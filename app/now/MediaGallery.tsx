"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./toni-now.module.css";

type MediaGalleryProps = {
  title: string;
  images: string[];
  label?: string;
};

export default function MediaGallery({ title, images, label }: MediaGalleryProps) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : validImages[activeIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index === null ? index : (index - 1 + validImages.length) % validImages.length));
      if (event.key === "ArrowRight") setActiveIndex((index) => (index === null ? index : (index + 1) % validImages.length));
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, validImages.length]);

  if (!validImages.length) return null;

  const openAt = (index: number) => setActiveIndex(index);
  const showPrevious = () => setActiveIndex((index) => (index === null ? index : (index - 1 + validImages.length) % validImages.length));
  const showNext = () => setActiveIndex((index) => (index === null ? index : (index + 1) % validImages.length));

  const lightbox = activeImage ? (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`${title} 大图预览`}>
      <button className={styles.lightboxBackdrop} type="button" onClick={() => setActiveIndex(null)} aria-label="关闭预览" />
      <div className={styles.lightboxStage}>
        <div className={styles.lightboxMeta}>
          <small>{label ?? "Project image"}</small>
          <strong>{title}</strong>
        </div>
        <button className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/12 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:scale-105 hover:bg-white/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80" type="button" onClick={() => setActiveIndex(null)} aria-label="关闭预览">
          <X size={21} />
        </button>
        {validImages.length > 1 ? (
          <button className="absolute left-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80" type="button" onClick={showPrevious} aria-label="上一张">
            <ArrowLeft size={22} />
          </button>
        ) : null}
        <div className={styles.lightboxImage}>
          <Image src={activeImage} alt={`${title} large screenshot`} fill sizes="92vw" />
        </div>
        {validImages.length > 1 ? (
          <button className="absolute right-4 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/25 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80" type="button" onClick={showNext} aria-label="下一张">
            <ArrowRight size={22} />
          </button>
        ) : null}
        {validImages.length > 1 ? <div className={styles.lightboxCounter}>{(activeIndex ?? 0) + 1} / {validImages.length}</div> : null}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.gallery}>
        <button className={styles.mediaButton} type="button" onClick={() => openAt(0)} aria-label={`查看 ${title} 大图`}>
          <Image src={validImages[0]} alt={`${title} screenshot`} fill sizes="(max-width: 900px) 100vw, 33vw" />
          {validImages.length > 1 ? <span>{validImages.length} 张图</span> : null}
        </button>
        {validImages.length > 1 ? (
          <div className={styles.slideStrip} aria-label={`${title} screenshots`}>
            {validImages.map((image, index) => (
              <button className={styles.slideThumb} type="button" key={image} onClick={() => openAt(index)} aria-label={`查看 ${title} 第 ${index + 1} 张图`}>
                <Image src={image} alt="" fill sizes="92px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isMounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
