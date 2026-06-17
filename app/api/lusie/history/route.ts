import { listRuns } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET() {
  const runs = await listRuns();
  return Response.json({ runs });
}
