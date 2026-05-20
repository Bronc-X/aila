import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shipModelRoot = path.resolve(repoRoot, process.argv[2] ?? ".tmp/ShipModel");
const integratedRoot = path.join(repoRoot, "app/lusie/_shipmodel");
const previewRoot = path.join(repoRoot, "public/lusie/concept-previews");

if (!existsSync(path.join(shipModelRoot, "src"))) {
  throw new Error(`ShipModel source directory not found: ${shipModelRoot}`);
}

copyFile("src/api.ts", "api.ts");
copyFile("src/types.ts", "types.ts");
copyFile("src/components/ModelViewer.tsx", "components/ModelViewer.tsx");
copyFile("src/lusie/LusieApp.tsx", "lusie/LusieApp.tsx");
copyFile("src/lusie/lusie.css", "lusie/lusie-scoped.css");
syncToyboxSources();
copyFile("src/toybox/ToyBoxApp.tsx", "toybox/ToyBoxApp.tsx");
copyFile("src/toybox/toybox.css", "toybox/toybox-scoped.css");
copyTree(path.join(shipModelRoot, "src/toybox/assets/concept-previews"), previewRoot, () => true);

patchIntegratedApi();
patchToyBoxApp();
patchRoutes();
patchConceptPreviewAssets();
patchSupabaseSync();

function copyFile(from, to) {
  const source = path.join(shipModelRoot, from);
  const target = path.join(integratedRoot, to);
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(source, target);
}

function copyTree(sourceRoot, targetRoot, shouldCopy) {
  rmSync(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });
  copyTreeEntries(sourceRoot, targetRoot, shouldCopy);
}

function syncToyboxSources() {
  const sourceRoot = path.join(shipModelRoot, "src/toybox");
  const targetRoot = path.join(integratedRoot, "toybox");
  mkdirSync(targetRoot, { recursive: true });

  for (const entry of readdirSync(targetRoot, { withFileTypes: true })) {
    const target = path.join(targetRoot, entry.name);
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      rmSync(target, { force: true });
    }
  }

  copyTreeEntries(sourceRoot, targetRoot, (entry) => entry.endsWith(".ts"));
}

function copyTreeEntries(sourceDir, targetDir, shouldCopy) {
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(target, { recursive: true });
      copyTreeEntries(source, target, shouldCopy);
      continue;
    }

    if (entry.isFile() && shouldCopy(source)) {
      mkdirSync(path.dirname(target), { recursive: true });
      cpSync(source, target);
    }
  }
}

function patchIntegratedApi() {
  const apiPath = path.join(integratedRoot, "api.ts");
  let text = readText(apiPath);
  text = text
    .replaceAll('"/api/handshake"', '"/api/lusie/handshake"')
    .replaceAll('"/api/concepts"', '"/api/lusie/concepts"')
    .replaceAll('"/api/concepts/revise"', '"/api/lusie/concepts/revise"')
    .replaceAll('"/api/models"', '"/api/lusie/models"')
    .replaceAll("`/api/runs/${encodeURIComponent(runId)}`", "`/api/lusie/runs/${encodeURIComponent(runId)}`");
  if (!text.includes("getConceptFallbacks")) {
    text = text.replace(
      "body: JSON.stringify({ runId, conceptId })",
      "body: JSON.stringify({ runId, conceptId, concepts: getConceptFallbacks() })"
    );
    text = text.replace(
      "\nexport async function getRun(runId: string) {",
      `
let conceptFallbacks: Concept[] = [];

export function setConceptFallbacks(concepts: Concept[]) {
  conceptFallbacks = concepts;
}

function getConceptFallbacks() {
  return conceptFallbacks.map((concept) => ({
    id: concept.id,
    title: concept.title,
    imageUrl: concept.imageUrl,
    imageDataUrl: concept.imageDataUrl,
    prompt: concept.prompt,
    feedback: concept.feedback
  }));
}

export async function getRun(runId: string) {`
    );
  }
  text = text.replace(
    "const json = (await response.json()) as { message?: string; error?: string; reasons?: string[] };",
    "const json = (await response.clone().json()) as { message?: string; error?: string; reasons?: string[] };"
  );
  text = text.replace(
    'return "Request failed";',
    'const text = await response.text().catch(() => "");\n    return text ? `Request failed: ${response.status} ${text.slice(0, 500)}` : `Request failed: ${response.status}`;'
  );
  writeText(apiPath, text);
}

function patchToyBoxApp() {
  const toyBoxPath = path.join(integratedRoot, "toybox/ToyBoxApp.tsx");
  let text = readText(toyBoxPath);
  text = text
    .replace(
      'import { generateConcepts, generateModel, getHandshake, getRun, reviseConcept } from "../api";',
      'import { generateConcepts, generateModel, getHandshake, getRun, reviseConcept, setConceptFallbacks } from "../api";'
    )
    .replace(
      'import { generateConcepts, generateModel, getHandshake, getRun } from "../api";',
      'import { generateConcepts, generateModel, getHandshake, getRun, setConceptFallbacks } from "../api";'
    )
    .replace(
      'import { parseRoute, routePaths, type RouteName, type RouteState } from "./routes";',
      'import { parseRoute, routePaths, toyboxBasePath, type RouteName, type RouteState } from "./routes";'
    )
    .replaceAll(
      "`/api/runs/${encodeURIComponent(readyRun.runId)}/download/stl`",
      "`/api/lusie/runs/${encodeURIComponent(readyRun.runId)}/download/stl`"
    )
    .replace('window.location.pathname === "/"', "window.location.pathname === toyboxBasePath")
    .replaceAll('replacePath(`/download/${restoredRun.runId}`)', "replacePath(`${routePaths.download}/${restoredRun.runId}`)")
    .replaceAll('replacePath(`/failed/${restoredRun.runId}`)', "replacePath(`${routePaths.failed}/${restoredRun.runId}`)")
    .replaceAll('replacePath("/concept")', "replacePath(routePaths.concept)")
    .replace(
      'const path = name === "download" && id ? `/download/${id}` : name === "failed" && id ? `/failed/${id}` : routePaths[name];',
      'const path = name === "download" && id ? `${routePaths.download}/${id}` : name === "failed" && id ? `${routePaths.failed}/${id}` : routePaths[name];'
    )
    .replace(
      "const inviteLink = `${window.location.origin}/?ref=${inviteCode}`;",
      "const inviteLink = `${window.location.origin}${toyboxBasePath}?ref=${inviteCode}`;"
    );

  text = insertAfterOnce(text, "setConcepts(restoredRun.concepts);\n", "    setConceptFallbacks(restoredRun.concepts);\n");
  text = insertAfterOnce(text, "const response = await generateConcepts(input, setConceptProgress);\n", "      setConceptFallbacks(response.concepts);\n");
  text = insertAfterOnce(text, "setModelEvents([]);\n", "    setConceptFallbacks(concepts);\n");
  writeText(toyBoxPath, text);
}

function patchRoutes() {
  const routesPath = path.join(integratedRoot, "toybox/routes.ts");
  let text = readText(routesPath);
  if (!text.includes("toyboxBasePath")) {
    text = text.replace(
      "export const routePaths: Record<RouteName, string> = {",
      'export const toyboxBasePath = "/lusie/ai";\n\nconst routeSlugs: Record<RouteName, string> = {'
    );
    text = text.replace(
      /};\s*\n\s*export function parseRoute/s,
      "};\n\nexport const routePaths: Record<RouteName, string> = Object.fromEntries(\n  Object.entries(routeSlugs).map(([name, slug]) => [name, `${toyboxBasePath}${slug}`])\n) as Record<RouteName, string>;\n\nexport function parseRoute"
    );
    text = text.replace(
      "export function parseRoute(pathname: string): RouteState {\n",
      "export function parseRoute(pathname: string): RouteState {\n  const normalizedPath = stripToyboxBasePath(pathname);\n"
    );
    text = text.replaceAll("pathname ===", "normalizedPath ===");
    text = text.replaceAll(".exec(pathname)", ".exec(normalizedPath)");
    text = text.replaceAll("path === pathname", "path === normalizedPath");
    text += `

function stripToyboxBasePath(pathname: string) {
  if (pathname === toyboxBasePath) return "/";
  if (pathname.startsWith(\`\${toyboxBasePath}/\`)) {
    const stripped = pathname.slice(toyboxBasePath.length);
    return stripped || "/";
  }
  return pathname;
}
`;
  }
  writeText(routesPath, text);
}

function patchConceptPreviewAssets() {
  const assetsPath = path.join(integratedRoot, "toybox/conceptPreviewAssets.ts");
  const text = readText(assetsPath).replaceAll('"/assets/concept-previews"', '"/lusie/concept-previews"');
  writeText(assetsPath, text);
}

function patchSupabaseSync() {
  const syncPath = path.join(integratedRoot, "toybox/supabaseSync.ts");
  if (!existsSync(syncPath)) return;

  let text = readText(syncPath);
  if (!text.includes('import type { ModelRequest } from "../types";')) {
    text = text.replace(
      'import type { LocalHistoryEntry } from "./localHistory";',
      'import type { ModelRequest } from "../types";\nimport type { LocalHistoryEntry } from "./localHistory";'
    );
  }

  text = text.replace(
    'const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\\/+$/, "");\nconst supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";',
    'const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LUSIE_SUPABASE_URL ?? "").replace(/\\/+$/, "");\nconst supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";'
  );
  text = text.replaceAll(/input:\s*entry\.input/g, "input: buildSyncedInput(entry)");

  if (!text.includes("function buildSyncedInput")) {
    text += `

function buildSyncedInput(entry: LocalHistoryEntry): ModelRequest & { _files?: LocalHistoryEntry["files"] } {
  if (!entry.files || Object.keys(entry.files).length === 0) return entry.input;
  return { ...entry.input, _files: entry.files };
}
`;
  }

  writeText(syncPath, text);
}

function insertAfterOnce(text, marker, insertion) {
  if (text.includes(insertion.trim())) return text;
  return text.replace(marker, `${marker}${insertion}`);
}

function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  writeFileSync(filePath, text, "utf8");
}
