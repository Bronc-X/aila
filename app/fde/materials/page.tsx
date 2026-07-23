import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";

import styles from "./materials.module.css";

const campaignRoot = "/fde/campaign-v3";

const assetSpecs = [
  {
    id: "key-visual",
    title: "核心主视觉",
    format: "1080 × 1350",
    filename: "fde-key-visual-2026-07-17.png",
    width: 1080,
    height: 1350,
    layout: "portrait",
  },
  {
    id: "wechat-cover",
    title: "公众号封面",
    format: "900 × 383",
    filename: "fde-wechat-cover-2026-07-17.png",
    width: 900,
    height: 383,
    layout: "wide",
  },
  {
    id: "modules",
    title: "十大模块长图",
    format: "1080 × 3240",
    filename: "fde-ten-modules-2026-07-17.png",
    width: 1080,
    height: 3240,
    layout: "poster",
  },
  {
    id: "delivery",
    title: "交付与合作模式",
    format: "1080 × 2160",
    filename: "fde-delivery-commercial-2026-07-17.png",
    width: 1080,
    height: 2160,
    layout: "poster",
  },
  {
    id: "overview",
    title: "整套物料预览",
    format: "1120 × 1460",
    filename: "fde-preview-sheet-2026-07-17.jpg",
    width: 1120,
    height: 1460,
    layout: "sheet",
  },
] as const;

const editions = [
  {
    id: "graphite",
    label: "石墨版",
    english: "GRAPHITE",
    folder: "dark",
  },
  {
    id: "porcelain",
    label: "瓷白版",
    english: "PORCELAIN",
    folder: "light",
  },
] as const;

type Edition = (typeof editions)[number];
type AssetSpec = (typeof assetSpecs)[number];

export const metadata: Metadata = {
  title: "企业 FDE 宣传物料 | Toni",
  description: "企业 FDE 石墨版与瓷白版传播物料。",
};

function assetSource(edition: Edition, asset: AssetSpec) {
  return `${campaignRoot}/${edition.folder}/${asset.filename}`;
}

function AssetActions({ src, title }: { src: string; title: string }) {
  return (
    <div className={styles.assetActions}>
      <a href={src} target="_blank" rel="noopener noreferrer">
        打开原图
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
      <a href={src} download>
        下载
        <Download size={14} aria-hidden="true" />
        <span className={styles.srOnly}>{title}</span>
      </a>
    </div>
  );
}

function CampaignAsset({
  edition,
  asset,
  priority = false,
}: {
  edition: Edition;
  asset: AssetSpec;
  priority?: boolean;
}) {
  const src = assetSource(edition, asset);

  return (
    <figure
      className={`${styles.asset} ${styles[asset.layout]}`}
      id={`${edition.id}-${asset.id}`}
    >
      <figcaption>
        <div>
          <h3>{asset.title}</h3>
          <span>{asset.format}</span>
        </div>
        <AssetActions src={src} title={`${edition.label}${asset.title}`} />
      </figcaption>

      <a
        className={styles.assetVisual}
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`打开${edition.label}${asset.title}原图`}
      >
        <Image
          src={src}
          alt={`${edition.label}企业 FDE ${asset.title}`}
          width={asset.width}
          height={asset.height}
          sizes={
            asset.layout === "poster"
              ? "(max-width: 760px) 100vw, 42vw"
              : "(max-width: 900px) 100vw, 82vw"
          }
          priority={priority}
        />
      </a>
    </figure>
  );
}

export default function FdeMaterialsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.field} aria-hidden="true" />

      <header className={styles.nav}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          Toni
        </Link>
        <span>FDE MATERIALS</span>
        <Link href="/aila" className={styles.serviceLink}>
          企业 FDE
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <p>TONI / ENTERPRISE FDE</p>
          <h1>
            企业 FDE
            <span>传播物料</span>
          </h1>
          <strong>进现场，接数据，改流程，交付生产系统。</strong>

          <nav className={styles.editionNav} aria-label="物料版本">
            {editions.map((edition) => (
              <a key={edition.id} href={`#${edition.id}`}>
                <small>{edition.english}</small>
                <span>{edition.label}</span>
              </a>
            ))}
          </nav>
        </section>

        {editions.map((edition, editionIndex) => (
          <section className={styles.edition} id={edition.id} key={edition.id}>
            <header className={styles.editionHeader}>
              <small>{edition.english}</small>
              <h2>{edition.label}</h2>
              <nav aria-label={`${edition.label}物料索引`}>
                {assetSpecs.map((asset) => (
                  <a key={asset.id} href={`#${edition.id}-${asset.id}`}>
                    {asset.title}
                  </a>
                ))}
              </nav>
            </header>

            <div className={styles.assetGrid}>
              {assetSpecs.map((asset, assetIndex) => (
                <CampaignAsset
                  key={asset.id}
                  edition={edition}
                  asset={asset}
                  priority={editionIndex === 0 && assetIndex === 0}
                />
              ))}
            </div>
          </section>
        ))}

        <footer className={styles.footer}>
          <span>TONI / ENTERPRISE FDE</span>
          <Link href="/aila">
            服务与交付
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
