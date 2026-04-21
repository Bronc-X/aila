import "server-only";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: unknown;
};

export type ChatCompletionPayload = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  error?: {
    message?: unknown;
  };
  message?: unknown;
};

export class AiGatewayError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "AiGatewayError";
    this.status = status;
    this.payload = payload;
  }
}

type CallAiChatOptions = {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

function getGatewayConfig() {
  const apiBaseUrl = process.env.GPT_API_BASE_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.GPT_API_KEY?.trim();
  const model = process.env.GPT_MODEL?.trim() || "gpt-5.4";

  if (!apiBaseUrl || !apiKey) {
    throw new AiGatewayError("AI gateway is not configured", 500);
  }

  return { apiBaseUrl, apiKey, model };
}

function parseMaybeJson(text: string) {
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractGatewayErrorMessage(payload: unknown, status: number, fallbackText?: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string" &&
    payload.error.message.trim()
  ) {
    return payload.error.message.trim();
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message.trim();
  }

  if (fallbackText?.trim()) {
    return fallbackText.trim();
  }

  return `AI service error (${status})`;
}

export async function callAiChat(options: CallAiChatOptions) {
  const { apiBaseUrl, apiKey, model } = getGatewayConfig();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      stream: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(45000),
  });

  const rawText = await response.text();
  const payload = parseMaybeJson(rawText);

  if (!response.ok) {
    throw new AiGatewayError(
      extractGatewayErrorMessage(payload, response.status, rawText),
      response.status,
      payload
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new AiGatewayError("AI gateway returned an invalid response body", 502, payload);
  }

  return payload as ChatCompletionPayload;
}

export function extractAssistantText(payload: ChatCompletionPayload) {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
}
