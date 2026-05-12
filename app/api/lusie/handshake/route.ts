import { getHandshakePayload } from "@/lib/lusie/server/api";

export const runtime = "nodejs";

export function GET() {
  return Response.json(getHandshakePayload());
}
