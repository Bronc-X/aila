import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import Module from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

async function importApiWithMocks(mocks, cacheKey) {
  const source = await readFile(new URL("./api.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

  const exports = {};
  const module = { exports };
  const baseRequire = Module.createRequire(import.meta.url);
  const requireWithMocks = (specifier) => specifier in mocks ? mocks[specifier] : baseRequire(specifier);
  const script = new vm.Script(outputText, { filename: `lusie-api.${cacheKey}.cjs` });
  const context = vm.createContext({
    ReadableStream,
    Response,
    TextEncoder,
    exports,
    module,
    process: {
      env: {
        TRIPO_API_KEY: "tripo-test-key",
      },
    },
    require: requireWithMocks,
  });

  script.runInContext(context);
  return module.exports;
}

test("model generation streams real backend job events before returning the final run", async () => {
  const savedRuns = [];
  const run = baseRun();
  const api = await importApiWithMocks(
    {
      "node:crypto": { randomUUID: () => "unused" },
      "./storage": {
        ensureRunDir: async () => {},
        getStorageConfigState: () => ({ ready: true }),
        loadRun: async () => ({ ...run, files: {} }),
        persistConceptImages: async () => ({ concepts: [], storage: { mode: "embedded" } }),
        saveRun: async (saved) => {
          savedRuns.push(saved);
        },
      },
      "./providers/openaiImages": {
        openAiConcepts: async () => [],
      },
      "./providers/tripoModel": {
        generateTripoModel: async (_run, emit) => {
          await emit({ type: "tool.started", callId: "tripo_poll_model_task", name: "tripo_poll_model_task", inputSummary: "task-1" });
          await emit({ type: "tool.completed", callId: "tripo_poll_model_task:1", name: "tripo_poll_model_task_status", outputSummary: "task-1: running" });
          await emit({ type: "tool.completed", callId: "tripo_download_stl", name: "tripo_download_stl", outputSummary: "model.stl" });
          return { fileName: "model.stl", sourceUrl: "https://tripo.example/model.stl" };
        },
      },
      "./validate": {
        validateStl: async () => [],
      },
      "./validation": {
        formatValidationReasons: (reasons) => reasons.join(";"),
        validateInput: () => [],
      },
    },
    `stream-${Date.now()}`
  );

  assert.equal(typeof api.createModelProgressStream, "function");

  const response = api.createModelProgressStream({ runId: run.runId, conceptId: run.concepts[0].id });
  assert.equal(response.headers.get("Content-Type"), "application/x-ndjson; charset=utf-8");
  assert.equal(response.headers.get("X-Accel-Buffering"), "no");

  const body = await response.text();
  const events = body.trim().split("\n").map((line) => JSON.parse(line));
  const types = events.map((event) => event.type);

  assert.equal(events[0].type, "job.started");
  assert.ok(types.includes("tool.started"));
  assert.ok(types.includes("tool.completed"));
  assert.ok(types.includes("artifact.created"));
  assert.equal(events.at(-1).type, "job.completed");
  assert.equal(events.at(-1).response.run.status, "Ready");
  assert.equal(events.at(-1).response.run.files.stl, `/api/lusie/runs/${run.runId}/download/stl`);
  assert.equal(events.at(-1).response.run.files.stlSourceUrl, "https://tripo.example/model.stl");
  assert.equal(savedRuns.length, 1);
  assert.equal(savedRuns[0].files.stlSourceUrl, "https://tripo.example/model.stl");
});

function baseRun() {
  return {
    runId: "event-stream-run",
    input: {
      category: "aircraft",
      subtype: "airliner",
      style: "baseline",
      primaryColor: "#245b70",
      accentColor: "#f3ead7",
      label: "07",
      description: "event stream model",
      targetLengthMm: 120,
    },
    concepts: [
      {
        id: "concept-1",
        title: "推荐建模图",
        imageUrl: "https://example.test/concept.png",
        prompt: "test",
      },
    ],
    selectedConceptId: "concept-1",
    reasons: [],
    files: {},
    createdAt: "2026-05-18T00:00:00.000Z",
    updatedAt: "2026-05-18T00:00:00.000Z",
  };
}
