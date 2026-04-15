"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Lock, ArrowLeft, ArrowRight, ArrowUpRight, Search, X,
  Target, MessageSquare, FlaskConical, BarChart3, Building2, Headphones,
  Users, Shield, Zap, Database, Globe,
  Activity, TrendingUp, Compass, Flame, Lock as LockIcon,
  Mail, GitBranch as Github,
} from "lucide-react";
import Link from "next/link";

/* ───────── Aila Tools Data ───────── */
const tools = [
  { icon: Target, title: "获客中心", sub: "MARKETING", desc: "批量 AI 海报 · 短视频脚本 · 全平台文案矩阵 · 素材编辑", tags: ["批量海报","短视频","文案矩阵","素材编辑"], stat: "28", statLabel: "Active Campaigns", color: "bg-amber-500/10", iconColor: "text-amber-500", borderHover: "hover:border-amber-500/50", detail: "接入阿里云 Wanx-v1 万相生图引擎，单次生成 4 张商用级海报。支持从产品图自动生成短视频脚本和全平台（抖音/小红书/公众号）分发文案。" },
  { icon: MessageSquare, title: "销售助手", sub: "SALES", desc: "实时对话分析 · 话术提示 · 智能回访策略 · 灵感追问", tags: ["实时对话","话术提示","智能回访","灵感追问"], stat: "154", statLabel: "Open Deals", color: "bg-blue-500/10", iconColor: "text-blue-400", borderHover: "hover:border-blue-400/50", detail: "销售员通话/聊天时，Agent 实时分析对话内容，推送最优话术建议。自动生成回访任务并按客户意向度排序。" },
  { icon: FlaskConical, title: "研发工坊", sub: "R&D", desc: "AI 头脑风暴 · 快速原型验证 · 市场趋势研判 · 资产盘点", tags: ["头脑风暴","快速原型","市场研判","资产盘点"], stat: "42", statLabel: "Research Projects", color: "bg-purple-500/10", iconColor: "text-purple-400", borderHover: "hover:border-purple-400/50", detail: "将模糊需求输入后，Agent 自动拆解为可执行方案，进行竞品分析和市场容量估算。" },
  { icon: BarChart3, title: "老板仪表盘", sub: "DASHBOARD", desc: "智能日报周报 · 回访进度追踪 · 成交数据分析", tags: ["智能仪表盘","AI 报告","回访追踪","成交分析"], stat: "89%", statLabel: "Active Campaigns", color: "bg-emerald-500/10", iconColor: "text-emerald-400", borderHover: "hover:border-emerald-400/50", detail: "每天早晨自动汇总前日全部门关键指标，生成结构化日报推送至企业微信群。" },
  { icon: Building2, title: "行政效率", sub: "ADMIN", desc: "合同文档助手 · 会议纪要 · 排班优化 · 流程自动化", tags: ["合同助手","会议纪要","排班优化","流程诊断"], stat: "350", statLabel: "Users", color: "bg-sky-500/10", iconColor: "text-sky-400", borderHover: "hover:border-sky-400/50", detail: "上传合同扫描件后自动提取关键条款并标注风险点。录音自动转文字并生成结构化纪要。" },
  { icon: Headphones, title: "智能客服", sub: "SERVICE", desc: "客服配置 · 回访话术 · 舆情监控 · 客户之声分析", tags: ["智能客服","回访话术","舆情监控","客户之声"], stat: "19", statLabel: "Active Tickets", color: "bg-rose-500/10", iconColor: "text-rose-400", borderHover: "hover:border-rose-400/50", detail: "自动接管售后常见问题。实时监控全网舆情，负面评论 30 秒内预警。" },
];

/* ───────── Code Gate ───────── */
function CodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === "2026") { onUnlock(); setError(false); } else { setError(true); }
  };
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors uppercase tracking-wide font-mono"><ArrowLeft size={14} /> 返回主页</Link>
        <div className="w-16 h-16 mx-auto bg-white/5 border border-neutral-800 rounded-2xl flex items-center justify-center"><Lock className="w-8 h-8 text-neutral-400" /></div>
        <h1 className="text-4xl font-black text-white tracking-tight">Toni Studio</h1>
        <p className="text-neutral-500 font-mono text-sm">输入访问码查看完整作品集</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setError(false); }} placeholder="访问码" maxLength={6} className={`w-full text-center text-2xl font-mono font-bold tracking-[0.5em] px-6 py-4 rounded-xl border-2 bg-black outline-none transition-colors ${error ? 'border-red-500 text-red-400' : 'border-neutral-800 focus:border-white text-white'}`} />
          {error && <p className="text-red-400 text-sm font-mono">访问码错误</p>}
          <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">进入作品集 <ArrowRight size={16} /></button>
        </form>
      </motion.div>
    </div>
  );
}

/* ───────── Interactive Tool Panel ───────── */
function ToolPanel() {
  const [activeId, setActiveId] = useState<number | null>(null);
  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-[#0c0f14] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80 bg-[#0a0d12]">
        <span className="text-white font-bold text-sm">Super Center.</span>
        <span className="text-[10px] font-mono text-neutral-600">toni.asia · 邀请码 2026</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {tools.map((t, i) => (
          <motion.div key={t.sub} onClick={() => setActiveId(activeId === i ? null : i)}
            className={`relative bg-[#f5f3ef] rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${activeId === i ? 'border-[#D97706] shadow-lg' : 'border-transparent ' + t.borderHover}`}
            whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center mb-3`}><t.icon className={`w-4 h-4 ${t.iconColor}`} /></div>
            <h4 className="text-[#2D2A26] font-black text-base mb-0.5">{t.title}</h4>
            <span className="text-[#9E9B96] font-mono text-[9px] tracking-[0.15em] block mb-2">{t.sub}</span>
            <p className="text-[#9E9B96] text-[10px] leading-relaxed mb-3 line-clamp-2">{t.desc}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {t.tags.map(tag => (<span key={tag} className={`text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${activeId === i ? 'bg-[#D97706] text-white border-[#D97706]' : 'border-[#E5E1D8] text-[#9E9B96]'} transition-colors`}>{tag}</span>))}
            </div>
            <div className="flex items-end gap-2 border-t border-[#E5E1D8] pt-2">
              <span className="text-[#2D2A26] font-black text-lg leading-none">{t.stat}</span>
              <span className="text-[#9E9B96] text-[9px] font-mono">{t.statLabel}</span>
            </div>
            <AnimatePresence>{activeId === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><div className="mt-3 pt-3 border-t border-[#E5E1D8]"><p className="text-[#555] text-[10px] leading-relaxed">{t.detail}</p></div></motion.div>)}</AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Portfolio Content ───────── */
function PortfolioContent() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-neutral-800 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-sm font-black bg-white text-black rounded-lg">T</div>
          <span className="text-sm font-bold tracking-wide text-white uppercase">Toni Studio</span>
        </Link>
        <div className="flex items-center gap-6 text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <a href="#aila" className="hover:text-white transition-colors">Aila</a>
          <a href="#antios" className="hover:text-white transition-colors">Antios</a>
          <a href="#quant" className="hover:text-white transition-colors">QuantMAx</a>
          <a href="#contact" className="hover:text-white transition-colors">联系</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-6 max-w-3xl">
          <p className="text-xs font-mono text-neutral-500 tracking-[0.3em] uppercase">Agent Architecture × Cross-Domain Engineering</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">Toni Studio.</h1>
          <p className="text-base text-neutral-400 font-mono max-w-2xl mx-auto leading-relaxed">一个跨界工程团队。同时掌握 iOS 原生开发、企业级全链路 Agent 部署与 A 股分钟级量化策略工程。</p>
        </motion.div>
      </section>

      {/* ======== AILA ======== */}
      <section id="aila" className="min-h-screen p-8 lg:p-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full"><span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" /><span className="text-xs font-mono text-neutral-400">B 端企业全链路 Agent 工具矩阵</span></div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">aila.</h2>
            <h3 className="text-xl font-mono text-[#00ffcc] tracking-widest">类 Bloomberg 的企业定制化 Agent 中枢</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">Aila 将获客、销售、研发、行政、客服 6 条业务线的核心操作全部收编到一个统一的 Agent 控制台中。直连阿里云 DashScope 的 Qwen-Plus 推理引擎和 Wanx-v1 生图引擎。<strong className="text-neutral-300">点击右侧卡片查看每个工具的详细能力。</strong></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}><ToolPanel /></motion.div>
        </div>
        {/* Aila 商业 */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{v:"¥3-8万",t:"单客户年费",d:"按模块计价。6 工具全开约 8 万/年。"},{v:"<2 周",t:"部署周期",d:"无需驻场实施。注册即用。"},{v:"~0",t:"边际复制成本",d:"新签同行业客户只需调参数库。"}].map(c=>(
            <div key={c.t} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#00ffcc] transition-colors"><span className="text-[#00ffcc] font-mono text-3xl block mb-4">{c.v}</span><h4 className="text-white font-bold text-lg mb-2">{c.t}</h4><p className="text-neutral-500 font-mono text-sm">{c.d}</p></div>
          ))}
        </div>
      </section>

      {/* ======== ANTIOS ======== */}
      <section id="antios" className="min-h-screen p-8 lg:p-16 border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-16 items-center">
          <div className="flex-1 flex justify-center"><div className="relative w-[280px] h-[560px] rounded-[3rem] border-[6px] border-neutral-900 bg-black shadow-2xl overflow-hidden flex items-center justify-center"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-neutral-900 rounded-full z-20" /><div className="text-center space-y-6 px-8"><div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-neutral-800 flex items-center justify-center"><Shield className="w-10 h-10 text-white/60" /></div><p className="text-white font-bold text-lg">AntiOS</p><p className="text-neutral-500 font-mono text-[10px] leading-relaxed">Health Agent Runtime<br/>Apple Watch → HRV → arousal_load<br/>→ Bayesian Inference → Action</p><div className="flex justify-center gap-2 mt-4">{["HRV","Sleep","Recovery"].map(s=>(<span key={s} className="text-[8px] px-2 py-1 rounded-full border border-neutral-800 text-neutral-500 font-mono">{s}</span>))}</div></div></div></div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span className="text-xs font-mono text-neutral-400">iOS 原生健康 Agent 平台</span></div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">antios.</h2>
            <h3 className="text-xl font-mono text-white tracking-widest">不是 AI 聊天 App，是健康状态运行时</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">Agent 的第一输入源不是文字，而是 Apple Watch 每秒采集的生理参数——HRV、静息心率、睡眠分期。在本地压缩成 8 个强类型派生状态变量（arousal_load / recovery_debt），然后才交给大模型做有约束的推理。</p>
          </motion.div>
        </div>
        {/* 三层护城河 */}
        <div className="max-w-5xl mx-auto mt-24 space-y-6">
          <h3 className="text-3xl font-bold text-center mb-12">护城河随时间自动加深</h3>
          {[{n:"1",t:"传感器记忆层 (Month 1+)",d:"5 层记忆堆栈持续积累。使用 6 个月后厚度数十倍于新装。竞品无法复制。",icon:Database},{n:"2",t:"贝叶斯个性化引擎 (Month 3+)",d:"match_score = 0.34H + 0.26S + 0.18T + 0.12R + 0.10A。用户反馈持续更新先验概率。",icon:Zap},{n:"3",t:"平台 API 网关锁定 (Month 6+)",d:"10 个强类型 Agent API。第三方 Agent 想了解用户健康状态必须通过 Antios 请求。",icon:Shield}].map(m=>(
            <motion.div key={m.n} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-black/60 border border-neutral-800 p-8 rounded-xl flex gap-6 items-start">
              <m.icon className="w-8 h-8 text-white shrink-0" />
              <div><h4 className="text-lg text-white font-bold mb-2">{m.t}</h4><p className="text-neutral-400 font-mono text-sm">{m.d}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======== QUANT ======== */}
      <section id="quant" className="min-h-screen p-8 lg:p-16 border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full"><span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" /><span className="text-xs font-mono text-neutral-400">边际影响力量化策略</span></div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">QuantMAx.</h2>
            <h3 className="text-xl font-mono text-[#d4af37] tracking-widest">在庄家布局的极早期入局</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">当一只票的热度排名在短时间内剧烈跃升（从第 200 名三天内冲到前 50），而价格尚未同步反应时，系统判定边际影响力信号触发，自动在庄家拉盘之前完成早期吸筹。</p>
          </motion.div>
          <div className="bg-black/50 border border-neutral-800 rounded-2xl p-8">
            <h4 className="text-white font-bold text-lg mb-6">核心参数表</h4>
            <div className="space-y-3 font-mono text-sm">
              {[["topk","5","最大持仓数"],["hot_topn","50","仅交易热榜前 N"],["min_amount_1m","200万","单分钟最小成交额"],["hold_minutes","60","最大持有时间"],["rebalance","5 min","再平衡周期"],["max_drawdown","8%","强制清仓线"]].map(([k,v,d])=>(
                <div key={k} className="flex items-center justify-between border-b border-neutral-800/50 pb-2"><span className="text-[#d4af37]">{k}</span><span className="text-white font-bold">{v}</span><span className="text-neutral-600 text-xs hidden md:block">{d}</span></div>
              ))}
            </div>
          </div>
        </div>
        {/* SaaS */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{v:"Cloud",t:"全托管信号订阅",d:"客户无需部署代码，实时接收 Alpha 信号推送。"},{v:"API",t:"信号流接入",d:"POST /v1/alpha 推送持仓权重至机构交易站。"},{v:"SDK",t:"框架授权",d:"大型机构购买底层框架，收授权年费。"}].map(c=>(
            <div key={c.t} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#d4af37] transition-colors"><span className="text-[#d4af37] font-mono text-xl block mb-4">{c.v}</span><h4 className="text-white font-bold text-lg mb-2">{c.t}</h4><p className="text-neutral-500 font-mono text-sm">{c.d}</p></div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto mt-12 text-center text-neutral-600 font-mono text-xs border border-[#d4af37]/20 rounded-lg p-4">⚠️ 闭源核心 quant_core/core_strategy.py 永不开源。可安排现场实盘演示，但绝不对外展示策略代码。</p>
      </section>

      {/* ======== CTA ======== */}
      <section id="contact" className="flex flex-col items-center justify-center min-h-[60vh] p-8 border-t border-neutral-800/50 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-8">Connect</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <a href="mailto:Broncin@163.com" className="flex items-center gap-3 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50"><Mail className="w-6 h-6 text-neutral-400" /><span className="font-mono text-sm">Broncin@163.com</span></a>
          <a href="https://github.com/Bronc-X" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50"><Github className="w-6 h-6 text-neutral-400" /><span className="font-mono text-sm">github.com/Bronc-X</span></a>
        </div>
      </section>
    </div>
  );
}

/* ───────── Main Page ───────── */
export default function PortfolioPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <CodeGate onUnlock={() => setUnlocked(true)} />;
  return <PortfolioContent />;
}
