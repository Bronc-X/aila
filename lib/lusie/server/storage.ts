import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { Concept, ModelRun } from "./types";

export const runsDir = process.env.LUSIE_RUNS_DIR ?? path.join(os.tmpdir(), "toni-lusie-runs");

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
}

export async function loadRun(runId: string): Promise<ModelRun> {
  const raw = await readFile(getRunFile(runId), "utf8");
  return JSON.parse(raw) as ModelRun;
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
