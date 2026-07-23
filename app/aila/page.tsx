import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, RotateCcw } from "lucide-react";

import FdePageMotion from "./FdePageMotion";
import {
  businessBoundaries,
  continuousService,
  commercialModels,
  enterpriseFlywheel,
  evidenceAssets,
  fdeModules,
  acceptanceMetrics,
  operatingFoundation,
  reuseFlywheel,
} from "./fde-content";
import styles from "./fde.module.css";

export const metadata: Metadata = {
  title: "企业 FDE 服务与交付 | Toni",
  description: "十大企业 FDE 服务模块、三周交付节奏、两套合作模式，以及数据、Harness、评测和增长飞轮。",
  openGraph: {
    title: "企业 FDE 服务与交付 | Toni",
    description: "进现场，接数据，改流程，交付生产系统。",
    images: ["https://www.toni.asia/fde/fde-enterprise-operating-system-v1.png"],
  },
};

function Flywheel({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className={styles.flywheel} data-fde-item>
      <h3>{title}</h3>
      <ol>
        {items.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
            {index < items.length - 1 ? (
              <ArrowDown size={14} aria-hidden="true" />
            ) : (
              <RotateCcw size={14} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function AilaPage() {
  return (
    <FdePageMotion>
      <main className={styles.page} data-case-motion-root>
        <nav className={styles.nav} aria-label="企业 FDE 页面导航">
          <Link href="/" className={styles.brand}>
            Toni
          </Link>
          <div>
            <a href="#modules">十大模块</a>
            <a href="#delivery">交付节奏</a>
            <a href="#commercial">合作方式</a>
            <Link href="/contact">联系</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 data-fde-hero>企业 FDE</h1>
            <p data-fde-hero>诊断 → 业务流解析 → 报价组队 → 三周交付 → 迭代飞轮</p>
            <div className={styles.heroActions} data-fde-hero>
              <Link href="/contact">
                预约免费诊断 <ArrowUpRight size={16} />
              </Link>
              <a href="#modules">查看十大模块</a>
            </div>
            <dl className={styles.heroFacts} data-fde-hero>
              <div>
                <dt>10</dt>
                <dd>业务模块</dd>
              </div>
              <div>
                <dt>03</dt>
                <dd>交付周</dd>
              </div>
              <div>
                <dt>02</dt>
                <dd>合作方式</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.heroVisual} data-fde-hero>
            <Image
              src="/fde/fde-enterprise-operating-system-v1.png"
              alt="企业数据从多平台进入采入、清洗、解析、治理和复用流程的 FDE 主视觉"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <figcaption>
              <strong>采入 / 清洗 / 解析 / 复核 / 看板 / 复用</strong>
            </figcaption>
          </figure>
        </header>

        <section className={styles.section} id="modules" data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>十大业务模块</h2>
          </header>
          <div className={styles.moduleGrid}>
            {fdeModules.map((module) => (
              <article
                className={`${styles.moduleCard} ${module.featured ? styles.moduleFeatured : ""}`}
                key={module.id}
                data-fde-item
              >
                <div className={styles.moduleTopline}>
                  <small>{module.index}</small>
                  {module.method ? <code>{module.method}</code> : null}
                </div>
                <h3>{module.title}</h3>
                <p>{module.statement}</p>
                <ul>
                  {module.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.foundationSection}`} data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>统一交付底座</h2>
          </header>
          <div className={styles.foundationList}>
            {operatingFoundation.map(([code, title, line], index) => (
              <article key={code} data-fde-item>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <code>{code}</code>
                <h3>{title}</h3>
                <p>{line}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.deliverySection}`} id="delivery" data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>交付流程索引</h2>
          </header>
          <div className={styles.deliveryIndexGrid}>
            {[
              ["01", "免费诊断", "/toni-universe/diagnose"],
              ["02", "业务流解析", "/toni-universe/analyze"],
              ["03", "报价组队", "/toni-universe/quote"],
              ["04", "三周交付", "/toni-universe/transform"],
              ["05", "迭代飞轮", "/toni-universe/deliver"],
            ].map(([index, title, href]) => (
              <Link href={href} key={href} data-fde-item>
                <small>{index}</small>
                <strong>{title}</strong>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.acceptanceSection}`} id="acceptance" data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>非业务 KPI</h2>
          </header>
          <div className={styles.acceptanceGrid}>
            {acceptanceMetrics.map(([title, line], index) => (
              <article key={title} data-fde-item>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{title}</h3>
                <p>{line}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="commercial" data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>两种合作方式</h2>
          </header>
          <div className={styles.commercialGrid}>
            {commercialModels.map((model) => (
              <article key={model.index} data-fde-item>
                <header>
                  <small>方案 {model.index}</small>
                  <h3>{model.title}</h3>
                  <p>{model.fit}</p>
                </header>
                <ol>
                  {model.points.map((point, index) => (
                    <li key={point}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {point}
                    </li>
                  ))}
                </ol>
                <strong>{model.after}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.flywheelSection}`} data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>增长与复用</h2>
          </header>
          <div className={styles.flywheelGrid}>
            <Flywheel title="企业增长飞轮" items={enterpriseFlywheel} />
            <Flywheel title="FDE 中枢复用" items={reuseFlywheel} />
          </div>
        </section>

        <section className={`${styles.section} ${styles.continuousSection}`} data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>持续优化</h2>
          </header>
          <div className={styles.continuousGrid}>
            {continuousService.map(([title, line], index) => (
              <article key={title} data-fde-item>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{title}</h3>
                <p>{line}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>项目画面</h2>
          </header>
          <div className={styles.evidenceGrid}>
            {evidenceAssets.map((asset) => (
              <figure key={asset.src} data-fde-item>
                <div>
                  <Image src={asset.src} alt={asset.title} fill sizes="(max-width: 760px) 100vw, 50vw" />
                </div>
                <figcaption>
                  <strong>{asset.title}</strong>
                  <span>{asset.line}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.boundarySection}`} data-fde-section>
          <header className={styles.sectionHeading} data-fde-heading>
            <h2>商务边界</h2>
          </header>
          <div className={styles.boundaryList}>
            {businessBoundaries.map(([title, line], index) => (
              <article key={title} data-fde-item>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{title}</h3>
                <p>{line}</p>
              </article>
            ))}
          </div>
          <div className={styles.documentLinks} data-fde-item>
            <a href="/fde/downloads/fde-enterprise-service-guide-2026-07-15.pdf" download>
              下载对外方案 <ArrowUpRight size={16} />
            </a>
            <a href="/fde/downloads/fde-sales-deck-12p-2026-07-15.pptx" download>
              下载销售 Deck <ArrowUpRight size={16} />
            </a>
            <a href="/fde/downloads/fde-one-page-flyer-2026-07-15.pdf" download>
              下载一页式宣传单 <ArrowUpRight size={16} />
            </a>
            <Link href="/">
              返回 FDE 图谱 <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        <footer className={styles.footer} data-fde-section>
          <span data-fde-heading>企业 FDE</span>
          <h2 data-fde-item>提交一个真实业务现场。</h2>
          <Link href="/contact" data-fde-item>
            开始免费诊断 <ArrowUpRight size={18} />
          </Link>
        </footer>
      </main>
    </FdePageMotion>
  );
}
