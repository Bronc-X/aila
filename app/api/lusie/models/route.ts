import { createModel, createModelProgressStream, jsonError } from "@/lib/lusie/server/api";
import type { GenerateModelRequest } from "@/lib/lusie/server/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  let body: GenerateModelRequest;
  try {
    body = (await request.json()) as GenerateModelRequest;
  } catch {
    return jsonError(400, "Invalid JSON", "请求内容不是有效 JSON。");
  }

  if (request.headers.get("accept")?.includes("application/x-ndjson")) {
    return createModelProgressStream(body);
  }

  return createModel(body);
}
