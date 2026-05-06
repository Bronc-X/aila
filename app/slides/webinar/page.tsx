"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideEngine, Slide } from "@/components/slides/SlideEngine";
import { CaseModal } from "@/components/slides/CaseModal";
import { caseDetails } from "./case-details";
import {
  TrendingUp, AlertTriangle, Brain, Zap, Target, Users,
  CheckCircle2, XCircle, Clock, DollarSign, Bot, MessageSquare,
  Eye, Code2, Database, Radio, Lightbulb, Sparkles,
  BarChart3, Image, ShoppingBag, Cpu, Map, Network, Workflow
} from "lucide-react";

/* ============================================
   动画工具集
   ============================================ */
const pop = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: 0.1 },
};
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 80, damping: 16, delay },
});
const fade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay },
});

/* ============================================
   22 张暗黑电影感 Slides
   1小时线上讲演 · 转化优先
   ============================================ */
function allSlides(setModal: (c: React.ReactNode) => void) {
  return [

    /* ━━━━━━ 第一幕：开场核爆 ━━━━━━ */

    // S1: 封面 — 深黑+发光粒子+巨型文字
    <Slide key="s1" bg="radial-gradient(ellipse at 30% 20%, rgba(34, 214, 101,0.08) 0%, #0A0A0A 50%, #050505 100%)">
      <style>{`
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(34, 214, 101,0.3), 0 0 60px rgba(34, 214, 101,0.1); } 50% { box-shadow: 0 0 40px rgba(34, 214, 101,0.5), 0 0 120px rgba(34, 214, 101,0.2); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .glow-border { animation: pulse-glow 3s ease-in-out infinite; }
        .float-slow { animation: float 6s ease-in-out infinite; }
      `}</style>
      <motion.div {...pop} className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div {...fade(0)} className="inline-flex items-center gap-3 text-red-500 font-mono tracking-[0.3em] uppercase text-xs mb-16 border border-red-500/30 px-5 py-2.5 rounded-full glow-border">
          <Radio size={12} className="animate-pulse" /> LIVE · 正在直播
        </motion.div>
        <motion.h1 {...rise(0.2)} className="text-[7rem] md:text-[12rem] font-black leading-[0.85] tracking-tight mb-8">
          <span style={{ background: "linear-gradient(135deg, #a8f06a 0%, #22d665 40%, #15803d 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI造浪营</span>
        </motion.h1>
        <motion.p {...rise(0.4)} className="text-2xl md:text-3xl text-neutral-500 font-light tracking-wide">
          60分钟 · 看懂AI如何帮你<span className="text-white font-semibold">每年省下百万</span>
        </motion.p>
        <motion.div {...rise(0.6)} className="mt-16 flex items-center justify-center gap-6 text-neutral-600 text-sm font-mono tracking-wider">
          <span>智企实验室</span>
          <span className="w-1 h-1 bg-lime-600 rounded-full"></span>
          <span>企业主专场</span>
        </motion.div>
      </motion.div>
    </Slide>,

    // S2: 定调——为什么叫造浪营
    <Slide key="s2" bg="#080808">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="mb-12">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">THE NAME</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-5xl md:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-12">
          为什么叫<br />
          <span style={{ background: "linear-gradient(90deg, #a8f06a, #22d665)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{"\"造浪营\""}？</span>
        </motion.h2>
        <motion.div {...rise(0.4)} className="border-l-4 border-lime-600 pl-8 max-w-3xl">
          <p className="text-xl md:text-2xl text-neutral-400 leading-[1.8] font-light">
            2026 年的 AI 是一场<span className="text-white font-medium">摧毁旧有商业秩序的滔天巨浪</span>。<br />
            在岸边观望的人，终将被吞噬。
          </p>
          <p className="text-xl md:text-2xl text-neutral-400 leading-[1.8] font-light mt-6">
            我们不卖课。我们帮你<span className="text-lime-500 font-semibold">下场、踩板、造浪</span>。
          </p>
        </motion.div>
      </motion.div>
    </Slide>,

    // S3: 市场乱象——三种骗局 (暗红+警告)
    <Slide key="s3" bg="radial-gradient(ellipse at 70% 80%, rgba(220,38,38,0.06) 0%, #0A0A0A 60%)">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-16">
          <AlertTriangle size={20} className="text-red-500" />
          <span className="text-red-500 font-mono text-xs tracking-[0.5em] uppercase">WARNING</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          90% 的 AI 培训<br />
          <span className="text-red-500">在骗你的钱</span>
        </motion.h2>
        <motion.p {...rise(0.3)} className="text-neutral-500 text-lg mb-14">别再踩坑了</motion.p>
        <div className="grid md:grid-cols-3 gap-6" onClick={() => setModal(caseDetails["chaos_detail"])}>
          {[
            { num: "01", title: "卖课型", desc: "录几十小时视频收你几千块。学完只会跟AI闲聊，业务纹丝不动。", tag: "信息差倒卖", border: "border-red-900/40" },
            { num: "02", title: "卖工具型", desc: "打着培训旗号卖SaaS订阅。教的全是怎么用他的工具，不续费归零。", tag: "工具锁定", border: "border-emerald-900/40" },
            { num: "03", title: "空谈型", desc: "请几个「专家」讲两天PPT。听完热血沸腾，回公司第一步都不知道。", tag: "焦虑贩卖", border: "border-yellow-900/40" },
          ].map((item, i) => (
            <motion.div key={item.num} {...rise(0.3 + i * 0.12)}
              className={`relative p-8 rounded-2xl border ${item.border} bg-white/[0.02] backdrop-blur-sm cursor-pointer hover:bg-white/[0.04] transition-all group`}>
              <div className="text-[4rem] font-black text-white/[0.04] absolute top-4 right-6 group-hover:text-white/[0.08] transition-colors">{item.num}</div>
              <XCircle size={24} className="text-red-500/60 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-5">{item.desc}</p>
              <span className="text-[10px] font-mono text-red-500/60 tracking-[0.3em] uppercase">{item.tag}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S4: 我们凭什么不一样 — 对比表格
    <Slide key="s4" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="mb-12">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">DIFFERENTIATION</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-6xl font-black text-white mb-16 tracking-tight">
          我们<span className="text-lime-500">不一样</span>
        </motion.h2>
        <motion.div {...rise(0.3)} className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="p-6 text-neutral-600 text-xs font-mono tracking-[0.3em] uppercase w-[160px]">维度</th>
                <th className="p-6 text-neutral-600 text-xs font-mono tracking-[0.3em] uppercase">市面AI培训</th>
                <th className="p-6 text-lime-600 text-xs font-mono tracking-[0.3em] uppercase">AI造浪营</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "核心交付", them: "知识/课程", us: "企业级AI应用 — IDE级定制开发" },
                { dim: "落地方式", them: "看视频自学", us: "Live Coding 现场部署 → 当天出活" },
                { dim: "教学团队", them: "自媒体博主", us: "全栈工程师 + 战略咨询 — 既写代码又懂算账" },
                { dim: "长期价值", them: "课程结束=关系结束", us: "专属Agent矩阵 + 知识库 + 管理系统集成" },
                { dim: "ROI", them: "不可衡量", us: "30天回本 — 每年省¥35万+" },
              ].map((row, i) => (
                <tr key={row.dim} className="border-t border-white/[0.04]">
                  <td className="p-6 text-white font-semibold text-sm">{row.dim}</td>
                  <td className="p-6 text-neutral-600 line-through text-sm">{row.them}</td>
                  <td className="p-6 text-lime-400 font-semibold text-sm">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </Slide>,

    // S5: 认知冲击——24个月对比
    <Slide key="s5" bg="radial-gradient(ellipse at 50% 50%, rgba(34, 214, 101,0.04) 0%, #080808 70%)">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="mb-12">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">24 MONTHS AGO vs NOW</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-5xl font-black text-white mb-14 tracking-tight">
          这不是科幻<span className="text-lime-500">。</span>全都已经在用了<span className="text-lime-500">。</span>
        </motion.h2>
        <div className="space-y-6">
          {[
            { before: "AI只能帮你写文章", after: "AI可以操控你的电脑，自主完成完整工作流", icon: Cpu },
            { before: "做一张海报需要设计师2天", after: "描述一句话，10秒生成商用级海报+视频", icon: Eye },
            { before: "客服7×24需要18人三班倒", after: "1个AI Bot + 2个人工 = 一样的服务质量", icon: Bot },
            { before: "新员工培训周期3个月", after: "AI知识库+实时导师，上岗时间缩短60%", icon: Users },
          ].map((item, i) => (
            <motion.div key={i} {...rise(0.2 + i * 0.1)}
              className="flex items-start gap-6 p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <item.icon size={20} className="text-lime-600 mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-neutral-600 line-through text-sm mb-2">{item.before}</p>
                <p className="text-white font-medium">{item.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S5.5: Agent 架构革命——从单兵到军团
    <Slide key="s_agent" bg="radial-gradient(ellipse at 60% 30%, rgba(34, 214, 101,0.06) 0%, #080808 60%)">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-12">
          <Network size={20} className="text-lime-600" />
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">AGENT ARCHITECTURE</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          {"从\"你问我答\""}<br />
          {"到"}<span style={{ background: "linear-gradient(135deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>一支自主作战的数字军团</span>
        </motion.h2>
        <motion.p {...rise(0.3)} className="text-neutral-500 text-lg mb-12">2026年AI最大的跃迁不是更聪明——是学会了<span className="text-white font-semibold">多Agent协作</span></motion.p>
        <div className="grid md:grid-cols-3 gap-6" onClick={() => setModal(caseDetails["agent_arch"])}>
          {[
            { title: "Hermes Agent", sub: "自进化型私人AI", desc: "完成任务后自动提炼经验，用得越多越懂你的业务", icon: Brain, border: "border-white/[0.06]" },
            { title: "Claude Managed Agent", sub: "企业级托管团队", desc: "无需搭建基础设施，一键部署自主决策的AI团队", icon: Workflow, border: "border-lime-600/20" },
            { title: "Subagent 并行", sub: "任务自动拆解+并行", desc: "5个Subagent同时执行，3天的工作量压缩到3分钟", icon: Zap, border: "border-white/[0.06]" },
          ].map((item, i) => (
            <motion.div key={item.title} {...rise(0.3 + i * 0.12)}
              className={`relative p-8 rounded-2xl border ${item.border} bg-white/[0.02] backdrop-blur-sm cursor-pointer hover:bg-white/[0.04] transition-all group`}>
              <item.icon size={24} className="text-lime-600/60 mb-5 group-hover:text-lime-500 transition-colors" />
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-lime-500/80 text-xs font-mono tracking-wider mb-4">{item.sub}</p>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...rise(0.7)} className="text-center text-neutral-600 text-sm mt-10">
          点击卡片查看详细解读
        </motion.p>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第二幕：数字核弹 ━━━━━━ */

    // S6: 巨型数字冲击
    <Slide key="s6" bg="#050505">
      <motion.div {...pop} className="max-w-6xl mx-auto text-center">
        <motion.div {...rise(0.1)} className="mb-16">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">THE NUMBERS DON{"'"}T LIE</span>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: "88%", label: "高管确认AI带来营收增长", src: "NVIDIA 2026", icon: TrendingUp },
            { num: "40%", label: "CEO报告年营收增长超10%", src: "McKinsey", icon: DollarSign },
            { num: "70%", label: "用AI后人力成本直降", src: "中国企业案例", icon: Users },
            { num: "18", label: "个月——留给你的窗口期", src: "行业共识", icon: AlertTriangle },
          ].map((item, i) => (
            <motion.div key={item.num} {...rise(0.2 + i * 0.1)}
              className="relative p-8 rounded-2xl border border-white/[0.04] bg-white/[0.01] overflow-hidden group cursor-pointer hover:border-lime-900/30 transition-all"
              onClick={() => { if (caseDetails[item.src === "NVIDIA 2026" ? "nvidia" : "window"]) setModal(caseDetails[item.src === "NVIDIA 2026" ? "nvidia" : "window"]); }}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-lime-600/[0.03] rounded-full blur-3xl group-hover:bg-lime-600/[0.08] transition-all"></div>
              <item.icon size={20} className="text-lime-600/60 mb-6" />
              <div className="text-5xl md:text-6xl font-black text-white mb-3" style={{ background: "linear-gradient(180deg, #FFF 0%, #666 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{item.num}{item.num === "18" ? "" : ""}</div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-3">{item.label}</p>
              <span className="text-[10px] font-mono text-neutral-700 tracking-wider">{item.src}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S7: 效率对比——巨型倍率
    <Slide key="s7" bg="#080808">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.h2 {...rise(0.1)} className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tight text-center">
          同样的工作<span className="text-lime-500">，</span>效率差多少<span className="text-lime-500">？</span>
        </motion.h2>
        {[
          { task: "100篇多平台营销文案", old: "15人天", ai: "0.25人天", ratio: "60×" },
          { task: "500条客户咨询处理", old: "8人一天", ai: "AI自动+人兜底", ratio: "8×" },
          { task: "10套产品宣发设计", old: "设计师5天", ai: "AI批量2小时", ratio: "20×" },
        ].map((item, i) => (
          <motion.div key={item.task} {...rise(0.2 + i * 0.1)}
            className="grid grid-cols-[1fr_140px_160px_100px] gap-4 items-center py-6 border-b border-white/[0.04]">
            <span className="text-white font-medium text-lg">{item.task}</span>
            <span className="text-neutral-600 line-through text-sm text-center font-mono">{item.old}</span>
            <span className="text-emerald-400 text-sm text-center font-mono font-semibold">{item.ai}</span>
            <span className="text-4xl font-black text-center" style={{ background: "linear-gradient(180deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{item.ratio}</span>
          </motion.div>
        ))}
        <motion.p {...rise(0.6)} className="text-center text-lime-600 font-semibold text-lg mt-12">
          你的竞对已经在用了。你还在等什么？
        </motion.p>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第三幕：三大案例深度拆解 ━━━━━━ */

    // S8: 章节页——三大案例
    <Slide key="s8" bg="radial-gradient(ellipse at 50% 50%, rgba(34, 214, 101,0.06) 0%, #050505 60%)">
      <motion.div {...pop} className="text-center max-w-4xl mx-auto">
        <motion.div {...rise(0.1)} className="mb-12">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">REAL CASES</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-5xl md:text-[7rem] font-black text-white leading-[0.9] tracking-tight mb-8">
          三个<br />
          <span style={{ background: "linear-gradient(135deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>真实案例</span>
        </motion.h2>
        <motion.p {...rise(0.4)} className="text-xl text-neutral-500 font-light">
          不是PPT上的远景——是已经帮企业省到真金白银的事实
        </motion.p>
      </motion.div>
    </Slide>,

    // S9: 案例① PYXL 超级数据分析
    <Slide key="s_case1" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-lime-600/10 flex items-center justify-center">
            <BarChart3 size={24} className="text-lime-500" />
          </div>
          <div>
            <span className="text-lime-600 font-mono text-xs tracking-[0.3em] uppercase block">CASE 01</span>
            <span className="text-white font-bold text-lg">PYXL · 超级数据分析</span>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 cursor-pointer" onClick={() => setModal(caseDetails["pyxl"])}>
          <motion.div {...rise(0.2)}>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8 tracking-tight">
              10万行数据<br />
              <span className="text-lime-500">3分钟出洞察</span>
            </h3>
            <div className="space-y-5 text-neutral-400 leading-relaxed">
              <p>📊 <span className="text-white font-medium">痛点：</span>老板拍脑袋、市场部凭感觉。海量销售数据、客户反馈、渠道ROI散落在20个Excel里，没人能3天内整理出有用的结论。</p>
              <p>🤖 <span className="text-white font-medium">AI怎么做：</span>PYXL一键导入全量数据，自动识别维度、清洗异常值，用自然语言提问即可获得交叉分析、趋势预测和可视化图表。</p>
              <p>💰 <span className="text-white font-medium">结果：</span>某消费品公司用AI分析3年销售数据，发现了一个被忽略的高利润品类组合，季度利润<span className="text-lime-400 font-bold">增长23%</span>。</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.4)} className="flex flex-col justify-center gap-6">
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-600 text-sm">传统方式</span>
                <span className="text-neutral-600 line-through font-mono">3人 × 5天 = 15人天</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-emerald-400 text-sm">AI分析</span>
                <span className="text-emerald-400 font-mono font-bold">3 分钟</span>
              </div>
              <div className="border-t border-white/[0.06] pt-4 text-center">
                <span className="text-5xl font-black" style={{ background: "linear-gradient(180deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>7200×</span>
                <p className="text-neutral-600 text-xs mt-2 font-mono tracking-wider">EFFICIENCY MULTIPLIER</p>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-lime-600/[0.06] border border-lime-600/20">
              <p className="text-lime-400 text-sm font-semibold">★ 核心逻辑：数据不值钱，<span className="text-white">洞察</span>才值钱。AI把你埋在Excel里的金矿挖出来。</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // S10: 案例② AI模特+产品生图
    <Slide key="s_case2" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-lime-600/10 flex items-center justify-center">
            <Image size={24} className="text-lime-500" />
          </div>
          <div>
            <span className="text-lime-600 font-mono text-xs tracking-[0.3em] uppercase block">CASE 02</span>
            <span className="text-white font-bold text-lg">AI模特 · 产品生图</span>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 cursor-pointer" onClick={() => setModal(caseDetails["ai_model"])}>
          <motion.div {...rise(0.2)} className="flex flex-col justify-center gap-6">
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h4 className="text-white font-bold mb-6 flex items-center gap-2"><DollarSign size={18} className="text-red-400" /> 传统拍一套产品图要花多少？</h4>
              <div className="space-y-3 text-sm">
                {[
                  { item: "模特费", cost: "¥3,000-8,000/天" },
                  { item: "摄影师+棚", cost: "¥5,000-15,000" },
                  { item: "后期精修", cost: "¥2,000-5,000" },
                  { item: "周期", cost: "7-14 天" },
                ].map(r => (
                  <div key={r.item} className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-neutral-500">{r.item}</span>
                    <span className="text-red-400/70 line-through font-mono">{r.cost}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="text-white font-bold">总计</span>
                  <span className="text-red-400 font-bold font-mono">¥10,000-28,000</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-emerald-600/[0.06] border border-emerald-600/20 text-center">
              <p className="text-emerald-400 text-xs font-mono tracking-wider mb-2">AI 生图成本</p>
              <p className="text-4xl font-black text-white">¥0<span className="text-lg text-neutral-500 font-normal ml-2">/ 套</span></p>
              <p className="text-neutral-500 text-xs mt-2">一张白底产品图 → 无限风格、无限姿势、无限场景</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.3)}>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8 tracking-tight">
              一张白底图<br />
              <span className="text-lime-500">AI生成全套大片</span>
            </h3>
            <div className="space-y-5 text-neutral-400 leading-relaxed">
              <p>📱 <span className="text-white font-medium">痛点：</span>每季上新50个SKU，每个要拍6组场景图。摄影+模特+后期= 天文数字的成本和永远赶不上的进度。</p>
              <p>🤖 <span className="text-white font-medium">AI怎么做：</span>上传产品白底图→AI自动匹配模特体型/肤色/姿势→生成INS风、街拍风、电商白底全场景→一键出图100张。</p>
              <p>💡 <span className="text-white font-medium">额外收益：</span>A/B测试不同风格图的点击率——以前不敢做，现在成本为零，随便测。<span className="text-lime-400 font-bold">转化率平均提升35%</span>。</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // S11: 案例③ 小红书爆款AI筛选+二创
    <Slide key="s_case3" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-lime-600/10 flex items-center justify-center">
            <ShoppingBag size={24} className="text-lime-500" />
          </div>
          <div>
            <span className="text-lime-600 font-mono text-xs tracking-[0.3em] uppercase block">CASE 03</span>
            <span className="text-white font-bold text-lg">小红书 · 爆款筛选+二创</span>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 cursor-pointer" onClick={() => setModal(caseDetails["xiaohongshu"])}>
          <motion.div {...rise(0.2)}>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8 tracking-tight">
              AI选品+AI文案<br />
              <span className="text-lime-500">+AI海报</span><br />
              全自动二创流水线
            </h3>
            <div className="space-y-5 text-neutral-400 leading-relaxed">
              <p>🔍 <span className="text-white font-medium">选品：</span>AI实时抓取小红书全品类热门笔记，按互动量/增长率/竞争度三维评分，10分钟筛出下一个爆品。</p>
              <p>✍️ <span className="text-white font-medium">文案：</span>分析TOP100爆文的标题+正文结构，AI自动生成「小红书体」文案——emoji密度、分段节奏、种草话术一键到位。</p>
              <p>🎨 <span className="text-white font-medium">海报：</span>AI根据产品图+文案自动生成小红书风格封面图，多尺寸多风格批量出图。</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.4)} className="flex flex-col justify-center gap-6">
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h4 className="text-white font-bold mb-6">传统 vs AI 二创效率</h4>
              {[
                { step: "选品调研", old: "2天", ai: "10分钟" },
                { step: "文案撰写", old: "3小时/篇", ai: "30秒/篇" },
                { step: "海报设计", old: "设计师半天", ai: "AI 10秒" },
                { step: "矩阵分发", old: "手动1天", ai: "自动5分钟" },
              ].map(r => (
                <div key={r.step} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-white/[0.04] text-sm">
                  <span className="text-neutral-400">{r.step}</span>
                  <span className="text-neutral-600 line-through text-center font-mono">{r.old}</span>
                  <span className="text-emerald-400 text-center font-mono font-semibold">{r.ai}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-xl bg-lime-600/[0.06] border border-lime-600/20">
              <p className="text-lime-400 text-sm font-semibold">★ 某美妆团队：3人用AI矩阵运营50个小红书号，月均笔记产出<span className="text-white">2000+条</span>，获客成本<span className="text-white">降低72%</span>。</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第四幕：消除恐惧 ━━━━━━ */

    // S12: 用AI vs 不用AI
    <Slide key="s12" bg="radial-gradient(ellipse at 30% 70%, rgba(34,197,94,0.04) 0%, #080808 50%, rgba(220,38,38,0.04) 100%)">
      <motion.div {...pop} className="max-w-5xl mx-auto">
        <motion.h2 {...rise(0.1)} className="text-4xl md:text-5xl font-black text-white mb-14 tracking-tight text-center">
          两种未来<span className="text-lime-500">，</span>你选哪个<span className="text-lime-500">？</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...rise(0.2)} className="p-8 rounded-2xl border border-emerald-900/30 bg-emerald-950/10">
            <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-3"><CheckCircle2 size={20} /> 拥抱AI</h3>
            <ul className="space-y-4">
              {["1个运营 = 以前5个人的产出", "获客成本降低40-60%", "客户响应 24h→3min", "产品迭代 3个月→2周", "7×24全自动销售+客服"].map(t => (
                <li key={t} className="flex items-start gap-3 text-neutral-400 text-sm"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...rise(0.3)} className="p-8 rounded-2xl border border-red-900/30 bg-red-950/10">
            <h3 className="text-lg font-bold text-red-400 mb-6 flex items-center gap-3"><XCircle size={20} /> 继续观望</h3>
            <ul className="space-y-4">
              {["人力年年涨，效率原地踏步", "客户流失率持续攀升", "竞对投文量是你的10倍", "招不到人、留不住人", "每天都在多花不必要的钱"].map(t => (
                <li key={t} className="flex items-start gap-3 text-neutral-400 text-sm"><XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // S13: 真正的卡点——巨型文字
    <Slide key="s13" bg="#050505">
      <motion.div {...pop} className="max-w-5xl mx-auto pl-8">
        <motion.div {...rise(0.1)} className="mb-8">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">THE REAL PROBLEM</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-5xl md:text-[6rem] font-black text-white leading-[1.05] tracking-tight">
          老板有意识<span className="text-lime-500">，</span>
        </motion.h2>
        <motion.h2 {...rise(0.4)} className="text-5xl md:text-[6rem] font-black leading-[1.05] tracking-tight" style={{ background: "linear-gradient(135deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          员工没跟上。
        </motion.h2>
      </motion.div>
    </Slide>,

    // S14: 员工三层抗拒
    <Slide key="s14" bg="#080808">
      <motion.div {...pop} className="max-w-5xl mx-auto">
        <motion.h2 {...rise(0.1)} className="text-3xl md:text-4xl font-black text-white mb-12 tracking-tight text-center">
          员工抗拒AI的<span className="text-lime-500 cursor-pointer" onClick={() => setModal(caseDetails["employee_boss"])}>三层心理</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "认知层", sub: "不知道用什么", points: ["工具太多，眼花缭乱", "觉得AI是程序员的事"], color: "lime" },
            { icon: Target, title: "能力层", sub: "知道好但不会", points: ["Prompt写不好", "试一次放弃了"], color: "emerald" },
            { icon: Users, title: "心理层", sub: "不愿意用", points: ["怕被AI替代", "怕暴露效率低"], color: "red" },
          ].map((item, i) => (
            <motion.div key={item.title} {...rise(0.2 + i * 0.12)}
              className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <item.icon size={28} className={`text-${item.color}-500 mb-5`} />
              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
              <p className="text-neutral-500 text-sm mb-5">{item.sub}</p>
              <ul className="space-y-3">
                {item.points.map(p => (
                  <li key={p} className="text-neutral-500 text-sm flex gap-2"><span className="text-neutral-700">·</span>{p}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S15: AI是放大器——巨型宣言
    <Slide key="s15" bg="radial-gradient(ellipse at 50% 40%, rgba(34, 214, 101,0.08) 0%, #050505 60%)">
      <motion.div {...pop} className="text-center max-w-4xl mx-auto">
        <motion.h2 {...rise(0.1)} className="text-5xl md:text-[5rem] font-black text-white leading-[1.1] tracking-tight mb-10">
          AI不是来<span className="text-red-500">替代</span>人的<br />
          是来<span style={{ background: "linear-gradient(135deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>放大</span>人的
        </motion.h2>
        <motion.div {...rise(0.3)} className="inline-block border-t border-b border-white/[0.06] py-6 px-12">
          <p className="text-2xl md:text-3xl font-black" style={{ background: "linear-gradient(90deg, #a8f06a 0%, #22d665 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            碳基大脑 × 硅基算力 = 超级个体
          </p>
        </motion.div>
        <motion.p {...rise(0.5)} className="text-lg text-neutral-500 leading-relaxed mt-10 max-w-2xl mx-auto">
          一个5人团队 + AI = <span className="text-white font-semibold">50人的产能</span>
        </motion.p>
      </motion.div>
    </Slide>,

    // S15.5: 硅基军团——Agent协作实战
    <Slide key="s_silicon" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-lime-600/10 flex items-center justify-center">
            <Network size={24} className="text-lime-500" />
          </div>
          <div>
            <span className="text-lime-600 font-mono text-xs tracking-[0.3em] uppercase block">SILICON ARMY</span>
            <span className="text-white font-bold text-lg">{"你的企业也能拥有一支\"硅基军团\""}</span>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 cursor-pointer" onClick={() => setModal(caseDetails["silicon_army"])}>
          <motion.div {...rise(0.2)}>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8 tracking-tight">
              一个指令下去<br />
              <span className="text-lime-500">5个Agent并行</span><br />
              3分钟交付
            </h3>
            <div className="space-y-5 text-neutral-400 leading-relaxed">
              <p>{"🎯 "}<span className="text-white font-medium">{"指挥中枢："}</span>{"你说\"帮我上架新品到8国\"——Orchestrator自动拆解成选品、文案、生图、定价、客服5个子任务。"}</p>
              <p>{"🤖 "}<span className="text-white font-medium">{"并行执行："}</span>{"5个专业Subagent同时开工。Hermes做调研、Claude写6国文案、视觉Agent批量出图——"}<span className="text-lime-400 font-bold">全程无需人工</span>{"。"}</p>
              <p>{"✅ "}<span className="text-white font-medium">{"汇整交付："}</span>{"3分钟后收到完整上架包，直接可用。"}</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.4)} className="flex flex-col justify-center gap-6">
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h4 className="text-white font-bold mb-6">传统团队 vs 硅基军团</h4>
              {[
                { role: "选品调研", old: "运营3天", ai: "Hermes 10分钟" },
                { role: "多语言文案", old: "翻译团队5天", ai: "Claude 2分钟" },
                { role: "产品图", old: "设计师3天", ai: "Subagent 5分钟" },
                { role: "客服配置", old: "培训2周", ai: "知识库1小时" },
              ].map(r => (
                <div key={r.role} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-white/[0.04] text-sm">
                  <span className="text-neutral-400">{r.role}</span>
                  <span className="text-neutral-600 line-through text-center font-mono">{r.old}</span>
                  <span className="text-emerald-400 text-center font-mono font-semibold">{r.ai}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-xl bg-lime-600/[0.06] border border-lime-600/20">
              <p className="text-lime-400 text-sm font-semibold">{"★ 某跨境团队实战："}<span className="text-white">3人 + Agent军团</span>{"管理8国站点，月GMV超200万，人力成本仅为传统的"}<span className="text-white">4.4%</span>{"。"}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第五幕：服务+路线图 ━━━━━━ */

    // S16: 四大交付物
    <Slide key="s16" bg="#060606">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="mb-12">
          <span className="text-lime-600 font-mono text-xs tracking-[0.5em] uppercase">WHAT WE DELIVER</span>
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-3xl md:text-4xl font-black text-white mb-12 tracking-tight">
          我们帮企业打造的<span className="text-lime-500">AI基建</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Code2, num: "01", title: "企业级AI工具定制开发", desc: "IDE级编程，按你的业务逻辑量身打造。不是SaaS套模板，是你独有的数字武器。" },
            { icon: Users, num: "02", title: "百位专家Agent矩阵", desc: "100+个AI Agent覆盖全岗位。销售/法务/采购/运营/客服，7×24不休不走。" },
            { icon: Database, num: "03", title: "企业知识库", desc: "散落在微信群、飞书文档里的知识全部注入AI大脑。新人=十年老员工。私有部署。" },
            { icon: MessageSquare, num: "04", title: "飞书/钉钉/企微集成", desc: "CLI一键接入。不换系统、不培训。零学习成本，当天部署当天用。" },
          ].map((item, i) => (
            <motion.div key={item.num} {...rise(0.2 + i * 0.1)}
              className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-lime-900/30 transition-all group">
              <div className="flex items-center gap-4 mb-5">
                <item.icon size={20} className="text-lime-600/60 group-hover:text-lime-500 transition-colors" />
                <span className="text-xs font-mono text-lime-600/40 tracking-wider">{item.num}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    // S17: 路线图
    <Slide key="s17" bg="#080808">
      <motion.div {...pop} className="max-w-4xl mx-auto w-full">
        <motion.h2 {...rise(0.1)} className="text-3xl md:text-4xl font-black text-white mb-14 tracking-tight text-center">
          你不需要懂AI<span className="text-lime-500">。</span>你需要<span className="text-lime-500">一张路线图。</span>
        </motion.h2>
        <div className="space-y-8">
          {[
            { week: "W1", title: "诊断", desc: "免费AI体检，找出3个最值得改造的岗位", active: true },
            { week: "W2", title: "试点", desc: "选一个岗位先上AI，让全公司看到真实ROI", active: false },
            { week: "W3", title: "推广", desc: "发布公司级AI规范，工具权限发到每一个人", active: false },
          ].map((step, i) => (
            <motion.div key={step.week} {...rise(0.2 + i * 0.1)}
              className={`flex items-start gap-8 p-8 rounded-2xl border ${step.active ? "border-lime-600/30 bg-lime-600/[0.04]" : "border-white/[0.04] bg-white/[0.01]"}`}>
              <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold font-mono ${step.active ? "bg-lime-600 text-black" : "border border-white/[0.1] text-neutral-600"}`}>{step.week}</div>
              <div>
                <h4 className="font-bold text-white text-xl mb-2">{step.title}</h4>
                <p className="text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Slide>,

    /* ━━━━━━ 第六幕：转化核弹 ━━━━━━ */

    // S18: 金句——全屏暗黑
    <Slide key="s18" bg="radial-gradient(ellipse at 50% 50%, rgba(34, 214, 101,0.05) 0%, #050505 60%)">
      <motion.div {...pop} className="text-center max-w-3xl mx-auto">
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-[3.5rem] font-black text-white leading-[1.3] tracking-tight">
          {"\"AI不会淘汰任何人"}<br />
          但<span style={{ background: "linear-gradient(90deg, #a8f06a, #22d665)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>会用AI的人</span><br />
          {"会淘汰不会用的人\""}
        </motion.h2>
        <motion.p {...rise(0.5)} className="text-neutral-600 text-lg mt-12 font-light">
          这句话送给屏幕前的每一位企业主
        </motion.p>
      </motion.div>
    </Slide>,

    // S19: CTA——行动号召 (最强转化)
    <Slide key="s_cta" bg="radial-gradient(ellipse at 50% 80%, rgba(34, 214, 101,0.1) 0%, #080808 60%)">
      <motion.div {...pop} className="max-w-5xl mx-auto w-full">
        <motion.div {...rise(0.1)} className="text-center mb-12">
          <span className="text-red-500 font-mono text-xs tracking-[0.5em] uppercase animate-pulse">⚡ LIMITED · 仅限今日直播</span>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...rise(0.2)} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              扫码<span className="text-lime-500">行动</span>
            </h2>
            <div className="p-8 rounded-2xl border border-lime-600/30 bg-lime-600/[0.04]">
              <h3 className="text-xl font-bold text-white mb-5">🔥 直播专属三重福利</h3>
              <ul className="space-y-4">
                {[
                  { title: "企业AI诊断报告", desc: "免费体检你的利润出血点" },
                  { title: "6套AI工具包", desc: "获客/销售/客服/运营开箱即用" },
                  { title: "线下实战营优先名额", desc: "2天沉浸式，现场搭建AI系统" },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-sm">{item.title}</span>
                      <span className="text-neutral-500 text-sm ml-2">— {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-red-950/30 border border-red-900/30 flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
              <p className="text-neutral-400 text-sm">每期仅限<span className="text-white font-bold">15位</span>企业主。扫码即锁位，先到先得。</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.4)} className="text-center">
            <div className="inline-block p-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <img src="/qr-wechat.jpg" alt="微信" className="w-52 h-52 object-contain mx-auto mb-6 rounded-xl" />
              <p className="text-white font-bold text-lg mb-1">扫码加微信</p>
              <p className="text-neutral-600 text-sm">备注「AI造浪」优先通过</p>
            </div>
            <motion.div {...fade(0.8)} className="mt-6 flex items-center justify-center gap-2 text-lime-600 font-mono text-sm tracking-wider">
              <Clock size={14} className="animate-pulse" /> 福利倒计时 · 直播结束即关闭
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Slide>,

    // S20: Q&A
    <Slide key="s_final" bg="radial-gradient(ellipse at 50% 30%, rgba(34, 214, 101,0.06) 0%, #050505 60%)">
      <motion.div {...pop} className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.div {...rise(0.1)}>
          <MessageSquare size={40} className="mx-auto mb-10 text-lime-600/40" />
        </motion.div>
        <motion.h2 {...rise(0.2)} className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
          聊聊<span className="text-lime-500">你的困惑</span>
        </motion.h2>
        <motion.p {...rise(0.4)} className="text-lg text-neutral-500 leading-relaxed mb-12 font-light">
          哪一点最打动你？最大的顾虑是什么？<br />
          评论区打出来，我们现场解答。
        </motion.p>
        <motion.div {...rise(0.6)} className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.06] text-neutral-600 text-sm font-mono tracking-wider">
          <Clock size={14} /> Q&A TIME
        </motion.div>
      </motion.div>
    </Slide>,
  ];
}

/* ============================================
   页面组件
   ============================================ */
export default function WebinarSlides() {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  return (
    <div className="bg-black relative w-screen h-screen overflow-hidden">
      <motion.div
        animate={{
          scale: modalContent ? 0.96 : 1,
          filter: modalContent ? "blur(16px)" : "blur(0px)",
          opacity: modalContent ? 0.4 : 1,
        }}
        transition={{ type: "spring" as const, damping: 25, stiffness: 150 }}
        className="origin-center w-full h-full"
      >
        <SlideEngine
          slides={allSlides(setModalContent)}
          title="AI造浪营"
          subtitle="LIVE WEBINAR"
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
