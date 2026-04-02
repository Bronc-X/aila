"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ArrowLeft,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  CalendarDays,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Plus,
  LayoutGrid,
  List,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { StatusDropdown, TASK_STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/components/ui/StatusDropdown";
import { ExportButton } from "@/components/ui/ExportButton";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

function DroppableColumn({ id, children, className }: any) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className={className}>{children}</div>;
}

function DraggableCard({ id, children, className }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50, position: 'relative' as const } : undefined;
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={className}>{children}</div>;
}

// ── 类型定义 ──────────────────────────────
interface KPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
  detail: string[];
}

interface TrackingRow {
  id: string;
  name: string;
  status: string;
  priority: string;
  date: string;
  owner: string;
}

interface PipelineStage {
  stage: string;
  count: number;
  amount: string;
}

interface RecentDeal {
  client: string;
  amount: string;
  status: string;
  date: string;
}

// ── 初始数据 ──────────────────────────────
const INITIAL_KPIS: KPI[] = [
  { label: "本月成交额", value: "¥1,284,500", change: "+23.5%", trend: "up", icon: DollarSign, detail: ["周一 ¥85K", "周二 ¥120K", "周三 ¥230K", "周四 ¥56K", "周五 ¥42K", "周六 ¥98K", "周日 ¥65K"] },
  { label: "新客户数", value: "47", change: "+12.3%", trend: "up", icon: Users, detail: ["线上获客 28", "转介绍 12", "展会 5", "自然流量 2"] },
  { label: "转化率", value: "18.6%", change: "+2.1%", trend: "up", icon: Target, detail: ["线索→沟通 38.4%", "沟通→方案 40.7%", "方案→签约 23.7%"] },
  { label: "客单价", value: "¥27,330", change: "-3.2%", trend: "down", icon: TrendingUp, detail: ["大单(>10万) 8笔", "中单(3-10万) 15笔", "小单(<3万) 24笔"] },
];

const PIPELINE: PipelineStage[] = [
  { stage: "线索", count: 156, amount: "¥4,200K" },
  { stage: "需求确认", count: 68, amount: "¥2,800K" },
  { stage: "方案提报", count: 34, amount: "¥1,650K" },
  { stage: "商务谈判", count: 18, amount: "¥980K" },
  { stage: "签约", count: 8, amount: "¥520K" },
];

const RECENT_DEALS: RecentDeal[] = [
  { client: "深圳XX科技", amount: "¥85,000", status: "signed", date: "03-28" },
  { client: "杭州YY贸易", amount: "¥120,000", status: "signed", date: "03-27" },
  { client: "广州ZZ制造", amount: "¥230,000", status: "approval", date: "03-26" },
  { client: "上海AA农业", amount: "¥56,000", status: "signed", date: "03-25" },
  { client: "北京BB服务", amount: "¥42,000", status: "following", date: "03-24" },
];

const INITIAL_TRACKING: TrackingRow[] = [
  { id: "1", name: "深圳XX科技 · 张总", status: "pending", priority: "high", date: "04-02", owner: "小王" },
  { id: "2", name: "杭州YY贸易 · 李经理", status: "completed", priority: "low", date: "03-28", owner: "小陈" },
  { id: "3", name: "广州ZZ制造 · 赵总", status: "in_progress", priority: "medium", date: "04-03", owner: "小王" },
  { id: "4", name: "上海AA农业 · 吴董", status: "pending", priority: "high", date: "04-01", owner: "小李" },
  { id: "5", name: "北京BB服务 · 钱总", status: "overdue", priority: "high", date: "03-25", owner: "小张" },
  { id: "6", name: "成都CC教育 · 孙总", status: "in_progress", priority: "medium", date: "04-05", owner: "小陈" },
  { id: "7", name: "武汉DD医疗 · 周总", status: "pending", priority: "low", date: "04-08", owner: "小李" },
];

const STORAGE_KEY = "aila-operations-tracking";

// ── 主组件 ──────────────────────────────
export default function OperationsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "report" | "tracking" | "analysis">("dashboard");
  const [reportInput, setReportInput] = useState("");
  const [reportType, setReportType] = useState("weekly");
  const [reportResult, setReportResult] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedKPI, setExpandedKPI] = useState<number | null>(null);
  const [hoveredPipeline, setHoveredPipeline] = useState<number | null>(null);
  const [trackingRows, setTrackingRows] = useState<TrackingRow[]>(INITIAL_TRACKING);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  // localStorage 持久化
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTrackingRows(JSON.parse(saved));
      } catch {
        // 忽略解析错误，使用默认数据
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingRows));
  }, [trackingRows]);

  const subTabs = [
    { id: "dashboard" as const, label: "智能仪表盘", icon: BarChart3 },
    { id: "report" as const, label: "AI报告", icon: FileText },
    { id: "tracking" as const, label: "回访追踪", icon: CalendarDays },
    { id: "analysis" as const, label: "成交分析", icon: TrendingUp },
  ];

  // ── 报告生成 ──────────────────────────────
  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个专业的运营总监助理。根据提供的工作要点数据，生成一份结构清晰、数据翔实的${reportType === "daily" ? "日报" : reportType === "weekly" ? "周报" : "月报"}。\n包含：1.核心数据总结 2.重点工作进展 3.存在问题 4.下一步计划。\n格式要专业简洁，适合直接发给老板看。` },
            { role: "user", content: reportInput || "本周新增客户47个，成交8单，总成交额128.45万。重点跟进了深圳XX科技的23万大单。线索转化率18.6%，较上周提升2.1个百分点。存在问题：客单价下降3.2%，需要调整话术。" },
          ],
        }),
      });
      const data = await res.json();
      setReportResult(data.choices?.[0]?.message?.content || "生成失败");
    } catch {
      setReportResult("生成失败，请重试");
    } finally {
      setReportLoading(false);
    }
  };

  // ── Kanban Draggable/Droppable ──
  const handleDragEndKanban = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTrackingRows(prev => prev.map(r => r.id === active.id ? { ...r, status: String(over.id) } : r));
    }
  };

  // ── 回访追踪操作 ──────────────────────────────
  const updateRow = useCallback((id: string, field: keyof TrackingRow, value: string) => {
    setTrackingRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const addRow = useCallback(() => {
    const newRow: TrackingRow = {
      id: Date.now().toString(),
      name: "",
      status: "pending",
      priority: "medium",
      date: new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
      owner: "",
    };
    setTrackingRows(prev => [...prev, newRow]);
  }, []);

  const deleteRow = useCallback((id: string) => {
    setTrackingRows(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── 统计 ──────────────────────────────
  const statusCounts = trackingRows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ── AI 洞察数据 ──────────────────────────────
  const insights = [
    { type: "warning", title: "注册→沟通转化率偏高", text: "38.4% 的注册用户进入了沟通阶段，说明留资质量好，但方案→签约环节（23.7%）存在瓶颈。建议优化方案模板和价格策略。", detail: "具体分析：\n1. 留资质量高说明获客渠道精准，建议加大当前渠道投放\n2. 方案→签约瓶颈可能原因：价格敏感、竞品对比、决策链过长\n3. 建议动作：\n   - 制作标准化方案模板，缩短出方案时间\n   - 推出限时优惠机制，加速决策\n   - 安排技术专家参与重点客户的方案沟通" },
    { type: "insight", title: "Q3 增速放缓", text: "7-9月成交额环比增速从 37%→-14%→+28%，波动较大。建议排查是否与暑期客户决策周期有关，可提前布局Q3促销。", detail: "详细数据：\n- 7月：¥135万 (环比+37%)\n- 8月：¥98万 (环比-14%)\n- 9月：¥128万 (环比+28%)\n\n原因推测：\n1. 8月暑期大量企业进入休假周期\n2. 关键决策人无法到位\n\n建议：\n- 6月提前锁定 Q3 合同\n- 8月切换至线上轻量演示模式\n- 推出暑期签约早鸟优惠" },
    { type: "action", title: "客单价优化机会", text: "客单价 ¥27,330 较行业中位数低 12%。前20%大单客户贡献了 58% 收入。建议推出高端套餐锁定大客户。", detail: "客户分层数据：\n- Top 20%（9笔大单）：贡献 ¥745K (58%)\n- Middle 50%（24笔中单）：贡献 ¥389K (30%)\n- Bottom 30%（14笔小单）：贡献 ¥150K (12%)\n\n建议：\n1. 高端套餐：推出 ¥50K+ 年度服务包\n2. 追加销售：现有大客户推荐增值模块\n3. 淘汰低效客户：<¥5K 单子考虑自助服务化" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] ">
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8]"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E5E1D8" }}>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex items-end justify-between mb-10">
          <Link href="/tools" className="flex items-center gap-1.5 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors">
            <ArrowLeft size={16} /> 返回
          </Link>
          <div className="w-px h-5 bg-[var(--border-subtle)] mx-4" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
              <BarChart3 size={16} className="text-[#2D2A26]" />
            </div>
            <span className="font-semibold text-sm">运营驾驶舱</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex gap-12 -mb-px mt-2">
          {subTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-2 pb-5 text-base font-bold border-b-4 transition-all ${
                activeSubTab === tab.id ? "border-[#D97706] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-8">

        {/* ═══════════════════ 仪表盘 ═══════════════════ */}
        {activeSubTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* KPI 卡片 — 可点击展开详情 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {INITIAL_KPIS.map((kpi, i) => (
                <motion.div key={kpi.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedKPI(expandedKPI === i ? null : i)}
                  className={`border bg-[#FAF9F6] transition-all cursor-pointer ${expandedKPI === i ? "border-[#A3A3A3]" : "border-[#E5E1D8] hover:border-[#A3A3A3]"} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
                      <kpi.icon size={18} className="text-[#2D2A26]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        kpi.trend === "up" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                      }`}>{kpi.change}</span>
                      {expandedKPI === i ? <ChevronUp size={12} className="text-[#6B6660]" /> : <ChevronDown size={12} className="text-[#6B6660]" />}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#2D2A26] mb-1">{kpi.value}</div>
                  <div className="text-xs text-[#6B6660]">{kpi.label}</div>

                  <AnimatePresence>
                    {expandedKPI === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-[#E5E1D8] space-y-1.5">
                          {kpi.detail.map((d, j) => (
                            <div key={j} className="text-xs text-[#9E9B96] flex justify-between">
                              <span>{d.split(" ")[0]}</span>
                              <span className="text-[#6B6660] font-mono">{d.split(" ").slice(1).join(" ")}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-12">
              {/* 销售漏斗 — hover 显示详情 */}
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12">
                <h3 className="text-base font-bold text-[#2D2A26] mb-5">销售漏斗</h3>
                <div className="space-y-3">
                  {PIPELINE.map((stage, i) => {
                    const maxCount = PIPELINE[0].count;
                    const width = (stage.count / maxCount) * 100;
                    const convRate = i > 0 ? ((stage.count / PIPELINE[i - 1].count) * 100).toFixed(1) : "100";
                    return (
                      <motion.div key={stage.stage}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        onMouseEnter={() => setHoveredPipeline(i)}
                        onMouseLeave={() => setHoveredPipeline(null)}
                        className="relative">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-[#9E9B96]">{stage.stage}</span>
                          <div className="flex gap-8 items-center">
                            <span className="text-[#6B6660]">{stage.count} 个 · {stage.amount}</span>
                            {hoveredPipeline === i && i > 0 && (
                              <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                                className="text-xs text-[#D97706] bg-[#F3F1ED] px-2 py-0.5 rounded-full">
                                转化 {convRate}%
                              </motion.span>
                            )}
                          </div>
                        </div>
                        <div className="h-8 rounded-lg bg-white overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-lg"
                            style={{ background: `linear-gradient(90deg, rgba(217,119,6,${0.3 + i * 0.08}) 0%, rgba(217,119,6,${0.15 + i * 0.05}) 100%)` }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* 最近成交 */}
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12">
                <h3 className="text-base font-bold text-[#2D2A26] mb-4">最近成交</h3>
                <div className="space-y-3">
                  {RECENT_DEALS.map((deal, i) => {
                    const statusOpt = {
                      signed: { label: "已签约", color: "bg-green-500/10 text-green-400" },
                      approval: { label: "审批中", color: "bg-yellow-500/10 text-yellow-400" },
                      following: { label: "跟进中", color: "bg-blue-500/10 text-blue-400" },
                    }[deal.status] || { label: deal.status, color: "bg-[#F3F1ED] text-[#9E9B96]" };

                    return (
                      <motion.div key={deal.client}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E1D8]">
                        <div>
                          <div className="text-sm font-medium text-[#2D2A26]">{deal.client}</div>
                          <div className="text-xs text-[#6B6660]">{deal.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#D97706]">{deal.amount}</div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusOpt.color}`}>{statusOpt.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ AI 报告 ═══════════════════ */}
        {activeSubTab === "report" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                  <FileText size={18} className="text-[#D97706]" /> AI 智能报告
                </h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">报告类型</label>
                  <div className="flex gap-2">
                    {[{id:"daily",label:"日报"},{id:"weekly",label:"周报"},{id:"monthly",label:"月报"}].map(t => (
                      <button key={t.id} onClick={() => setReportType(t.id)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                          reportType === t.id ? "border-[#D97706] bg-[rgba(217,119,6,0.08)] text-[#D97706]" : "border-[#E5E1D8] text-[#6B6660]"
                        }`}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">工作要点 / 数据</label>
                  <textarea value={reportInput} onChange={e => setReportInput(e.target.value)}
                    placeholder="输入本期工作要点...（不填则使用示例数据）" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-8 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[180px] resize-y" rows={7} />
                </div>
                <button onClick={handleGenerateReport} disabled={reportLoading}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {reportLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 一键生成报告</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">生成结果</h2>
                  {reportResult && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopy(reportResult, "report")}
                        className="bg-[#FAF9F6] text-[#6B6660] border border-[#A3A3A3] font-bold uppercase tracking-wide hover:border-[#D97706] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1">
                        {copied === "report" ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 复制</>}
                      </button>
                      <ExportButton content={reportResult} filename={`${reportType === "daily" ? "日报" : reportType === "weekly" ? "周报" : "月报"}_${new Date().toISOString().slice(0,10)}.txt`} />
                    </div>
                  )}
                </div>
                {!reportResult ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <FileText size={28} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">输入工作要点后一键生成</p>
                    <p className="text-sm text-[#6B6660] mt-1">报告支持复制和导出为文本文件</p>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-[#E5E1D8] bg-white max-h-[500px] overflow-y-auto">
                    <div className="text-sm text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{reportResult}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════════ 回访追踪 ═══════════════════ */}
        {activeSubTab === "tracking" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#2D2A26]">回访进度追踪</h2>
                <p className="text-xs text-[#6B6660] mt-1">Notion 式数据看板 · 行内编辑 · 状态管理 · 数据持久化</p>
              </div>
              <div className="flex gap-2">
                {/* 视图切换 */}
                <div className="flex border border-[#E5E1D8]">
                  <button onClick={() => setViewMode("table")}
                    className={`px-3 py-2 text-xs transition-colors ${viewMode === "table" ? "bg-[#F3F1ED] text-[#2D2A26]" : "text-[#6B6660] hover:text-[#2D2A26]"}`}>
                    <List size={14} />
                  </button>
                  <button onClick={() => setViewMode("kanban")}
                    className={`px-3 py-2 text-xs transition-colors border-l border-[#E5E1D8] ${viewMode === "kanban" ? "bg-[#F3F1ED] text-[#2D2A26]" : "text-[#6B6660] hover:text-[#2D2A26]"}`}>
                    <LayoutGrid size={14} />
                  </button>
                </div>
                <button onClick={addRow} className="px-4 py-2 border border-[#E5E1D8] text-[#666] text-sm hover:border-[#D97706] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                  <Plus size={14} /> 新建任务
                </button>
              </div>
            </div>

            {viewMode === "table" ? (
              <>
                {/* 表格视图 */}
                <div className="border border-[#E5E1D8] bg-[#FAF9F6]">
                  <div className="grid grid-cols-[1fr_110px_80px_90px_90px_60px] gap-px px-5 py-3 border-b border-[#E5E1D8] text-xs text-[#6B6660] font-semibold uppercase tracking-wider">
                    <span>客户名称</span><span>状态</span><span>优先级</span><span>计划日期</span><span>负责人</span><span></span>
                  </div>
                  <AnimatePresence>
                    {trackingRows.map((row) => (
                      <motion.div key={row.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-[1fr_110px_80px_90px_90px_60px] gap-px px-5 py-3 border-b border-[#0a0a0a] hover:bg-[#FAF9F6] transition-colors items-center group">
                        <EditableCell value={row.name} onSave={(v) => updateRow(row.id, "name", v)} className="text-sm text-[#2D2A26] font-medium" placeholder="客户名称" />
                        <StatusDropdown value={row.status} options={TASK_STATUS_OPTIONS} onChange={(v) => updateRow(row.id, "status", v)} />
                        <StatusDropdown value={row.priority} options={PRIORITY_OPTIONS} onChange={(v) => updateRow(row.id, "priority", v)} />
                        <EditableCell value={row.date} onSave={(v) => updateRow(row.id, "date", v)} className="text-xs font-mono text-[#666]" placeholder="MM-DD" />
                        <EditableCell value={row.owner} onSave={(v) => updateRow(row.id, "owner", v)} className="text-xs text-[#9E9B96]" placeholder="负责人" />
                        <button onClick={() => deleteRow(row.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#A3A3A3] hover:text-red-400">
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {/* 底部统计 */}
                <div className="flex gap-12 mt-4 text-xs text-[#6B6660]">
                  <span>共 <span className="text-[#2D2A26] font-semibold">{trackingRows.length}</span> 条</span>
                  <span>待回访 <span className="text-yellow-400 font-semibold">{statusCounts.pending || 0}</span></span>
                  <span>跟进中 <span className="text-blue-400 font-semibold">{statusCounts.in_progress || 0}</span></span>
                  <span>已逾期 <span className="text-red-400 font-semibold">{statusCounts.overdue || 0}</span></span>
                  <span>已完成 <span className="text-green-400 font-semibold">{statusCounts.completed || 0}</span></span>
                </div>
              </>
            ) : (
              /* 看板视图 */
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <DndContext onDragEnd={handleDragEndKanban}>
                  {TASK_STATUS_OPTIONS.map(status => {
                    const rows = trackingRows.filter(r => r.status === status.value);
                    return (
                      <DroppableColumn key={status.value} id={status.value} className="border border-[#E5E1D8] bg-[#FAF9F6] min-h-[300px]">
                        <div className="px-4 py-3 border-b border-[#E5E1D8] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                            <span className="text-xs text-[#6B6660]">{rows.length}</span>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          {rows.map(row => (
                            <DraggableCard key={row.id} id={row.id} className="p-3 border border-[#E5E1D8] bg-white hover:border-[#A3A3A3] transition-colors cursor-grab active:cursor-grabbing">
                              <div className="text-sm text-[#2D2A26] font-medium mb-2 truncate">{row.name || "未命名"}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#6B6660]">{row.date}</span>
                                <span className="text-[#9E9B96]">{row.owner}</span>
                              </div>
                              <div className="mt-2" onPointerDown={e => e.stopPropagation()}>
                                <StatusDropdown value={row.priority} options={PRIORITY_OPTIONS} onChange={(v) => updateRow(row.id, "priority", v)} />
                              </div>
                            </DraggableCard>
                          ))}
                          {rows.length === 0 && (
                            <div className="text-center text-xs text-[#A3A3A3] py-8">拖拽任务到此处</div>
                          )}
                        </div>
                      </DroppableColumn>
                    );
                  })}
                </DndContext>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════ 成交分析 ═══════════════════ */}
        {activeSubTab === "analysis" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-12">
              <div className="space-y-6">
                {/* 转化漏斗分析 */}
                <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-12">
                  <h3 className="text-base font-bold text-[#2D2A26] mb-5">转化漏斗分析</h3>
                  <div className="space-y-3">
                    {[
                      { stage: "官网访问", count: 8420, rate: "100%" },
                      { stage: "注册留资", count: 1264, rate: "15.0%" },
                      { stage: "需求沟通", count: 486, rate: "38.4%" },
                      { stage: "方案提报", count: 198, rate: "40.7%" },
                      { stage: "签约成交", count: 47, rate: "23.7%" },
                    ].map((item, i) => {
                      const width = (item.count / 8420) * 100;
                      return (
                        <motion.div key={item.stage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-[#9E9B96]">{item.stage}</span>
                            <div className="flex gap-8">
                              <span className="text-[#2D2A26] font-semibold">{item.count.toLocaleString()}</span>
                              <span className="text-[#6B6660] font-mono w-14 text-right">{item.rate}</span>
                            </div>
                          </div>
                          <div className="h-7 bg-white overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                              className="h-full" style={{ background: `rgba(255,255,255,${0.03 + (5 - i) * 0.02})` }} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 月度趋势 */}
                <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-12">
                  <h3 className="text-base font-bold text-[#2D2A26] mb-4">月度成交趋势</h3>
                  <div className="flex items-end gap-2 h-40">
                    {[65, 78, 52, 91, 84, 120, 98, 135, 128, 142, 156, 168].map((v, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / 168) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="flex-1 bg-[#F3F1ED] hover:bg-white/15 transition-colors relative group cursor-pointer">
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-[#6B6660] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v}万</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] text-[#A3A3A3]">
                    {["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"].map(m => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 数据洞察 (Gemini 式) — 可展开详情 */}
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-12">
                <h3 className="text-base font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                  <Sparkles size={16} /> AI 数据洞察
                </h3>
                <div className="space-y-4">
                  {insights.map((item, i) => (
                    <motion.div key={item.title}
                      className={`p-8 border bg-white transition-colors cursor-pointer ${expandedInsight === i ? "border-[#A3A3A3]" : "border-[#E5E1D8] hover:border-[#E5E1D8]"}`}
                      onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}>
                      <div className="flex items-start justify-between">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block ${
                          item.type === "warning" ? "bg-yellow-500/10 text-yellow-400" : item.type === "insight" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                        }`}>{item.type === "warning" ? "预警" : item.type === "insight" ? "洞察" : "建议"}</span>
                        {expandedInsight === i ? <ChevronUp size={12} className="text-[#6B6660]" /> : <ChevronDown size={12} className="text-[#6B6660]" />}
                      </div>
                      <h4 className="text-sm font-semibold text-[#2D2A26] mb-1">{item.title}</h4>
                      <p className="text-xs text-[#9E9B96] leading-relaxed">{item.text}</p>

                      <AnimatePresence>
                        {expandedInsight === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden">
                            <div className="mt-3 pt-3 border-t border-[#E5E1D8]">
                              <p className="text-xs text-[#666] whitespace-pre-wrap leading-relaxed">{item.detail}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
