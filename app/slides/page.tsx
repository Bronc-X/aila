"use client";

import { motion } from "framer-motion";
import { Presentation, ArrowRight, Play, CheckCircle2, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sessions = [
  {
    day: "LIVE",
    date: "线上版",
    title: "1小时线上讲演：看懂AI如何为你的企业省下百万级成本",
    blocks: [
      {
        id: "webinar",
        time: "60min",
        title: "企业主专场 · 转化型 Webinar",
        desc: "区隔市场乱象、三大行业深化案例、企业AI改造路线图 — 打痛点、建信任、推转化。",
        slides: 22,
        ready: true,
      },
    ],
  },
  {
    day: "DAY 1",
    date: "2026.04.18",
    title: "破局：利润下滑不是终点，是换引擎的信号",
    blocks: [
      {
        id: "d1-morning",
        time: "09:00",
        title: "看清残局：您的利润正在被谁吞掉？",
        desc: "AI 能力边界全景扫描、同行用 AI 降本增效的残酷数据对比、中小企业引入 AI 的三大致命深坑。",
        slides: 27,
        ready: true,
      },
      {
        id: "d1-afternoon",
        time: "13:30",
        title: "对号入座：您的行业，AI 正在颠覆哪个环节？",
        desc: "五大行业真实利润翻倍案例拆解、现场企业痛点诊断、45 分钟从零搭建全自动获客→成交流水线。",
        slides: 8,
        ready: true,
      },
    ],
  },
  {
    day: "DAY 2",
    date: "2026.04.19",
    title: "上手：不再观望，今天就让 AI 替您干活",
    blocks: [
      {
        id: "d2-morning",
        time: "09:00",
        title: "工具实训：零基础也能即学即用的杀手级武器",
        desc: "最适合中小企业的 12 个杀手级 AI 应用、Dify/Coze 智能获客系统搭建、10 秒 AI 报表实操。",
        slides: 6,
        ready: true,
      },
      {
        id: "d2-afternoon",
        time: "13:30",
        title: "定制交付：带走属于您企业的 AI 作战地图",
        desc: "企业 AI 改造蓝图工作坊、ROI 人力成本精算、1v1 专家诊断定制落地时间表。",
        slides: 5,
        ready: true,
      },
    ],
  },
];

export default function SlidesIndexPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stagger = {
    animate: { transition: { staggerChildren: 0.15 } }
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-hidden font-sans pb-32">
      {/* 极简顶栏 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-6 flex items-center justify-between">
          <Link href="/tools" className="flex items-center gap-8 group">
            <div className="w-10 h-10 flex items-center justify-center font-black bg-[#22d665] text-white text-sm group-hover:scale-95 transition-transform rounded-xl">
              A
            </div>
            <span className="font-bold tracking-wide text-[#9E9B96] uppercase text-xs">AI Camp · Decks</span>
          </Link>
          <div className="flex items-center gap-12 text-xs text-[#9E9B96] font-mono tracking-wide uppercase">
            <Link href="/" className="hover:text-[#2D2A26] transition-colors flex items-center gap-1.5">
              <Home size={12} /> Home
            </Link>
            <span className="text-[#E5E1D8]">|</span>
            [Space] To Navigate
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 pt-28">
        {/* 顶部标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-28">
          <div className="font-mono text-[#9E9B96] tracking-wide text-sm mb-8 uppercase flex items-center gap-3">
             <Presentation size={14} /> Master Presentations
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[#2D2A26] tracking-normal leading-tight">
            核心<br className="md:hidden"/>沙盘。
          </h1>
        </motion.div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-24">
          {sessions.map((session) => (
            <motion.div key={session.day} variants={fadeInUp} className="relative">
              
              {/* 会场标头 */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 mb-12 border-b-2 border-[#E5E1D8] pb-8">
                <span className="text-4xl font-black text-[#2D2A26] tracking-normal">{session.day}</span>
                <span className="text-xl font-bold text-[#9E9B96] tracking-normal">{session.title}</span>
                <span className="font-mono text-sm tracking-wide text-[#9E9B96] md:ml-auto uppercase">{session.date}</span>
              </div>

              {/* 卡片队列 */}
              <div className="grid gap-12">
                {session.blocks.map((block) => {
                  const isHovered = hoveredId === block.id;
                  
                  return (
                    <Link key={block.id} href={block.ready ? `/slides/${block.id}` : "#"}>
                      <div 
                        onMouseEnter={() => setHoveredId(block.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group p-10 md:p-12 border-2 rounded-2xl transition-all duration-300 ${
                          block.ready
                           ? "border-[#E5E1D8] hover:border-[#22d665] bg-white hover:shadow-lg cursor-pointer"
                           : "border-[#E5E1D8] opacity-40 cursor-not-allowed bg-[#FAF9F6]"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                          {/* 时间块 */}
                          <div className="shrink-0 w-28">
                             <div className="font-mono text-xl text-[#9E9B96] group-hover:text-[#22d665] transition-colors">{block.time}</div>
                          </div>

                          {/* 内容体 */}
                          <div className="flex-1">
                             <h3 className="text-2xl md:text-3xl font-bold text-[#2D2A26] mb-5 tracking-normal flex items-center gap-3">
                               {block.title}
                             </h3>
                             <p className="text-base md:text-lg text-[#9E9B96] leading-relaxed mb-8 group-hover:text-[#6B6660] transition-colors">
                               {block.desc}
                             </p>
                             
                             <div className="flex items-center gap-8">
                               <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
                                 {block.ready ? (
                                   <><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> <span className="text-[#2D2A26] font-semibold">Active</span></>
                                 ) : (
                                   <><span className="w-2.5 h-2.5 rounded-full bg-[#E5E1D8]"></span> <span className="text-[#9E9B96]">Locked</span></>
                                 )}
                               </div>
                               <span className="font-mono text-xs text-[#9E9B96] tracking-wide uppercase">
                                  {block.slides} BLOCKS
                               </span>
                             </div>
                          </div>

                          {/* 悬停按钮 */}
                          {block.ready && (
                             <div className="flex items-center shrink-0">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                                  isHovered ? "bg-[#22d665] text-white border-[#22d665] scale-110 shadow-lg" : "bg-[#FAF9F6] text-[#9E9B96] border-[#E5E1D8]"
                                }`}>
                                   <Play size={22} className="ml-1" />
                                </div>
                             </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
