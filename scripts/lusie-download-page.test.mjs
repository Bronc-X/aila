import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const toyboxSource = readFileSync(new URL("../app/lusie/_shipmodel/toybox/ToyBoxApp.tsx", import.meta.url), "utf8");
const modelViewerSource = readFileSync(new URL("../app/lusie/_shipmodel/components/ModelViewer.tsx", import.meta.url), "utf8");

test("Lusie ready-run download page presents a final download handoff, not the old inspection desk", () => {
  assert.match(toyboxSource, /<h1>STL 文件已生成<\/h1>/);
  assert.match(toyboxSource, /下载成品文件/);
  assert.match(toyboxSource, /下载 STL 文件/);
  assert.doesNotMatch(toyboxSource, /<h1>模型检查台<\/h1>/);
  assert.doesNotMatch(toyboxSource, /STL geometry only/);
});

test("Lusie download preview keeps subtype-specific fallback geometry", () => {
  assert.match(toyboxSource, /<ModelViewer[^>]+subtype=\{run\.input\.subtype\}/);
  assert.match(modelViewerSource, /subtype\?: ModelSubtype/);
  assert.match(modelViewerSource, /subtype === "biplane"/);
  assert.match(modelViewerSource, /addBiplane/);
});
