import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toyboxSource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/ToyBoxApp.tsx", import.meta.url), "utf8");
const historySource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/localHistory.ts", import.meta.url), "utf8");

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
