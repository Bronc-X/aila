import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Concept, ModelRun, StorageDiagnostics } from "./types";

export const runsDir = process.env.LUSIE_RUNS_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "lusie", "runs");

function getStorageConfig() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LUSIE_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();
  const supabaseServiceRoleEnv = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  const supabaseServiceRoleKey = isSupabaseAdminKey(supabaseServiceRoleEnv) ? supabaseServiceRoleEnv : "";
  const supabaseStorageKey = supabaseServiceRoleKey || supabaseKey || supabaseServiceRoleEnv;
  const lusieStorageBucket = process.env.LUSIE_STORAGE_BUCKET?.trim() || "lusie-runs";

  return {
    supabaseKey,
    supabaseServiceRoleKey,
    supabaseStorageKey,
    supabaseUrl,
    lusieStorageBucket
  };
}

function isSupabaseAdminKey(key: string) {
  if (!key) return false;
  if (key.startsWith("sb_secret_")) return true;
  return getSupabaseJwtRole(key) === "service_role";
}

function getSupabaseJwtRole(key: string) {
  const [, payload] = key.split(".");
  if (!payload) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { role?: string };
    return claims.role ?? null;
  } catch {
    return null;
  }
}

export function getStorageConfigState() {
  const config = getStorageConfig();

  return {
    ready: Boolean(config.supabaseUrl && config.supabaseStorageKey),
    hasUrl: Boolean(config.supabaseUrl),
    hasKey: Boolean(config.supabaseStorageKey),
    hasServiceRoleKey: Boolean(config.supabaseServiceRoleKey),
    bucket: config.lusieStorageBucket
  };
}

export function getRunDir(runId: string) {
  return path.join(/* turbopackIgnore: true */ runsDir, runId);
}

export function getRunFile(runId: string) {
  return path.join(/* turbopackIgnore: true */ getRunDir(runId), "run.json");
}

export async function ensureRunDir(runId: string) {
  await mkdir(getRunDir(runId), { recursive: true });
}

export async function saveRun(run: ModelRun) {
  await ensureRunDir(run.runId);
  run.updatedAt = new Date().toISOString();
  await writeFile(getRunFile(run.runId), JSON.stringify(run, null, 2), "utf8");
  await saveRunToSupabase(run);
}

export async function loadRun(runId: string): Promise<ModelRun> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ getRunFile(runId), "utf8");
    return JSON.parse(raw) as ModelRun;
  } catch (error) {
    const run = await loadRunFromSupabase(runId);
    if (run) return run;
    throw error;
  }
}

export function publicRunFile(runId: string, fileName: string) {
  return `/api/lusie/runs/${runId}/files/${fileName}`;
}

export async function probeStorageUpload() {
  const config = getStorageConfig();
  if (!config.supabaseUrl) {
    return {
      ok: false,
      status: 0,
      message: "NEXT_PUBLIC_SUPABASE_URL is missing."
    };
  }

  if (!config.supabaseStorageKey) {
    return {
      ok: false,
      status: 0,
      message: "NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is missing."
    };
  }

  const runId = `probe-${Date.now()}`;
  const upload = await uploadConceptImage(runId, "pixel.png", {
    bytes: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p94AAAAASUVORK5CYII=", "base64"),
    contentType: "image/png"
  });

  return {
    ok: Boolean(upload.url),
    status: upload.status ?? 0,
    message: upload.url ? "Storage upload is ready." : upload.error ?? "Storage upload failed.",
    url: upload.url,
    bucket: config.lusieStorageBucket,
    hasUrl: Boolean(config.supabaseUrl),
    hasKey: Boolean(config.supabaseStorageKey),
    hasAdminKey: Boolean(config.supabaseServiceRoleKey)
  };
}

export type RunListResult = {
  runs: ModelRun[];
  diagnostics: {
    diskCount: number;
    supabaseConfigured: boolean;
    supabaseCount: number;
    supabaseError?: string;
  };
};

export async function listRuns(limit = 30): Promise<RunListResult> {
  const byRunId = new Map<string, ModelRun>();
  const supabaseResult = await listRunsFromSupabase(limit);
  const diskRuns = await listRunsFromDisk(limit);

  for (const run of supabaseResult.runs) {
    byRunId.set(run.runId, run);
  }

  for (const run of diskRuns) {
    if (!byRunId.has(run.runId)) byRunId.set(run.runId, run);
  }

  return {
    runs: Array.from(byRunId.values())
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit)
      .map(toHistoryRunPayload),
    diagnostics: {
      diskCount: diskRuns.length,
      supabaseConfigured: supabaseResult.configured,
      supabaseCount: supabaseResult.runs.length,
      supabaseError: supabaseResult.error
    }
  };
}

type StorageUploadResult = {
  error?: string;
  status?: number;
  url?: string;
};

export async function persistConceptImages(runId: string, concepts: Concept[]) {
  await ensureRunDir(runId);
  let storage: StorageDiagnostics = { mode: "supabase" };

  const persisted = await Promise.all(
    concepts.map(async (concept, index): Promise<Concept> => {
      const image = parseDataImage(concept.imageUrl);
      if (!image) return concept;

      const fileName = `concept-${index + 1}.${image.extension}`;
      await writeFile(path.join(getRunDir(runId), fileName), image.bytes);
      const upload = await uploadConceptImage(runId, fileName, image);
      if (!upload.url) {
        storage = {
          mode: "embedded",
          warning: upload.error ?? getStorageFailureMessage()
        };
      }

      return {
        ...concept,
        imageDataUrl: concept.imageUrl,
        imageUrl: upload.url ?? concept.imageUrl
      };
    })
  );

  return {
    concepts: persisted,
    storage
  };
}

function getStorageFailureMessage(uploadError?: string) {
  const config = getStorageConfig();

  if (!config.supabaseUrl) {
    return "Lusie concept image storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL in Vercel and redeploy Production.";
  }

  if (!config.supabaseStorageKey) {
    return "Lusie concept image storage is not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy Production.";
  }

  return uploadError || "Lusie concept image storage upload failed. Check the Supabase Storage bucket and upload policy for LUSIE_STORAGE_BUCKET.";
}

function parseDataImage(imageUrl: string) {
  const match = imageUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeSubtype = match[1].toLowerCase();
  const extension = mimeSubtype === "jpeg" ? "jpg" : mimeSubtype;
  return {
    contentType: `image/${mimeSubtype}`,
    extension,
    bytes: Buffer.from(match[2], "base64")
  };
}

async function uploadConceptImage(
  runId: string,
  fileName: string,
  image: { bytes: Buffer; contentType: string }
) {
  return uploadStorageObject(runId, fileName, image);
}

async function uploadStorageObject(
  runId: string,
  fileName: string,
  file: { bytes: Buffer; contentType: string }
): Promise<StorageUploadResult> {
  const config = getStorageConfig();

  if (!config.supabaseUrl || !config.supabaseStorageKey) return {};

  if (config.supabaseServiceRoleKey) {
    const bucketError = await ensureStorageBucket();
    if (bucketError) {
      console.warn(bucketError);
    }
  }

  const objectPath = `${runId}/${fileName}`;
  const response = await fetch(`${config.supabaseUrl}/storage/v1/object/${config.lusieStorageBucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: config.supabaseStorageKey,
      Authorization: `Bearer ${config.supabaseStorageKey}`,
      "Content-Type": file.contentType
    },
    body: new Uint8Array(file.bytes)
  }).catch((error) => {
    const detail = error instanceof Error ? error.message : "unknown network error";
    return { error: `Lusie Supabase Storage upload failed before response: ${detail}`, status: 0 };
  });

  if ("error" in response) {
    console.warn(response.error);
    return response;
  }

  if (!response.ok) {
    const detail = await response.text();
    const error = `Lusie Supabase Storage upload failed: ${response.status} ${detail}`;
    console.warn(error);
    return { error, status: response.status };
  }

  return { status: response.status, url: `${config.supabaseUrl}/storage/v1/object/public/${config.lusieStorageBucket}/${objectPath}` };
}

async function ensureStorageBucket() {
  const config = getStorageConfig();

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) return null;

  const response = await fetch(`${config.supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: config.supabaseServiceRoleKey,
      Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: config.lusieStorageBucket,
      name: config.lusieStorageBucket,
      public: true,
      file_size_limit: 10485760,
      allowed_mime_types: ["image/png", "image/jpeg", "image/webp"]
    })
  }).catch((error) => {
    const detail = error instanceof Error ? error.message : "unknown network error";
    return { error: `Lusie Supabase bucket ensure failed before response: ${detail}` };
  });

  if ("error" in response) {
    return response.error;
  }

  if (!response.ok && response.status !== 409) {
    const detail = await response.text();
    const error = `Lusie Supabase bucket ensure failed: ${response.status} ${detail}`;
    console.warn(error);
    return error;
  }

  return null;
}

async function saveRunToSupabase(run: ModelRun) {
  const config = getStorageConfig();
  const restKey = config.supabaseServiceRoleKey || config.supabaseKey;

  if (!config.supabaseUrl || !restKey) return;

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/toybox_history`, {
      method: "POST",
      headers: {
        apikey: restKey,
        Authorization: `Bearer ${restKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        id: run.runId,
        run_id: run.runId,
        title: `${run.input.style || run.input.subtype} ${run.input.label || ""}`.trim(),
        label: run.input.label || run.runId.slice(0, 8),
        status: run.status === "Ready" ? "ready" : run.status === "Failed" ? "failed" : "concept",
        input: { ...run.input, _files: run.files, _reasons: run.reasons },
        concepts: run.concepts.map(toPersistedConcept),
        selected_concept_id: run.selectedConceptId ?? null,
        preview_image_url: run.concepts[0]?.imageUrl ?? null,
        created_at: run.createdAt,
        updated_at: run.updatedAt
      })
    });

    if (!response.ok) {
      console.warn(`Lusie Supabase run sync failed: ${response.status} ${await response.text()}`);
    }
  } catch (error) {
    console.warn("Lusie Supabase run sync failed:", error);
  }
}

function toPersistedConcept(concept: Concept) {
  const persisted = { ...concept };
  delete persisted.imageDataUrl;
  return persisted;
}

async function loadRunFromSupabase(runId: string): Promise<ModelRun | null> {
  const config = getStorageConfig();
  const restKey = config.supabaseServiceRoleKey || config.supabaseKey;

  if (!config.supabaseUrl || !restKey) return null;

  const response = await fetch(`${config.supabaseUrl}/rest/v1/toybox_history?run_id=eq.${encodeURIComponent(runId)}&select=input,concepts,selected_concept_id,status,created_at,updated_at&limit=1`, {
    headers: {
      apikey: restKey,
      Authorization: `Bearer ${restKey}`
    }
  });

  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{
    input: ModelRun["input"];
    concepts: ModelRun["concepts"];
    selected_concept_id: string | null;
    status: "saved" | "concept" | "ready" | "failed";
    created_at: string;
    updated_at: string;
  }>;
  const row = rows[0];
  if (!row) return null;
  const { _files, _reasons, ...input } = row.input as ModelRun["input"] & {
    _files?: ModelRun["files"];
    _reasons?: string[];
  };

  return {
    runId,
    input,
    concepts: row.concepts,
    storage: inferStorageDiagnostics(row.concepts),
    selectedConceptId: row.selected_concept_id ?? undefined,
    status: row.status === "ready" ? "Ready" : row.status === "failed" ? "Failed" : undefined,
    reasons: _reasons ?? [],
    files: _files ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listRunsFromSupabase(limit: number): Promise<{ configured: boolean; error?: string; runs: ModelRun[] }> {
  const config = getStorageConfig();
  const restKey = config.supabaseServiceRoleKey || config.supabaseKey;

  if (!config.supabaseUrl || !restKey) return { configured: false, error: "supabase_not_configured", runs: [] };

  const metadataResponse = await fetch(`${config.supabaseUrl}/rest/v1/toybox_history?status=eq.ready&select=run_id,input,selected_concept_id,status,created_at,updated_at&order=updated_at.desc&limit=${limit}`, {
    headers: {
      apikey: restKey,
      Authorization: `Bearer ${restKey}`
    }
  });

  if (!metadataResponse.ok) return { configured: true, error: await formatSupabaseListError(metadataResponse), runs: [] };

  const metadataRows = (await metadataResponse.json()) as SupabaseHistorySummaryRow[];
  const deliverableRows = metadataRows.filter((row) => {
    const files = getSupabaseHistoryFiles(row.input);
    return row.run_id && (files.stl || files.stlSourceUrl || files.stlPersisted);
  });

  const detailRows = await Promise.all(
    deliverableRows.map(async (row) => loadHistoryRowFromSupabase(row, restKey, config.supabaseUrl))
  );

  return {
    configured: true,
    runs: detailRows
      .filter((row): row is SupabaseHistoryRow => Boolean(row))
      .map((row) => runFromHistoryRow(row.run_id ?? "", row))
      .filter((run) => run.status === "Ready")
  };
}

type SupabaseHistorySummaryRow = Omit<SupabaseHistoryRow, "concepts">;

type SupabaseHistoryRow = {
  run_id: string | null;
  input: ModelRun["input"];
  concepts: ModelRun["concepts"];
  selected_concept_id: string | null;
  status: "saved" | "concept" | "ready" | "failed";
  created_at: string;
  updated_at: string;
};

async function loadHistoryRowFromSupabase(summary: SupabaseHistorySummaryRow, restKey: string, supabaseUrl: string): Promise<SupabaseHistoryRow | null> {
  const runId = summary.run_id;
  if (!runId) return null;

  const response = await fetch(`${supabaseUrl}/rest/v1/toybox_history?run_id=eq.${encodeURIComponent(runId)}&select=run_id,input,concepts,selected_concept_id,status,created_at,updated_at&limit=1`, {
    headers: {
      apikey: restKey,
      Authorization: `Bearer ${restKey}`
    }
  });

  if (!response.ok) {
    console.warn(`Lusie Supabase history detail failed for ${runId}: ${await formatSupabaseListError(response)}`);
    return null;
  }

  const rows = (await response.json()) as SupabaseHistoryRow[];
  const row = rows[0];
  if (!row) return null;

  return {
    ...row,
    concepts: stripEmbeddedConceptImages(row.concepts)
  };
}

async function formatSupabaseListError(response: Response) {
  const detail = await response.text().catch(() => "");
  if (!detail) return `supabase_${response.status}`;

  try {
    const parsed = JSON.parse(detail) as { code?: string; message?: string };
    return `supabase_${response.status}${parsed.code ? `_${parsed.code}` : ""}${parsed.message ? `: ${parsed.message}` : ""}`;
  } catch {
    return `supabase_${response.status}: ${detail.slice(0, 240)}`;
  }
}

async function listRunsFromDisk(limit: number): Promise<ModelRun[]> {
  try {
    const entries = await readdir(/* turbopackIgnore: true */ runsDir, { withFileTypes: true });
    const runs = await Promise.all(entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const run = await loadRun(entry.name).catch(() => null);
        return run ? markPersistedStl(run) : null;
      }));
    return runs
      .filter((run): run is ModelRun => Boolean(run))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  } catch {
    return [];
  }
}

function runFromHistoryRow(
  runId: string,
  row: {
    input: ModelRun["input"];
    concepts: ModelRun["concepts"];
    selected_concept_id: string | null;
    status: "saved" | "concept" | "ready" | "failed";
    created_at: string;
    updated_at: string;
  }
): ModelRun {
  const { _files, _reasons, ...input } = row.input as ModelRun["input"] & {
    _files?: ModelRun["files"];
    _reasons?: string[];
  };

  return {
    runId,
    input,
    concepts: row.concepts,
    storage: inferStorageDiagnostics(row.concepts),
    selectedConceptId: row.selected_concept_id ?? undefined,
    status: row.status === "ready" ? "Ready" : row.status === "failed" ? "Failed" : undefined,
    reasons: _reasons ?? [],
    files: _files ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function getSupabaseHistoryFiles(input: ModelRun["input"]) {
  return ((input as ModelRun["input"] & { _files?: ModelRun["files"] })._files ?? {}) as ModelRun["files"];
}

function stripEmbeddedConceptImages(concepts: ModelRun["concepts"]) {
  return concepts.map((concept) => {
    const { imageDataUrl, ...persisted } = concept;
    return persisted;
  });
}

function toHistoryRunPayload(run: ModelRun): ModelRun {
  return {
    ...run,
    files: {
      ...run.files,
      stl: run.status === "Ready" && run.files.stl ? `/api/lusie/runs/${run.runId}/download/stl` : run.files.stl,
      stlPersisted: run.files.stlPersisted === true ? true : undefined
    },
    concepts: run.concepts.map((concept) => {
      const { imageDataUrl, ...persisted } = concept;
      return {
        ...persisted,
        prompt: "",
        feedback: persisted.feedback ? persisted.feedback.slice(0, 220) : undefined
      };
    })
  };
}

async function markPersistedStl(run: ModelRun): Promise<ModelRun> {
  if (run.status !== "Ready" || !run.files.stl) return run;
  if (run.files.stlSourceUrl || run.files.stlPersisted) return run;

  const fileName = path.basename(run.files.stl);
  try {
    const stlStats = await stat(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ getRunDir(run.runId), fileName));
    if (stlStats.size >= 256) {
      return {
        ...run,
        files: {
          ...run.files,
          stlPersisted: true
        }
      };
    }
  } catch {
  }

  return run;
}

function inferStorageDiagnostics(concepts: Concept[]): StorageDiagnostics {
  return concepts.some((concept) => concept.imageUrl.startsWith("data:image/"))
    ? { mode: "embedded", warning: "Concept images are embedded in the run record." }
    : { mode: "supabase" };
}
