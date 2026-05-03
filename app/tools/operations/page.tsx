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
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { StatusDropdown, TASK_STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/components/ui/StatusDropdown";
import { ExportButton } from "@/components/ui/ExportButton";
import { postJson, type ChatApiResponse } from "@/lib/api-client";
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

const INITIAL_DEALS = [
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

  // ── AI 仪表盘状态 ──
  const [dbConfig, setDbConfig] = useState({
    industry: "教培行业",
    target: "200",
    unit: "万",
    priority: "获取新客",
    marketingBudget: "5",
    customerProfile: "一二线城市宝妈",
    teamSize: "15"
  });
  const [dbData, setDbData] = useState<{ kpis: KPI[], pipeline: PipelineStage[], insights: any[], deals: RecentDeal[] } | null>(null);
  const [dbGenerating, setDbGenerating] = useState(false);

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
    { id: "analysis" as const, label: "成交分析", icon: TrendingUp },
  { id: "report" as const, label: "经营报告", icon: FileText },
    { id: "tracking" as const, label: "回访追踪", icon: CalendarDays },
  ];

  // ── AI 大屏推演 ──────────────────────────────
  const handleGenerateDashboard = async () => {
    setDbGenerating(true);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { 
            role: "system", 
            content: `你是一个顶尖的商业数据分析师(BI)系统。请根据用户设定的基础条件，推演并模拟出一组极其逼真、符合该行业特征的运营数据大屏。
请返回格式如下的极严格 JSON：
{
  "kpis": [
    { "label": "指标名(例如本月成交额)", "value": "带真实货币符号或单位的数值", "change": "带符号的百分比", "trend": "up 或 down", "detail": ["细分维度1的名称和数据", "细分维度2..."] },
    // 另外再生成三个KPI，禁止照搬本提示，数值必须依据行业、规模真实推演，具备随机波动性
  ],
  "pipeline": [
    { "stage": "阶段名称(例如线索曝光)", "count": 整数人数, "amount": "带单位的预计金额" },
    // 生成真实的漏斗阶段（4-5个），必须符合漏斗层层显著递减的逻辑
  ],
  "insights": [
    { "type": "warning 或 insight 或 action", "title": "简短结论", "text": "洞察说明", "detail": "具体的分析原因..." }
  ],
  "deals": [
    // 生成5条类似 { "client": "某某真实感行业公司名", "amount": "合理金额", "status": "signed 或 approval 或 following", "date": "XX-XX" }
  ]
}
不要有任何多余的文本、解释或包裹的Markdown标识。` 
          },
          { role: "user", content: `背景信息：
行业：【${dbConfig.industry}】
目标客户画像：【${dbConfig.customerProfile}】
销售团队规模：【${dbConfig.teamSize}人】
月度营销预算：【${dbConfig.marketingBudget}${dbConfig.unit}】
本月目标设定：营收【${dbConfig.target}${dbConfig.unit}】
当期核心经营重心：【${dbConfig.priority}】

请基于以上初始客观资源和设定，推演并合理分配各层漏斗及财务各项KPI，各数据必须符合逻辑及行业常识，不要太假。不要生成markdown代码块！` },
        ],
        temperature: 0.8,
      });
      const content = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
      
      // Map icon component refs safely
      const iconMap = [DollarSign, Users, Target, TrendingUp];
      if (parsed.kpis && Array.isArray(parsed.kpis)) {
         parsed.kpis.forEach((k: any, i: number) => { k.icon = iconMap[i % iconMap.length]; });
      }
      setDbData(parsed);
    } catch (e) {
      alert(e instanceof Error ? e.message : "全盘数据生成失败，请重试");
    } finally {
      setDbGenerating(false);
    }
  };

  // ── 报告生成 ──────────────────────────────
  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: `你是一个专业的运营总监助理。根据提供的工作要点数据，生成一份结构清晰、数据翔实的${reportType === "daily" ? "日报" : reportType === "weekly" ? "周报" : "月报"}。\n包含：1.核心数据总结 2.重点工作进展 3.存在问题 4.下一步计划。\n格式要专业简洁，适合直接发给老板看。` },
          { role: "user", content: reportInput || "本周新增客户47个，成交8单，总成交额128.45万。重点跟进了深圳XX科技的23万大单。线索转化率18.6%，较上周提升2.1个百分点。存在问题：客单价下降3.2%，需要调整话术。" },
        ],
      });
      setReportResult(data.choices?.[0]?.message?.content || "生成失败");
    } catch (error) {
      setReportResult(error instanceof Error ? error.message : "生成失败，请重试");
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

  const insights = dbData?.insights || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] ">
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8]"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E5E1D8" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between mb-10">
          <div className="flex items-center gap-0">
            <Link href="/tools" className="flex items-center gap-1.5 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors">
              <ArrowLeft size={16} /> 返回
            </Link>
            <div className="w-px h-5 bg-[#E5E1D8] mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
                <BarChart3 size={16} className="text-[#2D2A26]" />
              </div>
              <span className="font-semibold text-sm">老板仪表盘</span>
            </div>
          </div>
          <Link href="/slides" className="flex items-center gap-2 text-sm font-mono tracking-wide uppercase text-[#6B6660] hover:text-[#2D2A26] transition-colors">
            <Presentation size={14} /> 课件学习
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex gap-12 -mb-px mt-2">
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

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

        {/* ═══════════════════ 仪表盘 ═══════════════════ */}
        {activeSubTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!dbData ? (
              <div className="max-w-2xl mx-auto border border-[#E5E1D8] bg-white rounded-xl shadow-sm p-8 space-y-6 mt-10">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-[#D97706]/10 text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} />
                  </div>
              <h2 className="text-2xl font-bold text-[#2D2A26]">初始化经营数据大屏</h2>
              <p className="text-[#6B6660] text-sm mt-2">填写业务规模与目标，系统会推演并监控实时数据指标。</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">所在行业</label>
                      <input type="text" value={dbConfig.industry} onChange={e => setDbConfig({...dbConfig, industry: e.target.value})}
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">目标客户画像</label>
                      <input type="text" value={dbConfig.customerProfile} onChange={e => setDbConfig({...dbConfig, customerProfile: e.target.value})}
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">本月营销预算</label>
                      <div className="flex gap-2">
                        <input type="number" value={dbConfig.marketingBudget} onChange={e => setDbConfig({...dbConfig, marketingBudget: e.target.value})}
                          className="flex-1 bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg" />
                        <span className="w-12 flex items-center justify-center bg-[#F3F1ED] border border-[#E5E1D8] rounded-lg text-sm text-[#6B6660]">{dbConfig.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">销售团队规模</label>
                      <div className="flex gap-2">
                        <input type="number" value={dbConfig.teamSize} onChange={e => setDbConfig({...dbConfig, teamSize: e.target.value})}
                          className="flex-1 bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg" />
                        <span className="w-12 flex items-center justify-center bg-[#F3F1ED] border border-[#E5E1D8] rounded-lg text-sm text-[#6B6660]">人</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">月度营收总目标</label>
                      <div className="flex gap-2">
                         <input type="number" value={dbConfig.target} onChange={e => setDbConfig({...dbConfig, target: e.target.value})}
                           className="flex-1 bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg" />
                         <select value={dbConfig.unit} onChange={e => setDbConfig({...dbConfig, unit: e.target.value})}
                           className="w-24 bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg">
                           <option value="万">万</option>
                           <option value="千万">千万</option>
                         </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase">当期核心经营重心</label>
                      <select value={dbConfig.priority} onChange={e => setDbConfig({...dbConfig, priority: e.target.value})}
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] outline-none focus:border-[#D97706] rounded-lg">
                        <option>获取新客 (扩大流量盘)</option>
                        <option>提高转化率 (精细化运营)</option>
                        <option>提升客单价 (大客户战略)</option>
                        <option>老带新转介绍 (口碑运营)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleGenerateDashboard} disabled={dbGenerating}
                    className="w-full bg-[#D97706] text-white font-bold tracking-widest py-3.5 rounded-xl hover:bg-[#B45309] transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {dbGenerating ? <><RefreshCw size={18} className="animate-spin"/> 深度推演中...</> : <><BarChart3 size={18}/> 生成高维数据大屏</>}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 重新生成按钮 */}
                <div className="flex justify-end mb-4">
                  <button onClick={() => setDbData(null)} className="text-sm text-[#9E9B96] hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                    <RefreshCw size={14} /> 重新推演
                  </button>
                </div>

                {/* KPI 卡片 — 可点击展开详情 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  {dbData.kpis.map((kpi, i) => (
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

            <div className="grid lg:grid-cols-[1fr_380px] gap-6">
              {/* 销售漏斗 — hover 显示详情 */}
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <h3 className="text-base font-bold text-[#2D2A26] mb-5">销售漏斗</h3>
                <div className="space-y-3">
                  {dbData.pipeline.map((stage, i) => {
                    const maxCount = dbData.pipeline[0]?.count || 1;
                    let width = (stage.count / maxCount) * 100;
                    // 增强漏斗的视觉效果，避免断崖式下跌导致后面的柱子细成一根针
                    if (width < 5 && stage.count > 0) width = 5 + (width / 5) * 5; 
                    if (stage.count === maxCount) width = 100;
                    
                    const convRate = i > 0 ? ((stage.count / dbData.pipeline[i - 1].count) * 100).toFixed(1) : "100";
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
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <h3 className="text-base font-bold text-[#2D2A26] mb-4">最近成交</h3>
                <div className="space-y-3">
                  {dbData.deals.map((deal, i) => {
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
            </>
            )}
          </motion.div>
        )}

        {/* ═══════════════════ AI 报告 ═══════════════════ */}
        {activeSubTab === "report" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                <FileText size={18} className="text-[#D97706]" /> 经营报告
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
                    placeholder="输入本期工作要点...（不填则使用示例数据）" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[180px] resize-y rounded-lg" rows={7} />
                </div>
                <button onClick={handleGenerateReport} disabled={reportLoading}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {reportLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 一键生成报告</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
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

        {/* ═══════════════════ 成交分析 (AI 洞察) ═══════════════════ */}
        {activeSubTab === "analysis" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[#2D2A26] mb-6">高维数据洞察与建议</h2>
            {!dbData ? (
              <div className="flex flex-col items-center justify-center h-[350px] text-center border-2 border-dashed border-[#E5E1D8] bg-[#FAF9F6] rounded-xl m-2">
                <TrendingUp size={28} className="text-[#A3A3A3] mb-3" />
                <p className="text-[#6B6660] font-medium">请先在【智能仪表盘】配置大盘数据</p>
              <p className="text-sm text-[#9E9B96] mt-2">系统将根据最新推演数据，深挖异动指标并提供决断建议</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(dbData.insights || insights).map((item, i) => (
                  <motion.div key={i}
                    className={`p-8 border bg-white rounded-xl transition-colors cursor-pointer ${expandedInsight === i ? "border-[#A3A3A3]" : "border-[#E5E1D8] hover:border-[#A3A3A3]"}`}
                    onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}>
                    <div className="flex items-start justify-between">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block ${
                        item.type === "warning" ? "bg-yellow-500/10 text-yellow-500" : item.type === "insight" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                      }`}>{item.type === "warning" ? "预警" : item.type === "insight" ? "洞察" : "建议"}</span>
                      {expandedInsight === i ? <ChevronUp size={14} className="text-[#6B6660]" /> : <ChevronDown size={14} className="text-[#6B6660]" />}
                    </div>
                    <h4 className="text-lg font-semibold text-[#2D2A26] mb-2">{item.title}</h4>
                    <p className="text-sm text-[#6B6660] leading-relaxed">{item.text}</p>
                    
                    <AnimatePresence>
                      {expandedInsight === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-4 pt-4 border-t border-[#E5E1D8]">
                            <p className="text-sm text-[#444] whitespace-pre-wrap leading-relaxed bg-[#FAF9F6] p-4 rounded-lg font-mono">{item.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
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
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                      if (!dbData) { alert("请先生成智能仪表盘数据"); return; }
                      const newRows = (dbData.deals || []).map((deal: any, i: number) => ({
                        id: `ai-${Date.now()}-${i}`,
                        name: deal.client,
                        status: deal.status === "signed" ? "completed" : "pending",
                        priority: "high",
                        date: deal.date,
          owner: "系统分配"
                      }));
                      setTrackingRows([...newRows, ...trackingRows]);
                    }} 
                    className="px-4 py-2 border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-sm hover:bg-[#D97706]/10 transition-colors flex items-center gap-1 rounded-lg font-medium">
              <Sparkles size={14} /> 同步最新大盘报表
                  </button>
                  <button onClick={addRow} className="px-4 py-2 border border-[#E5E1D8] bg-white text-[#666] text-sm hover:border-[#D97706] hover:text-[#2D2A26] transition-colors flex items-center gap-1 rounded-lg shadow-sm">
                    <Plus size={14} /> 新建任务
                  </button>
                </div>
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


      </main>
    </div>
  );
}
