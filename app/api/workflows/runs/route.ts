import {
  createWorkflowRun,
  parseWorkflowKey,
} from "@/lib/workflows/local-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workflowKey = parseWorkflowKey(body?.workflowKey);

    if (!workflowKey) {
      return Response.json({ error: "Unsupported workflow" }, { status: 400 });
    }

    const run = await createWorkflowRun(workflowKey, Boolean(body?.injectFailure));
    return Response.json({ run }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to create workflow run" }, { status: 400 });
  }
}
