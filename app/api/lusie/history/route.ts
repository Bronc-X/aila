import { listRuns } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await listRuns());
}
