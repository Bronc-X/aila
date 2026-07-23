"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Lock, ArrowLeft, ArrowRight, ArrowUpRight, Search, X,
  Target, MessageSquare, FlaskConical, BarChart3, Building2, Headphones, ClipboardList, FileImage,
  Users, Shield, Zap, Database, Globe,
  Activity, TrendingUp, Compass, Flame, Lock as LockIcon,
  Mail, GitBranch as Github,
} from "lucide-react";
import Link from "next/link";

/* ───────── Aila Tools Data ───────── */
const tools = [
  { icon: Target, title: "获客中心", sub: "MARKETING", desc: "海报 · 脚本 · 分发文案 · 素材处理", tags: ["批量海报","短视频","文案矩阵","素材编辑"], stat: "28", statLabel: "Demo Campaigns", color: "bg-lime-500/10", iconColor: "text-lime-500", borderHover: "hover:border-lime-500/50", detail: "演示版把产品信息延展成海报、短视频脚本和多平台分发文案，用来判断内容出品线是否值得接入真实业务。" },
  { icon: MessageSquare, title: "销售助手", sub: "SALES", desc: "对话重点 · 异议 · 回访 · 下一步", tags: ["实时对话","话术提示","智能回访","灵感追问"], stat: "154", statLabel: "Sample Deals", color: "bg-blue-500/10", iconColor: "text-blue-400", borderHover: "hover:border-blue-400/50", detail: "销售通话或聊天进行时，系统同步整理重点、潜在异议和下一步动作，再生成可复核的回访任务。" },
  { icon: FlaskConical, title: "验证工坊", sub: "RESEARCH", desc: "多角色评审 · 原型验证 · 市场线索 · 资产盘点", tags: ["多角色评审","原型验证","市场线索","资产盘点"], stat: "42", statLabel: "Prototype Ideas", color: "bg-purple-500/10", iconColor: "text-purple-400", borderHover: "hover:border-purple-400/50", detail: "模糊需求进入系统后，先被拆成使用者、输入、输出、复核点和下一版原型清单，方便团队继续取舍。" },
  { icon: BarChart3, title: "老板仪表盘", sub: "DASHBOARD", desc: "日报周报 · 回访进度 · 成交变化 · 经营视图", tags: ["经营看板","经营报告","回访追踪","成交分析"], stat: "89%", statLabel: "Sample Health", color: "bg-emerald-500/10", iconColor: "text-emerald-400", borderHover: "hover:border-emerald-400/50", detail: "每天早晨汇总前日关键指标，把部门进展、回访状态和成交变化整理成老板能快速浏览的日报。" },
  { icon: Building2, title: "行政效率", sub: "ADMIN", desc: "合同 · 纪要 · 排班 · 流程诊断", tags: ["合同助手","会议纪要","排班优化","流程诊断"], stat: "350", statLabel: "Sample Records", color: "bg-sky-500/10", iconColor: "text-sky-400", borderHover: "hover:border-sky-400/50", detail: "用演示材料展示合同要点提取、会议纪要和排班建议，真实落地时再接入企业文档与权限。" },
  { icon: Headphones, title: "智能客服", sub: "SERVICE", desc: "常见问答 · 回访话术 · 舆情 · 客户反馈", tags: ["智能客服","回访话术","舆情监控","客户之声"], stat: "19", statLabel: "Sample Tickets", color: "bg-rose-500/10", iconColor: "text-rose-400", borderHover: "hover:border-rose-400/50", detail: "常见售后问题先由演示知识库接住，舆情和客户反馈同步进入面板，方便团队看到处理路径。" },
  { icon: ClipboardList, title: "海报方案助手", sub: "PROPOSAL", desc: "活动方案 · 宣传文案 · 海报提示词 · PPTX 导出", tags: ["活动方案","宣传文案","海报提示词","PPTX"], stat: "GitHub", statLabel: "Activity-plan", color: "bg-amber-500/10", iconColor: "text-amber-400", borderHover: "hover:border-amber-400/50", detail: "把活动信息、预算人数和品牌物料整理成方案页、宣传文案、海报提示词和演示用 PPTX 初稿。" },
  { icon: FileImage, title: "小红书自动二创", sub: "XHS MATRIX", desc: "矩阵草稿 · 热点参考 · 质量检查 · 客服线索", tags: ["矩阵草稿","热点参考","质量检查","客服线索"], stat: "GitHub", statLabel: "auto-red-book", color: "bg-fuchsia-500/10", iconColor: "text-fuchsia-400", borderHover: "hover:border-fuchsia-400/50", detail: "围绕 5 个账号生成候选图文草稿，保留人工筛选、审核和发布确认，不做自动发布或规避平台风控。" },
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
        <p className="text-neutral-500 font-mono text-sm">输入访问码查看旧作品集和演示档案</p>
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
            className={`relative bg-[#f5f3ef] rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${activeId === i ? 'border-[#22d665] shadow-lg' : 'border-transparent ' + t.borderHover}`}
            whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center mb-3`}><t.icon className={`w-4 h-4 ${t.iconColor}`} /></div>
            <h4 className="text-[#2D2A26] font-black text-base mb-0.5">{t.title}</h4>
            <span className="text-[#9E9B96] font-mono text-[9px] tracking-[0.15em] block mb-2">{t.sub}</span>
            <p className="text-[#9E9B96] text-[10px] leading-relaxed mb-3 line-clamp-2">{t.desc}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {t.tags.map(tag => (<span key={tag} className={`text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${activeId === i ? 'bg-[#22d665] text-white border-[#22d665]' : 'border-[#E5E1D8] text-[#9E9B96]'} transition-colors`}>{tag}</span>))}
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
          <p className="text-xs font-mono text-neutral-500 tracking-[0.3em] uppercase">AI Workflow × Product Prototyping</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">Toni Studio.</h1>
          <p className="text-base text-neutral-400 font-mono max-w-2xl mx-auto leading-relaxed">企业工具、iOS 产品与量化界面原型。</p>
        </motion.div>
      </section>

      {/* ======== AILA ======== */}
      <section id="aila" className="min-h-screen p-8 lg:p-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full"><span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" /><span className="text-xs font-mono text-neutral-400">B 端企业工具矩阵</span></div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">aila.</h2>
            <h3 className="text-xl font-mono text-[#00ffcc] tracking-widest">企业工具矩阵演示</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">Aila 把获客、销售、验证、行政、客服和内容项目放进统一控制台。当前版本用于展示流程和交互路径，真实落地时再按企业系统、权限和数据边界接入。<strong className="text-neutral-300">点击右侧卡片查看每个工具的详细能力。</strong></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}><ToolPanel /></motion.div>
        </div>
        {/* Aila 商业 */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{v:"8 个",t:"工具模块",d:"获客、销售、验证、运营、行政、客服和内容项目先做成可演示模块。"},{v:"1 条",t:"起步链路",d:"真实合作通常先选一个高摩擦流程验证价值。"},{v:"可复核",t:"交付边界",d:"每个模块都要明确输入、输出、使用者和复核方式。"}].map(c=>(
            <div key={c.t} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#00ffcc] transition-colors"><span className="text-[#00ffcc] font-mono text-3xl block mb-4">{c.v}</span><h4 className="text-white font-bold text-lg mb-2">{c.t}</h4><p className="text-neutral-500 font-mono text-sm">{c.d}</p></div>
          ))}
        </div>
      </section>

      {/* ======== ANTIOS ======== */}
      <section id="antios" className="min-h-screen p-8 lg:p-16 border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-16 items-center">
          <div className="flex-1 flex justify-center"><div className="relative w-[280px] h-[560px] rounded-[3rem] border-[6px] border-neutral-900 bg-black shadow-2xl overflow-hidden"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-neutral-900 rounded-full z-20" /><video src="/antios.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover rounded-[2rem]" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 rounded-[2rem]" /></div></div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span className="text-xs font-mono text-neutral-400">iOS 原生健康 Agent 平台</span></div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">antios.</h2>
            <h3 className="text-xl font-mono text-white tracking-widest">个人健康状态产品实验</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">Antios 探索如何把 Apple Watch 的 HRV、静息心率、睡眠分期等信号整理成用户能理解的状态解释、提醒和反馈，而不是再做一个泛泛聊天入口。</p>
          </motion.div>
        </div>
        {/* 产品判断 */}
        <div className="max-w-5xl mx-auto mt-24 space-y-6">
          <h3 className="text-3xl font-bold text-center mb-12">产品判断先落在三个问题上</h3>
          {[{n:"1",t:"记录是否足够轻",d:"用户愿不愿意长期留下信号，是健康产品能否成立的第一道门槛。",icon:Database},{n:"2",t:"解释是否能被相信",d:"状态判断必须说清依据、置信度和不确定性，不能只给一个漂亮结论。",icon:Zap},{n:"3",t:"提醒是否改变行动",d:"提示要回到睡眠、训练、工作节奏等具体动作，才有机会进入日常。",icon:Shield}].map(m=>(
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
            <h3 className="text-xl font-mono text-[#d4af37] tracking-widest">量化信号的产品化表达</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">QuantMAx 是一个闭源策略的界面实验：公开部分只展示信号解释、候选筛选、风险提示和结果阅读方式，不展示核心参数，也不构成投资建议。</p>
          </motion.div>
          <div className="bg-black/50 border border-neutral-800 rounded-2xl p-8">
            <h4 className="text-white font-bold text-lg mb-6">界面展示参数</h4>
            <div className="space-y-3 font-mono text-sm">
              {[["topk","5","最大持仓数"],["hot_topn","50","仅交易热榜前 N"],["min_amount_1m","200万","单分钟最小成交额"],["hold_minutes","60","最大持有时间"],["rebalance","5 min","再平衡周期"],["max_drawdown","8%","强制清仓线"]].map(([k,v,d])=>(
                <div key={k} className="flex items-center justify-between border-b border-neutral-800/50 pb-2"><span className="text-[#d4af37]">{k}</span><span className="text-white font-bold">{v}</span><span className="text-neutral-600 text-xs hidden md:block">{d}</span></div>
              ))}
            </div>
          </div>
        </div>
        {/* SaaS */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{v:"Explain",t:"信号解释",d:"把复杂判断压缩成候选理由、风险提示和可读结论。"},{v:"Demo",t:"现场演示",d:"敏感策略只适合现场展示，不外放核心逻辑。"},{v:"Archive",t:"产品档案",d:"保留界面方向和跨领域工程方法，便于复盘。"}].map(c=>(
            <div key={c.t} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#d4af37] transition-colors"><span className="text-[#d4af37] font-mono text-xl block mb-4">{c.v}</span><h4 className="text-white font-bold text-lg mb-2">{c.t}</h4><p className="text-neutral-500 font-mono text-sm">{c.d}</p></div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto mt-12 text-center text-neutral-600 font-mono text-xs border border-[#d4af37]/20 rounded-lg p-4">闭源核心策略不外放。页面仅展示产品叙事、界面方向和风险提示，不提供投资建议。</p>
      </section>

      {/* ======== CTA ======== */}
      <section id="contact" className="flex flex-col items-center justify-center min-h-[60vh] p-8 border-t border-neutral-800/50 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-8">发来你的业务现场</h2>
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <a href="mailto:Broncin@163.com" className="flex items-center gap-3 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50"><Mail className="w-6 h-6 text-neutral-400" /><span className="font-mono text-sm">Broncin@163.com</span></a>
          <a href="https://github.com/Bronc-X" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border border-neutral-800 rounded-xl hover:border-white transition-colors bg-neutral-900/50"><Github className="w-6 h-6 text-neutral-400" /><span className="font-mono text-sm">github.com/Bronc-X</span></a>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-48 p-2 bg-white rounded-2xl shadow-2xl overflow-hidden"><img src="/wechat-qr.jpg" alt="WeChat QR" className="w-full h-full object-cover rounded-xl" /></div>
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
