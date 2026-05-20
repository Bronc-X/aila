import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

async function importSupabaseSync(fetchImpl, cacheKey) {
  const source = await readFile(
    new URL("../../../app/lusie/_shipmodel/toybox/supabaseSync.ts", import.meta.url),
    "utf8"
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const runnableText = outputText.replaceAll("import.meta.env", "process.env");

  const exports = {};
  const module = { exports };
  const script = new vm.Script(runnableText, { filename: `supabase-sync.${cacheKey}.cjs` });
  const context = vm.createContext({
    exports,
    fetch: fetchImpl,
    module,
    process: {
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "https://supabase.example/",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "publishable-key",
      },
    },
  });

  script.runInContext(context);
  return module.exports;
}

test("Supabase history sync preserves STL source metadata for ready runs", async () => {
  let requestBody;
  const { syncHistoryEntry } = await importSupabaseSync(async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return { ok: true };
  }, "ready");

  const result = await syncHistoryEntry({
    ...baseHistoryEntry(),
    status: "ready",
    files: {
      stl: "/api/lusie/runs/run-ready/download/stl",
      stlSourceUrl: "https://tripo.example/model.stl",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(requestBody.input._files.stl, "/api/lusie/runs/run-ready/download/stl");
  assert.equal(requestBody.input._files.stlSourceUrl, "https://tripo.example/model.stl");
});

test("Supabase history sync does not send empty file metadata for non-ready history", async () => {
  let requestBody;
  const { syncHistoryEntry } = await importSupabaseSync(async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return { ok: true };
  }, "concept");

  const result = await syncHistoryEntry({
    ...baseHistoryEntry(),
    status: "concept",
  });

  assert.equal(result.ok, true);
  assert.equal("_files" in requestBody.input, false);
});

function baseHistoryEntry() {
  return {
    id: "run-ready",
    input: {
      category: "vehicle",
      subtype: "race-car",
      style: "baseline",
      primaryColor: "#c7352f",
      accentColor: "#f3ead7",
      label: "07",
      description: "baseline sync metadata",
      targetLengthMm: 120,
    },
    runId: "run-ready",
    concepts: [],
    selectedConceptId: "concept-1",
    createdAt: "2026-05-13T00:00:00.000Z",
    updatedAt: "2026-05-13T00:00:01.000Z",
    title: "baseline race-car",
    label: "07",
    previewImageUrl: null,
  };
}
