"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Target,
  MessageSquare,
  FlaskConical,
  BarChart3,
  Building2,
  Headphones,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ChevronDown,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TokenGate from "./components/TokenGate";

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// 工具模块数据
const toolModules = [
  {
    icon: Target,
    title: "获客中心",
    desc: "批量AI海报生成、短视频自动化制作、全平台文案矩阵铺设",
  },
  {
    icon: MessageSquare,
    title: "销售助手",
    desc: "高意向对话实时分析、金牌话术库动态挂载、极速智能预测与回访",
  },
  {
    icon: FlaskConical,
    title: "研发工坊",
    desc: "业务级大模型头脑风暴、基于自然语言的极速原型验证、行业全网趋势研判",
  },
  {
    icon: BarChart3,
    title: "运营驾驶舱",
    desc: "基于图表的智能仪表盘生成、高管视角的 AI 自动总结分析、成交数据洞察",
  },
  {
    icon: Building2,
    title: "行政效率站",
    desc: "律师级合同自动审核生成、冗长会议提取式自动纪要、审批流程 RPA 改造诊断",
  },
  {
    icon: Headphones,
    title: "客服智能体",
    desc: "基于 RAG 对接企业私域知识库的客诉处理、舆情公关监控、大量客户反馈之声提取",
  },
];

// 两天流程 — 从中小企业主痛点出发重写
const schedule = [
  {
    day: "DAY 1",
    date: "4月18日",
    title: "破局：利润下滑不是终点，是您换引擎的信号",
    blocks: [
      {
        time: "上午 09:00",
        label: "看清残局：您的利润正在被谁吞掉？",
        items: [
          "2026 年 AI 能力边界全景：哪些岗位正在被替代，哪些企业已经在翻倍增长",
          "残酷数据对比：用了 AI 的同行，获客成本砍半、人效翻三倍的真实账本",
          "中小企业引入 AI 最容易踩的三个致命深坑——以及怎么绕过去",
        ],
      },
      {
        time: "下午 13:30",
        label: "对号入座：您的行业，AI 正在颠覆哪个环节？",
        items: [
          "五大行业真实案例拆解：他们怎样用 AI 把利润率从 8% 拉到 23%",
          "现场诊断：随机抽取在座企业，当场锁定 AI 可切入的利润增长点",
          "🔥 45 分钟实战：从零搭建一套全自动获客→跟单→成交流水线",
        ],
      },
    ],
  },
  {
    day: "DAY 2",
    date: "4月19日",
    title: "上手：不再观望，今天就让 AI 替您干活",
    blocks: [
      {
        time: "上午 09:00",
        label: "工具实训：零基础也能即学即用的杀手级武器",
        items: [
          "从 100+ AI 工具中筛出最适合中小企业的 12 个杀手级应用",
          "手把手教学：用 Dify / Coze 搭建您自己的智能获客+销售系统",
          "10 秒出报表：用 AI 替代过去要花半天的数据分析工作",
        ],
      },
      {
        time: "下午 13:30",
        label: "定制交付：带走属于您企业的 AI 作战地图",
        items: [
          "工作坊：画出您企业的 AI 改造蓝图——哪些岗位换工具、哪些流程自动化",
          "算一笔账：引入 AI 后，您每月能省多少人力成本、多接多少订单",
          "🔥 1v1 专家诊断：针对您的企业定制 AI 落地时间表，离场即可执行",
        ],
      },
    ],
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [tokenGateOpen, setTokenGateOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] overflow-hidden font-sans">
      {/* Token 验证 Modal */}
      <TokenGate isOpen={tokenGateOpen} onClose={() => setTokenGateOpen(false)} />

      {/* 极简化导航栏 */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-32 py-4 md:py-6 gap-4"
        style={{
          background: scrollY > 50 ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid #E5E1D8" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center text-xl font-black bg-[#D97706] text-white rounded-xl">
            A
          </div>
          <span className="text-xl font-bold tracking-normal text-[#2D2A26] uppercase hidden lg:block whitespace-nowrap">
            AI Camp 2026
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium tracking-wide uppercase text-[#9E9B96] whitespace-nowrap overflow-hidden">
          <a href="#schedule" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">日程剖析</a>
          <a href="#tools" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">工具解密</a>
          <a href="#about" className="hover:text-[#2D2A26] transition-colors whitespace-nowrap">关于峰会</a>
        </div>
        <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <button
            onClick={() => setTokenGateOpen(true)}
            className="text-[#2D2A26] border border-[#E5E1D8] bg-transparent text-sm font-bold tracking-wide uppercase py-3 px-6 lg:px-10 hover:bg-[#2D2A26] hover:text-white hover:border-[#2D2A26] transition-colors rounded-xl hidden sm:block whitespace-nowrap text-center cursor-pointer"
          >
            进入讲演模式
          </button>
          <Link
            href="/login"
            className="bg-[#D97706] text-white text-sm font-bold tracking-wide uppercase py-3 px-8 lg:px-12 hover:bg-[#B45309] transition-colors rounded-xl whitespace-nowrap text-center"
          >
            输入邀请码
          </Link>
        </div>
      </motion.nav>

      {/* Hero 区域 — 从痛点出发 */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-12 lg:px-32 pt-32 pb-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto mt-[-5vh]"
        >
          <motion.div variants={fadeInUp} className="text-[#9E9B96] font-mono tracking-wide uppercase mb-8">
            —— SEASON I · 2026.04.18
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-[9rem] font-black tracking-normal leading-tight mb-10 text-[#2D2A26]"
          >
            AI<span className="text-[#6B6660]">造浪营</span>。
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl text-[#9E9B96] max-w-4xl leading-snug tracking-normal mb-16"
          >
            订单下滑、利润缩水、团队疲于内卷——<br className="hidden md:block"/>
            问题不在努力不够，而在<span className="text-[#2D2A26] font-bold">武器没升级</span>。<br className="hidden md:block"/>
            两天时间，逐环节锁定 AI 的精确切入点，让每一分钱的成本都找到可量化的回报路径。
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-[#6B6660] font-mono tracking-wide uppercase"
          >
            <span className="flex items-center gap-3">
              <Calendar size={18} className="text-[#D97706]" />
              APRIL 18-19, 2026
            </span>
            <span className="flex items-center gap-3 border-l border-[#E5E1D8] pl-8">
              <MapPin size={18} className="text-[#D97706]" />
              CLOSED DOOR / INVITE ONLY
            </span>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-col sm:flex-row gap-8 justify-center"
          >
            <button
              onClick={() => setTokenGateOpen(true)}
              className="bg-[#2D2A26] text-white font-bold tracking-wide uppercase py-5 px-12 hover:bg-black transition-colors rounded-2xl text-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              启动授课演示
              <ChevronDown size={20} className="-rotate-90" />
            </button>
          </motion.div>

        </motion.div>

        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[#9E9B96]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs uppercase font-mono tracking-wide">SCROLL FOR DETAILS</span>
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* 日程区 — 从痛点出发的标题 */}
      <section id="schedule" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
              两天，六大环节，逐个击破。
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
              不卖概念、不讲空话。每个模块都直接对应您企业的获客、销售、运营、行政、客服和研发环节，现场演练可直接复制到您公司的落地方案。
            </p>
          </motion.div>

          <div className="space-y-20">
            {schedule.map((day, di) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: di * 0.2 }}
                className="group border-t-2 border-[#E5E1D8] pt-16"
              >
                <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                  {/* 日期侧标 */}
                  <div className="md:w-1/3 shrink-0">
                    <div className="text-5xl font-black text-[#2D2A26] tracking-normal mb-3">{day.day}</div>
                    <div className="text-[#9E9B96] font-mono uppercase tracking-wide mb-8 text-base">{day.date}</div>
                    <h3 className="text-xl font-bold text-[#9E9B96] tracking-normal leading-relaxed">{day.title}</h3>
                  </div>

                  {/* 详细块列 */}
                  <div className="md:w-2/3 space-y-16">
                    {day.blocks.map((block) => (
                      <div key={block.time} className="hover:bg-white/60 p-8 -mx-4 rounded-2xl transition-colors">
                        <div className="flex items-baseline gap-12 mb-8">
                          <span className="text-[#6B6660] font-mono text-xl">{block.time}</span>
                          <span className="text-[#2D2A26] text-2xl font-bold tracking-normal">{block.label}</span>
                        </div>
                        <ul className="space-y-6 pl-2">
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="text-lg text-[#6B6660] flex items-start leading-relaxed"
                            >
                              <span className="mr-5 text-[#D97706] mt-1 font-bold">•</span>
                              {item.includes("🔥") ? (
                                <span className="text-[#2D2A26] font-bold">{item}</span>
                              ) : item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 工具展示区 — 保留 The Arsenal + 卡片可点击跳转 login */}
      <section id="tools" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-white border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
               您的企业，哪些环节<br className="hidden md:block"/>明天就能用 AI？<br/>
               <span className="text-[#9E9B96]">The Arsenal.</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
               从获客到售后，六大核心职能的 AI 实战工具已就绪。不是看演示——是您亲手操作，带走能直接落地的方案。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolModules.map((tool, i) => (
              <Link key={tool.title} href="/login">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-[#E5E1D8] p-10 hover:border-[#D97706] cursor-pointer group transition-all bg-white rounded-2xl hover:shadow-lg h-full"
                >
                  <tool.icon size={48} className="text-[#9E9B96] group-hover:text-[#D97706] transition-colors mb-10" />
                  <h3 className="text-3xl font-bold text-[#2D2A26] mb-6 tracking-normal">
                    {tool.title}
                  </h3>
                  <p className="text-lg text-[#9E9B96] leading-loose mb-6">
                    {tool.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                    输入邀请码体验 <ArrowRight size={16} />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 脚尾 CTA — K型分化 + 痛点 */}
      <section id="about" className="relative py-36 md:py-48 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* K型分化图示 */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp size={28} strokeWidth={3} />
                <span className="text-sm font-mono uppercase tracking-wide">用 AI 的企业</span>
              </div>
              <div className="w-px h-10 bg-[#E5E1D8]"></div>
              <div className="flex items-center gap-2 text-red-500">
                <TrendingDown size={28} strokeWidth={3} />
                <span className="text-sm font-mono uppercase tracking-wide">观望中的企业</span>
              </div>
            </div>

            <h2 className="text-5xl md:text-[5.5rem] font-black text-[#2D2A26] leading-tight tracking-normal mb-10">
              AI 时代的 K 型十字路口。<br />
              <span className="text-[#9E9B96]">向上，或向下。没有中间地带。</span>
            </h2>
            <p className="text-2xl text-[#9E9B96] leading-relaxed mb-8 tracking-normal max-w-3xl mx-auto">
              同行已经在用 AI 接单、降本、提效——利润曲线正在急剧分化。您的窗口期，不会永远敞开。
            </p>
            <p className="text-xl text-[#6B6660] leading-relaxed mb-20 tracking-normal max-w-3xl mx-auto">
              这不是又一堂"认知课"——这是为您企业量身定制的 AI 落地路线图。<br/>
              两天后，您带走的不是笔记，是<span className="text-[#2D2A26] font-bold">能立刻执行的行动方案</span>。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-xl font-bold uppercase tracking-wide text-white bg-[#D97706] px-14 py-6 hover:bg-[#B45309] transition-colors rounded-2xl gap-3"
            >
              立刻进入 AI 工具控制台
              <ArrowRight size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[#E5E1D8] py-16 px-12 md:px-24 lg:px-32 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-sm text-[#9E9B96] font-mono uppercase tracking-wide">
          <div className="flex items-center gap-8">
             AI 造浪营 S1 / 智企实验室闭门会
          </div>
          <span>© 2026 ALL PROCESSES FINALIZED.</span>
        </div>
      </footer>
    </div>
  );
}
