import { loadWorkflowRun } from "@/lib/workflows/local-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params;
    return Response.json({ run: await loadWorkflowRun(runId) });
  } catch {
    return Response.json({ error: "Workflow run not found" }, { status: 404 });
  }
}
