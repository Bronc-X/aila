import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const toolsSource = readFileSync(new URL("../app/tools/page.tsx", import.meta.url), "utf8");
const motionSource = readFileSync(new URL("../app/tools/_components/PortfolioCaseMotion.tsx", import.meta.url), "utf8");
const proposalSource = readFileSync(new URL("../app/tools/activity-plan/page.tsx", import.meta.url), "utf8");
const matrixSource = readFileSync(new URL("../app/tools/auto-red-book/page.tsx", import.meta.url), "utf8");
const shellSource = readFileSync(new URL("../app/components/LegacyPageMotionShell.tsx", import.meta.url), "utf8");
const operationsSource = readFileSync(new URL("../app/tools/operations/page.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const ailaSource = readFileSync(new URL("../app/aila/page.tsx", import.meta.url), "utf8");
const lusieSource = readFileSync(new URL("../app/lusie/page.tsx", import.meta.url), "utf8");
const lusieMotionSource = readFileSync(new URL("../app/lusie/LusieSurfaceMotion.tsx", import.meta.url), "utf8");
const lusieAiSource = readFileSync(new URL("../app/lusie/ai/LusieAiClient.tsx", import.meta.url), "utf8");
const lusieShowcaseSource = readFileSync(new URL("../app/lusie/showcase/LusieShowcaseClient.tsx", import.meta.url), "utf8");
const lusieShowcaseAppSource = readFileSync(new URL("../app/lusie/_shipmodel/lusie/LusieApp.tsx", import.meta.url), "utf8");
const authSource = readFileSync(new URL("../lib/auth.ts", import.meta.url), "utf8");

test("tools overview routes unfinished modules to internal portfolio case pages", () => {
  assert.ok(toolsSource.includes('href: "/tools/activity-plan"'));
  assert.ok(toolsSource.includes('href: "/tools/auto-red-book"'));
  assert.ok(toolsSource.includes('badge: "CASE STUDY"'));
  assert.equal(toolsSource.includes('href: "https://github.com/xiahui001/Activity-plan.git"'), false);
  assert.equal(toolsSource.includes('href: "https://github.com/xiahui001/auto-red-book.git"'), false);
});

test("portfolio case pages stay public while functional tool modules remain protected", () => {
  assert.ok(authSource.includes('"/tools/activity-plan"'));
  assert.ok(authSource.includes('"/tools/auto-red-book"'));
  assert.ok(authSource.includes("publicToolShowcasePaths.has(normalizedPathname)"));
  assert.ok(authSource.includes('normalizedPathname.startsWith("/tools")'));
  assert.ok(proposalSource.includes('href="/aila"'));
  assert.ok(matrixSource.includes('href="/aila"'));
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

test("site-wide positioning and sample-data language stay aligned with enterprise FDE", () => {
  assert.ok(layoutSource.includes("企业 FDE 交付与项目作品集"));
  assert.ok(layoutSource.includes("数据管道、知识资产、工作流到可运行系统"));
  assert.ok(ailaSource.includes("<dt>10</dt>"));
  assert.ok(ailaSource.includes("<dt>03</dt>"));
  assert.ok(ailaSource.includes("<dt>02</dt>"));
  assert.ok(ailaSource.includes("十大业务模块"));
  assert.ok(ailaSource.includes("两种合作方式"));
  assert.ok(ailaSource.includes("项目画面"));
  assert.equal(ailaSource.includes("AILA 已升级为 8 大工具模块"), false);
  assert.equal(ailaSource.includes("className={styles.lede}"), false);
  assert.ok(operationsSource.includes("明确用于演示的样例数据"));
  assert.ok(operationsSource.includes("不代表任何真实企业"));

  for (const phrase of ["顶尖的商业数据分析师", "极其逼真", "真实推演", "真实感行业公司名"]) {
    assert.equal(operationsSource.includes(phrase), false, `simulation-heavy phrase found: ${phrase}`);
  }
});

test("legacy GSAP shell leaves Framer-owned transforms alone and registers dynamic content", () => {
  assert.ok(shellSource.includes('element.matches("[data-legacy-motion-ignore]")'));
  assert.ok(shellSource.includes("opacity|transform"));
  assert.ok(shellSource.includes("registerRevealTargets"));
  assert.ok(shellSource.includes("registeredTargets"));
  assert.ok(shellSource.includes("MutationObserver"));
  assert.ok(shellSource.includes("window.requestAnimationFrame"));
});

test("legacy GSAP navigation cannot stall behind throttled animation frames", () => {
  assert.ok(shellSource.includes("const navigationTimerRef = useRef<number | null>(null)"));
  assert.ok(shellSource.includes("gsap.timeline({ onComplete: navigateOnce })"));
  assert.ok(shellSource.includes("window.clearTimeout(navigationTimerRef.current)"));
  assert.match(
    shellSource,
    /navigationTimerRef\.current = window\.setTimeout\(\(\) => \{[\s\S]*exitTimelineRef\.current\?\.kill\(\);[\s\S]*navigateOnce\(\);[\s\S]*\}, 700\);/
  );
});

test("legacy GSAP entrances settle on wall-clock fallbacks", () => {
  assert.ok(shellSource.includes("const motionTimers = new Set<number>()"));
  assert.ok(shellSource.includes("lowFrameMode = frameCount < 8"));
  assert.ok(shellSource.includes("entryTween.progress(1)"));
  assert.ok(shellSource.includes("onEnter: () => scheduleSettle(1)"));
  assert.ok(shellSource.includes("onLeaveBack: () => scheduleSettle(0)"));
  assert.ok(shellSource.includes("tween.progress(progress)"));
  assert.ok(shellSource.includes("lowFrameMode ? 0 : 900"));
  assert.ok(shellSource.includes("motionTimers.forEach((timer) => window.clearTimeout(timer))"));
});

test("Lusie copy reflects the integrated product and motion stays outside interactive internals", () => {
  assert.ok(lusieSource.includes("生成链路"));
  assert.ok(lusieSource.includes("项目记录"));
  assert.equal(lusieSource.includes("className={styles.lede}"), false);
  assert.equal(lusieSource.includes("下一步再把原 Vite 工作台迁成"), false);
  assert.equal(lusieSource.includes("后续会共用同一套 Supabase"), false);
  assert.equal(lusieSource.includes("迁入 Next API 后接入"), false);
  assert.ok(lusieSource.includes("LegacyPageMotionShell"));

  assert.ok(lusieMotionSource.includes("useGSAP"));
  assert.ok(lusieMotionSource.includes("prefers-reduced-motion"));
  assert.ok(lusieMotionSource.includes("autoAlpha"));
  assert.equal(lusieMotionSource.includes("ScrollTrigger"), false);
  assert.equal(lusieMotionSource.includes("querySelectorAll"), false);
  assert.ok(lusieAiSource.includes('LusieSurfaceMotion variant="workbench"'));
  assert.ok(lusieShowcaseSource.includes('LusieSurfaceMotion variant="showcase"'));
  assert.ok(lusieShowcaseAppSource.includes('const showcaseBasePath = "/lusie/showcase"'));
  assert.ok(lusieShowcaseAppSource.includes("browserPath.slice(showcaseBasePath.length)"));
  assert.ok(lusieShowcaseAppSource.includes("getShowcaseBrowserPath(to)"));
});
