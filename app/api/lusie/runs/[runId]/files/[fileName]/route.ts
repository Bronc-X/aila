import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRunDir, loadRun } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string; fileName: string }> }) {
  try {
    const { runId, fileName } = await params;
    const safeFileName = path.basename(fileName);
    const bytes = await readRunFile(runId, safeFileName);
    return new Response(bytes, {
      headers: {
        "Content-Type": contentTypeForFile(safeFileName)
      }
    });
  } catch {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
}

async function readRunFile(runId: string, fileName: string) {
  try {
    return await readFile(path.join(getRunDir(runId), fileName));
  } catch (error) {
    const conceptImage = await readConceptImageFromRun(runId, fileName);
    if (conceptImage) return conceptImage;
    throw error;
  }
}

async function readConceptImageFromRun(runId: string, fileName: string) {
  const match = fileName.match(/^concept-(\d+)\.(png|jpg|jpeg|webp)$/i);
  if (!match) return null;

  const conceptIndex = Number(match[1]) - 1;
  const run = await loadRun(runId);
  const dataUrl = run.concepts[conceptIndex]?.imageDataUrl;
  if (!dataUrl) return null;

  const [, base64] = dataUrl.split(",", 2);
  return base64 ? Buffer.from(base64, "base64") : null;
}

function contentTypeForFile(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".stl")) return "model/stl";
  if (lower.endsWith(".glb")) return "model/gltf-binary";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}
