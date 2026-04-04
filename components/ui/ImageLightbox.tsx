"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useCallback, useEffect } from "react";

interface PosterData {
  src: string;
  name: string;
  gradient?: string;
}

interface ImageLightboxProps {
  images: PosterData[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  overlayText?: string;
  productTitle?: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  overlayText,
  productTitle,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1)
        onNavigate(currentIndex + 1);
    },
    [currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* 图片计数 */}
        <div className="absolute top-6 left-6 z-10 text-white/70 font-mono text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* 上一张 */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* 下一张 */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* 主图 */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative max-w-[85vw] max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
            {current.src ? (
              /* 真实图片模式 */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={current.src}
                alt={current.name}
                className="w-[600px] max-w-[85vw] max-h-[70vh] object-contain"
              />
            ) : (
              /* CSS 渐变海报模式 */
              <div
                className="w-[600px] max-w-[85vw] h-[500px] max-h-[70vh] flex flex-col items-center justify-center p-12 relative"
                style={{ background: current.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <div className="text-white text-center">
                  <div className="text-6xl font-black mb-4 tracking-tight leading-tight">
                    {productTitle || "AI 智能海报"}
                  </div>
                  <div className="text-xl opacity-80 mb-6">
                    {current.name}
                  </div>
                  {overlayText && (
                    <div className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-lg font-semibold">
                      {overlayText}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 底部标签和操作 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-white/60 text-sm font-medium">{current.name}</span>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors backdrop-blur-sm">
              <Download size={14} /> 下载
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
