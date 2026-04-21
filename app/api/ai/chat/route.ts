import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { AiGatewayError, callAiChat, type ChatMessage } from "@/lib/ai-gateway";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 32000;
const MAX_TOKENS = 4096;

function estimateMessageSize(messages: ChatMessage[]) {
  return messages.reduce((total, message) => {
    if (typeof message.content === "string") {
      return total + message.content.length;
    }

    return total + JSON.stringify(message.content ?? "").length;
  }, 0);
}

export async function POST(request: NextRequest) {
  if (!getSessionFromRequest(request)) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "请先登录后再使用 AI 功能" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : null;
    const temperature = typeof body?.temperature === "number" ? body.temperature : undefined;
    const maxTokens = typeof body?.max_tokens === "number" ? body.max_tokens : undefined;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "INVALID_MESSAGES", message: "messages 参数无效" },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: "TOO_MANY_MESSAGES", message: `单次最多允许 ${MAX_MESSAGES} 条消息` },
        { status: 400 }
      );
    }

    if (estimateMessageSize(messages) > MAX_CONTENT_CHARS) {
      return NextResponse.json(
        { error: "CONTENT_TOO_LARGE", message: "请求内容过大，请精简后重试" },
        { status: 413 }
      );
    }

    if (temperature !== undefined && (temperature < 0 || temperature > 2)) {
      return NextResponse.json(
        { error: "INVALID_TEMPERATURE", message: "temperature 必须在 0 到 2 之间" },
        { status: 400 }
      );
    }

    if (maxTokens !== undefined && (maxTokens < 1 || maxTokens > MAX_TOKENS)) {
      return NextResponse.json(
        { error: "INVALID_MAX_TOKENS", message: `max_tokens 必须在 1 到 ${MAX_TOKENS} 之间` },
        { status: 400 }
      );
    }

    const payload = await callAiChat({
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof AiGatewayError) {
      return NextResponse.json(
        { error: "AI_GATEWAY_ERROR", message: error.message },
        { status: error.status }
      );
    }

    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "AI 服务调用失败，请稍后重试" },
      { status: 500 }
    );
  }
}
