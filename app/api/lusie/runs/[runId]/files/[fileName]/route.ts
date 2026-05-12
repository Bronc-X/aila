import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRunDir } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string; fileName: string }> }) {
  try {
    const { runId, fileName } = await params;
    const safeFileName = path.basename(fileName);
    const bytes = await readFile(path.join(getRunDir(runId), safeFileName));
    return new Response(bytes, {
      headers: {
        "Content-Type": contentTypeForFile(safeFileName)
      }
    });
  } catch {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
}

function contentTypeForFile(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".stl")) return "model/stl";
  if (lower.endsWith(".glb")) return "model/gltf-binary";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}
