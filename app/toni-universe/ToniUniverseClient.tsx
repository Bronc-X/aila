"use client";

import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight, LocateFixed, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import FdeUniverseScene from "./FdeUniverseScene";
import styles from "./toni-universe.module.css";
import { getUniverseNodeDestination, getUniverseNodeHref, universe, universeNodeMap } from "./universe-data";
import type { UniverseLayer, UniverseNode } from "./universe-types";

gsap.registerPlugin(useGSAP);

type LayerFilter = "all" | Exclude<UniverseLayer, "core">;

type ToniUniverseClientProps = {
  homeMode?: boolean;
};

const layerOptions: Array<{ id: LayerFilter; label: string; english: string }> = [
  { id: "all", label: "全局", english: "ALL" },
  { id: "delivery", label: "交付链", english: "DELIVERY" },
  { id: "capability", label: "能力", english: "CAPABILITY" },
  { id: "proof", label: "交付证据", english: "PROOF" },
];

const layerLabels: Record<UniverseLayer, string> = {
  core: "核心业务",
  delivery: "FDE 交付链",
  capability: "支撑能力",
  proof: "交付证据",
};

const statusLabels = {
  live: "运行中",
  delivered: "已交付",
  prototype: "实验中",
  archive: "归档",
};

const deliveryStageCount = universe.nodes.filter((node) => node.layer === "delivery").length;
const capabilityCount = universe.nodes.filter((node) => node.layer === "capability").length;
const proofCount = universe.nodes.filter((node) => node.layer === "proof").length;

function nodeMatchesView(node: UniverseNode, layerFilter: LayerFilter, query: string) {
  if (node.layer === "core") return true;
  if (layerFilter !== "all" && node.layer !== layerFilter) return false;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [node.title, node.english, node.summary, node.detail, ...node.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

export default function ToniUniverseClient({ homeMode = false }: ToniUniverseClientProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const introPanelRef = useRef<HTMLElement | null>(null);
  const detailPanelRef = useRef<HTMLElement | null>(null);
  const transitionVeilRef = useRef<HTMLDivElement | null>(null);
  const navigationTweenRef = useRef<gsap.core.Timeline | null>(null);
  const personalSignalTweensRef = useRef(new Map<HTMLElement, gsap.core.Timeline>());
  const navigatingRef = useRef(false);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("fde");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);
  const [layerFilter, setLayerFilter] = useState<LayerFilter>("all");
  const [query, setQuery] = useState("");
  const [sceneError, setSceneError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedNode = universeNodeMap.get(selectedId) ?? universe.nodes[0];
  const selectedDestination = getUniverseNodeDestination(selectedNode.id);
  const hoveredNode = hoveredId ? universeNodeMap.get(hoveredId) : null;

  const visibleNodeIds = useMemo(
    () => universe.nodes.filter((node) => nodeMatchesView(node, layerFilter, query)).map((node) => node.id),
    [layerFilter, query]
  );

  const filteredNodes = useMemo(
    () => universe.nodes.filter((node) => visibleNodeIds.includes(node.id) && node.layer !== "core"),
    [visibleNodeIds]
  );

  useGSAP(
    () => {
      const introPanel = introPanelRef.current;
      if (!introPanel) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!detailsOpen) {
        gsap.set(introPanel, { xPercent: 0, opacity: 1, pointerEvents: "auto" });
        return;
      }

      gsap.to(introPanel, {
        xPercent: -118,
        opacity: 0,
        pointerEvents: "none",
        duration: reducedMotion ? 0 : 0.52,
        ease: "power3.inOut",
        overwrite: true,
      });

      const detailPanel = detailPanelRef.current;
      if (!detailPanel || reducedMotion) return;
      gsap.fromTo(
        detailPanel,
        { x: 34, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.56, ease: "power3.out", overwrite: true }
      );
    },
    { scope: pageRef, dependencies: [detailsOpen, selectedId] }
  );

  useGSAP(
    () => {
      const signals = gsap.utils.toArray<HTMLElement>("[data-personal-signal]", pageRef.current);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        gsap.set(signals, { autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        signals,
        { autoAlpha: 0, x: 14 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.52,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        }
      );
    },
    { scope: pageRef }
  );

  useEffect(
    () => () => {
      navigationTweenRef.current?.kill();
      personalSignalTweensRef.current.forEach((timeline) => timeline.kill());
      personalSignalTweensRef.current.clear();
    },
    []
  );

  function animatePersonalSignal(target: HTMLElement) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    personalSignalTweensRef.current.get(target)?.kill();
    const visual = target.querySelector<HTMLElement>("[data-personal-visual]");
    const arrow = target.querySelector<HTMLElement>("[data-personal-arrow]");
    if (!visual || !arrow) return;

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => personalSignalTweensRef.current.delete(target),
    });
    timeline
      .to(target, { x: -3, duration: 0.16, ease: "power3.out" }, 0)
      .to(visual, { scale: 1.06, rotation: -2, duration: 0.16, ease: "power2.out" }, 0)
      .to(arrow, { x: 2, y: -2, duration: 0.16, ease: "power2.out" }, 0)
      .to(visual, { x: 1.4, rotation: 1.6, duration: 0.05, ease: "none" }, 0.22)
      .to(visual, { x: -1.2, rotation: -1.2, duration: 0.05, ease: "none" }, 0.27)
      .to(visual, { x: 0.8, rotation: 0.8, duration: 0.045, ease: "none" }, 0.32)
      .to(visual, { x: 0, rotation: 0, scale: 1.03, duration: 0.1, ease: "power2.out" }, 0.365);

    personalSignalTweensRef.current.set(target, timeline);
  }

  function settlePersonalSignal(target: HTMLElement) {
    personalSignalTweensRef.current.get(target)?.kill();
    personalSignalTweensRef.current.delete(target);
    const visual = target.querySelector<HTMLElement>("[data-personal-visual]");
    const arrow = target.querySelector<HTMLElement>("[data-personal-arrow]");
    gsap.to(target, { x: 0, duration: 0.22, ease: "power2.out", clearProps: "transform" });
    if (visual) gsap.to(visual, { x: 0, rotation: 0, scale: 1, duration: 0.2, ease: "power2.out", clearProps: "transform" });
    if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.18, ease: "power2.out", clearProps: "transform" });
  }

  function returnSelectionToOverview() {
    setSelectedId("fde");
    setFocusNodeId(null);
    setFocusVersion((version) => version + 1);
    setDetailsOpen(false);
  }

  function updateLayerFilter(nextFilter: LayerFilter) {
    setLayerFilter(nextFilter);
    setHoveredId(null);
    if (!nodeMatchesView(selectedNode, nextFilter, query)) returnSelectionToOverview();
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setHoveredId(null);
    if (!nodeMatchesView(selectedNode, layerFilter, nextQuery)) returnSelectionToOverview();
  }

  function selectNode(nodeId: string) {
    if (selectedId === nodeId && focusNodeId === nodeId) {
      openNodeDestination(nodeId);
      return;
    }

    setSelectedId(nodeId);
    setFocusNodeId(nodeId);
    setFocusVersion((version) => version + 1);
    setDetailsOpen(true);
  }

  function openNodeDestination(nodeId: string) {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    const destination = getUniverseNodeDestination(nodeId);
    const navigate = () => {
      if (destination.startsWith("http")) {
        window.location.assign(destination);
        return;
      }
      router.push(destination);
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !stageRef.current || !transitionVeilRef.current) {
      navigate();
      return;
    }

    navigationTweenRef.current?.kill();
    navigationTweenRef.current = gsap
      .timeline({ onComplete: navigate })
      .set(transitionVeilRef.current, { opacity: 0, pointerEvents: "auto" })
      .to(
        stageRef.current,
        {
          scale: 1.018,
          opacity: 0.28,
          filter: "blur(8px)",
          duration: 0.46,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        transitionVeilRef.current,
        {
          opacity: 1,
          duration: 0.42,
          ease: "power2.inOut",
        },
        0.08
      );
  }

  function resetView() {
    returnSelectionToOverview();
    setLayerFilter("all");
    setQuery("");
    setHoveredId(null);
  }

  return (
    <main className={styles.page} ref={pageRef}>
      <nav className={styles.nav} aria-label="FDE Delivery Galaxy navigation">
        {homeMode ? (
          <Link href="/" className={styles.backLink} aria-current="page">
            Toni
          </Link>
        ) : (
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} />
            Toni
          </Link>
        )}
        <div className={styles.navTitle}>
          <span>TONI // FDE DELIVERY GALAXY</span>
          <small>欢迎来到 Toni 的主页</small>
        </div>
        <div className={styles.navLinks}>
          <Link href="/work">作品</Link>
          <Link href="/tools">工具</Link>
          <Link href="/work/training-system">陪跑</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <span className={styles.srOnly} aria-live="polite">
        已选择：{selectedNode.title}
      </span>

      <section className={styles.stage} ref={stageRef}>
        <section className={styles.sceneRegion} aria-label="Enterprise FDE cosmic relationship map">
          {sceneError ? (
            <div className={styles.sceneFallback} role="status">
              <p>当前设备无法加载三维宇宙。</p>
              <span>仍可通过页面下方的节点索引浏览全部内容。</span>
            </div>
          ) : (
            <FdeUniverseScene
              visibleNodeIds={visibleNodeIds}
              selectedId={selectedId}
              hoveredId={hoveredId}
              focusNodeId={focusNodeId}
              focusVersion={focusVersion}
              onSelect={selectNode}
              onHover={setHoveredId}
              onError={() => setSceneError(true)}
            />
          )}
        </section>

        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.scanField} aria-hidden="true" />

        <header
          className={styles.introPanel}
          ref={introPanelRef}
          aria-hidden={detailsOpen}
          inert={detailsOpen}
        >
          <p className={styles.eyebrow}>自己的作品 · 工具模块 · 陪跑方案 · 关于联系</p>
          <h1>Toni 的主页</h1>
          <p className={styles.introCopy}>发来业务现场，先判断哪里值得动。</p>

          <div className={styles.liveSignal} aria-live="polite">
            <i aria-hidden="true" />
            <span>{hoveredNode ? "聚焦节点" : "当前视图"}</span>
            <strong>{hoveredNode?.title ?? selectedNode.title}</strong>
          </div>

          <div className={styles.searchWrap}>
            <Search size={14} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="搜索能力、阶段或交付证据"
              aria-label="查找 FDE 宇宙节点"
            />
            {query ? (
              <button type="button" onClick={() => updateQuery("")} aria-label="清除搜索">
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className={styles.filters} role="group" aria-label="FDE galaxy layer filters">
            {layerOptions.map((option, index) => (
              <button
                key={option.id}
                type="button"
                className={layerFilter === option.id ? styles.filterActive : ""}
                onClick={() => updateLayerFilter(option.id)}
                aria-pressed={layerFilter === option.id}
                aria-label={`${option.label} ${option.english}`}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.graphStatus}>
            <span>
              <strong>{deliveryStageCount.toString().padStart(2, "0")}</strong>
              交付阶段
            </span>
            <span>
              <strong>{capabilityCount.toString().padStart(2, "0")}</strong>
              核心能力
            </span>
            <span>
              <strong>{proofCount.toString().padStart(2, "0")}</strong>
              验证案例
            </span>
          </div>
        </header>

        {detailsOpen ? (
          <aside className={styles.detailPanel} ref={detailPanelRef}>
            <button className={styles.closeDetail} type="button" onClick={() => setDetailsOpen(false)} aria-label="关闭节点详情">
              <X size={15} />
            </button>
            <div className={styles.detailIndex}>
              <span>{layerLabels[selectedNode.layer]}</span>
              <small>{statusLabels[selectedNode.status]}</small>
            </div>
            <p className={styles.detailEnglish}>{selectedNode.english}</p>
            <h2>{selectedNode.title}</h2>
            <p className={styles.detailSummary}>{selectedNode.summary}</p>

            <div className={styles.tags}>
              {selectedNode.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.detailActions}>
              {selectedDestination.startsWith("http") ? (
                <a className={styles.openLink} href={selectedDestination} target="_blank" rel="noopener noreferrer">
                  进入对应页面 <ArrowUpRight size={15} />
                </a>
              ) : (
                <Link className={styles.openLink} href={selectedDestination}>
                  进入对应页面 <ArrowUpRight size={15} />
                </Link>
              )}
              <Link className={styles.openLink} href={getUniverseNodeHref(selectedNode.id)}>
                查看星系说明 <ArrowUpRight size={15} />
              </Link>
            </div>
          </aside>
        ) : null}

        <div className={styles.sceneControls}>
          <button type="button" className={styles.resetButton} onClick={resetView}>
            <LocateFixed size={14} />
            <span>返回全局</span>
          </button>
          <p>拖动旋转 · 滚轮缩放 · 首次聚焦 · 再次进入</p>
        </div>

        <section className={styles.stageRail} aria-label="FDE delivery chain">
          <div className={styles.stageIntro}>
            <small>DELIVERY SPINE</small>
            <strong>问题诊断 → 生产运行 → 资产复用</strong>
          </div>
          <div className={styles.stageButtons}>
            {universe.paths[0].nodeIds.map((nodeId, index) => {
              const node = universeNodeMap.get(nodeId);
              if (!node) return null;

              return (
                <button
                  key={node.id}
                  type="button"
                  className={selectedId === node.id ? styles.stageActive : ""}
                  onClick={() => selectNode(node.id)}
                  aria-pressed={selectedId === node.id}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{node.title}</span>
                  <i aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>
      </section>

      <aside className={styles.personalOrbit} data-muted={detailsOpen} aria-label="Toni 的个人轨道">
        <div className={styles.personalOrbitHeader}>
          <small>PERSONAL ORBIT</small>
        </div>
        <div className={styles.personalSignalList}>
          <Link
            href="/pet/taiga"
            className={styles.personalSignal}
            aria-label="进入 Taiga 的房间"
            data-personal-signal
            onPointerEnter={(event) => animatePersonalSignal(event.currentTarget)}
            onPointerLeave={(event) => settlePersonalSignal(event.currentTarget)}
            onFocus={(event) => animatePersonalSignal(event.currentTarget)}
            onBlur={(event) => settlePersonalSignal(event.currentTarget)}
          >
            <span className={styles.taigaSignalVisual} data-personal-visual aria-hidden="true">
              <span className={styles.taigaOrbit} />
              <span className={styles.taigaSprite} />
            </span>
            <span className={styles.personalSignalCopy}>
              <small>TAIGA</small>
              <strong>Taiga</strong>
            </span>
            <ArrowUpRight className={styles.personalSignalArrow} data-personal-arrow size={14} aria-hidden="true" />
          </Link>

          <Link
            href="/lusie"
            className={styles.personalSignal}
            aria-label="进入航模项目"
            data-personal-signal
            onPointerEnter={(event) => animatePersonalSignal(event.currentTarget)}
            onPointerLeave={(event) => settlePersonalSignal(event.currentTarget)}
            onFocus={(event) => animatePersonalSignal(event.currentTarget)}
            onBlur={(event) => settlePersonalSignal(event.currentTarget)}
          >
            <span className={styles.lusieSignalVisual} data-personal-visual aria-hidden="true">
              <Image
                className={styles.aeromodelEmblem}
                src="/toni-universe/aeromodel-emblem-v2.png"
                alt=""
                width={48}
                height={48}
              />
            </span>
            <span className={styles.personalSignalCopy}>
              <small>LUSIE</small>
              <strong>航模项目</strong>
            </span>
            <ArrowUpRight className={styles.personalSignalArrow} data-personal-arrow size={14} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <section className={styles.mobileIndex} aria-label="FDE galaxy node list">
        <div className={styles.mobileIndexHeader}>
          <small>VISIBLE SYSTEMS</small>
          <strong>{filteredNodes.length} 个节点</strong>
        </div>
        <div className={styles.mobileIndexList}>
          {filteredNodes.length === 0 ? (
            <p className={styles.mobileEmpty}>没有匹配节点，请调整筛选或清除搜索。</p>
          ) : null}
          {filteredNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={selectedId === node.id ? styles.mobileNodeActive : ""}
              onClick={() => selectNode(node.id)}
              aria-pressed={selectedId === node.id}
            >
              <span style={{ backgroundColor: node.color }} aria-hidden="true" />
              <div>
                <small>{layerLabels[node.layer]}</small>
                <strong>{node.title}</strong>
                <p>{node.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div ref={transitionVeilRef} className={styles.transitionVeil} aria-hidden="true" />
    </main>
  );
}
