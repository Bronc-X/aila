import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { Concept, ModelRun } from "./types";

export const runsDir = process.env.LUSIE_RUNS_DIR ?? path.join(os.tmpdir(), "toni-lusie-runs");

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
  return path.join(runsDir, runId);
}

export function getRunFile(runId: string) {
  return path.join(getRunDir(runId), "run.json");
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
    const raw = await readFile(getRunFile(runId), "utf8");
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

export async function persistConceptImages(runId: string, concepts: Concept[]) {
  await ensureRunDir(runId);

  return Promise.all(
    concepts.map(async (concept, index) => {
      const image = parseDataImage(concept.imageUrl);
      if (!image) return concept;

      const fileName = `concept-${index + 1}.${image.extension}`;
      await writeFile(path.join(getRunDir(runId), fileName), image.bytes);
      const upload = await uploadConceptImage(runId, fileName, image);
      const storageUrl = upload.url;
      if (!storageUrl && process.env.NODE_ENV === "production") {
        throw new Error(getStorageFailureMessage(upload.error));
      }

      return {
        ...concept,
        imageUrl: storageUrl ?? publicRunFile(runId, fileName)
      };
    })
  );
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
      "Content-Type": image.contentType,
      "x-upsert": "true"
    },
    body: new Uint8Array(image.bytes)
  });

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
  });

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

  if (!config.supabaseUrl || !config.supabaseKey) return;

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/toybox_history`, {
      method: "POST",
      headers: {
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        id: run.runId,
        run_id: run.runId,
        title: `${run.input.style || run.input.subtype} ${run.input.label || ""}`.trim(),
        label: run.input.label || run.runId.slice(0, 8),
        status: run.status === "Ready" ? "ready" : run.status === "Failed" ? "failed" : "concept",
        input: run.input,
        concepts: run.concepts.map(({ imageDataUrl: _imageDataUrl, ...concept }) => concept),
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

async function loadRunFromSupabase(runId: string): Promise<ModelRun | null> {
  const config = getStorageConfig();

  if (!config.supabaseUrl || !config.supabaseKey) return null;

  const response = await fetch(`${config.supabaseUrl}/rest/v1/toybox_history?run_id=eq.${encodeURIComponent(runId)}&select=input,concepts,selected_concept_id,status,created_at,updated_at&limit=1`, {
    headers: {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${config.supabaseKey}`
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

  return {
    runId,
    input: row.input,
    concepts: row.concepts,
    selectedConceptId: row.selected_concept_id ?? undefined,
    status: row.status === "ready" ? "Ready" : row.status === "failed" ? "Failed" : undefined,
    reasons: [],
    files: {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
