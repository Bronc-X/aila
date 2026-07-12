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
const nodePageSource = readFileSync(new URL("../app/toni-universe/[nodeId]/page.tsx", import.meta.url), "utf8");
const nodeClientSource = readFileSync(new URL("../app/toni-universe/UniverseNodeClient.tsx", import.meta.url), "utf8");
const universeDataSource = readFileSync(new URL("../app/toni-universe/universe-data.ts", import.meta.url), "utf8");
const legacyMotionSource = readFileSync(new URL("../app/components/LegacyPageMotionShell.tsx", import.meta.url), "utf8");
const legacyLayouts = ["tools", "work", "aila", "contact", "now"].map((segment) =>
  readFileSync(new URL(`../app/${segment}/layout.tsx`, import.meta.url), "utf8")
);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const deliveryStageIds = ["discover", "design", "build", "deploy", "operate", "compound"];
const nodeIds = new Set(universe.nodes.map((node) => node.id));

test("toni universe centers the enterprise FDE delivery system", () => {
  assert.equal(universe.meta.title, "FDE Delivery Galaxy");
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
    assert.ok(["core", "delivery", "capability", "proof"].includes(node.layer), `invalid layer: ${node.id}`);
    assert.ok(["live", "delivered", "prototype", "archive"].includes(node.status), `invalid status: ${node.id}`);
    assert.equal(node.position.length, 3, `invalid position: ${node.id}`);
    assert.ok(node.position.every(Number.isFinite), `non-numeric position: ${node.id}`);
    assert.ok(node.weight >= 1 && node.weight <= 5, `invalid weight: ${node.id}`);
    assert.ok(node.title && node.english && node.summary && node.detail, `missing content: ${node.id}`);
    assert.ok(node.tags.length >= 2, `missing content tags: ${node.id}`);
    assert.ok(
      typeof node.href === "string" && (node.href.startsWith("/") || node.href.startsWith("http")),
      `missing original-page destination: ${node.id}`
    );
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

  assert.equal(universe.relations.length, 27);
  assert.deepEqual(outgoing.get("fde"), [{ source: "fde", target: "discover", type: "enables" }]);

  for (const node of universe.nodes.filter((candidate) => candidate.layer === "capability")) {
    const relations = outgoing.get(node.id);
    assert.equal(relations.length, 1, `capability must have one delivery owner: ${node.id}`);
    assert.equal(relations[0].type, "enables");
    assert.ok(deliveryIds.has(relations[0].target));
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
  assert.ok(clientSource.includes("查看星系说明"));
  assert.ok(clientSource.includes("navigationTweenRef.current?.kill()"));
  assert.ok(clientSource.includes("欢迎来到"));
  assert.ok(clientSource.includes("Toni 的主页"));
  assert.ok(clientSource.includes("发来业务现场，先判断哪里值得动。"));
  assert.ok(clientSource.includes("再次进入"));
  assert.ok(universeDataSource.includes("/toni-universe/${encodeURIComponent(nodeId)}"));
  assert.ok(universeDataSource.includes("universeNodeMap.get(nodeId)?.href ?? getUniverseNodeHref(nodeId)"));
  assert.ok(nodePageSource.includes("generateStaticParams"));
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

  assert.ok(clientSource.includes("<h1>Toni 的主页</h1>"));
  assert.ok(clientSource.includes("自己的作品 · 工具模块 · 陪跑方案 · 关于联系"));
  assert.ok(clientSource.includes("发来业务现场，先判断哪里值得动。"));
  assert.doesNotMatch(clientSource, /<h1>[\s\S]*?欢迎来到[\s\S]*?<\/h1>/);
  assert.match(introPanelStyle, /width:\s*min\(332px, calc\(100vw - 36px\)\)/);
  assert.match(introHeadingStyle, /font-size:\s*clamp\(27px, 2\.45vw, 32px\)/);
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
  assert.ok(sceneSource.includes("* 0.22"));
  assert.ok(sceneSource.includes("* 0.18"));
  assert.equal(sceneSource.includes("const startRadius = radius * Math.pow"), false);
  assert.equal(sceneSource.includes("seeded(seed + 2) > 0.5"), false);
  assert.ok(sceneSource.includes("const bendScale ="));
  assert.ok(sceneSource.includes("const minimumBend ="));
  assert.ok(sceneSource.includes("const bendMagnitude ="));
  assert.ok(sceneSource.includes("flow: 0.85"));
});

test("galaxy destinations preserve original Axure-derived pages", () => {
  const destinations = new Map(universe.nodes.map((node) => [node.id, node.href]));

  assert.equal(destinations.get("fde"), "/aila#cooperation");
  assert.equal(destinations.get("discover"), "/tools/research");
  assert.equal(destinations.get("deploy"), "/tools/admin");
  assert.equal(destinations.get("operate"), "/tools/operations");
  assert.equal(destinations.get("adoption-operations"), "/work/training-system");
  assert.equal(destinations.get("aila-platform"), "/aila");
  assert.equal(destinations.get("lotus"), "https://github.com/Bronc-X/Lotus");
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
