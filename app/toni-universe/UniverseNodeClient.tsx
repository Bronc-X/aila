"use client";

import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef } from "react";
import { gsap } from "gsap";

import styles from "./toni-universe.module.css";
import { getUniverseNodeHref } from "./universe-data";
import type { UniverseLayer, UniverseNode, UniverseRelation, UniverseStatus } from "./universe-types";

gsap.registerPlugin(useGSAP);

type RelatedNode = {
  relation: UniverseRelation;
  node: UniverseNode;
};

type UniverseNodeClientProps = {
  node: UniverseNode;
  relatedNodes: RelatedNode[];
};

const layerLabels: Record<UniverseLayer, string> = {
  core: "核心业务",
  delivery: "FDE 交付阶段",
  capability: "交付能力",
  proof: "验证案例",
};

const statusLabels: Record<UniverseStatus, string> = {
  live: "运行中",
  delivered: "已交付",
  prototype: "实验中",
  archive: "归档",
};

const relationLabels = {
  flow: "进入下一交付阶段",
  enables: "支撑该节点",
  proves: "验证该能力",
  compounds: "沉淀并复用",
};

function usesModifiedNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function UniverseNodeClient({ node, relatedNodes }: UniverseNodeClientProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const navigationTweenRef = useRef<gsap.core.Timeline | null>(null);
  const navigatingRef = useRef(false);
  const router = useRouter();

  useGSAP(
    () => {
      const page = pageRef.current;
      if (!page) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-node-reveal]", page);
      const signalLine = page.querySelector<HTMLElement>("[data-node-signal]");

      if (reducedMotion) {
        gsap.set(revealItems, { opacity: 1, y: 0 });
        gsap.set(signalLine, { scaleX: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          page.querySelector(`.${styles.nodePageNav}`),
          { y: -18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.58 },
          0
        )
        .fromTo(signalLine, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.16)
        .fromTo(
          revealItems,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.72, stagger: 0.075 },
          0.18
        );
    },
    { scope: pageRef }
  );

  useEffect(
    () => () => {
      navigationTweenRef.current?.kill();
    },
    []
  );

  function navigateWithTransition(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (usesModifiedNavigation(event)) return;
    event.preventDefault();
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !pageRef.current || !veilRef.current) {
      router.push(href);
      return;
    }

    navigationTweenRef.current?.kill();
    navigationTweenRef.current = gsap
      .timeline({ onComplete: () => router.push(href) })
      .set(veilRef.current, { opacity: 0, pointerEvents: "auto" })
      .to(
        pageRef.current.querySelectorAll("[data-node-reveal]"),
        {
          y: -16,
          opacity: 0,
          duration: 0.34,
          stagger: 0.025,
          ease: "power2.in",
        },
        0
      )
      .to(veilRef.current, { opacity: 1, duration: 0.4, ease: "power2.inOut" }, 0.06);
  }

  return (
    <main className={`${styles.page} ${styles.nodePage}`} ref={pageRef}>
      <div className={styles.nodeAtmosphere} aria-hidden="true" />
      <div className={styles.nodeConstellation} aria-hidden="true" />

      <nav className={styles.nodePageNav} aria-label="节点档案导航">
        <Link href="/" onClick={(event) => navigateWithTransition(event, "/")}>
          <ArrowLeft size={15} />
          返回首页图谱
        </Link>
        <span>FDE NODE ARCHIVE / {node.id}</span>
      </nav>

      <article className={styles.nodeArchive}>
        <header className={styles.nodeArchiveHeader} data-node-reveal>
          <p>
            {layerLabels[node.layer]} / {statusLabels[node.status]}
          </p>
          <span style={{ backgroundColor: node.color, color: node.color }} aria-hidden="true" />
          <h1>{node.title}</h1>
          <small>{node.english}</small>
          <strong>{node.summary}</strong>
          <i className={styles.nodeSignalLine} data-node-signal aria-hidden="true" />
        </header>

        <div className={styles.nodeArchiveGrid} data-node-reveal>
          <section>
            <small>节点说明</small>
            <p>{node.detail}</p>
          </section>
          <section>
            <small>关于 / 联系</small>
            <p>发来业务现场，先判断哪里值得动。</p>
          </section>
        </div>

        <div className={styles.tags} data-node-reveal>
          {node.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.nodeArchiveActions} data-node-reveal>
          <Link href="/" onClick={(event) => navigateWithTransition(event, "/")}>
            返回首页图谱 <ArrowUpRight size={15} />
          </Link>
          {node.href ? (
            node.href.startsWith("http") ? (
              <a href={node.href} target="_blank" rel="noopener noreferrer">
                查看相关项目 <ArrowUpRight size={15} />
              </a>
            ) : (
              <Link href={node.href} onClick={(event) => navigateWithTransition(event, node.href!)}>
                查看相关项目 <ArrowUpRight size={15} />
              </Link>
            )
          ) : (
            <Link href="/contact" onClick={(event) => navigateWithTransition(event, "/contact")}>
              关于 / 联系 <ArrowUpRight size={15} />
            </Link>
          )}
        </div>

        <section className={styles.relatedNodes} data-node-reveal>
          <div>
            <small>CONNECTED NODES</small>
            <h2>与该节点直接相连的交付关系</h2>
          </div>
          <div className={styles.relatedNodeGrid}>
            {relatedNodes.map(({ relation, node: relatedNode }) => {
              const href = getUniverseNodeHref(relatedNode.id);
              return (
                <Link
                  key={`${relation.source}-${relation.target}`}
                  href={href}
                  onClick={(event) => navigateWithTransition(event, href)}
                >
                  <small>{relationLabels[relation.type]}</small>
                  <strong>{relatedNode.title}</strong>
                  <p>{relatedNode.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </article>

      <div ref={veilRef} className={styles.transitionVeil} aria-hidden="true" />
    </main>
  );
}
