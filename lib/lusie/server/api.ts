import { randomUUID } from "node:crypto";
import { ensureRunDir, loadRun, persistConceptImages, saveRun } from "./storage";
import type { ConceptProgressEvent, ConceptResponse, GenerateModelRequest, HandshakeResponse, ModelRequest, ModelRun } from "./types";
import { openAiConcepts } from "./providers/openaiImages";
import { generateTripoModel } from "./providers/tripoModel";
import { validateStl } from "./validate";
import { formatValidationReasons, validateInput } from "./validation";

export function getHandshakePayload(): HandshakeResponse {
  return {
    ok: true,
    app: "printable-model-demo",
    apiVersion: "0.1.0",
    mode: {
      imageProvider: "openai",
      modelProvider: "tripo"
    },
    configured: {
      openai: Boolean(process.env.OPENAI_API_KEY ?? process.env.GPT_API_KEY),
      tripo: Boolean(process.env.TRIPO_API_KEY)
    },
    capabilities: {
      conceptImages: true,
      modelGeneration: true,
      stlDownload: true,
      threeMfDownload: false,
      statuses: ["Ready", "Failed"]
    }
  };
}

export async function createConcepts(input: ModelRequest) {
  const validation = validateInput(input);
  if (validation.length > 0) {
    return jsonError(400, "Invalid input", formatValidationReasons(validation), validation);
  }

  if (!hasOpenAiKey()) {
    return jsonError(503, "OpenAI is not configured", "生成概念图前，请先设置 OPENAI_API_KEY 或 GPT_API_KEY。");
  }

  try {
    const runId = randomUUID();
    await ensureRunDir(runId);
    const generatedConcepts = await openAiConcepts(input, runId);
    const concepts = await persistConceptImages(runId, generatedConcepts);
    const now = new Date().toISOString();
    const run: ModelRun = {
      runId,
      input,
      concepts,
      reasons: [],
      files: {},
      createdAt: now,
      updatedAt: now
    };

    await saveRun(run);
    return Response.json({ runId, concepts: generatedConcepts } satisfies ConceptResponse);
  } catch (error) {
    return jsonError(500, "Concept generation failed", error instanceof Error ? error.message : "Unknown error");
  }
}

export function createConceptProgressStream(input: ModelRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ConceptProgressEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        send({ phase: "queued", progress: 5, message: "已接收概念图生成请求。" });

        const validation = validateInput(input);
        if (validation.length > 0) {
          send({ phase: "complete", progress: 100, message: formatValidationReasons(validation) });
          return;
        }

        send({ phase: "validating", progress: 12, message: "参数校验通过，正在创建生成记录。" });

        const runId = randomUUID();
        await ensureRunDir(runId);

        if (!hasOpenAiKey()) {
          send({ phase: "complete", progress: 100, message: "生成概念图前，请先设置 OPENAI_API_KEY 或 GPT_API_KEY。", runId });
          return;
        }

        send({ phase: "image", progress: 22, message: "正在生成第 1 张概念图。", runId, conceptIndex: 1, totalConcepts: 2 });
        const generatedConcepts = await openAiConcepts(input, runId, {
          onConceptDone: (_concept, index, total) => {
            const progress = index === 1 ? 56 : 84;
            const message = index < total ? `第 ${index} 张已完成，正在生成第 ${index + 1} 张。` : "两张概念图已生成，正在保存结果。";
            send({ phase: "image", progress, message, runId, conceptIndex: index, totalConcepts: total });
          }
        });
        const concepts = await persistConceptImages(runId, generatedConcepts);

        send({ phase: "saving", progress: 92, message: "正在保存概念图和生成记录。", runId, totalConcepts: concepts.length });

        const now = new Date().toISOString();
        const run: ModelRun = {
          runId,
          input,
          concepts,
          reasons: [],
          files: {},
          createdAt: now,
          updatedAt: now
        };

        await saveRun(run);
        const response: ConceptResponse = { runId, concepts: generatedConcepts };
        send({ phase: "complete", progress: 100, message: "概念图已生成。", runId, totalConcepts: concepts.length, response });
      } catch (error) {
        send({
          phase: "complete",
          progress: 100,
          message: error instanceof Error ? error.message : "Concept generation failed"
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "X-Accel-Buffering": "no"
    }
  });
}

export async function createModel(body: GenerateModelRequest) {
  try {
    const run = await loadRun(body.runId);
    const concept = run.concepts.find((item) => item.id === body.conceptId);
    if (!concept) {
      return jsonError(404, "Concept not found", "没有找到选中的概念图。");
    }

    run.selectedConceptId = body.conceptId;
    run.reasons = [];

    try {
      if (!process.env.TRIPO_API_KEY) {
        throw new Error("生成可打印模型前，请先设置 TRIPO_API_KEY。");
      }

      const stlFile = await generateTripoModel(run);
      const reasons = await validateStl(run.runId, stlFile);

      if (reasons.length > 0) {
        run.status = "Failed";
        run.reasons = reasons;
        run.files = {};
      } else {
        run.status = "Ready";
        run.reasons = [];
        run.files = {
          stl: `/api/lusie/runs/${run.runId}/download/stl`
        };
      }
    } catch (error) {
      run.status = "Failed";
      run.reasons = [error instanceof Error ? error.message : "model_generation_failed"];
      run.files = {};
    }

    await saveRun(run);
    return Response.json({ run });
  } catch (error) {
    return jsonError(500, "Model generation failed", error instanceof Error ? error.message : "Unknown error");
  }
}

function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY ?? process.env.GPT_API_KEY);
}

export function jsonError(status: number, error: string, message: string, reasons?: string[]) {
  return Response.json(
    {
      error,
      message,
      reasons
    },
    { status }
  );
}
