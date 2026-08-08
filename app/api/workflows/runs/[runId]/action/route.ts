import {
  advanceWorkflowRun,
  applyWorkflowAction,
} from "@/lib/workflows/local-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RunAction = "advance" | "approve" | "reject" | "cancel" | "retry";

function isRunAction(value: unknown): value is RunAction {
  return value === "advance" || value === "approve" || value === "reject" || value === "cancel" || value === "retry";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const body = await request.json();

    if (!isRunAction(body?.action)) {
      return Response.json({ error: "Unsupported workflow action" }, { status: 400 });
    }

    const run = body.action === "advance"
      ? await advanceWorkflowRun(runId, body.previousRun)
      : await applyWorkflowAction(runId, body.action, body.previousRun);

    return Response.json({ run });
  } catch {
    return Response.json({ error: "Unable to update workflow run" }, { status: 404 });
  }
}
