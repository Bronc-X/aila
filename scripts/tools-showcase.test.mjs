import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const toolsSource = readFileSync(new URL("../app/tools/page.tsx", import.meta.url), "utf8");
const motionSource = readFileSync(new URL("../app/tools/_components/PortfolioCaseMotion.tsx", import.meta.url), "utf8");
const proposalSource = readFileSync(new URL("../app/tools/activity-plan/page.tsx", import.meta.url), "utf8");
const matrixSource = readFileSync(new URL("../app/tools/auto-red-book/page.tsx", import.meta.url), "utf8");
const shellSource = readFileSync(new URL("../app/components/LegacyPageMotionShell.tsx", import.meta.url), "utf8");

test("tools overview routes unfinished modules to internal portfolio case pages", () => {
  assert.ok(toolsSource.includes('href: "/tools/activity-plan"'));
  assert.ok(toolsSource.includes('href: "/tools/auto-red-book"'));
  assert.ok(toolsSource.includes('badge: "CASE STUDY"'));
  assert.equal(toolsSource.includes('href: "https://github.com/xiahui001/Activity-plan.git"'), false);
  assert.equal(toolsSource.includes('href: "https://github.com/xiahui001/auto-red-book.git"'), false);
});

test("portfolio case pages preserve source evidence and local visual assets", () => {
  assert.ok(proposalSource.includes("https://github.com/xiahui001/Activity-plan.git"));
  assert.ok(matrixSource.includes("https://github.com/xiahui001/auto-red-book.git"));
  assert.ok(proposalSource.includes("/tools-showcase/activity-plan-editorial-hero.webp"));
  assert.ok(matrixSource.includes("/tools-showcase/xhs-matrix-editorial-hero.webp"));
  assert.ok(proposalSource.includes("/brand/toni-asia/toni-asia-brand-board-image2.png"));
  assert.ok(matrixSource.includes("/now/auto-red-book-github.png"));
  assert.ok(existsSync(new URL("../public/tools-showcase/activity-plan-editorial-hero.webp", import.meta.url)));
  assert.ok(existsSync(new URL("../public/tools-showcase/xhs-matrix-editorial-hero.webp", import.meta.url)));
  assert.ok(existsSync(new URL("../public/tools-showcase/commercial-poster-workshop.webp", import.meta.url)));
});

test("portfolio copy stays evidence-led and matches the supplied knowledge themes", () => {
  assert.ok(matrixSource.includes("数据管道"));
  assert.ok(matrixSource.includes("异构接口"));
  assert.ok(matrixSource.includes("中转站 API"));
  assert.ok(matrixSource.includes("Harness"));
  assert.ok(matrixSource.includes("自然语言规则、外部规则文件和完整运行框架"));
  assert.ok(proposalSource.includes("品牌物料"));
  assert.ok(proposalSource.includes("PPTX"));

  const combined = `${proposalSource}\n${matrixSource}`;
  for (const phrase of ["AI 赋能", "颠覆式", "无限可能", "重塑未来", "一键生成爆款"]) {
    assert.equal(combined.includes(phrase), false, `banned portfolio phrase found: ${phrase}`);
  }
});

test("case study animation is GSAP-driven, reversible, and reduced-motion safe", () => {
  assert.ok(motionSource.includes("useGSAP"));
  assert.ok(motionSource.includes("ScrollTrigger"));
  assert.ok(motionSource.includes('toggleActions: "play none none reverse"'));
  assert.ok(motionSource.includes("scrub: 0.8"));
  assert.ok(motionSource.includes("prefers-reduced-motion"));
  assert.ok(motionSource.includes("clearProps"));
  assert.ok(shellSource.includes('element.closest("[data-case-motion-root]")'));
});
