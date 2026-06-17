import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toyboxSource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/ToyBoxApp.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/localHistory.ts", import.meta.url), "utf8");
const apiSource = readFileSync(new URL("../app/lusie/_shipmodel/api.ts", import.meta.url), "utf8");
const storageSource = readFileSync(new URL("../lib/lusie/server/storage.ts", import.meta.url), "utf8");
const historyRouteSource = readFileSync(new URL("../app/api/lusie/history/route.ts", import.meta.url), "utf8");

test("Lusie history preserves and reuses STL source URLs for 3D rendering", () => {
  assert.match(historySource, /stlSourceUrl\?: string/);
  assert.match(historySource, /typeof files\.stlSourceUrl === "string"/);
  assert.match(toyboxSource, /withStlSource\(entry\.files\.stl, entry\.files\.stlSourceUrl\)/);
  assert.match(toyboxSource, /source=\$\{encodeURIComponent\(sourceUrl\)\}/);
});

test("Lusie history attempts to recover missing STL source metadata from saved runs", () => {
  assert.match(toyboxSource, /historyRecoveryRunIds/);
  assert.match(toyboxSource, /await getRun\(entry\.runId\)/);
  assert.match(toyboxSource, /restoredRun\.files\.stlSourceUrl/);
});

test("Lusie history loads server-side generated runs instead of localStorage only", () => {
  assert.match(storageSource, /export async function listRuns/);
  assert.match(historyRouteSource, /listRuns/);
  assert.match(apiSource, /export async function getHistoryRuns/);
  assert.match(toyboxSource, /getHistoryRuns\(\)/);
  assert.match(toyboxSource, /mergeHistoryEntries\(runs\.map\(historyEntryFromRun\), getHistoryEntries\(\)\)/);
  assert.match(toyboxSource, /filterRecoverableLocalHistory/);
});
