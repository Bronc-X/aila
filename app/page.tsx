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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// 两天流程
const schedule = [
  {
    day: "DAY 1",
    date: "4月18日",
    title: "认知重塑 · 案例震撼",
    blocks: [
      {
        time: "上午 09:00",
        label: "AI核心破局点",
        items: ["2026 年生成式大模型边界扫描", "中美企业应用 AI 差距数据实录", "破除员工抗拒：组织转型三大致命卡点"],
      },
      {
        time: "下午 13:30",
        label: "极限深钻",
        items: [
          "多行业 AI 落地效果极致拆解 (含跨维打击逻辑)",
          "随机抽取企业当下的痛点盲区诊断",
          "🔥 Live Coding: 45 分钟屏息实战，构建您企业的全自动销售流",
        ],
      },
    ],
  },
  {
    day: "DAY 2",
    date: "4月19日",
    title: "工具实操 · 方案带走",
    blocks: [
      {
        time: "上午 09:00",
        label: "无情操练",
        items: ["展示当前世界最能变现的杀手级工具全景图", "Dify / Coze：手把手搭建获客与销售工作流", "Perplexity / Advanced Data：图鉴与报表 10 秒通杀体验"],
      },
      {
        time: "下午 13:30",
        label: "终班闭门会",
        items: [
          "业务级工作坊推演图：画出替代人工的 AI 业务管道",
          "算清这笔恐怖的 ROI 溢价账簿",
          "🔥 1v1 Q&A 专家问诊答疑，带走您的行动计划甘特图",
        ],
      },
    ],
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] overflow-hidden font-sans">
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
          <Link
            href="/slides"
            className="text-[#2D2A26] border border-[#E5E1D8] bg-transparent text-sm font-bold tracking-wide uppercase py-3 px-6 lg:px-10 hover:bg-[#2D2A26] hover:text-white hover:border-[#2D2A26] transition-colors rounded-xl hidden sm:block whitespace-nowrap text-center"
          >
            进入讲演模式
          </Link>
          <Link
            href="/login"
            className="bg-[#D97706] text-white text-sm font-bold tracking-wide uppercase py-3 px-8 lg:px-12 hover:bg-[#B45309] transition-colors rounded-xl whitespace-nowrap text-center"
          >
            系统授权接口
          </Link>
        </div>
      </motion.nav>

      {/* 极简风 Hero 区域 */}
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
            这不是一次营销噱头。<br className="hidden md:block"/>这是两天的残酷内化。从认知剥离到核心流重建，让 AI 真正渗透进您的利润血管里。
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
            <Link
              href="/slides"
              className="bg-[#2D2A26] text-white font-bold tracking-wide uppercase py-5 px-12 hover:bg-black transition-colors rounded-2xl text-lg flex items-center justify-center gap-3"
            >
              启动授课演示
              <ChevronDown size={20} className="-rotate-90" />
            </Link>
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

      {/* 极简风格日程 */}
      <section id="schedule" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
              极限两天。
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
              拒绝只说不练。这里没有废话，只有干货研表与血淋淋的代码流展示。
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
                    <h3 className="text-2xl font-bold text-[#9E9B96] tracking-normal">{day.title}</h3>
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

      {/* 极简风格全矩阵工具展示 */}
      <section id="tools" className="relative py-32 md:py-40 px-12 md:px-24 lg:px-32 bg-white border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] tracking-normal mb-8">
               全企业器官级覆盖。<br/>
               The Arsenal.
            </h2>
            <p className="text-xl md:text-2xl text-[#9E9B96] tracking-normal max-w-3xl">
               我们不仅仅是讲一些理论框架。您的营员证绑定了六大职能方向的强力模型库实测权限，现场见证 ROI 的百倍跳跃。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolModules.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-[#E5E1D8] p-10 hover:border-[#D97706] cursor-pointer group transition-all bg-white rounded-2xl hover:shadow-lg"
              >
                <tool.icon size={48} className="text-[#9E9B96] group-hover:text-[#D97706] transition-colors mb-10" />
                <h3 className="text-3xl font-bold text-[#2D2A26] mb-6 tracking-normal">
                  {tool.title}
                </h3>
                <p className="text-lg text-[#9E9B96] leading-loose">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 极简脚尾声明 */}
      <section id="about" className="relative py-36 md:py-48 px-12 md:px-24 lg:px-32 bg-[#FAF9F6] border-t border-[#E5E1D8]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-[6.5rem] font-black text-[#2D2A26] leading-tight tracking-normal mb-16">
              要么重构引擎，<br />要么被大模型碾过。
            </h2>
            <p className="text-2xl text-[#9E9B96] leading-relaxed mb-20 tracking-normal max-w-3xl mx-auto">
              你可以在互联网上无数次购买营销课、"认知课"，也可以亲手在这里把公司从旧世纪拉入 2026 年大航海时代。
              这不是讲演，这是为您企业定制的外脑植入。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-xl font-bold uppercase tracking-wide text-white bg-[#D97706] px-14 py-6 hover:bg-[#B45309] transition-colors rounded-2xl gap-3"
            >
              立刻启动控制台
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
