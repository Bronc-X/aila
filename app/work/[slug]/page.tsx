import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "../../site.module.css";
import LotusBrandPage from "../LotusBrandPage";
import type { CaseEvidence } from "../work-data";
import { getWorkItem, workItems } from "../work-data";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function evidenceLevelLabel(level: CaseEvidence["level"]) {
  if (level === "real_delivery") return "真实交付";
  if (level === "real_product") return "真实运行产品";
  if (level === "verified_prototype") return "真实运行原型";
  if (level === "reference_build") return "参考实现";
  return "待补证据";
}

function permissionLabel(permission: CaseEvidence["clientPermission"]) {
  if (permission === "confirmed") return "公开授权已确认";
  if (permission === "internal_only") return "对外匿名展示";
  return "公开授权待确认";
}

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
  if (item.slug === "lotus") return <LotusBrandPage />;

  const media = item.media ?? (item.image
    ? [{
        type: "image" as const,
        src: item.image,
        alt: item.title,
        caption: `${item.title} 项目画面`,
      }]
    : []);
  const primaryHref = item.nativeRoute ?? item.nextHref;
  const primaryLabel = item.nativeRoute ? "打开原生路由" : item.nextLabel;
  const isExternalPrimaryHref = !item.nativeRoute && item.nextHref
    ? item.nextHref.startsWith("http")
    : false;

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/tools">工具</Link>
          <Link href="/work">案例</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link href="/work" className={styles.backLink}>
            <ArrowLeft size={15} />
            返回案例
          </Link>
          <p className={styles.eyebrow}>{item.sub}</p>
          <h1>{item.title}</h1>
        </div>
        <aside className={styles.heroPanel}>
          <strong>{item.k}</strong>
          <span>{item.metrics.map((metric) => `${metric.label} ${metric.value}`).join(" / ")}</span>
        </aside>
      </section>

      {media.length > 0 && (
        <section className={`${styles.section} ${styles.workMediaSection}`}>
          <div className={styles.workMediaHeader}>
            <div>
              <small>PROJECT EVIDENCE</small>
              <h2>项目画面与运行证据</h2>
            </div>
          </div>
          <div
            className={[
              styles.workMediaGrid,
              media.length === 1 ? styles.workMediaSingle : "",
              media.length === 2 ? styles.workMediaPair : "",
              media.length === 3 ? styles.workMediaTriple : "",
            ].filter(Boolean).join(" ")}
          >
            {media.map((asset, index) => (
              <figure
                className={`${styles.workMediaItem} ${index === 0 ? styles.workMediaLead : ""}`}
                key={`${asset.type}-${asset.src}`}
              >
                <div className={styles.workMediaViewport} data-media-kind={asset.type}>
                  {asset.type === "video" ? (
                    <video
                      src={asset.src}
                      poster={asset.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      preload="metadata"
                      aria-label={asset.alt}
                    />
                  ) : (
                    <Image
                      src={asset.src}
                      alt={asset.alt}
                      fill
                      sizes={index === 0 ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 40vw"}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  )}
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{asset.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {item.evidenceStatus === "pending" && (
        <section className={styles.section}>
          <div className={styles.workEvidenceNotice}>
            <small>MEDIA STATUS</small>
            <h2>待补真实媒体</h2>
            <p>当前只保留项目位置与已确认范围；截图、录屏或可公开结果补齐后，再进入已完成案例。</p>
          </div>
        </section>
      )}

      {item.evidence && (
        <section className={styles.section}>
          <div className={styles.workEvidenceNotice}>
            <small>CASE EVIDENCE / {evidenceLevelLabel(item.evidence.level)}</small>
            <h2>{item.evidence.sourceProject}</h2>
            <p>{item.evidence.note}</p>
            <div className={styles.metricTags}>
              <span>
                <small>交付物</small>
                <strong>{item.evidence.deliverables.join(" / ") || "待补"}</strong>
              </span>
              <span>
                <small>公开边界</small>
                <strong>{permissionLabel(item.evidence.clientPermission)}</strong>
              </span>
              <span>
                <small>指标来源</small>
                <strong>{item.evidence.metricsSource.replaceAll("_", " ")}</strong>
              </span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.timelineGrid}>
          <article className={styles.timelineItem}>
            <small>Context</small>
            <h3>现场卡点</h3>
            <p>{item.context}</p>
          </article>
          <article className={styles.timelineItem}>
            <small>Metrics</small>
            <h3>可验证指标</h3>
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
            <strong>拆解路径</strong>
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
        <h2>有类似现场问题，先拿一个流程来拆。</h2>
        <div className={styles.actions}>
          {primaryHref && primaryLabel && (
            isExternalPrimaryHref ? (
              <a href={primaryHref} target="_blank" rel="noopener noreferrer" className={styles.button}>
                {primaryLabel}
              </a>
            ) : (
              <Link href={primaryHref} className={styles.button}>
                {primaryLabel}
              </Link>
            )
          )}
          <Link href="/contact" className={styles.ghost}>
            发我场景 <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
