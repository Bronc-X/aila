import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = Number(process.env.LUSIE_BASELINE_PORT ?? 3317);
const baseUrl = `http://${host}:${port}`;
const nextBin = path.join("node_modules", "next", "dist", "bin", "next");

await run(process.execPath, [
  "--test",
  path.join("lib", "lusie", "server", "stl-download-route.test.mjs"),
  path.join("lib", "lusie", "server", "model-progress-stream.test.mjs"),
  path.join("lib", "lusie", "server", "supabase-sync.test.mjs"),
  path.join("lib", "lusie", "server", "concept-revision.test.mjs"),
  path.join("scripts", "sync-shipmodel.test.mjs"),
  path.join("scripts", "lusie-download-page.test.mjs"),
  path.join("scripts", "lusie-history-stl-source.test.mjs"),
  path.join("scripts", "now-page.test.mjs"),
  path.join("scripts", "ai-pm-prep-page.test.mjs"),
  path.join("scripts", "toni-universe.test.mjs"),
  path.join("scripts", "tools-showcase.test.mjs")
]);
await run(process.execPath, [nextBin, "build"]);

const server = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", String(port)], {
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

const logs = [];
server.stdout.on("data", (chunk) => pushLog(logs, chunk));
server.stderr.on("data", (chunk) => pushLog(logs, chunk));

try {
  await waitForServer();
  await expectText("/lusie", "Lusie AI /");
  await expectOk("/lusie/showcase");
  await expectOk("/lusie/showcase/competitions");
  await expectOk("/lusie/ai");
  await expectOk("/lusie/ai/configure");
  await expectText("/ai-pm-prep", "T0 课预习包");
  await expectText("/ai-pm-prep", "CC Switch");
  await expectText("/ai-pm-prep", "Claude Code 和 Codex 的 API 配置");
  await expectText("/", "企业 FDE 图谱");
  await expectText("/spatial", "航模项目");
  await expectText("/toni-universe", "Forward Deployed Engineering");
  await expectRouteRedirect("/toni-universe/fde", "/aila");
  await expectRouteRedirect("/toni-universe/transform", "/aila#delivery");
  await expectLoginRedirect("/tools/research");
  await expectLoginRedirect("/tools/admin");
  await expectLoginRedirect("/tools/operations");
  await expectPublicText("/tools/activity-plan", "把活动方案做成一套能交付的出品包");
  await expectPublicText("/tools/auto-red-book", "中转站 API 对接的到底是真模型还是伪装模型");
  await expectText("/aila", "源码一次性交付");
  await expectText("/lusie", "生成链路");
  await expectOk("/work/training-system");
  await expectHandshake();
  await expectValidationGuard();
  console.log("Lusie baseline passed.");
} finally {
  stopServer(server);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited early.\n${logs.join("")}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/lusie/handshake`, { cache: "no-store" });
      if (response.ok) return;
    } catch {
      // Keep polling until the production server is ready.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${baseUrl}.\n${logs.join("")}`);
}

async function expectOk(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${routePath} returned ${response.status}`);
  }
}

async function expectPublicText(routePath, expected) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    cache: "no-store",
    redirect: "manual",
  });
  const body = await response.text();
  if (response.status !== 200 || !body.includes(expected)) {
    throw new Error(`${routePath} is not a public page containing: ${expected}`);
  }
}

async function expectLoginRedirect(routePath) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    cache: "no-store",
    redirect: "manual",
  });
  const expectedLocation = `/login?next=${encodeURIComponent(routePath)}`;
  if (response.status !== 307 || response.headers.get("location") !== expectedLocation) {
    throw new Error(`${routePath} did not preserve the expected login redirect`);
  }
}

async function expectRouteRedirect(routePath, expectedLocation) {
  const response = await fetch(`${baseUrl}${routePath}`, {
    cache: "no-store",
    redirect: "manual",
  });
  if (response.status !== 307 || response.headers.get("location") !== expectedLocation) {
    throw new Error(`${routePath} did not redirect to ${expectedLocation}`);
  }
}

async function expectText(routePath, expected) {
  const response = await fetch(`${baseUrl}${routePath}`, { cache: "no-store" });
  const body = await response.text();
  if (!response.ok || !body.includes(expected)) {
    throw new Error(`${routePath} did not include expected text: ${expected}`);
  }
}

async function expectHandshake() {
  const response = await fetch(`${baseUrl}/api/lusie/handshake`, { cache: "no-store" });
  const json = await response.json();
  if (
    !response.ok ||
    json?.ok !== true ||
    json?.app !== "printable-model-demo" ||
    typeof json?.configured?.storage !== "boolean"
  ) {
    throw new Error("Lusie handshake API returned an unexpected payload.");
  }
}

async function expectValidationGuard() {
  const response = await fetch(`${baseUrl}/api/lusie/concepts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: "aircraft",
      subtype: "jet",
      style: "baseline",
      primaryColor: "#c7352f",
      accentColor: "#f3ead7",
      label: "07",
      description: "baseline validation guard",
      targetLengthMm: 10
    })
  });
  const json = await response.json();
  if (response.status !== 400 || !json?.reasons?.includes("target_length_out_of_range")) {
    throw new Error("Lusie concepts API validation guard did not fire.");
  }
}

function pushLog(logs, chunk) {
  logs.push(chunk.toString());
  while (logs.join("").length > 4000) logs.shift();
}

function stopServer(child) {
  if (!child.pid || child.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  child.kill("SIGTERM");
}
