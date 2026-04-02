"use client";

import { motion } from "framer-motion";
import {
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  ArrowRight,
  Presentation,
  LogOut,
  Search,
  Sparkles,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const modules = [
  {
    id: "acquisition",
    icon: Target,
    title: "获客中心",
    subtitle: "MARKETING",
    desc: "批量AI海报生成 · 短视频制作 · 全平台文案矩阵 · 素材智能编辑",
    tools: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    href: "/tools/acquisition",
  },
  {
    id: "sales",
    icon: MessageSquare,
    title: "销售助手",
    subtitle: "SALES",
    desc: "实时对话分析 · 销售话术提示 · 智能回访策略 · 灵感追问引导",
    tools: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    href: "/tools/sales",
  },
  {
    id: "research",
    icon: FlaskConical,
    title: "研发工坊",
    subtitle: "RESEARCH",
    desc: "AI头脑风暴 · 快速原型验证 · 市场趋势研判 · 数字资产盘点",
    tools: ["头脑风暴", "快速原型", "市场研判", "资产盘点"],
    href: "/tools/research",
  },
  {
    id: "operations",
    icon: BarChart3,
    title: "运营驾驶舱",
    subtitle: "OPERATIONS",
    desc: "智能仪表盘 · AI日报周报 · 回访进度追踪 · 成交数据分析",
    tools: ["智能仪表盘", "AI报告", "回访追踪", "成交分析"],
    href: "/tools/operations",
  },
  {
    id: "admin",
    icon: Building2,
    title: "行政效率站",
    subtitle: "ADMIN",
    desc: "合同文档助手 · 会议纪要 · 排班优化 · 流程自动化诊断",
    tools: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    href: "/tools/admin",
  },
  {
    id: "service",
    icon: Headphones,
    title: "客服智能体",
    subtitle: "SERVICE",
    desc: "智能客服配置 · 智能回访话术 · 舆情公关助手 · 客户之声分析",
    tools: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    href: "/tools/service",
  },
];

export default function ToolsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-24">
      {/* 极简顶栏 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-8">
            <div className="w-10 h-10 flex items-center justify-center font-black bg-[#D97706] text-white text-sm rounded-xl">
              A
            </div>
            <span className="font-bold tracking-wide text-[#9E9B96] uppercase text-xs">AI Camp · Control Center</span>
          </Link>

          <div className="flex items-center gap-8 text-[#6B6660] text-sm font-mono tracking-wide uppercase">
            <Link href="/" className="hover:text-[#2D2A26] transition-colors flex items-center gap-2">
              <Home size={14} /> Home
            </Link>
            <Link href="/slides" className="hover:text-[#2D2A26] transition-colors flex items-center gap-2">
              <Presentation size={14} /> Deck
            </Link>
            <button className="hover:text-red-500 transition-colors flex items-center gap-2">
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 pt-28">
        {/* 控制台欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-28 flex flex-col md:flex-row items-end justify-between gap-12 border-b-2 border-[#D97706] pb-16"
        >
          <div>
            <h1 className="text-6xl md:text-8xl font-black text-[#2D2A26] tracking-normal leading-tight mb-8 uppercase">
              Super<br /><span className="text-[#6B6660]">Center.</span>
            </h1>
            <p className="text-xl text-[#9E9B96] tracking-normal max-w-2xl font-medium">
              极简企业级控制中枢。全链路能力引擎在此汇聚。
            </p>
          </div>

          <div className="w-full md:w-80 relative group">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9E9B96] group-focus-within:text-[#2D2A26] transition-colors" />
            <input
              type="text"
              placeholder="GLOBAL SEARCH"
              className="w-full bg-transparent border-0 border-b-2 border-[#E5E1D8] group-focus-within:border-[#D97706] transition-colors pl-8 pb-3 text-lg text-[#2D2A26] placeholder-[#9E9B96] focus:ring-0 focus:outline-none font-mono tracking-wide uppercase"
            />
          </div>
        </motion.div>

        {/* 电影级聚焦特效风格网格 */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {modules.map((mod) => {
            const isDimmed = hoveredId !== null && hoveredId !== mod.id;
            return (
              <motion.div
                key={mod.id}
                variants={item}
                onMouseEnter={() => setHoveredId(mod.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={mod.href} className="block h-full">
                   <div 
                      className="p-10 h-full border border-[#E5E1D8] bg-white transition-all duration-300 relative group flex flex-col hover:border-[#D97706] rounded-2xl hover:shadow-lg"
                      style={{
                        opacity: isDimmed ? 0.3 : 1,
                      }}
                   >
                      <div className="flex justify-between items-start mb-14">
                         <mod.icon size={36} className={`${hoveredId === mod.id ? "text-[#D97706] scale-110" : "text-[#9E9B96]"} transition-all duration-300`} />
                         <span className="text-xs font-mono tracking-[0.2em] font-bold text-[#9E9B96] group-hover:text-[#D97706] transition-colors">{mod.subtitle}</span>
                      </div>
                      
                      <div className="mt-auto">
                        <h3 className="text-3xl font-black tracking-normal text-[#2D2A26] mb-5 group-hover:translate-x-2 transition-transform duration-300">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-[#9E9B96] leading-loose mb-10">
                          {mod.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-[#E5E1D8] group-hover:border-[#D97706] transition-colors">
                          {mod.tools.map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] uppercase tracking-wide px-3 py-1.5 font-semibold rounded-full border border-[#E5E1D8] text-[#9E9B96] group-hover:bg-[#D97706] group-hover:text-white group-hover:border-[#D97706] transition-all duration-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                   </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
