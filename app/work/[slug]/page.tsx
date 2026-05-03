import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "../../site.module.css";
import { getWorkItem, workItems } from "../work-data";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};

  return {
    title: `${item.title} | Toni Work`,
    description: item.summary,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const item = getWorkItem(slug);

  if (!item) notFound();

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
          <Link href="/work" className={styles.backLink}>
            <ArrowLeft size={15} />
            返回作品
          </Link>
          <p className={styles.eyebrow}>{item.sub}</p>
          <h1>{item.title}</h1>
          <p className={styles.lede}>{item.summary}</p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>{item.k}</strong>
          <span>{item.metrics.map((metric) => `${metric.label} ${metric.value}`).join(" / ")}</span>
        </aside>
      </section>

      {item.image && (
        <section className={styles.section}>
          <div className={styles.videoFrame}>
            <Image src={item.image} alt={item.title} fill sizes="100vw" />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.timelineGrid}>
          <article className={styles.timelineItem}>
            <small>Context</small>
            <h3>背景</h3>
            <p>{item.context}</p>
          </article>
          <article className={styles.timelineItem}>
            <small>Metrics</small>
            <h3>指标</h3>
            <div className={styles.metricTags}>
              {item.metrics.map((metric) => (
                <span key={metric.label}>
                  <small>{metric.label}</small>
                  <strong>{metric.value}</strong>
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.playbook}>
          <aside className={styles.playbookIndex}>
            <strong>怎么做</strong>
            <ul className={styles.playbookList}>
              {item.approach.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
          <div className={styles.mapList}>
            {item.outcome.map((point, index) => (
              <div key={point}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>继续往下看，进入对应工具或联系我聊现场。</h2>
        <div className={styles.actions}>
          {item.nextHref && item.nextLabel && (
            <Link href={item.nextHref} className={styles.button}>
              {item.nextLabel}
            </Link>
          )}
          <Link href="/contact" className={styles.ghost}>
            联系 Toni <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
