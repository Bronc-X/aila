import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("sync script keeps toybox TSX/CSS files while syncing generated TS sources", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "sync-shipmodel-"));
  const tempRepo = path.join(tempRoot, "aila");
  const tempShipModel = path.join(tempRoot, "ShipModel");

  cpSync(path.join(repoRoot, "scripts/sync-shipmodel.mjs"), path.join(tempRepo, "scripts/sync-shipmodel.mjs"), {
    recursive: true
  });

  writeFixture(tempShipModel, "src/api.ts", 'export async function getHandshake() { return fetch("/api/handshake"); }\nexport async function generateModel(runId: string, conceptId: string) {\n  return fetch("/api/models", { body: JSON.stringify({ runId, conceptId }) });\n}\nexport async function getRun(runId: string) { return fetch(`/api/runs/${encodeURIComponent(runId)}`); }\n');
  writeFixture(tempShipModel, "src/types.ts", "export interface Concept { id: string; imageUrl: string; prompt: string; title: string; feedback?: string; imageDataUrl?: string; }\n");
  writeFixture(tempShipModel, "src/components/ModelViewer.tsx", "export function ModelViewer() { return null; }\n");
  writeFixture(tempShipModel, "src/lusie/LusieApp.tsx", "export function App() { return null; }\n");
  writeFixture(tempShipModel, "src/lusie/lusie.css", ".site-shell {}\n");
  writeFixture(tempShipModel, "src/toybox/ToyBoxApp.tsx", 'import { generateConcepts, generateModel, getHandshake, getRun } from "../api";\nimport { parseRoute, routePaths, type RouteName, type RouteState } from "./routes";\nconst stlDownloadHref = readyRun ? `/api/runs/${encodeURIComponent(readyRun.runId)}/download/stl` : "";\nif (window.location.pathname === "/") {}\nconst inviteLink = `${window.location.origin}/?ref=${inviteCode}`;\nsetConcepts(restoredRun.concepts);\nconst response = await generateConcepts(input, setConceptProgress);\nsetModelEvents([]);\n');
  writeFixture(tempShipModel, "src/toybox/toybox.css", ".toybox-app {}\n");
  writeFixture(tempShipModel, "src/toybox/catalog.ts", "export const catalog = [];\n");
  writeFixture(tempShipModel, "src/toybox/routes.ts", 'export type RouteName = "configure" | "download" | "failed" | "concept";\nexport interface RouteState { name: RouteName; runId?: string; }\nexport const routePaths: Record<RouteName, string> = {\n  configure: "/configure",\n  download: "/download",\n  failed: "/failed",\n  concept: "/concept"\n};\nexport function parseRoute(pathname: string): RouteState {\n  if (pathname === "/" || pathname === routePaths.configure) return { name: "configure" };\n  const downloadMatch = /^\\/download\\/([^/]+)$/.exec(pathname);\n  if (downloadMatch) return { name: "download", runId: decodeURIComponent(downloadMatch[1]) };\n  return { name: "configure" };\n}\n');
  writeFixture(tempShipModel, "src/toybox/conceptPreviewAssets.ts", 'const previewBasePath = "/assets/concept-previews";\n');
  writeFixture(tempShipModel, "src/toybox/supabaseSync.ts", 'import type { LocalHistoryEntry } from "./localHistory";\nconst supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\\/+$/, "");\nconst supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";\nexport async function syncHistoryEntry(entry: LocalHistoryEntry) {\n  return fetch(`${supabaseUrl}/rest/v1/toybox_history`, { body: JSON.stringify({ input: entry.input }) });\n}\n');
  writeFixture(tempShipModel, "src/toybox/assets/concept-previews/sample.png", "png");

  execFileSync(process.execPath, [path.join(tempRepo, "scripts/sync-shipmodel.mjs"), tempShipModel], {
    cwd: tempRepo,
    stdio: "pipe"
  });

  const toyBoxPath = path.join(tempRepo, "app/lusie/_shipmodel/toybox/ToyBoxApp.tsx");
  const routesPath = path.join(tempRepo, "app/lusie/_shipmodel/toybox/routes.ts");
  const supabaseSyncPath = path.join(tempRepo, "app/lusie/_shipmodel/toybox/supabaseSync.ts");
  const supabaseSync = readFileSync(supabaseSyncPath, "utf8");

  assert.match(readFileSync(toyBoxPath, "utf8"), /setConceptFallbacks/);
  assert.match(readFileSync(routesPath, "utf8"), /toyboxBasePath = "\/lusie\/ai"/);
  assert.match(supabaseSync, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(supabaseSync, /buildSyncedInput\(entry\)/);
  assert.match(supabaseSync, /_files/);
  assert.equal(readFileSync(path.join(tempRepo, "app/lusie/_shipmodel/toybox/toybox-scoped.css"), "utf8"), ".toybox-app {}\n");
  assert.equal(readFileSync(path.join(tempRepo, "app/lusie/_shipmodel/toybox/catalog.ts"), "utf8"), "export const catalog = [];\n");
  assert.equal(readFileSync(path.join(tempRepo, "app/lusie/_shipmodel/toybox/assets/concept-previews/sample.png"), "utf8"), "png");
  assert.equal(readFileSync(path.join(tempRepo, "public/lusie/concept-previews/sample.png"), "utf8"), "png");
});

function writeFixture(root, relativePath, content) {
  const fullPath = path.join(root, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}
