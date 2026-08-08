import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const readerPath = new URL("../public/ai-learning/ai-learning-collection.html", import.meta.url);
const manifestPath = new URL("../public/ai-learning/ai-learning-manifest.webmanifest", import.meta.url);
const readerSource = readFileSync(readerPath, "utf8");
const manifestSource = readFileSync(manifestPath, "utf8");
const authSource = readFileSync(new URL("../lib/auth.ts", import.meta.url), "utf8");
const proxySource = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
const loginSource = readFileSync(new URL("../app/login/page.tsx", import.meta.url), "utf8");
const materialsSource = readFileSync(new URL("../app/fde/materials/page.tsx", import.meta.url), "utf8");
const universeSource = readFileSync(
  new URL("../app/toni-universe/ToniUniverseClient.tsx", import.meta.url),
  "utf8"
);

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

test("protects the reader with the existing slides invite scope", () => {
  assert.match(authSource, /normalizedPathname\.startsWith\("\/ai-learning"\)/);
  assert.match(proxySource, /"\/ai-learning\/:path\*"/);
  assert.match(loginSource, /nextPath\.startsWith\("\/ai-learning"\)/);
});

test("exposes the reader from Toni's materials navigation", () => {
  assert.match(materialsSource, /href="\/ai-learning"/);
  assert.match(universeSource, /Link href="\/ai-learning"/);
});
