import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toyboxSource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/ToyBoxApp.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/localHistory.ts", import.meta.url), "utf8");
const apiSource = readFileSync(new URL("../app/lusie/_shipmodel/api.ts", import.meta.url), "utf8");
const clientTypesSource = readFileSync(new URL("../app/lusie/_shipmodel/types.ts", import.meta.url), "utf8");
const storageSource = readFileSync(new URL("../lib/lusie/server/storage.ts", import.meta.url), "utf8");
const historyRouteSource = readFileSync(new URL("../app/api/lusie/history/route.ts", import.meta.url), "utf8");
const historyPageSource = readFileSync(new URL("../app/lusie/ai/LusieHistoryClient.tsx", import.meta.url), "utf8");

test("Lusie history preserves and reuses STL source URLs for 3D rendering", () => {
  assert.match(historySource, /stlSourceUrl\?: string/);
  assert.match(historySource, /stlPersisted\?: boolean/);
  assert.match(historySource, /typeof files\.stlSourceUrl === "string"/);
  assert.match(historySource, /files\.stlPersisted === true/);
  assert.match(toyboxSource, /withStlSource\(entry\.files\.stl, entry\.files\.stlSourceUrl\)/);
  assert.match(toyboxSource, /source=\$\{encodeURIComponent\(sourceUrl\)\}/);
});

test("Lusie history attempts to recover missing STL source metadata from saved runs", () => {
  assert.match(toyboxSource, /historyRecoveryRunIds/);
  assert.match(toyboxSource, /await getRun\(entry\.runId\)/);
  assert.match(toyboxSource, /hasRecoverableStl\(restoredRun\.files\)/);
});

test("Lusie history loads server-side generated runs instead of localStorage only", () => {
  assert.match(storageSource, /export async function listRuns/);
  assert.match(historyRouteSource, /listRuns/);
  assert.match(apiSource, /export async function getHistoryRuns/);
  assert.match(toyboxSource, /getHistoryRuns\(\)/);
  assert.match(toyboxSource, /const localEntries = getHistoryEntries\(\)/);
  assert.match(toyboxSource, /mergeHistoryEntries\(runs\.map\(historyEntryFromRun\), localEntries\)/);
  assert.match(toyboxSource, /filterDeliverableHistoryEntries/);
  assert.match(toyboxSource, /hasRecoverableStl/);
  assert.match(toyboxSource, /files\.stlSourceUrl \|\| files\.stlPersisted/);
  assert.match(storageSource, /markPersistedStl/);
  assert.match(storageSource, /stlStats\.size >= 256/);
  assert.match(storageSource, /\/api\/lusie\/runs\/\$\{run\.runId\}\/download\/stl/);
  assert.match(clientTypesSource, /stlPersisted\?: boolean/);
});

test("Lusie Supabase history list avoids loading heavy concept payloads before STL filtering", () => {
  assert.match(storageSource, /status=eq\.ready&select=run_id,input,selected_concept_id,status,created_at,updated_at/);
  assert.match(storageSource, /getSupabaseHistoryFiles\(row\.input\)/);
  assert.match(storageSource, /files\.stl \|\| files\.stlSourceUrl \|\| files\.stlPersisted/);
  assert.match(storageSource, /loadHistoryRowFromSupabase\(row/);
  assert.match(storageSource, /stripEmbeddedConceptImages/);
  assert.doesNotMatch(storageSource, /select=run_id,input,concepts,selected_concept_id,status,created_at,updated_at&order=updated_at\.desc/);
});

test("Lusie history page keeps the Tripo STL source URL on preview and download links", () => {
  assert.match(historyPageSource, /withStlSource\(run\.files\.stl/);
  assert.match(historyPageSource, /run\.files\.stlSourceUrl/);
  assert.match(historyPageSource, /source=\$\{encodeURIComponent\(sourceUrl\)\}/);
});

test("Lusie local generated runs persist in the project during development", () => {
  assert.match(storageSource, /process\.cwd\(\), "data", "lusie", "runs"/);
  assert.doesNotMatch(storageSource, /toni-lusie-runs/);
});
