import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const readerPath = new URL("../public/ai-learning/ai-learning-collection.html", import.meta.url);
const manifestPath = new URL("../public/ai-learning/ai-learning-manifest.webmanifest", import.meta.url);
const builderPath = new URL("./build-ai-learning-reader.mjs", import.meta.url);
const readerSource = readFileSync(readerPath, "utf8");
const manifestSource = readFileSync(manifestPath, "utf8");
const builderSource = readFileSync(builderPath, "utf8");
const authSource = readFileSync(new URL("../lib/auth.ts", import.meta.url), "utf8");
const proxySource = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
const loginSource = readFileSync(new URL("../app/login/page.tsx", import.meta.url), "utf8");
const materialsSource = readFileSync(new URL("../app/fde/materials/page.tsx", import.meta.url), "utf8");
const universeSource = readFileSync(
  new URL("../app/toni-universe/ToniUniverseClient.tsx", import.meta.url),
  "utf8"
);

function readEmbeddedSourceData() {
  const match = readerSource.match(
    /<script id="aiLearningSourceData" type="application\/json">([\s\S]*?)<\/script>/
  );

  assert.ok(match, "reader must embed the source corpus in the same HTML page");
  return JSON.parse(match[1]);
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
}

test("ships the complete AI learning reader as a static Toni asset", () => {
  assert.equal(existsSync(readerPath), true);
  assert.equal(existsSync(manifestPath), true);
  assert.ok(statSync(readerPath).size > 500_000);
  assert.match(readerSource, /<meta charset="utf-8">/);
  assert.match(readerSource, /id="search"/);
  assert.match(readerSource, /id="progressBar"/);
  assert.match(readerSource, /ai-learning-manifest\.webmanifest/);
  assert.match(readerSource, /href="\/fde\/materials"/);
  assert.match(manifestSource, /"start_url": "\.\/ai-learning-collection\.html"/);
});

test("embeds the complete corpus and every available source body in the same page", () => {
  const sourceData = readEmbeddedSourceData();

  assert.equal(sourceData.documents.length, 624);
  assert.equal(
    sourceData.documents.filter((document) => document.body).length,
    602
  );
  assert.equal(
    sourceData.documents.filter((document) => !document.body).length,
    22
  );

  const markdownSource = sourceData.documents.find(
    (document) => document.localFile === "85.AI大模型领域核心概念.md"
  );
  assert.ok(markdownSource?.body);
  assert.equal(markdownSource.sourceKind, "markdown");
  assert.equal(
    sha256(markdownSource.body),
    "58C997205086FC01F75E4BCA46D4B4B2CAD01E39990BD4D120FC64E5810BFE3F"
  );

  const pdfSource = sourceData.documents.find(
    (document) => document.title === "104.RAG优化相关面试题"
  );
  assert.ok(pdfSource?.body);
  assert.equal(pdfSource.sourceKind, "pdf-text");
  assert.equal(
    sha256(pdfSource.body),
    "FD4EEB240AC05D7412B6A8138709FFDFD82F8B1888736A2F108A345578E6379B"
  );
});

test("integrates the linked conversation as traceable source material and a study chapter", () => {
  const sourceData = readEmbeddedSourceData();
  const transcript = sourceData.documents.find(
    (document) =>
      document.sourceThreadId === "01a008fe-af2e-7c63-9c56-ac65f887315b" &&
      document.sourceKind === "conversation-transcript"
  );
  const studyGuide = sourceData.documents.find(
    (document) =>
      document.sourceThreadId === "01a008fe-af2e-7c63-9c56-ac65f887315b" &&
      document.sourceKind === "conversation-note"
  );

  assert.ok(transcript?.body.includes("像 token、怎么切词、怎么去找向量"));
  assert.equal(transcript.studyLevel, "lookup");
  assert.ok(transcript.topics.includes("section-11"));
  assert.equal(studyGuide?.studyLevel, "must");
  assert.ok(studyGuide.topics.includes("section-11"));

  assert.match(readerSource, /id="section-11"/);
  assert.match(readerSource, /从 Transformer 论文到现代 LLM、扩散模型与 RAG/);
  assert.match(readerSource, /李沐论文精读/);
  assert.match(readerSource, /Umar Jamil/);
  assert.match(readerSource, /Karpathy/);
  assert.match(readerSource, /Stanford CS336/);
  assert.match(readerSource, /Stanford CME296/);
  assert.match(readerSource, /BM25.*混合检索.*Reranker.*RAG Evaluation/s);
  assert.match(readerSource, /Equal contribution/);
  assert.match(readerSource, /Google Brain/);
});

test("marks what to study and opens original text without leaving the reader", () => {
  const sourceData = readEmbeddedSourceData();
  const levels = new Set(sourceData.documents.map((document) => document.studyLevel));

  assert.deepEqual(levels, new Set(["must", "optional", "lookup"]));
  assert.match(readerSource, />必学</);
  assert.match(readerSource, />选学</);
  assert.match(readerSource, />回查</);
  assert.match(readerSource, /id="sourceLibraryButton"/);
  assert.match(readerSource, /id="sourceViewer"/);
  assert.match(readerSource, /id="sourceViewerBody"/);
  assert.match(readerSource, /function openSourceDocument\(/);
  assert.doesNotMatch(readerSource, /window\.open\(/);

  const coreSource = sourceData.documents.find(
    (document) => document.localFile === "85.AI大模型领域核心概念.md"
  );
  assert.equal(coreSource?.studyLevel, "must");
  assert.ok(coreSource.topics.includes("section-2"));
  assert.ok(
    coreSource.studyRanges.some(
      (range) => range.startLine === 3 && range.endLine === 127
    )
  );
  assert.ok(coreSource.learningHints.some((hint) => hint.includes("用于传统编程/机器学习")));
});

test("keeps the browser document available while rendering source records", () => {
  assert.doesNotMatch(builderSource, /function renderSourceBody\(document\)/);
  assert.doesNotMatch(builderSource, /documents\.forEach\(\(document\)/);
  assert.doesNotMatch(readerSource, /function renderSourceBody\(document\)/);
  assert.doesNotMatch(readerSource, /documents\.forEach\(\(document\)/);
});

test("keeps source context visible and mobile source cards compact", () => {
  for (const source of [builderSource, readerSource]) {
    assert.match(
      source,
      /\.source-list\s*\{[^}]*align-items:\s*flex-start;[^}]*\}/s
    );
    assert.match(
      source,
      /sourceReader\.scrollTo\(\{\s*top:\s*0,\s*left:\s*0\s*\}\)/
    );
    assert.doesNotMatch(source, /firstStudyLine\?\.scrollIntoView/);
  }
});

test("generates the in-page Feynman selection workflow", () => {
  assert.match(readerSource, /id="askAiAction"/);
  assert.match(readerSource, /id="feynmanPanel"/);
  assert.match(readerSource, /id="feynmanAnswer"/);
  assert.match(readerSource, /\/api\/learning\/feynman/);
  assert.match(readerSource, /selectionchange/);
  assert.match(readerSource, /textContent\s*=\s*explanation/);
  assert.doesNotMatch(readerSource, /feynmanAnswer\.innerHTML/);
});

test("protects the reader with the existing slides invite scope", () => {
  assert.match(authSource, /normalizedPathname\.startsWith\("\/ai-learning"\)/);
  assert.match(proxySource, /"\/ai-learning\/:path\*"/);
  assert.match(authSource, /normalizedPathname\.startsWith\("\/api\/learning"\)/);
  assert.match(proxySource, /"\/api\/learning\/:path\*"/);
  assert.match(loginSource, /nextPath\.startsWith\("\/ai-learning"\)/);
});

test("exposes the reader from Toni's materials navigation", () => {
  assert.match(materialsSource, /href="\/ai-learning"/);
  assert.match(universeSource, /Link href="\/ai-learning"/);
});
