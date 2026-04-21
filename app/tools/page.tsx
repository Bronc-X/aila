"use client";

import { motion } from "framer-motion";
import {
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  Presentation,
  LogOut,
  Search,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";

import { postJson } from "@/lib/api-client";

const modules = [
  {
    id: "acquisition",
    icon: Target,
    title: "获客中心",
    subtitle: "MARKETING",
    desc: "批量AI海报生成 · 短视频制作 · 全平台文案矩阵 · 素材智能编辑",
    tools: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    href: "/tools/acquisition",
    gradient: "from-amber-500/10 to-orange-500/5",
  },
  {
    id: "sales",
    icon: MessageSquare,
    title: "销售助手",
    subtitle: "SALES",
    desc: "实时对话分析 · 销售话术提示 · 智能回访策略 · 灵感追问引导",
    tools: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    href: "/tools/sales",
    gradient: "from-blue-500/10 to-indigo-500/5",
  },
  {
    id: "research",
    icon: FlaskConical,
    title: "研发工坊",
    subtitle: "RESEARCH",
    desc: "AI头脑风暴 · 快速原型验证 · 市场趋势研判 · 数字资产盘点",
    tools: ["头脑风暴", "快速原型", "市场研判", "资产盘点"],
    href: "/tools/research",
    gradient: "from-purple-500/10 to-violet-500/5",
  },
  {
    id: "operations",
    icon: BarChart3,
    title: "老板仪表盘",
    subtitle: "DASHBOARD",
    desc: "智能仪表盘 · AI日报周报 · 回访进度追踪 · 成交数据分析",
    tools: ["智能仪表盘", "AI报告", "回访追踪", "成交分析"],
    href: "/tools/operations",
    gradient: "from-emerald-500/10 to-green-500/5",
  },
  {
    id: "admin",
    icon: Building2,
    title: "行政效率",
    subtitle: "ADMIN",
    desc: "合同文档助手 · 会议纪要 · 排班优化 · 流程自动化诊断",
    tools: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    href: "/tools/admin",
    gradient: "from-sky-500/10 to-cyan-500/5",
  },
  {
    id: "service",
    icon: Headphones,
    title: "智能客服",
    subtitle: "SERVICE",
    desc: "智能客服配置 · 智能回访话术 · 舆情公关助手 · 客户之声分析",
    tools: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    href: "/tools/service",
    gradient: "from-rose-500/10 to-pink-500/5",
  },
];

// 3D 倾斜计算
function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 6,
      rotateY: (x - 0.5) * 6,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return { ref, tilt, handleMouseMove, handleMouseLeave };
}

function ToolCard({
  mod,
  index,
  hoveredId,
  setHoveredId,
}: {
  mod: (typeof modules)[0];
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useCardTilt();
  const isDimmed = hoveredId !== null && hoveredId !== mod.id;
  const isActive = hoveredId === mod.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: 60 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        delay: index * 0.12,
        type: "spring",
        stiffness: 80,
        damping: 15,
      }}
      onMouseEnter={() => setHoveredId(mod.id)}
      onMouseLeave={() => {
        setHoveredId(null);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: 800 }}
    >
      <Link href={mod.href} className="block h-full">
        <motion.div
          ref={ref}
          animate={{
            scale: isDimmed ? 0.96 : isActive ? 1.02 : 1,
            y: isActive ? -6 : 0,
            filter: isDimmed ? "blur(1.5px)" : "blur(0px)",
            opacity: isDimmed ? 0.35 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
            transformStyle: "preserve-3d",
          }}
          className={`p-8 h-full border bg-white transition-shadow duration-300 relative group flex flex-col rounded-2xl overflow-hidden ${
            isActive
              ? "border-[#D97706] shadow-[0_8px_40px_-8px_rgba(217,119,6,0.25)]"
              : "border-[#E5E1D8] hover:shadow-lg"
          }`}
        >
          {/* 背景渐变光效 */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} pointer-events-none`}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* 顶部光线效果 */}
          {isActive && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D97706] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <div className="flex justify-between items-start mb-10 relative z-10">
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
                rotate: isActive ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <mod.icon
                size={32}
                className={`${
                  isActive ? "text-[#D97706]" : "text-[#9E9B96]"
                } transition-colors duration-300`}
              />
            </motion.div>
            <motion.span
              className={`text-[10px] font-mono tracking-[0.2em] font-bold transition-colors duration-300 ${
                isActive ? "text-[#D97706]" : "text-[#9E9B96]"
              }`}
              animate={{ y: isActive ? -2 : 0 }}
            >
              {mod.subtitle}
            </motion.span>
          </div>

          <div className="mt-auto relative z-10">
            <motion.h3
              className="text-2xl font-black tracking-normal text-[#2D2A26] mb-3"
              animate={{ x: isActive ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {mod.title}
            </motion.h3>
            <p className="text-xs text-[#9E9B96] leading-relaxed mb-8">
              {mod.desc}
            </p>

            {/* 底部标签 — hover 时逐个亮起 */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#E5E1D8] group-hover:border-[#D97706]/30 transition-colors">
              {mod.tools.map((tool, ti) => (
                <motion.span
                  key={tool}
                  className={`text-[10px] uppercase tracking-wide px-2.5 py-1 font-semibold rounded-full border transition-all duration-200 ${
                    isActive
                      ? "bg-[#D97706] text-white border-[#D97706]"
                      : "border-[#E5E1D8] text-[#9E9B96]"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 1,
                    opacity: isActive ? 1 : 0.7,
                  }}
                  transition={{
                    delay: isActive ? ti * 0.06 : 0,
                    duration: 0.2,
                  }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ToolsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await postJson("/api/auth/logout", {});
    } finally {
      router.push("/");
      router.refresh();
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-24">
      {/* 极简顶栏 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center font-black bg-[#D97706] text-white text-sm rounded-xl">
              A
            </div>
            <span className="font-bold tracking-wide text-[#9E9B96] uppercase text-xs">
              AI Camp · Control Center
            </span>
          </Link>

          <div className="flex items-center gap-6 text-[#6B6660] text-sm font-mono tracking-wide uppercase">
            <Link
              href="/"
              className="hover:text-[#2D2A26] transition-colors flex items-center gap-2"
            >
              <Home size={14} /> Home
            </Link>
            <Link
              href="/slides"
              className="hover:text-[#2D2A26] transition-colors flex items-center gap-2"
            >
              <Presentation size={14} /> Deck
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 pt-20">
        {/* 控制台欢迎 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8 border-b-2 border-[#D97706] pb-12"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal leading-tight mb-4 uppercase">
              Super
              <br />
              <span className="text-[#6B6660]">Center.</span>
            </h1>
            <p className="text-lg text-[#9E9B96] tracking-normal max-w-2xl font-medium">
              极简企业级控制中枢。全链路能力引擎在此汇聚。
            </p>
          </div>

          <div className="w-full md:w-80 relative group">
            <Search
              size={18}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9E9B96] group-focus-within:text-[#2D2A26] transition-colors"
            />
            <input
              type="text"
              placeholder="GLOBAL SEARCH"
              className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] group-focus-within:border-[#D97706] transition-colors pl-8 pb-3 text-lg text-[#2D2A26] placeholder-[#9E9B96] focus:ring-0 focus:outline-none font-mono tracking-wide uppercase"
            />
          </div>
        </motion.div>

        {/* 3D 交互卡片网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, i) => (
            <ToolCard
              key={mod.id}
              mod={mod}
              index={i}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
