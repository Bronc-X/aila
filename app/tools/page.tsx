"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  FileImage,
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  Presentation,
  LogOut,
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
    tools: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    href: "/tools/acquisition",
    gradient: "from-[#b9824b]/12 to-[#d7c2a2]/10",
  },
  {
    id: "sales",
    icon: MessageSquare,
    title: "销售助手",
    subtitle: "SALES",
    tools: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    href: "/tools/sales",
    gradient: "from-[#5e8f91]/12 to-[#b6d0c9]/10",
  },
  {
    id: "research",
    icon: FlaskConical,
    title: "验证工坊",
    subtitle: "RESEARCH",
    tools: ["多角色评审", "原型验证", "市场线索", "资产盘点"],
    href: "/tools/research",
    gradient: "from-[#7a7890]/12 to-[#c7c5d4]/10",
  },
  {
    id: "operations",
    icon: BarChart3,
    title: "老板仪表盘",
    subtitle: "DASHBOARD",
    tools: ["经营看板", "经营报告", "回访追踪", "成交分析"],
    href: "/tools/operations",
    gradient: "from-[#708e79]/12 to-[#c3d2c1]/10",
  },
  {
    id: "admin",
    icon: Building2,
    title: "行政效率",
    subtitle: "ADMIN",
    tools: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    href: "/tools/admin",
    gradient: "from-[#64869b]/12 to-[#c5d5dc]/10",
  },
  {
    id: "service",
    icon: Headphones,
    title: "智能客服",
    subtitle: "SERVICE",
    tools: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    href: "/tools/service",
    gradient: "from-[#9a7267]/12 to-[#dbc0b8]/10",
  },
  {
    id: "activity-plan",
    icon: ClipboardList,
    title: "海报方案助手",
    subtitle: "PROPOSAL",
    tools: ["活动方案", "宣传文案", "海报提示词", "PPTX 导出"],
    href: "/tools/activity-plan",
    gradient: "from-[#ae8555]/12 to-[#e2cfac]/10",
    badge: "CASE STUDY",
  },
  {
    id: "auto-red-book",
    icon: FileImage,
    title: "小红书自动二创",
    subtitle: "XHS MATRIX",
    tools: ["矩阵草稿", "热点参考", "质量检查", "客服线索"],
    href: "/tools/auto-red-book",
    gradient: "from-[#8f6e72]/12 to-[#dbc1c2]/10",
    badge: "CASE STUDY",
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
  const isExternal = mod.href.startsWith("http");
  const badge = "badge" in mod ? mod.badge : isExternal ? "GitHub" : null;

  const card = (
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
          ? "border-[#22d665] shadow-[0_8px_40px_-8px_rgba(34, 214, 101,0.25)]"
          : "border-[#E5E1D8] hover:shadow-lg"
      }`}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} pointer-events-none`}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {isActive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d665] to-transparent"
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
              isActive ? "text-[#22d665]" : "text-[#9E9B96]"
            } transition-colors duration-300`}
          />
        </motion.div>
        <div className="flex flex-col items-end gap-2">
          <motion.span
            className={`text-[10px] font-mono tracking-[0.2em] font-bold transition-colors duration-300 ${
              isActive ? "text-[#22d665]" : "text-[#9E9B96]"
            }`}
            animate={{ y: isActive ? -2 : 0 }}
          >
            {mod.subtitle}
          </motion.span>
          {badge && (
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#D97706]">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <motion.h3
          className="text-2xl font-black tracking-normal text-[#2D2A26] mb-3"
          animate={{ x: isActive ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {mod.title}
        </motion.h3>
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#E5E1D8] group-hover:border-[#22d665]/30 transition-colors">
          {mod.tools.map((tool, ti) => (
            <motion.span
              key={tool}
              className={`text-[10px] uppercase tracking-wide px-2.5 py-1 font-semibold rounded-full border transition-all duration-200 ${
                isActive
                  ? "bg-[#22d665] text-white border-[#22d665]"
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
  );

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
      {isExternal ? (
        <a href={mod.href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {card}
        </a>
      ) : (
        <Link href={mod.href} className="block h-full">
          {card}
        </Link>
      )}
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
            <div className="w-10 h-10 flex items-center justify-center font-black bg-[#22d665] text-white text-sm rounded-xl">
              A
            </div>
            <span className="font-bold tracking-wide text-[#9E9B96] uppercase text-xs">
              AILA · System Index
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
              <Presentation size={14} /> 宣讲会
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
          className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8 border-b-2 border-[#22d665] pb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22d665]/40 bg-[#22d665]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#2D2A26] mb-5">
              <span className="text-[#b9824b] text-lg leading-none">08</span>
              System Modules
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal leading-tight mb-4">
              AILA
              <br />
              <span className="text-[#6B6660]">系统.</span>
            </h1>
          </div>
          <p className="max-w-xs text-right text-sm leading-7 text-[#6B6660]">
            获客、销售、验证、经营、行政、客服与案例展示。
          </p>
        </motion.div>

        {/* 3D 交互卡片网格 */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
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
