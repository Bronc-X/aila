"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import {
  Sparkles, TrendingUp, AlertTriangle, Brain, Zap, Target, Users, ArrowRight,
  BarChart3, Globe, Factory, ShoppingBag, CheckCircle2, XCircle,
  Clock, DollarSign, Cpu, Bot, MessageSquare, Eye,
  Building2, Headphones, Sprout
} from "lucide-react";

/* ============================================
   动画工具
   ============================================ */
const fadeUp = {
  initial: { opacity: 0, y: 50, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 100, damping: 20, delay: 0.1 },
};
const d = (delay: number) => ({
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 100, damping: 20, delay },
});

/* ============================================
   D1 上午 全部 Slides — 25 张
   目的：FOMO 激活 + AI 个人思想改造
   ============================================ */
function allSlides(setModalContent: (content: React.ReactNode) => void) {
  return [
    /* ━━━━━━ 第一章：开场破冰 ━━━━━━ */

    // S1: 封面
    <Slide key="s1" bg="linear-gradient(135deg, #1C1917 0%, #292420 40%, #1A1612 100%)">
      <div className="hero-glow" />
      <motion.div {...fadeUp} className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.div {...d(0.1)} className="text-gray-400 font-mono tracking-wide uppercase text-sm mb-12">
          <Sparkles size={14} className="inline mr-2 text-[var(--brand-glow)]" /> Season 1 · 2026年4月18-19日
        </motion.div>
        <motion.h1 {...d(0.3)} className="text-7xl md:text-[9rem] font-black leading-tight tracking-normal mb-10">
          <span className="text-gradient">AI造浪营</span>
        </motion.h1>
        <motion.p {...d(0.5)} className="text-2xl md:text-3xl text-[var(--text-secondary)] mb-6">
          智企实验室 · 闭门会
        </motion.p>
        <motion.div {...d(0.7)} className="text-base text-[var(--text-muted)]">
          D1 上午 · AI发展全景 + 认知重塑
        </motion.div>
      </motion.div>
    </Slide>,

    // S2: 开场提问
    <Slide key="s2">
      <motion.div {...fadeUp} className="text-center max-w-5xl mx-auto">
        <p className="text-2xl text-[var(--brand-glow)] mb-12 font-medium tracking-wide">先问在座各位一个问题 —</p>
        <h2 className="text-6xl md:text-[5.5rem] font-black text-[#2D2A26] leading-[1.1] tracking-normal mb-16">
          你上一次<br /><span className="text-gradient">被AI彻底震撼到</span><br />是什么时候？
        </h2>
        <motion.p {...d(0.5)} className="text-2xl text-[var(--text-secondary)] leading-loose">
          如果你的回答是“很久了”或者“好像还没有”<br />
          那这两天的内容，可能会<span className="text-[var(--text-primary)] font-semibold">重新校准你的世界观</span>。
        </motion.p>
      </motion.div>
    </Slide>,

    // [新增] S3: 大模型通识
    <Slide key="s_llm">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-black text-[#2D2A26] mb-8 text-center">
          到底什么是<span className="text-gradient">大语言模型 (LLM)</span>？
        </h2>
        <p className="text-center text-xl text-[var(--text-muted)] mb-14">不要把它当成搜索工具，它是一个“认知引擎”</p>
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div {...d(0.2)} className="glass-card !p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-[#2D2A26] mb-6 flex items-center gap-3">
              <Sprout className="text-[var(--brand-glow)]" size={32} /> 本质：概率预测与涌现
            </h3>
            <p className="text-lg text-[var(--text-secondary)] leading-loose">
              它并没有真正“理解”这个世界，它只是在阅读了人类所有的文本之后，找到了“字与字之间最合理的接龙概率”。
              但是，当模型参数跨过百亿门槛时，量变引发了质变——<b>涌现能力</b>诞生了。它突然学会了逻辑、推理和归纳。
            </p>
          </motion.div>
          <motion.div {...d(0.4)} className="glass-card !p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-[#2D2A26] mb-6 flex items-center gap-3">
              <Brain className="text-green-400" size={32} /> 弱 AI vs 强 AI 的区别
            </h3>
            <ul className="space-y-4 text-lg text-[var(--text-secondary)]">
              <li className="flex gap-3 items-start"><CheckCircle2 className="text-green-400 shrink-0 mt-1" /> <b>以前的AI：</b> 规则驱动，教它怎么下棋（AlphaGo），它就只能下棋。</li>
              <li className="flex gap-3 items-start"><CheckCircle2 className="text-[var(--brand-glow)] shrink-0 mt-1" /> <b>现在的AI：</b> 通用智能。你不需要写规则，只需要用“人话”跟它对接。它是通往通用人工智能（AGI）的雏形。</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // [新增] S4: 科技进化史
    <Slide key="s_history" bg="linear-gradient(135deg, #1C1917 0%, #292420 40%, #1A1612 100%)">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl font-black text-[#2D2A26] mb-16 text-center tracking-normal">
          科技革命图谱：<span className="text-gradient">这次为何不同</span>？
        </h2>
        <div className="flex flex-col md:flex-row gap-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--text-secondary)] to-transparent opacity-20 hidden md:block rounded-full -translate-y-1/2"></div>
          {[
            { tag: "蒸汽/电力", title: "动力革命", subtitle: "解放体力", year: "18-19世纪", desc: "把人从繁重的体力劳动中抽离" },
            { tag: "PC/互联网", title: "信息革命", subtitle: "解放距离", year: "20世纪末", desc: "消灭信息交换的时间与空间壁垒" },
            { tag: "大模型", title: "认知革命", subtitle: "释放智力", year: "2023 直至此时", desc: "历史第一次，机器承担了本属于人类的推理创作黑盒。", highlight: true },
          ].map((item, i) => (
            <motion.div key={item.title} {...d(0.2 + i * 0.15)} className={`flex-1 glass-card !p-12 relative z-10 ${item.highlight ? 'border-[var(--border-active)] shadow-glow bg-[#0A0A0A]' : ''}`}>
              <div className="text-sm font-mono text-[var(--text-muted)] tracking-wide mb-6">{item.year}</div>
              <h3 className={`text-3xl font-black mb-3 ${item.highlight ? 'text-[#2D2A26]' : 'text-gray-400'}`}>{item.title}</h3>
              <p className={`text-2xl font-bold mb-8 ${item.highlight ? 'text-gradient' : 'text-[var(--text-muted)]'}`}>{item.subtitle}</p>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S5: 两年前 vs 现在 — 让人坐不住的对比
    <Slide key="s3">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-black text-[#2D2A26] mb-4 text-center">
          24个月前 → 今天：<span className="text-gradient">发生了什么</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12">这不是科幻，这是已经发生的事</p>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {[
            { before: "AI只能陪你聊天、写文章", after: "AI可以操控你的电脑、浏览器，自主完成完整的工作流", icon: Cpu },
            { before: "做一张海报需要设计师2天", after: "描述一句话，10秒生成专业级海报和视频", icon: Eye },
            { before: "分析一份数据报告要半天", after: "上传文件→AI出完整分析+可视化+行动建议，3分钟", icon: BarChart3 },
            { before: "客服7×24需要3班倒18人", after: "1个AI客服Bot + 2个人工值班 = 同样的服务质量", icon: Bot },
            { before: "做竞品分析要出差+调研1周", after: "AI Agent 30分钟跑完全网信息，生成报告", icon: Globe },
            { before: "新员工培训周期3个月", after: "AI知识库 + 实时导师，上岗时间缩短60%", icon: Users },
          ].map((item, i) => (
            <motion.div key={i} {...d(0.15 + i * 0.08)}
              className="flex gap-8 items-start py-4 border-b border-[var(--border-subtle)]">
              <item.icon size={20} className="text-[var(--brand-glow)] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-[var(--text-muted)] line-through mb-2">{item.before}</p>
                <p className="text-sm text-[#2D2A26] font-medium leading-relaxed">{item.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第二章：2026年AI到底发展到了哪 ━━━━━━ */

    // S4: 章节页
    <Slide key="s4" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center">
        
        <h2 className="text-4xl md:text-5xl font-black text-[#2D2A26] leading-tight mb-6">
          2026年的AI<br /><span className="text-gradient">居然发展到了这样</span>
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">
          我给大家梳理一个时间线，你们感受一下这个速度
        </p>
      </motion.div>
    </Slide>,

    // S5: AI发展时间线 — 详细版
    <Slide key="s5">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-10 text-center">AI能力跃迁时间线</h2>
        <div className="space-y-5">
          {[
            { year: "2023.03", event: "GPT-4 发布 — 第一次让人感觉'AI好像真的能做事了'", icon: <Zap size={18} className="text-[var(--brand-glow)]" />, level: 25 },
            { year: "2024.02", event: "Sora 发布 — AI开始生成逼真视频，创意行业开始紧张", icon: <Eye size={18} className="text-[var(--brand-glow)]" />, level: 35 },
            { year: "2024.11", event: "多模态全面打通 — 图文音视频输入输出，一个模型搞定", icon: <Target size={18} className="text-[var(--brand-glow)]" />, level: 48 },
            { year: "2025.06", event: "AI Agent 成熟 — AI不再只回答问题，开始自主执行复杂任务链", icon: <Bot size={18} className="text-[var(--brand-glow)]" />, level: 62 },
            { year: "2025.08", event: "GPT-5 发布 — 100万token上下文，推理能力质的飞跃", icon: <Zap size={18} className="text-[var(--brand-glow)]" />, level: 75 },
            { year: "2026.01", event: "Claude Agent Teams — AI可以拆分任务、分派子Agent协作完成", icon: <Brain size={18} className="text-[var(--brand-glow)]" />, level: 85 },
            { year: "2026.03", event: "GPT-5.4 — AI可以操控电脑，超过人类专家水平（OSWorld基准）", icon: <Cpu size={18} className="text-[var(--brand-glow)]" />, level: 95 },
            { year: "现在", event: "你坐在这里，这些能力你的企业用了多少？", icon: <ArrowRight size={18} className="text-[var(--brand-glow)]" />, level: 100 },
          ].map((item, i) => (
            <motion.div key={item.year} {...d(0.15 + i * 0.08)}
              className="flex items-center gap-5">
              <span className="text-sm font-mono text-[var(--brand-glow)] w-[72px] text-right flex-shrink-0">
                {item.year}
              </span>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="h-12 rounded-xl bg-[var(--bg-card)] overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.level}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-xl"
                    style={{ background: `linear-gradient(90deg, rgba(217,119,6,${0.15 + item.level * 0.005}) 0%, rgba(245,158,11,${0.08 + item.level * 0.003}) 100%)` }}
                  />
                  <span className="absolute inset-0 flex items-center px-5 text-sm text-[var(--text-secondary)] leading-snug">
                    {item.event}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S6: AI现在能做什么 — 具体举例
    <Slide key="s6">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-4 text-center">
          现在的AI<span className="text-gradient">具体能做什么</span>？
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12">不是概念，是现在已经在用的能力</p>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "文本/语言", items: ["写完整的营销方案", "起草法律合同", "翻译26种语言（接近母语水平）", "自动生成周报/月报", "分析10万字文档并出摘要"], icon: MessageSquare },
            { title: "图像/视频", items: ["一句话生成商用级海报", "产品图自动换背景", "生成60秒品牌宣传视频", "批量处理1000张素材", "Logo设计 + 品牌VI生成"], icon: Eye },
            { title: "推理/执行", items: ["分析财务报表出经营建议", "自动操控电脑完成工作流", "多Agent协作完成复杂项目", "实时语音翻译（延迟不到1秒）", "代码编写 + 自动测试部署"], icon: Brain },
          ].map((cat, i) => (
            <motion.div key={cat.title} {...d(0.2 + i * 0.15)}
              className="glass-card p-7">
              <cat.icon size={24} className="text-[var(--brand-glow)] mb-4" />
              <h3 className="text-lg font-bold text-[#2D2A26] mb-4">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <CheckCircle2 size={14} className="text-[var(--brand-primary)] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第三章：数字冲击 — FOMO 核弹 ━━━━━━ */

    // S7: 章节页
    <Slide key="s7" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center">
        
        <h2 className="text-4xl md:text-5xl font-black text-[#2D2A26] leading-tight mb-6">
          几个<span className="text-gradient">让你坐不住</span>的数字
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">数据来自 NVIDIA、KPMG、信通院最新报告</p>
      </motion.div>
    </Slide>,

    // S8: 4大冲击数据
    <Slide key="s8">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: "88%", desc: "的高管表示AI已带来实际营收增长", sub: "— NVIDIA 2026 报告", key: "nvidia", icon: TrendingUp },
            { num: "40%+", desc: "的CEO报告AI带来超过10%的年营收增长", sub: "— 企业级AI调研", key: "mckinsey", icon: DollarSign },
            { num: "70%", desc: "跨境电商用AI后人力成本直降", sub: "— 中国企业案例", key: "cross-border", icon: Users },
            { num: "18月", desc: "留给未转型企业的窗口期", sub: "— 行业预估", key: "window", icon: AlertTriangle },
          ].map((item, i) => (
            <motion.div key={item.desc} {...d(0.2 + i * 0.12)}
              className="glass-card p-8 text-center cursor-pointer border border-transparent hover:border-[var(--brand-primary)] transition-colors"
              onClick={() => {
                if (item.key && caseDetails[item.key]) setModalContent(caseDetails[item.key]);
              }}>
              <item.icon size={28} className="text-[var(--brand-glow)] mx-auto mb-5" />
              <div className="text-5xl font-black text-gradient mb-4">{item.num}</div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{item.desc}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S9: 中国真实案例表格
    <Slide key="s9">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-4 text-center">
          中国企业<span className="text-gradient">真实落地案例</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-10">这些不是PPT上的远景，是已经发生的事实</p>
        <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
          {[
            { company: "亚朵集团", scene: "非标作业处理", result: "节省 750万", metric: "年提效30万小时", tag: "服务" },
            { company: "四维图新", scene: "AI合规审核", result: "300小时/次", metric: "审核周期大幅缩短", tag: "科技" },
            { company: "某跨境电商", scene: "生成矩阵", result: "销额 翻倍", metric: "人力成本直降70%", tag: "出海" },
            { company: "宁德时代", scene: "工业大模型", result: "偏差 降50%", metric: "原型设计缩短50%", tag: "制造" },
            { company: "京东工业", scene: "供应链管理", result: "提速 30%", metric: "供应商成本降50%+", tag: "零售" },
          ].map((item, i) => (
            <motion.div key={item.company} {...d(0.15 + i * 0.08)}
              className="flex items-center justify-between border-b border-[#E5E1D8] pb-6 cursor-pointer hover:bg-[#FAF9F6] transition-colors -mx-8 px-16 rounded-xl group"
              onClick={() => {
                if(item.company === "亚朵集团") setModalContent(caseDetails["atour"]);
                if(item.company === "某跨境电商") setModalContent(caseDetails["cross-border"]);
              }}>
              <div className="flex items-center gap-8">
                <span className="text-[var(--text-muted)] font-mono text-sm uppercase tracking-wide w-16">{item.tag}</span>
                <div>
                  <h3 className="text-3xl font-black text-[#2D2A26] group-hover:text-[var(--brand-glow)] transition-colors">{item.company}</h3>
                  <p className="text-[var(--text-secondary)] mt-1 tracking-wide">{item.scene}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-gradient tracking-normal">{item.result}</p>
                <p className="text-sm text-[var(--text-secondary)] font-mono mt-1">{item.metric}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S10: Salesforce / Amazon 国际案例
    <Slide key="s10">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-black text-[#6B6660] mb-16 text-center tracking-wide uppercase">
          国际巨头<span className="text-[#2D2A26]">已被重塑</span>
        </h2>
        <div className="flex md:flex-row flex-col justify-between items-center gap-12">
          {[
            { company: "Salesforce", stat: "成交量 +15%", detail: "Agentforce嵌入流程\n销售只做高价值谈判", icon: Target },
            { company: "Amazon", stat: "35% 营收", detail: "庞大推荐引擎的全量 AI 化\n每一个'猜你喜欢'背后全是算力重构", icon: ShoppingBag },
            { company: "PepsiCo", stat: "产能 +20%", detail: "AI数字孪生预判90%产线异常\n无缝降本", icon: Factory },
          ].map((item, i) => (
            <motion.div key={item.company} {...d(0.2 + i * 0.15)}
              className="flex-1 w-full text-center cursor-pointer group hover:scale-[1.02] transition-transform"
              onClick={() => {
                if(item.company === "Salesforce") setModalContent(caseDetails["salesforce"]);
              }}>
              <item.icon size={36} className="text-[#9E9B96] group-hover:text-[var(--brand-glow)] transition-colors mx-auto mb-8" />
              <h3 className="text-xl font-bold text-[#9E9B96] mb-4 tracking-wide uppercase">{item.company}</h3>
              <div className="text-4xl md:text-5xl font-black text-[#2D2A26] mb-6 tracking-normal">{item.stat}</div>
              <p className="text-sm text-[#6B6660] leading-loose whitespace-pre-wrap">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第四章：差距对比 ━━━━━━ */

    // S11: 章节页
    <Slide key="s11" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-12">
        <h2 className="text-4xl md:text-6xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal text-left">
          会用AI vs 不会用AI的企业：
        </h2>
        <p className="text-6xl md:text-[6.5rem] text-gradient font-black tracking-normal text-left leading-tight mt-4">
          差距在哪？
        </p>
      </motion.div>
    </Slide>,

    // S12: 对比表格 — 具体场景
    <Slide key="s12">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl font-black text-[#2D2A26] mb-16 text-center tracking-normal">
          同样的工作，<span className="text-gradient">效率差了多少</span>？
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-[1fr_200px_200px_100px] gap-8 px-16 text-sm text-[var(--text-muted)] tracking-wide uppercase font-mono mb-4 border-b border-[#E5E1D8] pb-4">
            <span>Core Task</span><span className="text-center text-[#6B6660]">Team & Time</span><span className="text-center text-[#999]">With AI Agent</span><span className="text-center">Multiplier</span>
          </div>
          {[
            { task: "生成100篇多平台营销矩阵文案", old: "15 人天", ai: "0.25 人天", ratio: "60x", key: "eff_1" },
            { task: "梳理全网舆情并产出竞品分析报告", old: "市场两人 1周", ai: "Agent 30分钟", ratio: "56x", key: "eff_2" },
            { task: "处理500条多端客户售前售后咨询", old: "客服8人 1天", ai: "AI 80%+人兜底", ratio: "8x", key: "eff_3" },
            { task: "从现场录音提取结构化会议纪要", old: "2 小时", ai: "3 分钟", ratio: "40x", key: "eff_4" },
            { task: "设计新产品包装宣发图（10个版本）", old: "设计 5天", ai: "AI批量 2小时", ratio: "20x", key: "eff_5" },
          ].map((item, i) => (
            <motion.div key={item.task} {...d(0.1 + i * 0.08)}
              className="grid grid-cols-[1fr_200px_200px_100px] gap-8 items-center cursor-pointer border border-transparent hover:border-[var(--border-active)] hover:bg-[#0A0A0A] p-12 -mx-6 rounded-xl transition-all group"
              onClick={() => {
                if (item.key && caseDetails[item.key]) setModalContent(caseDetails[item.key]);
              }}>
              <div className="text-xl md:text-2xl text-[#2D2A26] font-bold group-hover:text-[var(--brand-glow)] transition-colors">{item.task}</div>
              <div className="text-lg text-red-500/60 line-through text-center font-mono">{item.old}</div>
              <div className="text-lg text-green-400 font-bold text-center font-mono">{item.ai}</div>
              <div className="text-3xl font-black text-gradient text-center tracking-normal">{item.ratio}</div>
            </motion.div>
          ))}
          <div className="grid grid-cols-[1fr_160px_160px_60px] gap-8 px-5 text-xs text-[var(--text-muted)]">
            <span></span><span className="text-center">传统方式</span><span className="text-center">AI赋能</span><span className="text-center">倍数</span>
          </div>
        </div>
      </motion.div>
    </Slide>,

    // S13: 用AI vs 不用AI — 全景对比
    <Slide key="s13">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div {...d(0.2)} className="glass-card p-8" style={{ borderColor: "rgba(34,197,94,0.2)" }}>
            <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-3">
              <CheckCircle2 size={22} /> 拥抱AI的企业
            </h3>
            <ul className="space-y-4">
              {[
                "1个运营做以前5个人的工作量",
                "获客成本降低40-60%，ROI回报周期缩短",
                "客户响应从24小时→3分钟",
                "产品迭代周期从3个月→2周",
                "员工满意度反升（告别重复劳动）",
                "决策从拍脑袋到有数据",
                "7×24的销售和客服能力",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <CheckCircle2 size={15} className="text-green-400 mt-0.5 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...d(0.4)} className="glass-card p-8" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3">
              <XCircle size={22} /> 还在观望的企业
            </h3>
            <ul className="space-y-4">
              {[
                "人力成本年年涨，效率没提升",
                "响应慢、内容跟不上，客户在流失",
                "竞争对手的投文量是你的10倍",
                "老板推不动，员工觉得又来折腾",
                "招不到人、留不住人",
                "永远在下个季度再看看",
                "等你准备好的时候，市场已经不等你了",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <XCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // S14: KPMG 扩缩差距
    <Slide key="s14">
      <motion.div {...fadeUp} className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-[#2D2A26] leading-tight mb-10">
          KPMG 的一个发现
        </h2>
        <motion.div {...d(0.3)} className="glass-card p-10 inline-block">
          <p className="text-2xl text-[var(--text-secondary)] leading-relaxed mb-6">
            重视AI人才储备的企业<br />
            从AI获得商业价值的概率是——
          </p>
          <div className="text-8xl font-black text-gradient mb-6">4x</div>
          <p className="text-lg text-[var(--text-muted)]">
            77% vs 20% —— <span className="text-[#2D2A26] font-semibold">差距已经是代际级别的</span>
          </p>
        </motion.div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第五章：真正的问题 — 员工没跟上 ━━━━━━ */

    // S15: 章节页
    <Slide key="s15" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center w-full max-w-5xl mx-auto pl-12">
        <h2 className="text-5xl md:text-7xl font-black text-[#2D2A26] leading-tight mb-8 tracking-normal text-left">
          真正的<span className="text-red-500">卡点</span>在于：
        </h2>
        <p className="text-6xl md:text-[6rem] text-gradient font-black tracking-normal text-left leading-tight mt-4">
          老板有意识，<br />员工没跟上。
        </p>
      </motion.div>
    </Slide>,

    // S16: 三大卡点深入分析
    <Slide key="s16">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-10 text-center">
          员工抗拒AI的<span className="text-gradient cursor-pointer hover:underline" onClick={() => setModalContent(caseDetails["employee_boss"])}>三层心理</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain size={36} className="text-[var(--brand-glow)]" />, title: "认知层：不知道用什么",
              points: [
                "市面上工具太多，眼花缭乱",
                "ChatGPT我用过啊，就聊天嘛",
                "不知道AI能嵌入自己的具体工作",
                "觉得AI是程序员的事",
              ],
              solution: "→ 需要：看到AI在自己行业的具体应用",
            },
            {
              icon: <Target size={36} className="text-orange-400" />, title: "能力层：知道好但不会用",
              points: [
                "写Prompt写不好，觉得AI不聪明",
                "不知道怎么把AI融入每天的工作流",
                "试了一次效果不好就放弃了",
                "没人教、没人带",
              ],
              solution: "→ 需要：手把手的上手指导 + 现成模板",
            },
            {
              icon: <Users size={36} className="text-red-400" />, title: "心理层：不愿意用",
              points: [
                "AI会取代我的岗位",
                "用AI是因为公司不信任我",
                "学新工具太累了，我本来就很忙",
                "怕暴露自己效率低的事实",
              ],
              solution: "→ 需要：重新定义AI与人的关系",
            },
          ].map((item, i) => (
            <motion.div key={item.title} {...d(0.2 + i * 0.15)} className="glass-card p-7">
              <div className="mb-5">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#2D2A26] mb-5">{item.title}</h3>
              <ul className="space-y-3 mb-6">
                {item.points.map((p) => (
                  <li key={p} className="text-sm text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                    <span className="text-[var(--text-muted)] mt-0.5">·</span> {p}
                  </li>
                ))}
              </ul>
              <div className="text-sm font-semibold text-[var(--brand-glow)] pt-4 border-t border-[var(--border-subtle)]">
                {item.solution}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S17: 老板的常见误区
    <Slide key="s17">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-10 text-center">
          老板们对AI的<span className="text-gradient">常见误区</span>
        </h2>
        <div className="space-y-6">
          {[
            { wrong: "AI太贵了，只有大厂能用", right: "GPT-5.4 API 每100万字约¥3，一个月几百块钱可以做到以前千万级项目的效果" },
            { wrong: "AI不稳定，总是胡说八道", right: "2026年的AI幻觉率已降至个位数，关键是知道怎么用Prompt引导它，怎么设计校验流程" },
            { wrong: "AI会取代我的员工", right: "AI取代的是任务，不是岗位。1个人+AI = 以前5个人的产出，人做更有价值的事" },
            { wrong: "等技术再成熟一点再上", right: "你的竞争对手不会等你。先用80%可用的AI跑起来，比追求100%完美再动手要有效1000倍" },
            { wrong: "买个系统就行了", right: "AI不是买来的，是长出来的——需要和你的业务流程深度结合，需要培训团队使用" },
          ].map((item, i) => (
            <motion.div key={i} {...d(0.1 + i * 0.08)}>
              <div className="glass-card p-12 grid md:grid-cols-2 gap-12 items-center">
                <div className="flex items-start gap-3">
                  <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-base text-red-400/80 font-medium">{item.wrong}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.right}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第六章：思想改造 — AI是放大器 ━━━━━━ */

    // S18: 核心观念
    <Slide key="s18" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center max-w-5xl mx-auto w-full">
        <h2 className="text-5xl md:text-[6rem] font-black text-[#2D2A26] leading-[1.1] mb-12 tracking-normal">
          AI不是来<span className="text-red-500">替代</span>人的<br />
          而是来<span className="text-gradient">放大</span>人的
        </h2>
        <motion.p {...d(0.5)} className="text-2xl md:text-3xl text-[var(--text-secondary)] leading-relaxed tracking-normal mt-8">
          AI是每个员工的 <span className="text-[#2D2A26] font-bold">超级数字外骨骼</span>，<br />
          它只取代任务，<span className="text-[var(--brand-glow)]">绝不取代拥有好奇心的大脑。</span>
        </motion.p>
      </motion.div>
    </Slide>,

    // S19: 人+AI 新公式
    <Slide key="s19">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-12">新的工作公式</h2>
        <div className="flex md:flex-row flex-col justify-center items-center gap-12 mb-16">
          {[
            { icon: <Users size={56} className="text-[#2D2A26] mb-6 mx-auto" />, label: "Human", desc: "创意 · 判断 · 战略 · 同理心" },
            { icon: <div className="text-5xl font-black text-[#9E9B96] hidden md:block px-4">×</div>, label: "Multiplier", desc: "" },
            { icon: <Bot size={56} className="text-[var(--brand-glow)] mb-6 mx-auto" />, label: "AI Agent", desc: "速度 · 规模 · 一致性 · 7×24" },
          ].map((item, i) => (
            <motion.div key={i} {...d(0.2 + i * 0.15)} className={item.desc ? "text-center w-full md:w-1/3" : "text-center w-auto"}>
              {item.desc ? (
                <>
                  {item.icon}
                  <h3 className="text-3xl font-black text-[#2D2A26] mb-4 tracking-normal">{item.label}</h3>
                  <p className="text-lg text-[var(--text-secondary)] font-mono">{item.desc}</p>
                </>
              ) : (
                item.icon
              )}
            </motion.div>
          ))}
        </div>
        <motion.div {...d(0.6)} className="inline-block border-t border-b border-[#E5E1D8] py-6 px-12">
          <p className="text-4xl md:text-5xl font-black text-gradient tracking-normal">= 一个人活成一支队伍</p>
        </motion.div>
      </motion.div>
    </Slide>,

    // S20: "一人公司"现象
    <Slide key="s20">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-4 text-center">
          <span className="text-gradient">"一人公司"</span>现象正在爆发
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-10">
          中国互联网上已经有大量不到5人的团队，年营收过千万
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "1个人做跨境电商", desc: "AI写产品描述（6种语言）→ AI生成素材图 → AI自动投放广告 → AI客服处理询盘 → 1个人管全链路", result: "月均营收 ¥120万+", icon: Globe },
            { title: "2个人做MCN", desc: "AI批量生成短视频脚本 → AI合成配音 → AI剪辑 → AI分析数据调优 → 2个人管100+账号", result: "全平台粉丝 500万+", icon: Eye },
            { title: "3个人做SaaS", desc: "AI写代码 → AI做UI → AI写文档 → AI做客服 → 3个人从0到产品上线只用了6周", result: "已服务200+企业客户", icon: Cpu },
            { title: "1个人做法律咨询", desc: "AI分析合同 → AI做判例检索 → AI起草法律意见 → 律师只做终审和客户沟通", result: "人效提升 8 倍", icon: Building2 },
          ].map((item, i) => (
            <motion.div key={item.title} {...d(0.2 + i * 0.1)}
              className="glass-card p-7">
              <div className="flex items-center gap-3 mb-4">
                <item.icon size={20} className="text-[var(--brand-glow)]" />
                <h3 className="text-base font-bold text-[#2D2A26]">{item.title}</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{item.desc}</p>
              <div className="text-sm font-bold text-gradient">{item.result}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第七章：AI能渗透企业的每一个环节 ━━━━━━ */

    // S21: 企业全链路
    <Slide key="s21">
      <motion.div {...fadeUp} className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-4 text-center">
          AI能渗透你企业的<span className="text-gradient">每一个环节</span>
        </h2>
        <p className="text-center text-[var(--text-muted)] mb-12">从获客到售后——没有死角</p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {[
            { icon: Target, label: "获客", desc: "AI海报 · 视频 · 文案矩阵", color: "#D97706" },
            { icon: MessageSquare, label: "销售", desc: "实时话术 · 智能回访", color: "#EA580C" },
            { icon: Brain, label: "研发", desc: "头脑风暴 · 快速原型", color: "#B45309" },
            { icon: BarChart3, label: "运营", desc: "仪表盘 · AI报告", color: "#CA8A04" },
            { icon: Building2, label: "行政", desc: "合同 · 纪要 · 排班", color: "#A16207" },
            { icon: Headphones, label: "客服", desc: "智能客服 · 舆情", color: "#DC6843" },
          ].map((item, i) => (
            <motion.div key={item.label} {...d(0.15 + i * 0.08)}
              className="flex items-center gap-3">
              {i > 0 && <ArrowRight size={18} className="text-[var(--text-muted)]" />}
              <div className="glass-card px-12 py-5 text-center min-w-[120px]">
                <item.icon size={22} style={{ color: item.color }} className="mx-auto mb-2" />
                <div className="text-sm font-bold text-[#2D2A26] mb-1">{item.label}</div>
                <div className="text-[11px] text-[var(--text-muted)] leading-snug">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p {...d(0.8)} className="text-center text-lg text-[var(--brand-glow)] font-semibold mt-12">
          下午我们会一个一个打开这些工具，现场体验 →
        </motion.p>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第八章：今天的安排 + 收尾 ━━━━━━ */

    // S22: 两天日程
    <Slide key="s22">
      <motion.div {...fadeUp} className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-10 text-center">
          两天<span className="text-gradient">实战</span>，你会得到什么
        </h2>
        <div className="space-y-5">
          {[
            { time: "D1 上午", title: "认知重塑", desc: "✅ 你正在经历的这一场——对齐AI最新能力认知", tag: "当前", active: true },
            { time: "D1 下午", title: "案例 + Live Coding", desc: "五大行业AI拆解 + 现场为一位老板搭建AI工具", tag: "", active: false },
            { time: "D2 上午", title: "工具实操", desc: "打开电脑，亲手上手所有AI工具——获客、销售、运营、客服", tag: "", active: false },
            { time: "D2 下午", title: "AI落地工作坊", desc: "你的企业问题→AI方案草图 + 1v1 答疑", tag: "", active: false },
          ].map((item, i) => (
            <motion.div key={item.time} {...d(0.2 + i * 0.1)}
              className={`glass-card p-12 flex items-center gap-5 ${item.active ? "!border-[var(--brand-primary)]" : ""}`}>
              <span className="text-sm font-mono text-[var(--brand-glow)] w-[72px] flex-shrink-0">{item.time}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-[#2D2A26]">{item.title}</h3>
                  {item.tag && <span className="badge badge-brand text-[10px]">{item.tag}</span>}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S23: 金句
    <Slide key="s23" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-[#2D2A26] leading-[1.2] mb-10">
          "AI不会淘汰任何人——<br />
          但<span className="text-gradient">会用AI的人</span>，<br />
          会淘汰不会用的人"
        </h2>
        <motion.p {...d(0.5)} className="text-xl text-[var(--text-muted)]">
          这句话送给在座的每一位企业主
        </motion.p>
      </motion.div>
    </Slide>,

    // S24: 互动环节引导
    <Slide key="s24">
      <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
        <MessageSquare size={56} className="mx-auto mb-10 text-[var(--brand-glow)]" />
        <h2 className="text-3xl font-black text-[#2D2A26] mb-8">
          来，聊聊<span className="text-gradient">你的困惑</span>
        </h2>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-10">
          刚才讲的这些，你觉得哪一点最打动你？<br />
          或者——你最大的顾虑是什么？<br />
          我们现场解答。
        </p>
        <div className="badge badge-warm text-sm">
          <Clock size={14} /> 自由提问 · 15分钟
        </div>
      </motion.div>
    </Slide>,

    // S25: 转场
    <Slide key="s25" bg="linear-gradient(135deg, #292420 0%, #1C1917 100%)">
      <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
        <p className="text-lg text-[var(--text-muted)] mb-8">D1 上午 · 认知重塑 · 完</p>
        <h2 className="text-5xl font-black text-[#2D2A26] mb-8">下午见</h2>
        <motion.p {...d(0.4)} className="text-xl text-[var(--text-secondary)] leading-relaxed mb-10">
          我们会现场选一位企业主<br />
          <span className="text-gradient font-bold">Live Coding 为你搭建一个AI工具</span><br />
          从痛点到工具上线——全程30分钟
        </motion.p>
        <motion.div {...d(0.6)} className="badge badge-brand text-base">
          <Sparkles size={16} /> 13:30 准时开始
        </motion.div>
      </motion.div>
    </Slide>,
  ];
}

export default function D1MorningSlides() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  return (
    <div className="bg-[#FAF9F6] relative w-screen h-screen overflow-hidden">
      <motion.div
        animate={{
          scale: modalContent ? 0.96 : 1,
          filter: modalContent ? "blur(12px)" : "blur(0px)",
          opacity: modalContent ? 0.5 : 1,
        }}
        transition={{ type: "spring" as const, damping: 25, stiffness: 150 }}
        className="origin-center w-full h-full"
      >
        <SlideEngine
          slides={allSlides(setModalContent)}
          title="AI造浪营"
          subtitle="D1上午 · AI发展全景 + 认知重塑"
        />
      </motion.div>
      <CaseModal 
        isOpen={!!modalContent} 
        onClose={() => setModalContent(null)} 
        content={modalContent} 
      />
    </div>
  );
}
