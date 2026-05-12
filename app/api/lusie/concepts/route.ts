import { createConceptProgressStream, createConcepts, jsonError } from "@/lib/lusie/server/api";
import type { ModelRequest } from "@/lib/lusie/server/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  let input: ModelRequest;
  try {
    input = (await request.json()) as ModelRequest;
  } catch {
    return jsonError(400, "Invalid JSON", "请求内容不是有效 JSON。");
  }

  if (request.headers.get("accept")?.includes("application/x-ndjson")) {
    return createConceptProgressStream(input);
  }

  return createConcepts(input);
}
