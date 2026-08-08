import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const caseDataSource = readFileSync(
  new URL("../app/case-library/case-library-data.ts", import.meta.url),
  "utf8"
);
const caseClientSource = readFileSync(
  new URL("../app/case-library/CaseLibraryClient.tsx", import.meta.url),
  "utf8"
);
const casePageSource = readFileSync(
  new URL("../app/case-library/page.tsx", import.meta.url),
  "utf8"
);
const workDataSource = readFileSync(
  new URL("../app/work/work-data.ts", import.meta.url),
  "utf8"
);

test("FDE entries open the server-backed runner instead of a recording or nested case shell", () => {
  assert.ok(caseDataSource.includes('href: "/work/fde-workflow-runner.html?case=crossborder"'));
  assert.ok(caseDataSource.includes('href: "/work/fde-workflow-runner.html?case=immigration"'));
  assert.ok(caseDataSource.includes('embedSrc: "/work/fde-workflow-runner.html?case=crossborder"'));
  assert.ok(caseDataSource.includes('embedSrc: "/work/fde-workflow-runner.html?case=immigration"'));
  assert.equal(caseDataSource.includes('href: "/work/fde-case-library.html#crossborder"'), false);
  assert.equal(caseDataSource.includes('href: "/work/fde-case-library.html#immigration"'), false);
  assert.ok(caseClientSource.includes("setSurfaceSrc"));
  assert.ok(caseClientSource.includes('src={surfaceSrc || undefined}'));
});

test("case library keeps native product routes and visible evidence boundaries", () => {
  for (const route of [
    "/work/weld-vision/demo",
    "/tools/sales",
    "/tools/service",
    "/tools/activity-plan",
    "/tools/auto-red-book",
    "/tools/research",
    "/lusie",
  ]) {
    assert.ok(caseDataSource.includes(`embedSrc: "${route}"`), `missing native embed route: ${route}`);
  }

  assert.ok(caseDataSource.includes("当前本地未配置外部生成 Provider"));
  assert.ok(caseClientSource.includes("<span>项目档案</span>"));
  assert.ok(casePageSource.includes('actionLabel: item.nativeRoute ? "打开原生路由" : "查看项目档案"'));
  assert.ok(casePageSource.includes('item.evidenceStatus !== "pending"'));
  assert.ok(casePageSource.includes("站内原生路由。"));
  assert.ok(casePageSource.includes("未纳入本仓库的功能不作为可运行产品展示。"));
});

test("work records point native products to their actual local routes", () => {
  for (const route of ["/tools", "/lusie", "/tools/auto-red-book", "/work/weld-vision/demo"]) {
    assert.ok(workDataSource.includes(`nativeRoute: "${route}"`), `missing native route: ${route}`);
  }
});
