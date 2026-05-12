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
    const bytes = await readFile(path.join(getRunDir(run.runId), safeFileName));
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
