import { loadRun } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params;
    const run = await loadRun(runId);
    return Response.json({ run });
  } catch {
    return Response.json({ error: "Run not found" }, { status: 404 });
  }
}
