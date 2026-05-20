import { randomUUID } from "node:crypto";
import { ensureRunDir, getStorageConfigState, loadRun, persistConceptImages, saveRun } from "./storage";
import type { ConceptProgressEvent, ConceptResponse, GenerateModelRequest, GenerateModelResponse, HandshakeResponse, ModelJobEvent, ModelRequest, ModelRun, ReviseConceptRequest, ReviseConceptResponse } from "./types";
import { openAiConcepts, reviseOpenAiConcept } from "./providers/openaiImages";
import { generateTripoModel } from "./providers/tripoModel";
import { validateStl } from "./validate";
import { formatValidationReasons, validateInput } from "./validation";

export function getHandshakePayload(): HandshakeResponse {
  const storageConfig = getStorageConfigState();

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
      storage: storageConfig.ready,
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
    const persisted = await persistConceptImages(runId, generatedConcepts);
    const now = new Date().toISOString();
    const run: ModelRun = {
      runId,
      input,
      concepts: persisted.concepts,
      storage: persisted.storage,
      reasons: [],
      files: {},
      createdAt: now,
      updatedAt: now
    };

    await saveRun(run);
    return Response.json({ runId, concepts: persisted.concepts, storage: persisted.storage } satisfies ConceptResponse);
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
        send({ phase: "queued", progress: 5, message: "Concept request received." });

        const validation = validateInput(input);
        if (validation.length > 0) {
          send({ phase: "complete", progress: 100, message: formatValidationReasons(validation) });
          return;
        }

        send({ phase: "validating", progress: 12, message: "Input validated. Creating generation run." });

        const runId = randomUUID();
        await ensureRunDir(runId);

        if (!hasOpenAiKey()) {
          send({ phase: "complete", progress: 100, message: "Set OPENAI_API_KEY or GPT_API_KEY before generating concepts.", runId });
          return;
        }

        send({ phase: "image", progress: 22, message: "Generating concept image 1.", runId, conceptIndex: 1, totalConcepts: 2 });
        const generatedConcepts = await openAiConcepts(input, runId, {
          onConceptDone: (_concept, index, total) => {
            const progress = index === 1 ? 56 : 84;
            const message = index < total ? `Concept ${index} finished. Generating concept ${index + 1}.` : "Concept images generated. Saving run.";
            send({ phase: "image", progress, message, runId, conceptIndex: index, totalConcepts: total });
          }
        });
        const persisted = await persistConceptImages(runId, generatedConcepts);

        send({ phase: "saving", progress: 92, message: "Saving concepts and run data.", runId, totalConcepts: persisted.concepts.length });

        const now = new Date().toISOString();
        const run: ModelRun = {
          runId,
          input,
          concepts: persisted.concepts,
          storage: persisted.storage,
          reasons: [],
          files: {},
          createdAt: now,
          updatedAt: now
        };

        await saveRun(run);
        const response: ConceptResponse = { runId, concepts: persisted.concepts, storage: persisted.storage };
        send({ phase: "complete", progress: 100, message: "Concept images are ready.", runId, totalConcepts: persisted.concepts.length, response });
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

export async function reviseConcept(body: ReviseConceptRequest) {
  try {
    const instruction = body.instruction.trim();
    if (!instruction) {
      return jsonError(400, "Invalid input", "请先写下想修改的地方。");
    }

    const run = await loadRun(body.runId);
    const concept = run.concepts.find((item) => item.id === body.conceptId);
    if (!concept) {
      return jsonError(404, "Concept not found", "没有找到选中的概念图。");
    }

    if (!hasOpenAiKey()) {
      return jsonError(503, "OpenAI is not configured", "修改概念图前，请先设置 OPENAI_API_KEY 或 GPT_API_KEY。");
    }

    const revised = await reviseOpenAiConcept(run.input, concept, instruction);
    const persisted = await persistConceptImages(run.runId, [revised]);
    const persistedConcept = persisted.concepts[0] ?? revised;

    run.concepts = [persistedConcept, ...run.concepts.filter((item) => item.id !== concept.id)];
    run.selectedConceptId = persistedConcept.id;
    run.storage = persisted.storage;
    await saveRun(run);

    return Response.json({ run, concept: persistedConcept } satisfies ReviseConceptResponse);
  } catch (error) {
    return jsonError(500, "Concept revision failed", error instanceof Error ? error.message : "Unknown error");
  }
}

export async function createModel(body: GenerateModelRequest) {
  try {
    const run = await loadRunOrFallback(body);
    await ensureRunDir(run.runId);
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
      const reasons = await validateStl(run.runId, stlFile.fileName);

      if (reasons.length > 0) {
        run.status = "Failed";
        run.reasons = reasons;
        run.files = {};
      } else {
        run.status = "Ready";
        run.reasons = [];
        run.files = {
          stl: `/api/lusie/runs/${run.runId}/download/stl`,
          stlSourceUrl: stlFile.sourceUrl
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

export function createModelProgressStream(body: GenerateModelRequest) {
  const encoder = new TextEncoder();
  const jobId = body.runId;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ModelJobEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        const payload = await runModelGeneration(body, async (event) => {
          send(event);
        });
        send({ type: "job.completed", jobId, at: new Date().toISOString(), response: payload });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Model generation failed";
        send({ type: "step.failed", jobId, stepId: "model_generation", error: message, recoverable: true, at: new Date().toISOString() });
        send({ type: "job.completed", jobId, at: new Date().toISOString() });
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

async function runModelGeneration(body: GenerateModelRequest, emit?: (event: ModelJobEvent) => Promise<void> | void): Promise<GenerateModelResponse> {
  const run = await loadRunOrFallback(body);
  await ensureRunDir(run.runId);
  const jobId = run.runId;
  const at = () => new Date().toISOString();
  const send = async (event: ModelJobEvent) => {
    await emit?.(event);
  };

  await send({ type: "job.started", jobId, title: "Generate STL model", at: at() });

  const concept = run.concepts.find((item) => item.id === body.conceptId);
  if (!concept) {
    throw new Error("Concept not found");
  }

  await send({ type: "step.started", jobId, stepId: "select_concept", title: "Select concept and print parameters", at: at() });
  run.selectedConceptId = body.conceptId;
  run.reasons = [];
  await send({ type: "tool.completed", jobId, callId: "select_concept", name: "select_concept", outputSummary: `${run.input.category} / ${run.input.targetLengthMm}mm`, at: at() });

  try {
    if (!process.env.TRIPO_API_KEY) {
      throw new Error("生成可打印模型前，请先设置 TRIPO_API_KEY。");
    }

    await send({ type: "tool.started", jobId, callId: "tripo_generate_model", name: "tripo_image_to_model", inputSummary: concept.title, at: at() });
    const stlFile = await generateTripoModel(run, async (event) => {
      await send({ ...event, jobId, at: at() });
    });
    await send({ type: "tool.completed", jobId, callId: "tripo_generate_model", name: "tripo_image_to_model", outputSummary: stlFile.fileName, at: at() });

    await send({ type: "tool.started", jobId, callId: "validate_stl", name: "validate_stl", inputSummary: stlFile.fileName, at: at() });
    const reasons = await validateStl(run.runId, stlFile.fileName);

    if (reasons.length > 0) {
      run.status = "Failed";
      run.reasons = reasons;
      run.files = {};
      await send({ type: "step.failed", jobId, stepId: "validate_stl", error: reasons.join("；"), recoverable: true, at: at() });
    } else {
      run.status = "Ready";
      run.reasons = [];
      run.files = {
        stl: `/api/lusie/runs/${run.runId}/download/stl`,
        stlSourceUrl: stlFile.sourceUrl
      };
      await send({ type: "tool.completed", jobId, callId: "validate_stl", name: "validate_stl", outputSummary: "STL file passed validation", at: at() });
      await send({
        type: "artifact.created",
        jobId,
        artifactId: `${run.runId}:stl`,
        kind: "stl",
        title: "Downloadable STL file",
        data: { href: run.files.stl },
        at: at()
      });
    }
  } catch (error) {
    run.status = "Failed";
    run.reasons = [error instanceof Error ? error.message : "model_generation_failed"];
    run.files = {};
    await send({ type: "step.failed", jobId, stepId: "model_generation", error: run.reasons[0], recoverable: true, at: at() });
  }

  await send({ type: "tool.started", jobId, callId: "save_run", name: "save_run", inputSummary: run.status ?? "unknown", at: at() });
  await saveRun(run);
  await send({ type: "tool.completed", jobId, callId: "save_run", name: "save_run", outputSummary: `Status: ${run.status ?? "unknown"}`, at: at() });

  return { run };
}

async function loadRunOrFallback(body: GenerateModelRequest) {
  try {
    return await loadRun(body.runId);
  } catch (error) {
    if (!body.concepts?.length) throw error;

    const now = new Date().toISOString();
    return {
      runId: body.runId,
      input: body.concepts[0]?.prompt ? fallbackInputFromPrompt(body.concepts[0].prompt) : fallbackInput(),
      concepts: body.concepts,
      storage: { mode: "embedded", warning: "Run record was rebuilt from the current browser session." },
      reasons: [],
      files: {},
      createdAt: now,
      updatedAt: now
    } satisfies ModelRun;
  }
}

function fallbackInputFromPrompt(prompt: string): ModelRequest {
  return {
    ...fallbackInput(),
    description: prompt.slice(0, 400)
  };
}

function fallbackInput(): ModelRequest {
  return {
    category: "aircraft",
    subtype: "jet",
    style: "Lusie",
    primaryColor: "#0fbf84",
    accentColor: "#f3ead7",
    label: "AI",
    description: "Recovered from the current concept selection.",
    targetLengthMm: 120
  };
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
