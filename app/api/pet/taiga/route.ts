import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TaigaRequestBody = {
  message?: unknown;
};

type ChatPayload = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  error?: {
    message?: unknown;
  };
};

type ImagePayload = {
  data?: Array<{
    url?: unknown;
    b64_json?: unknown;
  }>;
  error?: {
    message?: unknown;
  };
};

const MAX_MESSAGE_CHARS = 2400;
const SVG_IMAGE_SYSTEM_PROMPT = [
  "You generate one complete SVG image, not markdown.",
  "Return only a valid <svg>...</svg> document.",
  "Canvas must be 1024x1024. Use layered vector shapes, gradients, and a polished illustration style.",
  "Do not include scripts, external links, foreignObject, markdown fences, or explanations.",
  "If the prompt is in Chinese, preserve its intent visually.",
].join("\n");

const TAIGA_SYSTEM_PROMPT = [
  "你叫 Taiga，来自西伯利亚，是一只西森猫，也是 Toni 网站里的隐藏 agent。",
  "你的名字也可以写作 opentaiga。",
  "你的语气轻、聪明、直接，有一点陪伴感，但不要装可爱过度。",
  "你不保留记忆，每次只处理用户当前这一句话。",
  "你背后接入的是第一梯队的推理、创作与视觉模型。不要直白营销，不要说全球最好。",
  "你可以帮用户拆复杂问题、写代码、改文案、做产品判断、设计 agent 流程、生成图像方向。",
  "回答要短，先给可执行结论；必要时再补一两句原因。",
].join("\n");

function getConfig() {
  const apiBaseUrl = (
    process.env.TAIGA_API_BASE_URL ||
    process.env.GPT_API_BASE_URL ||
    "https://testvideo.site/v1"
  )
    .trim()
    .replace(/\/+$/, "");
  const apiKey = (process.env.TAIGA_API_KEY || process.env.GPT_API_KEY || "").trim();
  const model = (process.env.TAIGA_MODEL || "gpt-5.5").trim();
  const imageModel = (process.env.TAIGA_IMAGE_MODEL || "gpt-image-2").trim();

  if (!apiKey) {
    throw new Error("Taiga API key is not configured");
  }

  return { apiBaseUrl, apiKey, model, imageModel };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return fallback;
}

function extractAssistantText(payload: ChatPayload) {
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
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

function extractSvg(text: string) {
  const match = text.match(/<svg[\s\S]*<\/svg>/i);
  if (!match) return "";

  return match[0]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/href\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, "");
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

function wantsImage(message: string) {
  return /(生图|出图|生成图|画一张|画个|画一下|图片|image|poster|海报|视觉|插画)/i.test(message);
}

function findImageInPayload(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^(https?:\/\/|data:image\/)/i.test(trimmed)) return trimmed;
    if (/^[a-zA-Z0-9+/=]{600,}$/.test(trimmed)) return `data:image/png;base64,${trimmed}`;
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImageInPayload(item);
      if (found) return found;
    }

    return null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const likelyKeys = [
      "url",
      "image_url",
      "imageUrl",
      "b64_json",
      "base64",
      "data",
      "images",
      "output",
      "result",
    ];

    for (const key of likelyKeys) {
      const found = findImageInPayload(record[key]);
      if (found) return found;
    }

    for (const item of Object.values(record)) {
      const found = findImageInPayload(item);
      if (found) return found;
    }
  }

  return null;
}

async function callTaigaChat(message: string) {
  const { apiBaseUrl, apiKey, model } = getConfig();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: TAIGA_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.75,
      max_tokens: 1200,
      stream: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  const payload = (await response.json().catch(() => null)) as ChatPayload | null;

  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Taiga request failed (${response.status})`));
  }

  return extractAssistantText(payload) || "我收到了，但这次没有拿到完整回复。你换个说法再问我一次。";
}

async function callTaigaImage(message: string) {
  const { apiBaseUrl, apiKey, imageModel } = getConfig();

  const response = await fetch(`${apiBaseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: imageModel,
      prompt: message,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(90000),
  });

  const contentType = response.headers.get("content-type") || "";
  const rawBuffer = Buffer.from(await response.arrayBuffer());

  if (response.ok && contentType.startsWith("image/")) {
    return `data:${contentType};base64,${rawBuffer.toString("base64")}`;
  }

  const rawText = rawBuffer.toString("utf8");
  const payload = (() => {
    try {
      return JSON.parse(rawText) as ImagePayload | Record<string, unknown>;
    } catch {
      return null;
    }
  })();

  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Taiga image request failed (${response.status})`));
  }

  const imageUrl = findImageInPayload(payload);
  if (imageUrl) return imageUrl;

  throw new Error("Taiga image response did not include an image");
}

async function callTaigaSvgImage(message: string) {
  const { apiBaseUrl, apiKey, model } = getConfig();

  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SVG_IMAGE_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.8,
      max_tokens: 3600,
      stream: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });

  const payload = (await response.json().catch(() => null)) as ChatPayload | null;
  if (!response.ok || !payload) {
    throw new Error(getErrorMessage(payload, `Taiga SVG request failed (${response.status})`));
  }

  const svg = extractSvg(extractAssistantText(payload));
  if (!svg) {
    throw new Error("Taiga SVG response did not include an image");
  }

  return svgToDataUrl(svg);
}

function sanitizeMessage(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, MAX_MESSAGE_CHARS);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TaigaRequestBody;
    const message = sanitizeMessage(body.message);

    if (!message) {
      return NextResponse.json(
        { error: "INVALID_MESSAGE", message: "你先跟 Taiga 说一句话。" },
        { status: 400 }
      );
    }

    if (wantsImage(message)) {
      try {
        const imageUrl = await callTaigaImage(message);
        return NextResponse.json({
          type: "image",
          text: "我画了一版，先看方向。要更准的话，你可以继续告诉我风格、主体和用途。",
          imageUrl,
        });
      } catch (error) {
        console.error("Taiga image generation error:", error);
        const imageUrl = await callTaigaSvgImage(message);
        return NextResponse.json({
          type: "image",
          text: "图片模型那条路这次没接稳，我先直接画了一张轻量版给你看方向。",
          imageUrl,
        });
      }
    }

    const text = await callTaigaChat(message);
    return NextResponse.json({ type: "text", text });
  } catch (error) {
    console.error("Taiga API error:", error);
    return NextResponse.json(
      {
        error: "TAIGA_ERROR",
        message: "Taiga 这次没有连上模型。你再发一次，我继续接。",
      },
      { status: 500 }
    );
  }
}
