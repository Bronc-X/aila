import { jsonError, reviseConcept } from "@/lib/lusie/server/api";
import type { ReviseConceptRequest } from "@/lib/lusie/server/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  let body: ReviseConceptRequest;
  try {
    body = (await request.json()) as ReviseConceptRequest;
  } catch {
    return jsonError(400, "Invalid JSON", "请求内容不是有效 JSON。");
  }

  return reviseConcept(body);
}
