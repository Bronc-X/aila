"use client";

import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Maximize2,
  ShoppingBag,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "../site.module.css";
import { deliveryCases, productLabs } from "./work-data";

const archiveItems = [...deliveryCases, ...productLabs];

const archiveIcons: Record<string, LucideIcon> = {
  "survey-decision-system": ClipboardList,
  "ecommerce-product-radar": ShoppingBag,
  "commercial-poster-workshop": ImageIcon,
  aila: Boxes,
  antios: Activity,
  quantmax: TrendingUp,
  "training-system": GraduationCap,
};

export default function ArchiveCaseGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : archiveItems[activeIndex];

  useEffect(() => {
    if (!activeItem) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem]);

  const openArchive = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className={styles.companionCaseGrid}>
        {archiveItems.map((item, index) => {
          const Icon = archiveIcons[item.slug] ?? Boxes;

          return (
            <article className={styles.galleryCaseCard} key={item.slug}>
              <button
                type="button"
                className={styles.galleryMediaButton}
                onClick={() => openArchive(index)}
                aria-label={`查看 ${item.title} 档案`}
              >
                {item.image ? (
                  <>
                    <span className={styles.galleryMediaBackdrop} aria-hidden="true">
                      <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" />
                    </span>
                    <span className={styles.galleryMediaFrame}>
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 44vw" />
                    </span>
                  </>
                ) : (
                  <span className={styles.archiveCover}>
                    <small>{item.sub}</small>
                    <strong>{item.title}</strong>
                  </span>
                )}
                <span className={styles.galleryCount}>
                  档案 <Maximize2 size={14} />
                </span>
              </button>
              <div className={`${styles.galleryBody} ${styles.archiveGalleryBody}`}>
                <div className={styles.galleryTitleRow}>
                  <small>{item.k}</small>
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>
                  <strong>{item.sub}</strong>
                  <br />
                  {item.summary}
                </p>
                <div className={styles.caseScope}>
                  {item.metrics.map((metric) => (
                    <span key={metric.label}>{metric.value}</span>
                  ))}
                </div>
                <button type="button" className={styles.caseLink} onClick={() => openArchive(index)}>
                  查看详情 <Maximize2 size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {activeItem && (
        <div className={styles.caseModalBackdrop} role="dialog" aria-modal="true" aria-label={`${activeItem.title} 档案`}>
          <div className={`${styles.caseModal} ${styles.archiveModal}`}>
            <button type="button" className={styles.modalClose} onClick={() => setActiveIndex(null)} aria-label="关闭档案">
              <X size={20} />
            </button>
            <div className={styles.caseModalMedia}>
              {activeItem.image ? (
                <div className={styles.modalImageWrap}>
                  <Image src={activeItem.image} alt={activeItem.title} fill sizes="92vw" priority />
                </div>
              ) : (
                <div className={styles.archiveModalCover}>
                  <FileText size={26} />
                  <small>{activeItem.sub}</small>
                  <strong>{activeItem.title}</strong>
                </div>
              )}
            </div>
            <aside className={`${styles.caseModalContent} ${styles.archiveModalContent}`}>
              <small>
                {activeItem.k} / {activeItem.sub}
              </small>
              <h3>{activeItem.title}</h3>
              <p>
                <strong>{activeItem.summary}</strong>
                <br />
                {activeItem.context}
              </p>
              <div className={styles.archiveModalMetrics}>
                {activeItem.metrics.map((metric) => (
                  <span key={metric.label}>
                    <small>{metric.label}</small>
                    <strong>{metric.value}</strong>
                  </span>
                ))}
              </div>
              <div className={styles.archiveModalList}>
                <strong>怎么做</strong>
                {activeItem.approach.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>
              <div className={styles.archiveModalList}>
                <strong>结果</strong>
                {activeItem.outcome.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>
              {activeItem.nextHref && activeItem.nextLabel && (
                <a href={activeItem.nextHref} className={styles.archiveModalLink}>
                  {activeItem.nextLabel} <ArrowUpRight size={14} />
                </a>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
