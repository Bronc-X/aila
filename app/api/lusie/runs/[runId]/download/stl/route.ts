import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRunDir, loadRun } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params;
    const run = await loadRun(runId);
    if (run.status !== "Ready") {
      return Response.json({ error: "STL is not ready" }, { status: 404 });
    }

    const fileName = path.basename(run.files.stl ?? "model.stl");
    const safeFileName = fileName === "stl" ? "model.stl" : fileName;
    const bytes = await readStlBytes(run.runId, safeFileName, run.files.stlSourceUrl);
    return new Response(bytes, {
      headers: {
        "Content-Disposition": `attachment; filename="${run.runId}.stl"`,
        "Content-Type": "model/stl"
      }
    });
  } catch {
    return Response.json({ error: "Run not found" }, { status: 404 });
  }
}

async function readStlBytes(runId: string, fileName: string, sourceUrl?: string) {
  try {
    return await readFile(path.join(getRunDir(runId), fileName));
  } catch (error) {
    if (!sourceUrl) throw error;
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Remote STL fetch failed: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}
