"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize, Minimize, Home, ChevronLeft, ChevronRight, Presentation } from "lucide-react";
import React, { useState, useEffect, useCallback, ReactNode } from "react";

interface SlideProps {
  children: ReactNode;
  bg?: string;
}

/** 单张幻灯片容器 */
export function Slide({ children, bg }: SlideProps) {
  return (
    <div
      className="slide-container px-8 md:px-20"
      style={{ background: bg || "var(--gradient-subtle)" }}
    >
      {children}
    </div>
  );
}

/** 幻灯片引擎 - 管理翻页、全屏、键盘控制 */
export function SlideEngine({
  slides,
  title,
  subtitle,
}: {
  slides: ReactNode[];
  title: string;
  subtitle?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
      }
    },
    [current, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        prev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // 幻灯片切换动画
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* 幻灯片内容 */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* 底栏控制器 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-10 md:px-16 py-5 transition-opacity"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #E5E1D8",
        }}
      >
        {/* 左侧 */}
        <div className="flex items-center gap-3">
          <a href="/slides" className="text-[var(--text-muted)] hover:text-[#2D2A26] transition-colors">
            <Home size={16} />
          </a>
          <span className="text-xs text-[var(--text-muted)] hidden md:inline">
            {title} {subtitle && `· ${subtitle}`}
          </span>
        </div>

        {/* 中间 - 翻页 */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[#2D2A26] hover:bg-[var(--bg-card)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 进度指示器 */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-[var(--text-secondary)]">
              <span className="text-[#2D2A26] font-bold">{current + 1}</span>
              <span className="text-[var(--text-muted)]"> / {total}</span>
            </span>
            <div className="hidden md:flex gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-[var(--brand-primary)]"
                      : i < current
                      ? "w-2 bg-[var(--brand-primary)] opacity-40"
                      : "w-2 bg-[var(--border-default)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={next}
            disabled={current === total - 1}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[#2D2A26] hover:bg-[var(--bg-card)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[#2D2A26] hover:bg-[var(--bg-card)] transition-all"
            title="全屏 (F)"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      {/* 左右点击翻页热区 */}
      <div
        className="absolute left-0 top-0 w-1/5 h-[calc(100%-60px)] cursor-pointer z-10"
        onClick={prev}
      />
      <div
        className="absolute right-0 top-0 w-1/5 h-[calc(100%-60px)] cursor-pointer z-10"
        onClick={next}
      />
    </div>
  );
}
