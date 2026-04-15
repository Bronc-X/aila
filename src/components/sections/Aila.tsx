"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, MessageSquare, FlaskConical, BarChart3, Building2, Headphones, Users, Search, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const tools = [
  { 
    icon: Target, title: "获客中心", sub: "MARKETING", 
    desc: "批量 AI 海报 · 短视频脚本 · 全平台文案矩阵 · 素材编辑",
    tags: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    stat: "28", statLabel: "Active Campaigns",
    color: "bg-amber-500/10", iconColor: "text-amber-500", borderHover: "hover:border-amber-500/50",
    detail: "接入阿里云 Wanx-v1 万相生图引擎，单次生成 4 张商用级海报。支持从产品图自动生成短视频脚本和全平台（抖音/小红书/公众号）分发文案，素材库统一管理。"
  },
  { 
    icon: MessageSquare, title: "销售助手", sub: "SALES",
    desc: "实时对话分析 · 话术提示 · 智能回访策略 · 灵感追问",
    tags: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    stat: "154", statLabel: "Open Deals",
    color: "bg-blue-500/10", iconColor: "text-blue-400", borderHover: "hover:border-blue-400/50",
    detail: "销售员在与客户通话/聊天时，Agent 实时分析对话内容，推送最优话术建议和追问引导。自动生成回访任务并按客户意向度排序，确保高价值线索不因遗忘而流失。"
  },
  { 
    icon: FlaskConical, title: "研发工坊", sub: "R&D",
    desc: "AI 头脑风暴 · 快速原型验证 · 市场趋势研判 · 资产盘点",
    tags: ["头脑风暴", "快速原型", "市场研判", "资产盘点"],
    stat: "42", statLabel: "Research Projects",
    color: "bg-purple-500/10", iconColor: "text-purple-400", borderHover: "hover:border-purple-400/50",
    detail: "将产品经理的模糊需求输入后，Agent 自动拆解为可执行的产品方案，进行竞品分析和市场容量估算。内置数字资产盘点功能，追踪团队所有设计稿、文档和代码资产。"
  },
  { 
    icon: BarChart3, title: "老板仪表盘", sub: "DASHBOARD",
    desc: "智能日报周报 · 回访进度追踪 · 成交数据分析",
    tags: ["智能仪表盘", "AI 报告", "回访追踪", "成交分析"],
    stat: "89%", statLabel: "Active Campaigns",
    color: "bg-emerald-500/10", iconColor: "text-emerald-400", borderHover: "hover:border-emerald-400/50",
    detail: "每天早晨自动汇总前一日的全部门关键指标，生成结构化日报推送至企业微信群。老板无需逐个问询下属，打开仪表盘即可一目了然地掌握获客成本、成交金额和回访完成率。"
  },
  { 
    icon: Building2, title: "行政效率", sub: "ADMIN",
    desc: "合同文档助手 · 会议纪要 · 排班优化 · 流程自动化",
    tags: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    stat: "350", statLabel: "Users",
    color: "bg-sky-500/10", iconColor: "text-sky-400", borderHover: "hover:border-sky-400/50",
    detail: "上传合同扫描件后自动提取关键条款并标注风险点。会议结束后录音自动转文字并生成结构化纪要与待办事项。排班系统根据历史出勤数据自动生成最优方案。"
  },
  { 
    icon: Headphones, title: "智能客服", sub: "SERVICE",
    desc: "客服配置 · 回访话术 · 舆情监控 · 客户之声分析",
    tags: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    stat: "19", statLabel: "Active Tickets",
    color: "bg-rose-500/10", iconColor: "text-rose-400", borderHover: "hover:border-rose-400/50",
    detail: "自动接管售后常见问题，准确率达到人工客服的 95%。实时监控全网舆情（微博/抖音/小红书），负面评论 30 秒内预警。客户之声模块自动归类反馈痛点生成改进优先级。"
  },
];

function InteractiveToolPanel() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-[#0c0f14] shadow-2xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80 bg-[#0a0d12]">
        <span className="text-white font-bold text-sm tracking-wide">Super Center.</span>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 w-48">
          <Search className="w-3 h-3 text-neutral-600" />
          <input 
            type="text"
            placeholder="Search tools..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-transparent text-xs text-neutral-300 placeholder-neutral-600 outline-none w-full font-mono"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {tools.filter(t => 
          !searchText || t.title.includes(searchText) || t.sub.toLowerCase().includes(searchText.toLowerCase()) || t.desc.includes(searchText)
        ).map((t, i) => (
          <motion.div
            key={t.sub}
            layout
            onClick={() => setActiveId(activeId === i ? null : i)}
            className={`relative bg-[#f5f3ef] rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
              activeId === i ? 'border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.15)]' : 'border-transparent ' + t.borderHover
            }`}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg ${t.color} flex items-center justify-center mb-3`}>
              <t.icon className={`w-4 h-4 ${t.iconColor}`} />
            </div>

            {/* Title */}
            <h4 className="text-[#2D2A26] font-black text-base mb-0.5">{t.title}</h4>
            <span className="text-[#9E9B96] font-mono text-[9px] tracking-[0.15em] block mb-2">{t.sub}</span>
            
            {/* Desc */}
            <p className="text-[#9E9B96] text-[10px] leading-relaxed mb-3 line-clamp-2">{t.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {t.tags.map(tag => (
                <span key={tag} className={`text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${
                  activeId === i 
                    ? 'bg-[#D97706] text-white border-[#D97706]' 
                    : 'border-[#E5E1D8] text-[#9E9B96]'
                } transition-colors duration-200`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Stat */}
            <div className="flex items-end gap-2 border-t border-[#E5E1D8] pt-2">
              <span className="text-[#2D2A26] font-black text-lg leading-none">{t.stat}</span>
              <span className="text-[#9E9B96] text-[9px] font-mono">{t.statLabel}</span>
            </div>
            
            {/* Expand indicator */}
            <motion.div 
               className="absolute top-3 right-3"
               animate={{ rotate: activeId === i ? 45 : 0 }}
            >
              <ArrowUpRight className={`w-3.5 h-3.5 ${activeId === i ? 'text-[#D97706]' : 'text-[#D5D0C8]'} transition-colors`} />
            </motion.div>

            {/* Expanded Detail */}
            <AnimatePresence>
              {activeId === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-[#E5E1D8]">
                    <p className="text-[#555] text-[10px] leading-relaxed">{t.detail}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-neutral-800/80 bg-[#0a0d12] flex items-center justify-between">
        <span className="text-[10px] font-mono text-neutral-600">toni.asia · 邀请码 2026 · 课件码 2049</span>
        <a href="https://toni.asia" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#D97706] hover:text-amber-400 transition-colors flex items-center gap-1">
          访问实际产品 <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function Aila() {
  return (
    <>
      {/* -------------------- AILA PAGE 1: 交互式工具矩阵 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" />
              <span className="text-xs font-mono text-neutral-400">B 端企业全链路 Agent 工具矩阵</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
              aila.
            </h2>
            <h3 className="text-xl font-mono text-[#00ffcc] tracking-widest">类 Bloomberg 的企业定制化 Agent 中枢</h3>
            
            <p className="text-sm text-neutral-400 leading-relaxed font-mono">
              国内 B 端企业的日常运转中，获客、销售跟单、研发验证、行政审批和客服响应这些环节长期依赖于人工手动切换多个独立软件。每次跨部门流转都要在微信群里反复确认、手动录入、等人回复。
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed font-mono mt-4">
              Aila 将这 6 条业务线的核心操作全部收编到一个统一的 Agent 控制台中。直连阿里云 DashScope 的 Qwen-Plus 推理引擎和 Wanx-v1 生图引擎。<strong className="text-neutral-300">点击右侧卡片查看每个工具的详细能力。</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <InteractiveToolPanel />
          </motion.div>
        </div>
      </section>

      {/* -------------------- AILA PAGE 2: 壁垒与差异化 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-900/60 backdrop-blur-md border-t border-neutral-800/50">
        <motion.div 
           className="max-w-6xl mx-auto w-full"
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.2 }}
           transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl text-white font-bold tracking-tight mb-4">
              为什么不是通用大模型套壳？
            </h3>
            <p className="text-neutral-500 font-mono tracking-widest text-sm">每一个工具背后都是一个针对该业务流程深度定制的专业 Agent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.3 }}
               transition={{ duration: 0.5 }}
               className="bg-black/60 border border-neutral-800 p-8 rounded-xl"
             >
               <span className="text-[#00ffcc] font-mono text-3xl block mb-4">01</span>
               <h4 className="text-white font-bold text-lg mb-3">行业参数绑定</h4>
               <p className="text-neutral-500 font-mono text-sm leading-relaxed">
                 每个工具在长期使用中，积累了该企业独有的话术模板、产品参数库和客户特征标签。这些数据是在具体业务场景中跑出来的，不是预训练可以替代的。使用 6 个月后，这套参数体系就是一道天然壁垒。
               </p>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.3 }}
               transition={{ duration: 0.5, delay: 0.15 }}
               className="bg-black/60 border border-neutral-800 p-8 rounded-xl"
             >
               <span className="text-[#00ffcc] font-mono text-3xl block mb-4">02</span>
               <h4 className="text-white font-bold text-lg mb-3">多引擎调度</h4>
               <p className="text-neutral-500 font-mono text-sm leading-relaxed">
                 通用聊天只调一个文字模型。Aila 的获客中心同时调度了文字模型（Qwen-Plus 生文案）和图像模型（Wanx-v1 生海报），单次请求并行出 4 张图 + 配套文案。这种多引擎编排是套壳产品做不到的。
               </p>
             </motion.div>
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.3 }}
               transition={{ duration: 0.5, delay: 0.3 }}
               className="bg-black/60 border border-neutral-800 p-8 rounded-xl"
             >
               <span className="text-[#00ffcc] font-mono text-3xl block mb-4">03</span>
               <h4 className="text-white font-bold text-lg mb-3">全链路闭环</h4>
               <p className="text-neutral-500 font-mono text-sm leading-relaxed">
                 获客中心生成的海报 → 销售助手追踪的线索 → 老板仪表盘汇总的成交数据。6 个工具之间的数据是打通的，形成了一条从投放到回款的完整商业流水线。拆掉任何一个环节，整条链路都会断裂。
               </p>
             </motion.div>
          </div>
        </motion.div>
      </section>

      {/* -------------------- AILA PAGE 3: 商业回报模型 -------------------- */}
      <section className="snap-section relative z-10 flex flex-col items-center justify-center min-h-screen p-8 bg-[#050505] border-t border-neutral-800/50">
        <motion.div 
           className="max-w-5xl mx-auto w-full text-center space-y-12"
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.8 }}
        >
          <Users className="w-16 h-16 text-[#00ffcc] mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest">
            商业回报测算
          </h2>
          <div className="h-px w-32 bg-[#00ffcc]/50 mx-auto" />
          <p className="text-base text-neutral-400 font-mono leading-relaxed max-w-3xl mx-auto">
            SaaS 年费订阅制。企业按工具模块数量付费。使用时间越长，积累的定制化数据让企业越依赖系统。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#00ffcc] transition-colors">
                <span className="text-[#00ffcc] font-mono text-3xl block mb-4">¥3-8万</span>
                <h4 className="text-white font-bold text-lg mb-2">单客户年费</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">按选用模块组合计价。6 个工具全开约 8 万/年，单模块约 1.5 万/年。中小企业主的决策门槛极低。</p>
             </div>
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#00ffcc] transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00ffcc]/10 rounded-bl-full" />
                <span className="text-[#00ffcc] font-mono text-3xl block mb-4">{"<"}2 周</span>
                <h4 className="text-white font-bold text-lg mb-2">部署周期</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">无需驻场实施团队。企业注册账号后，后台配置行业参数即上线运转。相比传统软件动辄 3-6 个月的部署地狱，这是碾压级的交付速度。</p>
             </div>
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 hover:border-[#00ffcc] transition-colors">
                <span className="text-[#00ffcc] font-mono text-3xl block mb-4">{"~"}0</span>
                <h4 className="text-white font-bold text-lg mb-2">边际复制成本</h4>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed">核心代码复用率极高。新签第二家同行业客户时，只需调整行业参数库，无需重新开发。客户数量翻倍不增加工程编制。</p>
             </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
