// AI 服务商统一封装
// API Keys 通过环境变量注入，仅在服务端使用

/** GPT-5.4 文本生成（第三方API） */
export async function chatWithGPT(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }
) {
  const response = await fetch(process.env.GPT_API_BASE_URL! + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GPT_MODEL || "gpt-5.4",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 4096,
      stream: options?.stream ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(`GPT API error: ${response.status} ${response.statusText}`);
  }

  if (options?.stream) {
    return response; // 返回原始 response 用于流式传输
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/** GPT 流式输出辅助函数 */
export async function streamGPTResponse(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
) {
  const response = await chatWithGPT(messages, { stream: true });
  return response as Response;
}

/** Google Nano/Imagen 图片生成 */
export async function generateImage(
  prompt: string,
  options?: {
    count?: number;
    size?: string;
    style?: string;
  }
) {
  const response = await fetch(process.env.GOOGLE_AI_API_URL! + "/images:generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GOOGLE_AI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      number_of_images: options?.count ?? 4,
      aspect_ratio: options?.size ?? "1:1",
      style: options?.style,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Image API error: ${response.status}`);
  }

  return response.json();
}

/** Google Veo 视频生成 */
export async function generateVideo(
  prompt: string,
  options?: {
    duration?: number;
    aspect_ratio?: string;
  }
) {
  const response = await fetch(process.env.GOOGLE_AI_API_URL! + "/videos:generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GOOGLE_AI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      duration_seconds: options?.duration ?? 15,
      aspect_ratio: options?.aspect_ratio ?? "16:9",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Video API error: ${response.status}`);
  }

  return response.json();
}

/** Qwen 3.5 ASR 语音识别 */
export async function transcribeAudio(audioBase64: string) {
  const response = await fetch(process.env.QWEN_API_URL! + "/asr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.QWEN_ASR_MODEL || "qwen3.5-asr",
      audio: audioBase64,
      format: "webm",
      language: "zh",
    }),
  });

  if (!response.ok) {
    throw new Error(`Qwen ASR API error: ${response.status}`);
  }

  return response.json();
}
