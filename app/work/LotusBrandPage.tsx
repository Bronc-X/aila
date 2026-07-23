"use client";

import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight, GitBranch, Layers3, Route, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./lotus-brand.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Principle = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const principles: Principle[] = [
  {
    icon: Route,
    title: "先到现场",
    body: "不从漂亮的概念开始。先看真实流程、数据来源和谁在承担结果。",
  },
  {
    icon: ShieldCheck,
    title: "交付要能运行",
    body: "演示不是终点。系统要进入业务，能被使用、复核，也能被接管。",
  },
  {
    icon: Layers3,
    title: "做完要留下",
    body: "每一次交付都留下规则、连接器、评测和经验，成为下一次的起点。",
  },
];

const manifesto = [
  ["不追逐所有机会", "把精力交给主线"],
  ["不拿包装替代研发", "先让系统跑起来"],
  ["不把规则留在对话里", "写进项目、代码和验证"],
  ["不以用户量证明价值", "以真实使用留下证据"],
  ["不赚不合理的利润", "让合作能够长期继续"],
  ["不追求成为下一个超级 App", "把每个现场做成可靠系统"],
];

const spine = [
  ["01", "现场", "看见真实问题"],
  ["02", "数据", "接住来源与口径"],
  ["03", "流程", "改掉断点与重复"],
  ["04", "系统", "交付可运行结果"],
  ["05", "复用", "把经验带到下一次"],
];

export default function LotusBrandPage() {
  const pageRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-lotus-nav]", { autoAlpha: 0, y: -14, duration: 0.42 })
        .from("[data-lotus-hero-copy] > *", { autoAlpha: 0, y: 26, duration: 0.72, stagger: 0.08 }, "-=0.18")
        .from("[data-lotus-hero-mark]", { autoAlpha: 0, x: 34, scale: 0.96, duration: 0.86 }, "-=0.54");

      gsap.utils.toArray<HTMLElement>("[data-lotus-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.fromTo(
        "[data-lotus-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: "[data-lotus-line]",
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: pageRef }
  );

  return (
    <main className={styles.page} ref={pageRef}>
      <nav className={styles.nav} data-lotus-nav>
        <Link href="/work" className={styles.brand}>
          <span className={styles.brandMark}>T</span>
          <span>Toni</span>
        </Link>
        <span className={styles.navCenter}>LOTUS RUNTIME / BRAND NOTE</span>
        <div className={styles.navLinks}>
          <Link href="/toni-universe">宇宙图谱</Link>
          <a href="https://github.com/Bronc-X/Lotus" target="_blank" rel="noopener noreferrer">
            开源仓库 <ArrowUpRight size={13} />
          </a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy} data-lotus-hero-copy>
          <p className={styles.kicker}>TONI / LOTUS RUNTIME</p>
          <h1>
            <span>把真正重要的事，</span>
            <span>做深，做成，留下来。</span>
          </h1>
          <p className={styles.heroLead}>
            Toni 进现场，Lotus 把判断、规则、技能、验证和复用写进项目。
          </p>
          <div className={styles.heroActions}>
            <Link href="/work" className={styles.primaryAction}>
              <ArrowLeft size={15} />
              返回作品
            </Link>
            <a
              href="https://github.com/Bronc-X/Lotus"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryAction}
            >
              查看开源仓库 <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className={styles.heroVisual} data-lotus-hero-mark>
          <div className={styles.visualHeader}>
            <span>AGENT OPERATING LAYER</span>
            <span>TONI / 01</span>
          </div>
          <div className={styles.heroImage} style={{ position: "absolute", inset: "14% 6% 12%" }}>
            <Image
              src="/brand/toni-lotus/lotus-runtime-hero.png"
              alt="LOTUS Runtime 品牌主视觉"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className={styles.visualFooter}>
            <strong>规则 · 技能 · 验证 · 复用</strong>
            <span>SYNC KERNEL</span>
          </div>
        </div>
      </section>

      <section className={styles.section} data-lotus-reveal>
        <div className={styles.sectionLabel}>01 / BRAND EXPECTATION</div>
        <div className={styles.sectionHeading}>
          <h2>我们的期望，不是做更多。</h2>
          <p>是让每一次真实交付，都比上一次更接近生产。</p>
        </div>
        <div className={styles.principleGrid}>
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <article className={styles.principleCard} key={principle.title}>
                <Icon size={21} strokeWidth={1.6} />
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.manifesto} data-lotus-reveal>
        <div className={styles.manifestoInner}>
          <div className={styles.sectionLabel}>02 / MANIFESTO</div>
          <h2>先做减法，再把主线做深。</h2>
          <div className={styles.manifestoList}>
            {manifesto.map(([no, yes], index) => (
              <div className={styles.manifestoRow} key={no}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{no}</strong>
                <p>{yes}</p>
              </div>
            ))}
          </div>
          <p className={styles.manifestoQuote}>
            愿景不是挂在墙上的字。它会出现在我们如何取舍，如何交付，如何对待一个真实问题里。
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.spineSection}`} data-lotus-reveal>
        <div className={styles.sectionLabel}>03 / ONE LINE</div>
        <h2>Toni 负责进入现场。Lotus 负责让方法留下。</h2>
        <div className={styles.spineTrack} data-lotus-line>
          {spine.map(([number, title, body]) => (
            <div className={styles.spineStep} key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.assetSection}`} data-lotus-reveal>
        <div className={styles.assetCopy}>
          <div className={styles.sectionLabel}>04 / THE ASSET</div>
          <h2>把方法变成资产。</h2>
          <p>
            规则不再只存在于一次沟通里。它进入项目协议、技能路由、质量门禁和验证结果，能被下一次直接调用。
          </p>
          <div className={styles.assetList}>
            <span>
              <GitBranch size={15} /> 可读取
            </span>
            <span>
              <ShieldCheck size={15} /> 可验证
            </span>
            <span>
              <Layers3 size={15} /> 可复用
            </span>
          </div>
        </div>
        <div className={styles.assetGallery}>
          <figure>
            <div className={styles.assetImage} style={{ position: "relative" }}>
              <Image
                src="/brand/toni-lotus/lotus-runtime-visual-system-board.png"
                alt="LOTUS Runtime 视觉系统板"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
            <figcaption>视觉系统 / 状态契约</figcaption>
          </figure>
          <figure>
            <div className={styles.assetImage} style={{ position: "relative" }}>
              <Image
                src="/brand/toni-lotus/lotus-runtime-motion-master.png"
                alt="LOTUS Runtime 动态母版"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
            <figcaption>动态母版 / 运行状态</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.closing} data-lotus-reveal>
        <p className={styles.sectionLabel}>05 / THE PROMISE</p>
        <h2>一群平凡的人，把一件重要的事做成。</h2>
        <div className={styles.closingActions}>
          <Link href="/toni-universe" className={styles.primaryAction}>
            回到宇宙图谱 <ArrowUpRight size={15} />
          </Link>
          <Link href="/contact" className={styles.secondaryAction}>
            联系 Toni <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
