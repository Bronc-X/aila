import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import styles from "../site.module.css";
import { deliveryCases, productLabs } from "./work-data";

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/tools">工具</Link>
          <Link href="/about">关于</Link>
          <Link href="/contact">联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Sparkles size={16} /> Selected systems and delivery cases</p>
          <h1>作品页收进真实案例、产品实验和课程系统。</h1>
          <p className={styles.lede}>
            这里不再散放旧入口。企业交付看结果，产品实验看方向，课程系统看方法如何被带进现场。
          </p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>{deliveryCases.length + productLabs.length}</strong>
          <span>个可下钻档案：问卷统计、爆品筛查、海报工坊、AILA、Antios、QuantMAx、训练系统。</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>企业交付案例：看周期、成本和可用产出。</h2>
          <p>每张卡片都可以进入详情，继续看背景、做法、结果和下一步入口。</p>
        </div>
        <div className={styles.caseGrid}>
          {deliveryCases.map((item) => (
            <article className={styles.caseCard} key={item.slug}>
              {item.image && (
                <div className={styles.mediaFrame}>
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 44vw" />
                </div>
              )}
              <div>
                <small>{item.k}</small>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className={styles.metricTags}>
                  {item.metrics.map((metric) => (
                    <span key={metric.label}>
                      <small>{metric.label}</small>
                      <strong>{metric.value}</strong>
                    </span>
                  ))}
                </div>
                <Link href={`/work/${item.slug}`} className={styles.caseLink}>
                  查看详情 <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>产品实验和课程系统，统一放进作品档案。</h2>
        <p>AILA、Antios、QuantMAx 和训练系统不再分散成多个主入口。它们保留各自方向，也有各自的详情页和下一步动作。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {productLabs.map((item) => (
            <article className={styles.card} key={item.slug}>
              <small>{item.sub}</small>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link href={`/work/${item.slug}`} className={styles.resourceLink}>
                打开档案 <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>要体验企业工具矩阵，进入 AILA 或工具大厅。</h2>
        <div className={styles.actions}>
          <Link href="/aila" className={styles.button}>看 AILA</Link>
          <Link href="/tools" className={styles.ghost}>进入工具 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
