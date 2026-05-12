import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { Concept, ModelRun } from "./types";

export const runsDir = process.env.LUSIE_RUNS_DIR ?? path.join(os.tmpdir(), "toni-lusie-runs");

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LUSIE_SUPABASE_URL ?? "").replace(/\/+$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
const supabaseStorageKey = supabaseServiceRoleKey || supabaseKey;
const lusieStorageBucket = process.env.LUSIE_STORAGE_BUCKET?.trim() || "lusie-runs";

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

export async function persistConceptImages(runId: string, concepts: Concept[]) {
  await ensureRunDir(runId);

  return Promise.all(
    concepts.map(async (concept, index) => {
      const image = parseDataImage(concept.imageUrl);
      if (!image) return concept;

      const fileName = `concept-${index + 1}.${image.extension}`;
      await writeFile(path.join(getRunDir(runId), fileName), image.bytes);
      const storageUrl = await uploadConceptImage(runId, fileName, image);
      if (!storageUrl && process.env.NODE_ENV === "production") {
        throw new Error(
          supabaseStorageKey
            ? "Lusie concept image storage upload failed. Check the Supabase Storage bucket and upload policy for LUSIE_STORAGE_BUCKET."
            : "Lusie concept image storage is not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in Vercel."
        );
      }

      return {
        ...concept,
        imageUrl: storageUrl ?? publicRunFile(runId, fileName)
      };
    })
  );
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
  if (!supabaseUrl || !supabaseStorageKey) return null;

  if (supabaseServiceRoleKey) {
    await ensureStorageBucket();
  }

  const objectPath = `${runId}/${fileName}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${lusieStorageBucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: supabaseStorageKey,
      Authorization: `Bearer ${supabaseStorageKey}`,
      "Content-Type": image.contentType,
      "x-upsert": "true"
    },
    body: new Uint8Array(image.bytes)
  });

  if (!response.ok) {
    console.warn(`Lusie Supabase image upload failed: ${response.status} ${await response.text()}`);
    return null;
  }

  return `${supabaseUrl}/storage/v1/object/public/${lusieStorageBucket}/${objectPath}`;
}

async function ensureStorageBucket() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return;

  const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: lusieStorageBucket,
      name: lusieStorageBucket,
      public: true,
      file_size_limit: 10485760,
      allowed_mime_types: ["image/png", "image/jpeg", "image/webp"]
    })
  });

  if (!response.ok && response.status !== 409) {
    console.warn(`Lusie Supabase bucket ensure failed: ${response.status} ${await response.text()}`);
  }
}

async function saveRunToSupabase(run: ModelRun) {
  if (!supabaseUrl || !supabaseKey) return;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/toybox_history`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
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
  if (!supabaseUrl || !supabaseKey) return null;

  const response = await fetch(`${supabaseUrl}/rest/v1/toybox_history?run_id=eq.${encodeURIComponent(runId)}&select=input,concepts,selected_concept_id,status,created_at,updated_at&limit=1`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
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
