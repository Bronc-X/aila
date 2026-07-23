import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import FdePageMotion from "../../aila/FdePageMotion";
import { commercialModels } from "../../aila/fde-content";
import styles from "../../aila/fde.module.css";

export const metadata: Metadata = {
  title: "合作模式 | 企业 FDE",
  description: "源码一次性交付与季度模块交付。",
};

export default function CommercialModelsPage() {
  return (
    <FdePageMotion>
      <main className={styles.page} data-case-motion-root>
        <nav className={styles.nav} aria-label="合作模式导航">
          <Link href="/" className={styles.brand}>
            Toni
          </Link>
          <div>
            <Link href="/toni-universe">返回图谱</Link>
            <Link href="/aila#commercial">FDE 总页</Link>
            <Link href="/contact">联系</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Link href="/toni-universe" className={styles.backLink}>
              <ArrowLeft size={15} />
              返回宇宙图谱
            </Link>
            <h1 data-fde-hero>合作模式</h1>
            <p data-fde-hero>源码一次性交付 / 季度模块交付</p>
          </div>
          <aside className={styles.heroPanel}>
            <strong>02</strong>
            <span>合作方式</span>
          </aside>
        </header>

        <section className={styles.section} data-fde-section>
          <div className={styles.commercialGrid}>
            {commercialModels.map((model) => (
              <article key={model.index} data-fde-item>
                <header>
                  <small>方案 {model.index}</small>
                  <h2>{model.title}</h2>
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

        <section className={styles.footer}>
          <span>FDE / COMMERCIAL</span>
          <h2>先把范围写清楚。</h2>
          <Link href="/contact">
            进入联系页 <ArrowUpRight size={15} />
          </Link>
        </section>
      </main>
    </FdePageMotion>
  );
}
