import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { Concept, ModelRun } from "./types";

export const runsDir = process.env.LUSIE_RUNS_DIR ?? path.join(os.tmpdir(), "toni-lusie-runs");

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LUSIE_SUPABASE_URL ?? "").replace(/\/+$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

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

      return {
        ...concept,
        imageUrl: publicRunFile(runId, fileName)
      };
    })
  );
}

function parseDataImage(imageUrl: string) {
  const match = imageUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeSubtype = match[1].toLowerCase();
  return {
    extension: mimeSubtype === "jpeg" ? "jpg" : mimeSubtype,
    bytes: Buffer.from(match[2], "base64")
  };
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
