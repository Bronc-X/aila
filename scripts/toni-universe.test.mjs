import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const universe = JSON.parse(readFileSync(new URL("../data/toni-universe.json", import.meta.url), "utf8"));
const homeSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const spatialPageSource = readFileSync(new URL("../app/spatial/page.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../app/toni-universe/page.tsx", import.meta.url), "utf8");
const clientSource = readFileSync(new URL("../app/toni-universe/ToniUniverseClient.tsx", import.meta.url), "utf8");
const sceneSource = readFileSync(new URL("../app/toni-universe/FdeUniverseScene.tsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../app/toni-universe/toni-universe.module.css", import.meta.url), "utf8");
const lotusRuntimeWordmarkSource = readFileSync(
  new URL("../public/brand/toni-lotus/lotus-runtime-wordmark-paper.svg", import.meta.url),
  "utf8"
);
const nodePageSource = readFileSync(new URL("../app/toni-universe/[nodeId]/page.tsx", import.meta.url), "utf8");
const nodeClientSource = readFileSync(new URL("../app/toni-universe/UniverseNodeClient.tsx", import.meta.url), "utf8");
const universeDataSource = readFileSync(new URL("../app/toni-universe/universe-data.ts", import.meta.url), "utf8");
const workDataSource = readFileSync(new URL("../app/work/work-data.ts", import.meta.url), "utf8");
const workDetailSource = readFileSync(new URL("../app/work/[slug]/page.tsx", import.meta.url), "utf8");
const workIndexSource = readFileSync(new URL("../app/work/page.tsx", import.meta.url), "utf8");
const fdeCaseLibrarySource = readFileSync(new URL("../public/work/fde-case-library.html", import.meta.url), "utf8");
const weldDemoSource = readFileSync(new URL("../app/work/weld-vision/demo/WeldVisionDemo.tsx", import.meta.url), "utf8");
const weldDemoStylesSource = readFileSync(new URL("../app/work/weld-vision/demo/demo.module.css", import.meta.url), "utf8");
const ailaSource = readFileSync(new URL("../app/aila/page.tsx", import.meta.url), "utf8");
const ailaContentSource = readFileSync(new URL("../app/aila/fde-content.ts", import.meta.url), "utf8");
const ailaMotionSource = readFileSync(new URL("../app/aila/FdePageMotion.tsx", import.meta.url), "utf8");
const fdeMaterialsSource = readFileSync(new URL("../app/fde/materials/page.tsx", import.meta.url), "utf8");
const fdeMaterialsStylesSource = readFileSync(new URL("../app/fde/materials/materials.module.css", import.meta.url), "utf8");
const legacyMotionSource = readFileSync(new URL("../app/components/LegacyPageMotionShell.tsx", import.meta.url), "utf8");
const legacyLayouts = ["tools", "work", "aila", "contact", "now"].map((segment) =>
  readFileSync(new URL(`../app/${segment}/layout.tsx`, import.meta.url), "utf8")
);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const deliveryStageIds = ["diagnose", "analyze", "quote", "transform", "deliver"];
const nodeIds = new Set(universe.nodes.map((node) => node.id));

function decodeEmbeddedCase(source, key) {
  const match = source.match(
    new RegExp(`<script type="application/octet-stream" id="case-${key}">([A-Za-z0-9+/=]+)</script>`)
  );
  assert.ok(match, `missing embedded FDE case: ${key}`);
  return Buffer.from(match[1], "base64").toString("utf8");
}

test("toni universe centers the enterprise FDE delivery system", () => {
  assert.equal(universe.meta.title, "Enterprise FDE Galaxy");
  assert.equal(universe.meta.coreBusiness, "Enterprise FDE");
  assert.equal(universe.nodes.filter((node) => node.layer === "core").length, 1);
  assert.equal(universe.nodes.find((node) => node.layer === "core")?.id, "fde");
  assert.deepEqual(
    universe.nodes.filter((node) => node.layer === "delivery").map((node) => node.id),
    deliveryStageIds
  );
  assert.ok(universe.nodes.length >= 24);
});

test("toni universe graph data has valid nodes, positions, and relations", () => {
  assert.equal(nodeIds.size, universe.nodes.length);
  const connectedNodeIds = new Set();
  const relationKeys = new Set();

  for (const node of universe.nodes) {
    assert.ok(["core", "delivery", "capability", "commercial", "proof"].includes(node.layer), `invalid layer: ${node.id}`);
    assert.ok(["live", "delivered", "prototype", "archive"].includes(node.status), `invalid status: ${node.id}`);
    assert.equal(node.position.length, 3, `invalid position: ${node.id}`);
    assert.ok(node.position.every(Number.isFinite), `non-numeric position: ${node.id}`);
    assert.ok(node.weight >= 1 && node.weight <= 5, `invalid weight: ${node.id}`);
    assert.ok(node.title && node.english && node.summary && node.detail, `missing content: ${node.id}`);
    assert.ok(node.tags.length >= 2, `missing content tags: ${node.id}`);
    if (node.href !== undefined) {
      assert.ok(
        typeof node.href === "string" && (node.href.startsWith("/") || node.href.startsWith("http")),
        `invalid outward destination: ${node.id}`
      );
    }
  }

  for (const relation of universe.relations) {
    assert.ok(nodeIds.has(relation.source), `missing relation source: ${relation.source}`);
    assert.ok(nodeIds.has(relation.target), `missing relation target: ${relation.target}`);
    assert.notEqual(relation.source, relation.target, `self relation: ${relation.source}`);
    assert.ok(["flow", "enables", "proves", "compounds"].includes(relation.type));

    const relationKey = `${[relation.source, relation.target].sort().join("<->")}:${relation.type}`;
    assert.equal(relationKeys.has(relationKey), false, `duplicate relation: ${relationKey}`);
    relationKeys.add(relationKey);
    connectedNodeIds.add(relation.source);
    connectedNodeIds.add(relation.target);
  }

  for (const node of universe.nodes) {
    assert.ok(connectedNodeIds.has(node.id), `unconnected node: ${node.id}`);
  }
});

test("toni universe relations follow one explainable FDE hierarchy", () => {
  const deliveryIds = new Set(universe.nodes.filter((node) => node.layer === "delivery").map((node) => node.id));
  const capabilityIds = new Set(universe.nodes.filter((node) => node.layer === "capability").map((node) => node.id));
  const outgoing = new Map(universe.nodes.map((node) => [node.id, []]));
  for (const relation of universe.relations) outgoing.get(relation.source).push(relation);

  assert.equal(universe.relations.length, 37);
  assert.deepEqual(
    outgoing.get("fde").map((relation) => relation.target),
    deliveryStageIds
  );
  assert.ok(outgoing.get("fde").every((relation) => relation.type === "enables"));
  assert.deepEqual(outgoing.get("diagnose"), [{ source: "diagnose", target: "analyze", type: "flow" }]);
  assert.deepEqual(outgoing.get("analyze"), [{ source: "analyze", target: "quote", type: "flow" }]);
  assert.deepEqual(outgoing.get("quote").filter((relation) => relation.type === "flow"), [
    { source: "quote", target: "transform", type: "flow" },
  ]);
  assert.deepEqual(outgoing.get("transform").filter((relation) => relation.type === "flow"), [
    { source: "transform", target: "deliver", type: "flow" },
  ]);
  assert.deepEqual(universe.paths[0].nodeIds, ["diagnose", "analyze", "quote", "transform", "deliver"]);

  for (const node of universe.nodes.filter((candidate) => candidate.layer === "capability")) {
    const relations = outgoing.get(node.id);
    assert.equal(relations.length, 1, `capability must have one delivery owner: ${node.id}`);
    assert.equal(relations[0].type, "enables");
    assert.ok(deliveryIds.has(relations[0].target));
  }

  for (const node of universe.nodes.filter((candidate) => candidate.layer === "commercial")) {
    assert.deepEqual(outgoing.get(node.id), [{ source: node.id, target: "quote", type: "enables" }]);
  }

  for (const node of universe.nodes.filter((candidate) => candidate.layer === "proof")) {
    const relations = outgoing.get(node.id);
    assert.equal(relations.length, 1, `proof must have one capability owner: ${node.id}`);
    assert.equal(relations[0].type, "proves");
    assert.ok(capabilityIds.has(relations[0].target));
  }
});

test("toni universe language avoids generic AI marketing tells", () => {
  const serialized = JSON.stringify(universe);
  const bannedPhrases = ["AI Powered", "智能赋能", "重塑未来", "无限可能", "颠覆式创新"];

  for (const phrase of bannedPhrases) {
    assert.equal(serialized.includes(phrase), false, `banned phrase found: ${phrase}`);
  }
});

test("toni universe is a cinematic Three.js and GSAP route with accessible fallbacks", () => {
  assert.ok(homeSource.includes("ToniUniverseClient homeMode"));
  assert.ok(spatialPageSource.includes("ToniSpatialHero"));
  assert.equal(pageSource.includes("redirect("), false);
  assert.ok(pageSource.includes("ToniUniverseClient"));
  assert.ok(clientSource.includes('"use client"'));
  assert.ok(sceneSource.includes('from "three"'));
  assert.ok(sceneSource.includes("OrbitControls"));
  assert.ok(sceneSource.includes("EffectComposer"));
  assert.ok(sceneSource.includes("UnrealBloomPass"));
  assert.ok(sceneSource.includes("AdditiveBlending"));
  assert.ok(sceneSource.includes("createNebulaTexture"));
  assert.ok(sceneSource.includes("createParticleCluster"));
  assert.ok(sceneSource.includes("createBundledRelationGeometry"));
  assert.ok(sceneSource.includes("spineMaterial"));
  assert.ok(sceneSource.includes("new THREE.Line("));
  assert.ok(sceneSource.includes("curve.getPoints("));
  assert.ok(sceneSource.includes("spine.frustumCulled = false"));
  assert.ok(sceneSource.includes("gsap.to(relationRuntime.spineMaterial"));
  assert.ok(sceneSource.includes("visualPositions"));
  assert.ok(sceneSource.includes("gsap"));
  assert.ok(sceneSource.includes("controls.enableZoom = false"));
  assert.ok(sceneSource.includes("const handleWheel"));
  assert.ok(sceneSource.includes('addEventListener("wheel", handleWheel, { passive: false })'));
  assert.ok(sceneSource.includes('removeEventListener("wheel", handleWheel)'));
  assert.ok(sceneSource.includes("wheelTween?.kill()"));
  assert.ok(sceneSource.includes("stagingPosition"));
  assert.ok(sceneSource.includes("focusNodeId ? 36 : 42"));
  assert.ok(sceneSource.includes('ease: "elastic.out(1, 0.58)"'));
  assert.ok(sceneSource.includes("prefers-reduced-motion"));
  assert.ok(sceneSource.includes("webglcontextlost"));
  assert.ok(sceneSource.includes('focusNodeId: string | null'));
  assert.ok(sceneSource.includes("toneMappingExposure = 0.74"));
  assert.equal(sceneSource.includes("#ff55de"), false);
  assert.equal(sceneSource.includes("#ff4fd8"), false);
  assert.ok(stylesSource.includes(":focus-visible"));
  assert.ok(stylesSource.includes("#02080b"));
  assert.equal(stylesSource.includes("#ff58d5"), false);
  assert.ok(stylesSource.includes("introPanel"));
  assert.ok(stylesSource.includes("stageRail"));
  assert.ok(clientSource.includes("getUniverseNodeDestination"));
  assert.ok(clientSource.includes("getUniverseNodeHref"));
  assert.ok(clientSource.includes("useRouter"));
  assert.ok(clientSource.includes("selectedId === nodeId && focusNodeId === nodeId"));
  assert.ok(clientSource.includes("router.push(destination)"));
  assert.ok(clientSource.includes("window.location.assign(destination)"));
  assert.ok(clientSource.includes("进入对应页面"));
  assert.ok(clientSource.includes("进入受邀工具"));
  assert.ok(clientSource.includes("邀请码访问"));
  assert.ok(clientSource.includes("该工具保留邀请制，验证后返回当前页面。"));
  assert.ok(clientSource.includes("requiresInviteAccess"));
  assert.ok(clientSource.includes("节点档案"));
  assert.ok(clientSource.includes("navigationTweenRef.current?.kill()"));
  assert.ok(clientSource.includes("企业 FDE 图谱"));
  assert.ok(clientSource.includes("业务板块"));
  assert.ok(clientSource.includes("商业模式"));
  assert.ok(clientSource.includes("关键词命中"));
  assert.ok(clientSource.includes(".split(/[\\s,，、/|]+/)"));
  assert.ok(sceneSource.includes("hasActiveVisibilityFilter"));
  assert.equal(clientSource.includes("再次进入"), false);
  assert.ok(universeDataSource.includes("/toni-universe/${encodeURIComponent(nodeId)}"));
  assert.ok(universeDataSource.includes('node.layer === "core"'));
  assert.ok(universeDataSource.includes('return "/aila";'));
  assert.ok(universeDataSource.includes("return getUniverseNodeHref(nodeId);"));
  assert.equal(universeDataSource.includes('return "/aila#delivery";'), false);
  assert.equal(universeDataSource.includes('return "/aila#modules";'), false);
  assert.equal(universeDataSource.includes('return "/aila#commercial";'), false);
  assert.equal(universeDataSource.includes("universeNodeMap.get(nodeId)?.href ?? getUniverseNodeHref(nodeId)"), false);
  assert.ok(nodePageSource.includes("generateStaticParams"));
  assert.ok(nodePageSource.includes('import { notFound, redirect } from "next/navigation"'));
  assert.ok(nodePageSource.includes("getUniverseNodeDestination"));
  assert.ok(nodePageSource.includes("getUniverseNodeHref"));
  assert.ok(nodePageSource.includes("if (destination !== canonicalHref) redirect(destination);"));
  assert.ok(nodePageSource.includes("relatedNodes"));
  assert.ok(nodePageSource.includes("UniverseNodeClient"));
  assert.ok(nodeClientSource.includes("useGSAP"));
  assert.ok(nodeClientSource.includes("navigateWithTransition"));
  assert.ok(nodeClientSource.includes("data-node-reveal"));
  assert.ok(nodeClientSource.includes("prefers-reduced-motion"));
  assert.ok(nodeClientSource.includes("navigationTweenRef.current?.kill()"));
  assert.ok(stylesSource.includes("transitionVeil"));
  assert.ok(stylesSource.includes("nodeSignalLine"));
  assert.ok(layoutSource.includes('data-scroll-behavior="smooth"'));
  assert.ok(stylesSource.includes("touch-action: pan-y"));
  assert.ok(stylesSource.includes("prefers-reduced-motion"));
  assert.ok(packageJson.dependencies.gsap);
  assert.ok(packageJson.dependencies["@gsap/react"]);
});

test("the FDE service page uses the approved operating model, real assets, and scoped GSAP motion", () => {
  for (const phrase of [
    "进现场，接数据，改流程，交付生产系统。",
    "十大业务模块",
    "统一交付底座",
    "交付流程索引",
    "非业务 KPI",
    "企业增长飞轮",
    "FDE 中枢复用",
    "持续优化",
    "项目画面",
    "商务边界",
  ]) {
    assert.ok(ailaSource.includes(phrase), `missing FDE page phrase: ${phrase}`);
  }

  for (const phrase of [
    "MCP + OCR + Agent",
    "BM25 + Rerank + Vector RAG",
    "先保证数据真实采入，再谈经营判断。",
    "3 至 5 次附带功能",
  ]) {
    assert.ok(ailaContentSource.includes(phrase), `missing FDE content: ${phrase}`);
  }

  for (const asset of [
    "/fde/fde-enterprise-operating-system-v1.png",
    "/cases/ecommerce_dashboard_1775101771068.png",
    "/cases/service_knowledge_1775101783025.png",
    "/cases/industry_manufacturing_1775101754129.png",
    "/cases/media_creator_1775101804245.png",
  ]) {
    assert.ok(ailaSource.includes(asset) || ailaContentSource.includes(asset), `missing FDE asset reference: ${asset}`);
    assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), `missing FDE asset file: ${asset}`);
  }

  assert.ok(ailaSource.includes("data-case-motion-root"));
  assert.ok(ailaMotionSource.includes("useGSAP"));
  assert.ok(ailaMotionSource.includes("ScrollTrigger"));
  assert.ok(ailaMotionSource.includes("prefers-reduced-motion"));
  assert.ok(ailaMotionSource.includes('toggleActions: "play none none reverse"'));
  assert.equal(ailaSource.includes("赋能企业未来"), false);
  assert.equal(ailaSource.includes("一站式 AI 解决方案"), false);
});

test("toni universe navigation cannot stall behind throttled animation frames", () => {
  assert.ok(clientSource.includes("const navigationTimerRef = useRef<number | null>(null)"));
  assert.ok(clientSource.includes(".timeline({ onComplete: navigateOnce })"));
  assert.ok(clientSource.includes("window.clearTimeout(navigationTimerRef.current)"));
  assert.match(
    clientSource,
    /navigationTimerRef\.current = window\.setTimeout\(\(\) => \{[\s\S]*navigationTweenRef\.current\?\.kill\(\);[\s\S]*navigateOnce\(\);[\s\S]*\}, 800\);/
  );
});

test("the formal FDE homepage preserves Toni's personal orbit entrances", () => {
  assert.ok(clientSource.includes('href="/pet/taiga"'));
  assert.ok(clientSource.includes("<strong>Taiga</strong>"));
  assert.ok(clientSource.includes('href="/lusie"'));
  assert.ok(clientSource.includes("航模项目"));
  assert.ok(clientSource.includes('aria-label="Toni 的个人轨道"'));
  assert.ok(clientSource.includes("animatePersonalSignal"));
  assert.ok(clientSource.includes("settlePersonalSignal"));
  assert.ok(clientSource.includes("data-personal-visual"));
  assert.ok(clientSource.includes("personalSignalTweensRef"));
  assert.equal(clientSource.includes("西伯利亚森林猫"), false);
  assert.equal(clientSource.includes("藏在站内的另一位助手"), false);
  assert.equal(clientSource.includes("把想象做成可打印模型"), false);
  assert.equal(clientSource.includes("className={styles.detailBody}"), false);
  assert.equal(clientSource.includes("再次点击当前星系，进入对应页面。"), false);
  assert.equal(clientSource.includes("查看星系说明"), false);
  assert.equal(nodeClientSource.includes("节点说明"), false);
  assert.equal(nodeClientSource.includes("与该节点直接相连的交付关系"), false);
  assert.ok(stylesSource.includes('background-image: url("/pet/taiga/spritesheet.webp")'));
  assert.match(stylesSource, /\.taigaSprite\s*\{[^}]*animation:\s*none;/s);
  assert.equal(stylesSource.includes("taigaSignalIdle"), false);
  assert.ok(clientSource.includes('src="/toni-universe/aeromodel-emblem-v2.png"'));
  assert.equal(clientSource.includes("<Plane"), false);
  assert.ok(existsSync(new URL("../public/toni-universe/aeromodel-emblem-v2.png", import.meta.url)));
  assert.ok(stylesSource.includes('.personalOrbit[data-muted="true"]'));
});

test("the homepage keeps the approved compact portfolio plate and stable personal emblems", () => {
  const introPanelStyle = stylesSource.match(/\.introPanel\s*\{(?<rules>[^}]*)\}/s)?.groups?.rules ?? "";
  const introHeadingStyle = stylesSource.match(/\.introPanel h1\s*\{(?<rules>[^}]*)\}/s)?.groups?.rules ?? "";
  const aeromodelAsset = readFileSync(new URL("../public/toni-universe/aeromodel-emblem-v2.png", import.meta.url));

  assert.ok(clientSource.includes("<h1>企业 FDE 图谱</h1>"));
  assert.equal(clientSource.includes("ENTERPRISE FDE"), false);
  assert.equal(clientSource.includes("欢迎来到 Toni 的主页"), false);
  assert.equal(clientSource.includes("发来业务现场，先判断哪里值得动。"), false);
  assert.match(introPanelStyle, /width:\s*min\(380px, calc\(100vw - 36px\)\)/);
  assert.match(introHeadingStyle, /font-size:\s*clamp\(40px, 3\.1vw, 48px\)/);
  assert.ok(stylesSource.includes("@media (min-width: 2400px) and (min-height: 1400px)"));
  assert.ok(clientSource.includes("每一次服务，都会为您的企业留下成果"));
  assert.equal(introPanelStyle.includes("clip-path"), false);
  assert.equal(stylesSource.includes("grid-template-columns: repeat(4, 1fr);"), false);
  assert.match(stylesSource, /\.taigaSprite\s*\{[^}]*animation:\s*none;/s);
  assert.equal(stylesSource.includes("taigaSignalIdle"), false);
  assert.equal(clientSource.includes("<Plane"), false);
  assert.deepEqual([...aeromodelAsset.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(aeromodelAsset.readUInt32BE(16), 640);
  assert.equal(aeromodelAsset.readUInt32BE(20), 640);
  assert.equal(aeromodelAsset[25], 6);
});

test("decorative galaxy fibers originate inside each galaxy core", () => {
  assert.ok(sceneSource.includes('const emitterRadius = node.layer === "core" ? 0.5 : 0.14'));
  assert.ok(sceneSource.includes("const startRadius = emitterRadius *"));
  assert.ok(sceneSource.includes("const segmentsPerFiber"));
  assert.ok(sceneSource.includes('node.layer === "core" ? 12'));
  assert.ok(sceneSource.includes('node.layer === "core" ? 0.26 : 0.12'));
  assert.ok(sceneSource.includes("const fiberPoints = curve.getPoints(segmentsPerFiber)"));
  assert.ok(sceneSource.includes("new THREE.QuadraticBezierCurve3(start, midpoint, end)"));
  assert.equal(sceneSource.includes("new Float32Array(fiberCount * 6)"), false);
  assert.equal(sceneSource.includes("const startRadius = radius * Math.pow"), false);
  assert.equal(sceneSource.includes("seeded(seed + 2) > 0.5"), false);
  assert.ok(sceneSource.includes("const bendScale ="));
  assert.ok(sceneSource.includes("const minimumBend ="));
  assert.ok(sceneSource.includes("const bendMagnitude ="));
  assert.ok(sceneSource.includes("flow: 0.85"));
});

test("enterprise FDE label and relationship spine stay visibly attached to the core", () => {
  assert.ok(
    sceneSource.includes(
      'label.position.set(0, node.layer === "core" ? 1.45 : cluster.radius * 1.28, node.layer === "core" ? 0.45 : 0)'
    )
  );
  assert.ok(sceneSource.includes("const relationAnchorRadius"));
  assert.ok(sceneSource.includes("core: 0.74"));
  assert.ok(sceneSource.includes("const anchorDirection = targetCenter.clone().sub(sourceCenter).normalize()"));
  assert.ok(sceneSource.includes("sourceCenter.clone().addScaledVector(anchorDirection, relationAnchorRadius[source.layer])"));
  assert.ok(sceneSource.includes("targetCenter.clone().addScaledVector(anchorDirection, -relationAnchorRadius[target.layer])"));
  assert.ok(sceneSource.includes('const isCoreRelation = relation.source === "fde" || relation.target === "fde"'));
  assert.ok(sceneSource.includes("const relationColor = isCoreRelation ? relationColors.flow : relationColors[relation.type]"));
  assert.ok(sceneSource.includes("spine.renderOrder = isCoreRelation ? 5"));
});

test("galaxy destinations keep one tools entrance, dedicated FDE node archives, and matching project introductions", () => {
  const destinations = new Map(universe.nodes.map((node) => [node.id, node.href]));
  const expectedDestinations = {
    transform: "/aila#delivery",
    "survey-decision-system": "/work/survey-decision-system",
    "ecommerce-product-radar": "/work/ecommerce-product-radar",
    "commercial-poster-workshop": "/work/commercial-poster-workshop",
    "aila-platform": "/tools",
    lusie: "/work/lusie",
    lotus: "/work/lotus",
    cosic: "/work/cosic",
    antios: "/work/antios",
    quantmax: "/work/quantmax",
    "dewu-image": "/work/dewu-image",
    "bid-agent": "/work/bid-agent",
    kemo: "/work/kemo",
    "weld-vision": "/work/weld-vision",
    "fde-case-cross-border": "/work/fde-case-library.html#crossborder",
    "fde-case-immigration": "/work/fde-case-library.html#immigration",
  };

  for (const [nodeId, href] of Object.entries(expectedDestinations)) {
    assert.equal(destinations.get(nodeId), href, `unexpected destination: ${nodeId}`);
  }

  for (const node of universe.nodes.filter((candidate) => !(candidate.id in expectedDestinations))) {
    assert.equal(node.href, undefined, `business node should use its dedicated node archive: ${node.id}`);
  }

  const toolEntrances = universe.nodes.filter((node) => node.href?.startsWith("/tools"));
  assert.deepEqual(toolEntrances.map(({ id, href }) => ({ id, href })), [{ id: "aila-platform", href: "/tools" }]);
  assert.equal(universe.nodes.some((node) => node.href?.startsWith("/tools/")), false);
  assert.equal(universeDataSource.includes("getUniverseNodeHref(nodeId);"), true);
  assert.equal(nodePageSource.includes("UniverseNodeClient"), true);
});

test("LOTUS Runtime is a visible vector identity in Toni's home universe", () => {
  const lotus = universe.nodes.find((node) => node.id === "lotus");

  assert.equal(lotus?.title, "LOTUS Runtime");
  assert.equal(lotus?.english, "AGENT OPERATING LAYER");
  assert.equal(lotus?.color, "#7BCA71");
  assert.ok(clientSource.includes('href="/work/lotus"'));
  assert.ok(clientSource.includes("lotus-runtime-wordmark-paper.svg"));
  assert.ok(clientSource.includes("LOTUS Runtime"));
  assert.ok(sceneSource.includes("lotusRuntimePalette"));
  assert.ok(sceneSource.includes('button.dataset.nodeId = node.id'));
  assert.ok(sceneSource.includes("nodeLabelLotusMark"));
  assert.ok(sceneSource.includes('node.id === "lotus"'));
  assert.ok(stylesSource.includes(".lotusSignalVisual"));
  assert.ok(stylesSource.includes('.nodeLabel[data-node-id="lotus"]'));
  assert.ok(stylesSource.includes('lotus-runtime-wordmark-paper.svg'));
  assert.match(
    stylesSource,
    /@media \(max-width: 560px\) \{[\s\S]*\.lotusPersonalSignal\s*\{[^}]*grid-template-columns:\s*84px minmax\(0, 1fr\) 12px;/s
  );
  assert.ok(existsSync(new URL("../public/brand/toni-lotus/lotus-runtime-wordmark-paper.svg", import.meta.url)));
  assert.match(lotusRuntimeWordmarkSource, /<svg\b/);
  assert.doesNotMatch(lotusRuntimeWordmarkSource, /<image\b|(?:fill|stop-color)=["']#000(?:000)?["']/i);
});

test("project destinations use local media-led introductions before product or repository exits", () => {
  for (const slug of ["lusie", "lotus", "cosic", "antianxiety", "bid-agent"]) {
    assert.ok(workDataSource.includes(`slug: "${slug}"`), `missing local project introduction: ${slug}`);
  }

  for (const asset of [
    "/antios.mp4",
    "/print-loading-animation/print-loading-loop.mp4",
    "/brand/toni-lotus/lotus-runtime-hero.png",
    "/now/cosic-01-home.png",
    "/now/antianxiety-01-dashboard.png",
    "/now/bid-data-management-desktop.png",
    "/projects/kemo/login.png",
    "/projects/expert-agent/diagnostic.png",
    "/projects/expert-agent/console.png",
    "/projects/expert-agent/mobile.png",
    "/projects/weld-vision/workstation-ng.png",
    "/projects/weld-vision/workstation-pass.png",
  ]) {
    assert.ok(workDataSource.includes(asset), `missing project media: ${asset}`);
    assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), `project media does not exist: ${asset}`);
  }

  for (const asset of [
    "/projects/fde-cases/crossborder-walkthrough.webm",
    "/projects/fde-cases/immigration-walkthrough.webm",
  ]) {
    assert.ok(fdeCaseLibrarySource.includes(asset), `missing FDE case walkthrough: ${asset}`);
    assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), `FDE case walkthrough does not exist: ${asset}`);
  }
  assert.ok(fdeCaseLibrarySource.includes('id="caseReelButton"'));
  assert.ok(fdeCaseLibrarySource.includes('id="caseReelVideo"'));

  assert.ok(workDataSource.includes('nextHref: "/work/weld-vision/demo"'));
  assert.ok(workDataSource.includes('slug: "expert-agent"'));
  assert.ok(workDataSource.includes('src: "/projects/expert-agent/diagnostic.png"'));
  assert.ok(workDataSource.includes('src: "/projects/expert-agent/console.png"'));
  assert.ok(workDataSource.includes('src: "/projects/expert-agent/mobile.png"'));
  assert.ok(weldDemoSource.includes("SAMPLE DATA"));
  assert.ok(weldDemoSource.includes("3D 采集"));
  assert.ok(weldDemoSource.includes("几何计量"));
  assert.ok(weldDemoSource.includes("规则判定"));
  assert.ok(weldDemoSource.includes("useGSAP"));
  assert.ok(weldDemoStylesSource.includes("prefers-reduced-motion"));
  assert.equal(universe.nodes.find((node) => node.id === "weld-vision")?.status, "prototype");

  assert.ok(workDetailSource.includes("项目画面与运行证据"));
  assert.ok(workDetailSource.includes('data-media-kind={asset.type}'));
  assert.ok(workDetailSource.includes("<video"));
  assert.ok(workDetailSource.includes('item.nextHref.startsWith("http")'));
  assert.ok(workIndexSource.includes('href="/work/cosic"'));
  assert.ok(workIndexSource.includes('href="/work/lotus"'));
  assert.ok(workIndexSource.includes('href="/work/lusie"'));
  assert.ok(workIndexSource.includes('href="/work/antianxiety"'));
  assert.ok(workIndexSource.includes('href="/work/bid-agent"'));
});

test("original subpages share the GSAP motion upgrade without restyling", () => {
  assert.ok(legacyMotionSource.includes("useGSAP"));
  assert.ok(legacyMotionSource.includes("ScrollTrigger"));
  assert.ok(legacyMotionSource.includes('toggleActions: "play none none reverse"'));
  assert.ok(legacyMotionSource.includes('clearProps: "opacity,visibility,transform"'));
  assert.ok(legacyMotionSource.includes("prefers-reduced-motion"));
  assert.ok(legacyMotionSource.includes("observer.disconnect()"));
  assert.ok(legacyMotionSource.includes("exitTimelineRef.current?.kill()"));

  for (const layoutSource of legacyLayouts) {
    assert.ok(layoutSource.includes("LegacyPageMotionShell"));
  }
});

test("homepage exposes both FDE campaign editions before the work entrance", () => {
  const materialsLinkIndex = clientSource.indexOf('<Link href="/fde/materials">宣传物料</Link>');
  const workLinkIndex = clientSource.indexOf('<Link href="/work">作品</Link>');
  const campaignFiles = [
    "fde-key-visual-2026-07-17.png",
    "fde-wechat-cover-2026-07-17.png",
    "fde-ten-modules-2026-07-17.png",
    "fde-delivery-commercial-2026-07-17.png",
    "fde-preview-sheet-2026-07-17.jpg",
  ];

  assert.ok(materialsLinkIndex >= 0);
  assert.ok(workLinkIndex >= 0);
  assert.ok(materialsLinkIndex < workLinkIndex);
  assert.ok(fdeMaterialsSource.includes('title: "企业 FDE 宣传物料 | Toni"'));
  assert.ok(fdeMaterialsSource.includes("进现场，接数据，改流程，交付生产系统。"));
  assert.ok(fdeMaterialsSource.includes('label: "石墨版"'));
  assert.ok(fdeMaterialsSource.includes('label: "瓷白版"'));
  assert.ok(fdeMaterialsSource.includes('folder: "dark"'));
  assert.ok(fdeMaterialsSource.includes('folder: "light"'));
  assert.ok(fdeMaterialsSource.includes('const campaignRoot = "/fde/campaign-v3"'));
  assert.equal(fdeMaterialsSource.includes("campaign-v2"), false);
  for (const folder of ["dark", "light"]) {
    for (const filename of campaignFiles) {
      assert.ok(existsSync(new URL(`../public/fde/campaign-v3/${folder}/${filename}`, import.meta.url)));
    }
  }
  assert.ok(fdeMaterialsSource.includes("download"));
  assert.ok(fdeMaterialsStylesSource.includes("grid-template-columns: minmax(190px, 0.22fr) minmax(0, 0.78fr)"));
  assert.ok(fdeMaterialsStylesSource.includes("@media (max-width: 760px)"));
  assert.ok(fdeMaterialsStylesSource.includes("@media (max-width: 560px)"));
  assert.ok(fdeMaterialsStylesSource.includes("prefers-reduced-motion"));
});

test("homepage exposes the immigration FDE field kit with all 30 source files", () => {
  const immigrationCaseSource = decodeEmbeddedCase(fdeCaseLibrarySource, "immigration");

  assert.ok(
    clientSource.includes(
      'href="/work/fde-case-library.html?case=immigration&section=31"'
    )
  );
  assert.equal(
    clientSource.includes('<Link href="/work/fde-case-library.html?case=immigration&section=31"'),
    false
  );
  assert.ok(clientSource.includes('aria-label="移民 FDE 进场资料包（30 件）"'));
  assert.ok(clientSource.includes("移民 FDE"));
  assert.ok(fdeCaseLibrarySource.includes('caseSectionTargets'));
  assert.ok(fdeCaseLibrarySource.includes('"31": "31-移民-fde-进场资料包-30-件"'));
  assert.ok(fdeCaseLibrarySource.includes('query.get("case")'));
  assert.ok(fdeCaseLibrarySource.includes('query.get("section")'));
  assert.ok(fdeCaseLibrarySource.includes('const caseAccessPassword = "2026"'));
  assert.ok(fdeCaseLibrarySource.includes("getCaseAccessStorageKey"));
  assert.ok(fdeCaseLibrarySource.includes("accessGate"));
  assert.ok(immigrationCaseSource.includes("31. 移民 FDE 进场资料包（30 件）"));
  assert.equal((immigrationCaseSource.match(/<details class="kit-entry"/g) ?? []).length, 30);
});
