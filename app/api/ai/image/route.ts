import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import {
  AiGatewayError,
  callAiChat,
  extractAssistantText,
  type ChatCompletionPayload,
} from "@/lib/ai-gateway";

export const runtime = "nodejs";

type ImageRequestBody = {
  prompt?: unknown;
  images?: unknown;
  modelImage?: unknown;
};

type DesignSpec = {
  palette: [string, string, string];
  layout: "centerpiece" | "split" | "hero" | "collage";
  accentShape: "halo" | "ribbon" | "grid" | "orb";
  mood: string;
};

const MAX_PROMPT_CHARS = 2000;
const MAX_IMAGE_INPUTS = 3;
const MAX_IMAGE_SOURCE_CHARS = 6_000_000;

function sanitizeHexColor(color: string) {
  const normalized = color.trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(normalized) ? normalized : null;
}

function inferPalette(prompt: string): [string, string, string] {
  const lowered = prompt.toLowerCase();

  if (/(orange|amber|warm|sun|琥珀|橙)/.test(lowered)) {
    return ["#f2f5d1", "#a8f06a", "#22d665"];
  }

  if (/(blue|ocean|tech|科技|蓝)/.test(lowered)) {
    return ["#eff6ff", "#60a5fa", "#1d4ed8"];
  }

  if (/(pink|rose|beauty|粉|美妆)/.test(lowered)) {
    return ["#fff1f2", "#f9a8d4", "#e11d48"];
  }

  if (/(dark|black|night|暗黑|黑)/.test(lowered)) {
    return ["#111827", "#374151", "#a8f06a"];
  }

  return ["#f8fafc", "#cbd5e1", "#0f172a"];
}

function buildFallbackSpec(prompt: string, hasProduct: boolean, hasModel: boolean): DesignSpec {
  return {
    palette: inferPalette(prompt),
    layout: hasProduct && hasModel ? "split" : hasProduct ? "centerpiece" : "hero",
    accentShape: hasProduct ? "halo" : "orb",
    mood: "clean commercial editorial",
  };
}

function stripCodeFences(text: string) {
  return text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
}

function parseSpecFromModel(text: string, fallback: DesignSpec): DesignSpec {
  const cleaned = stripCodeFences(text);
  const jsonCandidate = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;

  try {
    const parsed = JSON.parse(jsonCandidate) as Partial<DesignSpec> & {
      palette?: string[];
    };

    const palette =
      Array.isArray(parsed.palette) && parsed.palette.length >= 3
        ? (parsed.palette
            .slice(0, 3)
            .map((value) => (typeof value === "string" ? sanitizeHexColor(value) : null))
            .filter((value): value is string => Boolean(value)) as string[])
        : [];

    return {
      palette:
        palette.length === 3
          ? ([palette[0], palette[1], palette[2]] as [string, string, string])
          : fallback.palette,
      layout:
        parsed.layout === "centerpiece" ||
        parsed.layout === "split" ||
        parsed.layout === "hero" ||
        parsed.layout === "collage"
          ? parsed.layout
          : fallback.layout,
      accentShape:
        parsed.accentShape === "halo" ||
        parsed.accentShape === "ribbon" ||
        parsed.accentShape === "grid" ||
        parsed.accentShape === "orb"
          ? parsed.accentShape
          : fallback.accentShape,
      mood: typeof parsed.mood === "string" && parsed.mood.trim() ? parsed.mood.trim() : fallback.mood,
    };
  } catch {
    return fallback;
  }
}

async function generateDesignSpec(prompt: string, hasProduct: boolean, hasModel: boolean) {
  const fallback = buildFallbackSpec(prompt, hasProduct, hasModel);

  try {
    const payload = await callAiChat({
      messages: [
        {
          role: "system",
          content:
            "You are a commercial art director. Return strict JSON only with keys palette, layout, accentShape, mood. palette must be exactly three hex colors. layout must be one of centerpiece, split, hero, collage. accentShape must be one of halo, ribbon, grid, orb. Favor clean, production-usable marketing layouts with strong whitespace.",
        },
        {
          role: "user",
          content: JSON.stringify({
            prompt,
            hasProduct,
            hasModel,
            output: {
              palette: ["#ffffff", "#a8f06a", "#111827"],
              layout: "centerpiece",
              accentShape: "halo",
              mood: "clean commercial editorial",
            },
          }),
        },
      ],
      temperature: 0.4,
      max_tokens: 220,
    });

    return parseSpecFromModel(extractAssistantText(payload), fallback);
  } catch (error) {
    if (!(error instanceof AiGatewayError)) {
      console.error("Image spec generation error:", error);
    }

    return fallback;
  }
}

async function normalizeImageSource(source: string) {
  const trimmed = source.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > MAX_IMAGE_SOURCE_CHARS) {
    throw new Error("图片输入过大，请压缩后重试");
  }

  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(trimmed)) {
    return trimmed;
  }

  if (!/^https?:\/\//.test(trimmed)) {
    return null;
  }

  const response = await fetch(trimmed, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("外部图片读取失败，请更换图片后重试");
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    throw new Error("上传的图片格式无效");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

function rotatePalette(palette: [string, string, string], variation: number): [string, string, string] {
  const shifted = [...palette];
  for (let index = 0; index < variation; index += 1) {
    shifted.push(shifted.shift() as string);
  }

  return [shifted[0], shifted[1], shifted[2]];
}

function buildTexture(accentShape: DesignSpec["accentShape"], accent: string, variation: number) {
  if (accentShape === "grid") {
    const gridSize = 84 - variation * 8;
    return `
      <pattern id="grid-${variation}" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${accent}22" stroke-width="1" />
      </pattern>
      <rect width="1080" height="1080" fill="url(#grid-${variation})" opacity="0.9" />
    `;
  }

  if (accentShape === "ribbon") {
    return `
      <path d="M -120 ${220 + variation * 26} C 260 ${90 + variation * 18}, 560 ${420 + variation * 10}, 1200 ${180 + variation * 36} L 1200 ${300 + variation * 40} C 720 ${500 + variation * 10}, 320 ${260 + variation * 24}, -120 ${420 + variation * 16} Z" fill="${accent}18" />
      <path d="M -160 ${760 - variation * 22} C 220 ${580 - variation * 16}, 520 ${940 - variation * 12}, 1240 ${700 - variation * 24} L 1240 860 C 700 1040, 300 ${820 - variation * 6}, -160 940 Z" fill="${accent}10" />
    `;
  }

  if (accentShape === "halo") {
    return `
      <circle cx="${820 - variation * 40}" cy="${250 + variation * 30}" r="${240 - variation * 18}" fill="${accent}18" />
      <circle cx="${250 + variation * 25}" cy="${840 - variation * 28}" r="${180 - variation * 10}" fill="${accent}12" />
    `;
  }

  return `
    <ellipse cx="${840 - variation * 30}" cy="${240 + variation * 30}" rx="${300 - variation * 12}" ry="${190 - variation * 10}" fill="${accent}16" />
    <ellipse cx="${230 + variation * 16}" cy="${830 - variation * 26}" rx="${220 - variation * 8}" ry="${150 - variation * 8}" fill="${accent}10" />
  `;
}

function buildProductLayer(products: string[], layout: DesignSpec["layout"], variation: number) {
  if (products.length === 0) {
    return "";
  }

  const placements =
    layout === "collage"
      ? [
          { x: 120, y: 180, width: 350, height: 520, rotate: -6 },
          { x: 420, y: 340, width: 350, height: 500, rotate: 5 },
          { x: 720, y: 150, width: 250, height: 390, rotate: -3 },
        ]
      : [
          { x: 250 + variation * 12, y: 240 - variation * 8, width: 560, height: 600, rotate: -2 + variation },
          { x: 120 + variation * 20, y: 520 - variation * 18, width: 280, height: 300, rotate: -7 + variation },
        ];

  return products
    .slice(0, Math.min(products.length, placements.length))
    .map((src, index) => {
      const placement = placements[index];
      const clipId = `product-clip-${variation}-${index}`;

      return `
        <g transform="rotate(${placement.rotate} ${placement.x + placement.width / 2} ${placement.y + placement.height / 2})">
          <rect x="${placement.x - 12}" y="${placement.y - 12}" width="${placement.width + 24}" height="${placement.height + 24}" rx="44" fill="#ffffffd8" />
          <defs>
            <clipPath id="${clipId}">
              <rect x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" rx="36" />
            </clipPath>
          </defs>
          <image href="${src}" x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />
        </g>
      `;
    })
    .join("");
}

function buildModelLayer(modelImage: string | null, layout: DesignSpec["layout"], variation: number) {
  if (!modelImage) {
    return "";
  }

  const x = layout === "split" ? 640 : 690 - variation * 10;
  const y = layout === "split" ? 110 : 140 + variation * 12;
  const width = layout === "split" ? 320 : 270;
  const height = layout === "split" ? 860 : 540;
  const clipId = `model-clip-${variation}`;

  return `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="46" />
      </clipPath>
    </defs>
    <rect x="${x - 16}" y="${y - 16}" width="${width + 32}" height="${height + 32}" rx="56" fill="#ffffffbc" />
    <image href="${modelImage}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" opacity="0.98" />
  `;
}

function buildSvg(spec: DesignSpec, variation: number, products: string[], modelImage: string | null) {
  const [bgStart, bgMiddle, accent] = rotatePalette(spec.palette, variation);
  const spotlightCx = 200 + variation * 110;
  const spotlightCy = 180 + variation * 70;
  const spotlightRadius = 420 - variation * 28;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" fill="none">
      <defs>
        <linearGradient id="bg-${variation}" x1="0" y1="0" x2="${1080 - variation * 120}" y2="${1080 - variation * 80}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="54%" stop-color="${bgMiddle}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <radialGradient id="spot-${variation}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${spotlightCx} ${spotlightCy}) rotate(90) scale(${spotlightRadius} ${spotlightRadius})">
          <stop stop-color="#ffffff" stop-opacity="0.68" />
          <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <filter id="shadow-${variation}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.16" />
        </filter>
      </defs>

      <rect width="1080" height="1080" fill="url(#bg-${variation})" />
      <rect width="1080" height="1080" fill="url(#spot-${variation})" />
      ${buildTexture(spec.accentShape, accent, variation)}
      <rect x="56" y="56" width="968" height="968" rx="48" stroke="#ffffff" stroke-opacity="0.26" />
      <g filter="url(#shadow-${variation})">
        ${buildModelLayer(modelImage, spec.layout, variation)}
        ${buildProductLayer(products, spec.layout, variation)}
      </g>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function ensurePrompt(prompt: unknown) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("缺少 prompt 参数");
  }

  if (prompt.trim().length > MAX_PROMPT_CHARS) {
    throw new Error("prompt 过长，请精简后重试");
  }

  return prompt.trim();
}

function parseImageInputs(body: ImageRequestBody) {
  const rawImages = Array.isArray(body.images) ? body.images : [];
  const images = rawImages.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  const modelImage = typeof body.modelImage === "string" && body.modelImage.trim() ? body.modelImage.trim() : null;

  if (images.length > MAX_IMAGE_INPUTS) {
    throw new Error(`最多支持 ${MAX_IMAGE_INPUTS} 张参考图`);
  }

  return { images, modelImage };
}

async function buildSpecPayload(prompt: string, images: string[], modelImage: string | null) {
  const normalizedProducts = (
    await Promise.all(images.map((item) => normalizeImageSource(item)))
  ).filter((item): item is string => Boolean(item));

  const normalizedModel = modelImage ? await normalizeImageSource(modelImage) : null;

  if ((images.length > 0 || modelImage) && normalizedProducts.length === 0 && !normalizedModel) {
    throw new Error("参考图片无法读取，请检查上传内容后重试");
  }

  return {
    spec: await generateDesignSpec(prompt, normalizedProducts.length > 0, Boolean(normalizedModel)),
    normalizedProducts,
    normalizedModel,
  };
}

export async function POST(request: NextRequest) {
  if (!getSessionFromRequest(request)) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "请先登录后再使用 AI 功能" },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as ImageRequestBody;
    const prompt = ensurePrompt(body.prompt);
    const { images, modelImage } = parseImageInputs(body);
    const { spec, normalizedProducts, normalizedModel } = await buildSpecPayload(
      prompt,
      images,
      modelImage
    );

    const urls = [0, 1, 2, 3].map((variation) =>
      buildSvg(spec, variation, normalizedProducts, normalizedModel)
    );

    return NextResponse.json({ urls });
  } catch (error) {
    if (error instanceof AiGatewayError) {
      return NextResponse.json(
        { error: "AI_GATEWAY_ERROR", message: error.message },
        { status: error.status }
      );
    }

    const message = error instanceof Error && error.message ? error.message : "图片生成失败，请稍后重试";
    return NextResponse.json({ error: "IMAGE_RENDER_ERROR", message }, { status: 400 });
  }
}
