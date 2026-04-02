"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation,
  Wrench,
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  X,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface NavItem {
  label: string;
  sublabel: string;
  href: string;
  icon: React.ElementType;
  tag?: string;
}

const slideModules: NavItem[] = [
  { label: "D1 上午", sublabel: "认知破界 · 25 BLOCKS", href: "/slides/d1-morning", icon: Sun, tag: "FOMO激活" },
  { label: "D1 下午", sublabel: "案例震慑 · 8 BLOCKS", href: "/slides/d1-afternoon", icon: Moon, tag: "Live Coding" },
  { label: "D2 上午", sublabel: "大航海武器库 · 6 BLOCKS", href: "/slides/d2-morning", icon: Sun, tag: "全景工具" },
  { label: "D2 下午", sublabel: "闭门工作坊 · 5 BLOCKS", href: "/slides/d2-afternoon", icon: Moon, tag: "结营终局" },
];

const toolModules: NavItem[] = [
  { label: "获客中心", sublabel: "文案矩阵 · 海报 · 短视频", href: "/tools/acquisition", icon: Target },
  { label: "销售助手", sublabel: "实时分析 · 话术 · 回访", href: "/tools/sales", icon: MessageSquare },
  { label: "研发工坊", sublabel: "头脑风暴 · 原型验证", href: "/tools/research", icon: FlaskConical },
  { label: "运营驾驶舱", sublabel: "仪表盘 · AI 报告", href: "/tools/operations", icon: BarChart3 },
  { label: "行政效率站", sublabel: "合同 · 纪要 · 流程", href: "/tools/admin", icon: Building2 },
  { label: "客服智能体", sublabel: "RAG 知识库 · 舆情", href: "/tools/service", icon: Headphones },
];

export function PresenterHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  // 按 P 键切换面板（仅在非输入状态时）
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
    if (isInput) return;

    if (e.key === "p" || e.key === "P") {
      // 避免在幻灯片模式下冲突 — 只有非全屏时生效
      if (!document.fullscreenElement) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    }
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 实时时钟
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-[#FAF9F6]/98 backdrop-blur-3xl flex flex-col overflow-y-auto"
        >
          {/* 顶栏 */}
          <div className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#E5E1D8]">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 flex items-center justify-center font-black bg-[#D97706] text-white text-lg">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#2D2A26] tracking-normal">PRESENTER HUB</h1>
                <p className="text-xs text-[#6B6660] font-mono tracking-wide uppercase">AI Camp 2026 · Control Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-[#6B6660] font-mono text-2xl tracking-wide">
                <Clock size={18} />
                <span className="text-[#2D2A26] font-bold">{currentTime}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-[#E5E1D8] text-[#9E9B96] hover:text-[#2D2A26] hover:border-[#D97706] transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 主内容 */}
          <div className="flex-1 px-8 md:px-16 py-12 max-w-5xl mx-auto w-full">
            {/* 幻灯片导航 */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <Presentation size={20} className="text-[#6B6660]" />
                <h2 className="text-sm font-mono tracking-[0.3em] text-[#666] uppercase">Presentation Decks</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slideModules.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative text-left p-8 border border-[#E5E1D8] hover:border-[#D97706] transition-all duration-300"
                    style={{
                      opacity: hoveredItem && hoveredItem !== item.href ? 0.3 : 1,
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity" />
                    <div className="flex items-center justify-between mb-4">
                      <item.icon size={20} className="text-[#9E9B96] group-hover:text-[#2D2A26] transition-colors" />
                      {item.tag && (
                        <span className="text-[9px] font-mono tracking-wide text-[#6B6660] uppercase px-2 py-1 border border-[#E5E1D8]">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-[#2D2A26] mb-2 tracking-normal group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </h3>
                    <p className="text-xs text-[#6B6660] font-mono tracking-wider uppercase">
                      {item.sublabel}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 工具导航 */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Wrench size={20} className="text-[#6B6660]" />
                <h2 className="text-sm font-mono tracking-[0.3em] text-[#666] uppercase">Tool Modules</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolModules.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative text-left p-8 border border-[#E5E1D8] hover:border-[#D97706] transition-all duration-300"
                    style={{
                      opacity: hoveredItem && hoveredItem !== item.href ? 0.3 : 1,
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity" />
                    <div className="flex items-center gap-4 mb-4">
                      <item.icon size={24} className="text-[#9E9B96] group-hover:text-[#2D2A26] transition-colors" />
                      <h3 className="text-xl font-black text-[#2D2A26] tracking-normal group-hover:translate-x-1 transition-transform">
                        {item.label}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B6660] font-mono tracking-wider">
                      {item.sublabel}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 底部快捷键提示 */}
            <div className="mt-16 pt-8 border-t border-[#E5E1D8] flex items-center gap-8 text-[#9E9B96] font-mono text-xs tracking-wide uppercase">
              <span>
                <kbd className="px-2 py-1 border border-[#E5E1D8] text-[#6B6660] mr-2">P</kbd>
                打开/关闭
              </span>
              <span>
                <kbd className="px-2 py-1 border border-[#E5E1D8] text-[#6B6660] mr-2">ESC</kbd>
                关闭
              </span>
              <span className="ml-auto text-[#222]">
                PRESENTER HUB v1.0
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
