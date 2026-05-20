import assert from "node:assert/strict";
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
  const script = new vm.Script(outputText, { filename: `lusie-api-revision.${cacheKey}.cjs` });
  const context = vm.createContext({
    Buffer,
    Blob,
    FormData,
    Response,
    exports,
    module,
    process: { env: {} },
    require: requireWithMocks,
  });

  script.runInContext(context);
  return module.exports;
}

test("reviseConcept rejects empty revision instructions", async () => {
  const api = await importApiWithMocks(
    {
      "node:crypto": { randomUUID: () => "unused" },
      "./storage": {
        ensureRunDir: async () => {},
        getStorageConfigState: () => ({ ready: true }),
        loadRun: async () => {
          throw new Error("loadRun should not run for empty instructions");
        },
        persistConceptImages: async () => ({ concepts: [], storage: { mode: "embedded" } }),
        saveRun: async () => {},
      },
      "./providers/openaiImages": {
        openAiConcepts: async () => [],
        reviseOpenAiConcept: async () => {
          throw new Error("reviseOpenAiConcept should not run for empty instructions");
        },
      },
      "./providers/tripoModel": {
        generateTripoModel: async () => ({ fileName: "model.stl", sourceUrl: "https://example.test/model.stl" }),
      },
      "./validate": {
        validateStl: async () => [],
      },
      "./validation": {
        formatValidationReasons: (reasons) => reasons.join(";"),
        validateInput: () => [],
      },
    },
    `empty-${Date.now()}`
  );

  assert.equal(typeof api.reviseConcept, "function");

  const response = await api.reviseConcept({
    runId: "run-1",
    conceptId: "concept-1",
    instruction: "   "
  });

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error, "Invalid input");
});
