"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ArrowLeft, FileSignature, BookOpen, CalendarClock, Workflow,
  Sparkles, RefreshCw, Copy, Check, Plus, X, Edit3, ChevronDown, ChevronUp, Download, Presentation,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { ExportButton } from "@/components/ui/ExportButton";
import { postJson, type ChatApiResponse } from "@/lib/api-client";

// ── 类型 ──────────────────────────────
interface ContractClause {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

interface MinuteItem {
  id: string;
  type: "decision" | "action" | "question";
  content: string;
  assignee: string;
  deadline: string;
}

interface ShiftCell {
  shift: string;
  locked: boolean;
}

interface ProcessStep {
  id: string;
  step: string;
  time: string;
  auto: string;
  tool: string;
  optimized: boolean;
}

// ── 常量 ──────────────────────────────
const contractTypes = [
  { id: "sales", label: "销售合同" },
  { id: "service", label: "服务协议" },
  { id: "nda", label: "保密协议" },
  { id: "employment", label: "劳动合同" },
  { id: "procurement", label: "采购合同" },
];

const SHIFT_LABELS: Record<string, { label: string; color: string }> = {
  "早": { label: "早", color: "text-green-400" },
  "中": { label: "中", color: "text-yellow-400" },
  "晚": { label: "晚", color: "text-blue-400" },
  "休": { label: "休", color: "text-[#A3A3A3]" },
};

const DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const STAFF = ["张三", "李四", "王五", "赵六", "钱七", "孙八"];

const INITIAL_PROCESS: ProcessStep[] = [
  { id: "1", step: "客户下单", time: "15min", auto: "可自动化", tool: "表单 → CRM 自动同步", optimized: false },
  { id: "2", step: "运营审核", time: "2h", auto: "可半自动", tool: "AI规则引擎预审 + 异常人工复核", optimized: false },
  { id: "3", step: "仓库确认", time: "30min", auto: "可自动化", tool: "ERP库存API实时查询", optimized: false },
  { id: "4", step: "财务开票", time: "1h", auto: "可自动化", tool: "发票系统API直连", optimized: false },
  { id: "5", step: "物流通知", time: "20min", auto: "可自动化", tool: "短信/微信模板自动推送", optimized: false },
];

const INITIAL_MINUTES: MinuteItem[] = [
  { id: "1", type: "decision", content: "Q2目标调整为150万", assignee: "", deadline: "" },
  { id: "2", type: "decision", content: "技术团队本周完成POC", assignee: "技术组", deadline: "本周五" },
  { id: "3", type: "action", content: "确认预算审批", assignee: "张总", deadline: "4/5" },
  { id: "4", type: "action", content: "整理竞品分析报告", assignee: "小王", deadline: "4/3" },
  { id: "5", type: "action", content: "安排客户回访", assignee: "李经理", deadline: "4/4" },
  { id: "6", type: "question", content: "新产品定价策略需补充市场调研数据", assignee: "", deadline: "" },
  { id: "7", type: "question", content: "外包团队交付时间需重新对齐", assignee: "", deadline: "" },
];

// 生成确定性排班表
function generateShifts(): Record<string, ShiftCell[]> {
  const pattern = [
    ["早", "早", "中", "中", "晚", "休", "休"],
    ["中", "晚", "早", "早", "中", "早", "休"],
    ["晚", "中", "早", "晚", "早", "休", "早"],
    ["早", "早", "晚", "早", "休", "早", "中"],
    ["中", "中", "早", "早", "早", "休", "晚"],
    ["晚", "早", "早", "中", "休", "晚", "早"],
  ];
  const result: Record<string, ShiftCell[]> = {};
  STAFF.forEach((name, i) => {
    result[name] = pattern[i].map(s => ({ shift: s, locked: false }));
  });
  return result;
}

const STORAGE_KEY_PROCESS = "aila-admin-process";
const STORAGE_KEY_MINUTES = "aila-admin-minutes";
const STORAGE_KEY_SHIFTS = "aila-admin-shifts";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"contract" | "minutes" | "schedule" | "process">("contract");

  // ── 合同 ──
  const [contractType, setContractType] = useState("sales");
  const [contractInput, setContractInput] = useState("");
  const [contractClauses, setContractClauses] = useState<ContractClause[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── 会议纪要 ──
  const [meetingInput, setMeetingInput] = useState("");
  const [minutes, setMinutes] = useState<MinuteItem[]>(INITIAL_MINUTES);
  const [minutesLoading, setMinutesLoading] = useState(false);
  const [minutesGenerated, setMinutesGenerated] = useState(false);

  // ── 排班 ──
  const [shifts, setShifts] = useState<Record<string, ShiftCell[]>>(generateShifts);
  const [teamSize, setTeamSize] = useState("6");
  const [shiftType, setShiftType] = useState("三班倒");
  const [shiftConstraint, setShiftConstraint] = useState("");

  // ── 流程诊断 ──
  const [processInput, setProcessInput] = useState("");
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(INITIAL_PROCESS);
  const [processGenerated, setProcessGenerated] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const tabs = [
    { id: "contract" as const, label: "合同助手", icon: FileSignature },
    { id: "minutes" as const, label: "会议纪要", icon: BookOpen },
    { id: "schedule" as const, label: "排班优化", icon: CalendarClock },
    { id: "process" as const, label: "流程诊断", icon: Workflow },
  ];

  // localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROCESS);
    if (saved) try { setProcessSteps(JSON.parse(saved)); setProcessGenerated(true); } catch { /* 忽略 */ }
    const savedMin = localStorage.getItem(STORAGE_KEY_MINUTES);
    if (savedMin) try { setMinutes(JSON.parse(savedMin)); setMinutesGenerated(true); } catch { /* 忽略 */ }
    const savedShifts = localStorage.getItem(STORAGE_KEY_SHIFTS);
    if (savedShifts) try { setShifts(JSON.parse(savedShifts)); } catch { /* 忽略 */ }
  }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PROCESS, JSON.stringify(processSteps)); }, [processSteps]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_MINUTES, JSON.stringify(minutes)); }, [minutes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_SHIFTS, JSON.stringify(shifts)); }, [shifts]);

  // ── 合同生成 (分条款输出) ──
  const handleGenerateContract = async () => {
    setLoading(true);
    setContractClauses([]);
    const typeLabel = contractTypes.find(t => t.id === contractType)?.label || "合同";
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是企业法务助手。生成${typeLabel}草稿，用---分隔每个条款，每条格式：\n条款标题\n条款内容\n需人工补充处用[_____]` },
            { role: "user", content: contractInput || `生成通用${typeLabel}模板，甲方科技公司，标的10万，期限1年` },
          ],
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const blocks = content.split(/---+/).filter((b: string) => b.trim());
      setContractClauses(blocks.map((b: string, i: number) => {
        const lines = b.trim().split("\n");
        return { id: (i + 1).toString(), title: lines[0]?.trim() || `第${i + 1}条`, content: lines.slice(1).join("\n").trim(), editable: false };
      }));
    } catch { setContractClauses([{ id: "err", title: "错误", content: "生成失败，请重试", editable: false }]); }
    finally { setLoading(false); }
  };

  const updateClause = (id: string, content: string) => {
    setContractClauses(prev => prev.map(c => c.id === id ? { ...c, content } : c));
  };

  const toggleClauseEdit = (id: string) => {
    setContractClauses(prev => prev.map(c => c.id === id ? { ...c, editable: !c.editable } : c));
  };

  // ── 会议纪要操作 ──
  const handleGenerateMinutes = async () => {
    if (!meetingInput.trim()) return;
    setMinutesLoading(true);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: "你是会议纪要助手。将会议记录整理为结构化纪要。输出JSON数组(不含markdown代码块)，每项：{\"type\":\"decision|action|question\",\"content\":\"...\",\"assignee\":\"...\",\"deadline\":\"...\"}" },
          { role: "user", content: meetingInput },
        ],
      });
      const content = data.choices?.[0]?.message?.content || "";

      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        throw new Error("会议纪要返回格式异常，请重试");
      }

      setMinutes(
        parsed.map((item: MinuteItem, index: number) => ({
          ...item,
          id: `${Date.now()}-${index}`,
        }))
      );
      setMinutesGenerated(true);
    } catch (error) {
      setMinutesGenerated(false);
      alert(error instanceof Error ? error.message : "会议纪要生成失败，请重试");
    }
    finally { setMinutesLoading(false); }
  };

  const updateMinuteItem = (id: string, field: keyof MinuteItem, value: string) => {
    setMinutes(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMinuteItem = (type: MinuteItem["type"]) => {
    setMinutes(prev => [...prev, { id: Date.now().toString(), type, content: "", assignee: "", deadline: "" }]);
  };

  const deleteMinuteItem = (id: string) => setMinutes(prev => prev.filter(m => m.id !== id));

  // ── 排班操作 ──
  const cycleShift = (name: string, dayIdx: number) => {
    const order = ["早", "中", "晚", "休"];
    setShifts(prev => {
      const updated = { ...prev };
      const cell = updated[name][dayIdx];
      if (cell.locked) return prev;
      const nextIdx = (order.indexOf(cell.shift) + 1) % order.length;
      updated[name] = [...updated[name]];
      updated[name][dayIdx] = { ...cell, shift: order[nextIdx] };
      return updated;
    });
  };

  const toggleLock = (name: string, dayIdx: number) => {
    setShifts(prev => {
      const updated = { ...prev };
      updated[name] = [...updated[name]];
      updated[name][dayIdx] = { ...updated[name][dayIdx], locked: !updated[name][dayIdx].locked };
      return updated;
    });
  };

  // ── 流程优化 ──
  const handleProcessDiagnosis = async () => {
    setProcessLoading(true);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: "分析流程..." },
          { role: "user", content: "诊断并推荐方案：流程自动化" },
        ],
      });
      const content = data.choices?.[0]?.message?.content || "";

      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        throw new Error("流程诊断返回格式异常，请重试");
      }

      setProcessSteps(
        parsed.map((item: any, index: number) => ({
          ...item,
          id: `${Date.now()}-${index}`,
        }))
      );
      setProcessGenerated(true);
    } catch (error) {
      setProcessGenerated(false);
      alert(error instanceof Error ? error.message : "流程诊断失败，请重试");
    } finally {
      setProcessLoading(false);
    }
  };

  const toggleOptimized = (id: string) => {
    setProcessSteps(prev => prev.map(s => s.id === id ? { ...s, optimized: !s.optimized } : s));
  };

  const addProcessStep = () => {
    setProcessSteps(prev => [...prev, { id: Date.now().toString(), step: "", time: "", auto: "", tool: "", optimized: false }]);
  };

  const deleteProcessStep = (id: string) => setProcessSteps(prev => prev.filter(s => s.id !== id));

  // 计算优化效果
  const totalMinutes = processSteps.reduce((sum, s) => {
    const match = s.time.match(/(\d+)/);
    const hrs = s.time.includes("h") ? parseInt(match?.[1] || "0") * 60 : parseInt(match?.[1] || "0");
    return sum + hrs;
  }, 0);
  const optimizedSteps = processSteps.filter(s => s.optimized).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8]"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E5E1D8" }}>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex items-center justify-between mb-10">
          <div className="flex items-center gap-0">
            <Link href="/tools" className="flex items-center gap-1.5 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors">
              <ArrowLeft size={16} /> 返回
            </Link>
            <div className="w-px h-5 bg-[#E5E1D8] mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
                <Building2 size={16} className="text-[#2D2A26]" />
              </div>
              <span className="font-semibold text-sm">行政效率</span>
            </div>
          </div>
          <Link href="/slides" className="flex items-center gap-2 text-sm font-mono tracking-wide uppercase text-[#6B6660] hover:text-[#2D2A26] transition-colors">
            <Presentation size={14} /> 课件学习
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-24 lg:px-32 flex gap-6 sm:gap-12 overflow-x-auto overscroll-x-contain -mb-px mt-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 px-2 pb-5 text-base font-bold whitespace-nowrap border-b-4 transition-all ${
                activeTab === tab.id ? "border-[#22d665] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}><tab.icon size={14} /> {tab.label}</button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-8">

        {/* ═══════════════ 合同助手 (分条款可编辑) ═══════════════ */}
        {activeTab === "contract" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><FileSignature size={18} /> 合同文档助手</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">合同类型</label>
                  <div className="flex flex-wrap gap-2">
                    {contractTypes.map(t => (
                      <button key={t.id} onClick={() => setContractType(t.id)}
                        className={`px-3 py-1.5 text-sm transition-all border ${contractType === t.id ? "border-[#22d665] bg-[#F3F1ED] text-[#2D2A26]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">关键信息</label>
                  <textarea value={contractInput} onChange={e => setContractInput(e.target.value)}
                    placeholder="甲乙方、金额、期限等（不填使用模板）" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[160px] resize-y" rows={6} />
                </div>
                <button onClick={handleGenerateContract} disabled={loading}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {loading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成合同草稿</>}
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">合同草稿 · 逐条编辑</h2>
                  {contractClauses.length > 0 && (
                    <ExportButton content={contractClauses.map(c => `【${c.title}】\n${c.content}`).join("\n\n")} filename={`合同_${contractTypes.find(t => t.id === contractType)?.label}.txt`} />
                  )}
                </div>
                {contractClauses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <FileSignature size={32} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">选择类型后生成</p>
                    <p className="text-sm text-[#6B6660]">输出分条款合同草稿，每条可独立编辑并人工复核</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {contractClauses.map((clause, i) => (
                      <motion.div key={clause.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-8 border border-[#E5E1D8] bg-white group hover:border-[#E5E1D8] transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-[#6B6660]">{String(i + 1).padStart(2, "0")}</span>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#2D2A26]">{clause.title}</h4>
                          </div>
                          <button onClick={() => toggleClauseEdit(clause.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#6B6660] hover:text-[#2D2A26] transition-all">
                            <Edit3 size={12} />
                          </button>
                        </div>
                        {clause.editable ? (
                          <textarea value={clause.content} onChange={e => updateClause(clause.id, e.target.value)}
                            onBlur={() => toggleClauseEdit(clause.id)} autoFocus
                            className="w-full bg-[#FAF9F6] border border-[#22d665]/20 text-[#2D2A26] text-xs p-3 outline-none focus:border-[#22d665] transition-colors min-h-[80px] resize-y font-mono" />
                        ) : (
                          <p className="text-xs text-[#9E9B96] leading-relaxed whitespace-pre-wrap">{clause.content}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 会议纪要 (Notion 结构化 + 行内编辑) ═══════════════ */}
        {activeTab === "minutes" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><BookOpen size={18} /> 会议纪要整理</h2>
                <div className="border-2 border-dashed border-[#E5E1D8] p-6 text-center hover:border-[#22d665] transition-colors cursor-pointer rounded-xl">
                  <BookOpen size={28} className="text-[#A3A3A3] mx-auto mb-2" />
                  <p className="text-xs text-[#9E9B96]">上传录音 (MP3/WAV/M4A)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">或粘贴文字记录</label>
                  <textarea value={meetingInput} onChange={e => setMeetingInput(e.target.value)}
                    placeholder="粘贴会议记录..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[120px] resize-y" rows={4} />
                </div>
                <button onClick={handleGenerateMinutes} disabled={minutesLoading || !meetingInput.trim()}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {minutesLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成结构化纪要</>}
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#2D2A26]">结构化纪要 · 可编辑</h2>
                  <div className="flex gap-2">
                    <ExportButton content={minutes.map(m => `[${m.type}] ${m.content} @${m.assignee} deadline:${m.deadline}`).join("\n")} filename="会议纪要.txt" />
                  </div>
                </div>
                {(["decision", "action", "question"] as const).map(type => {
                  const typeConfig = {
                    decision: { label: "决议事项", color: "text-[#2D2A26]", bg: "bg-[#F3F1ED]" },
                    action: { label: "行动项", color: "text-[#2D2A26]", bg: "bg-blue-500/5" },
                    question: { label: "存疑待确认", color: "text-yellow-400", bg: "bg-yellow-500/5" },
                  }[type];
                  const items = minutes.filter(m => m.type === type);
                  return (
                    <div key={type} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-bold ${typeConfig.color}`}>{typeConfig.label}</h3>
                        <button onClick={() => addMinuteItem(type)} className="text-[10px] text-[#6B6660] hover:text-[#2D2A26] flex items-center gap-0.5 transition-colors">
                          <Plus size={10} /> 添加
                        </button>
                      </div>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className={`p-3 border border-[#E5E1D8] ${typeConfig.bg} group flex items-start gap-3`}>
                            <div className="flex-1">
                              <EditableCell value={item.content} onSave={v => updateMinuteItem(item.id, "content", v)} className="text-xs text-[#9E9B96]" placeholder="内容" />
                            </div>
                            {(type === "action") && (
                              <>
                                <div className="w-20">
                                  <EditableCell value={item.assignee} onSave={v => updateMinuteItem(item.id, "assignee", v)} className="text-[10px] text-[#6B6660]" placeholder="@负责人" />
                                </div>
                                <div className="w-16">
                                  <EditableCell value={item.deadline} onSave={v => updateMinuteItem(item.id, "deadline", v)} className="text-[10px] text-[#6B6660]" placeholder="截止" />
                                </div>
                              </>
                            )}
                            <button onClick={() => deleteMinuteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-[#A3A3A3] hover:text-red-400 transition-all p-0.5">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 排班优化 (可交互排班表) ═══════════════ */}
        {activeTab === "schedule" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 mb-6 rounded-xl">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">排班优化演示</h2>
              <p className="text-[#666] mb-6">点击班次循环切换 · 右键锁定 · 数据自动保存</p>
            </div>
            <div className="border border-[#E5E1D8] bg-white p-6 mb-4 rounded-xl">
              <div className="grid grid-cols-8 gap-px text-xs text-center">
                <div className="p-3 text-[#6B6660] font-semibold">员工</div>
                {DAYS.map(d => <div key={d} className="p-3 text-[#9E9B96] font-semibold">{d}</div>)}
                {STAFF.map(name => (
                  <div key={name} className="contents">
                    <div className="p-3 text-[#2D2A26] font-medium border-t border-[#E5E1D8] text-left">{name}</div>
                    {shifts[name]?.map((cell, dayIdx) => (
                      <div key={dayIdx}
                        onClick={() => cycleShift(name, dayIdx)}
                        onContextMenu={(e) => { e.preventDefault(); toggleLock(name, dayIdx); }}
                        className={`p-3 border-t border-[#E5E1D8] cursor-pointer transition-colors hover:bg-[#F3F1ED] font-bold ${SHIFT_LABELS[cell.shift]?.color || "text-[#6B6660]"} ${cell.locked ? "ring-1 ring-inset ring-[#22d665]/30" : ""}`}>
                        {cell.shift}
                        {cell.locked && <span className="text-[8px] block text-[#A3A3A3]">🔒</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-8 text-xs text-[#6B6660]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full" /> 早班</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-400 rounded-full" /> 中班</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-400 rounded-full" /> 晚班</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#F3F1ED] rounded-full" /> 休息</span>
              <span className="text-[#A3A3A3] ml-auto">左键切换班次 · 右键锁定</span>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ 流程诊断 (可交互优化) ═══════════════ */}
        {activeTab === "process" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Workflow size={18} /> 流程自动化诊断</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">描述现有流程</label>
                  <textarea value={processInput} onChange={e => setProcessInput(e.target.value)}
                    placeholder="客户下单 → 审核 → 仓库确认 → ..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[160px] resize-y" rows={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">痛点反馈</label>
                  <div className="flex flex-wrap gap-2">
                    {["耗时长", "易出错", "依赖人工", "信息断层", "重复劳动", "难追踪"].map(p => (
                      <button key={p} className="px-3 py-1.5 border border-[#E5E1D8] text-[#666] text-sm hover:border-[#22d665] hover:text-[#2D2A26] transition-colors">{p}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleProcessDiagnosis} disabled={processLoading}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {processLoading ? <><RefreshCw size={18} className="animate-spin" /> 分析中...</> : <><Sparkles size={18} /> 诊断并推荐方案</>}
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="min-w-0">
              <div className="min-w-0 border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h2 className="text-lg font-bold text-[#2D2A26]">诊断报告 · 点击标记已优化</h2>
                  <button onClick={addProcessStep} className="text-xs text-[#6B6660] hover:text-[#2D2A26] flex items-center gap-1 transition-colors">
                    <Plus size={12} /> 新增步骤
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[420px] space-y-3">
                    {processSteps.map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className={`grid grid-cols-[120px_60px_80px_1fr_40px] gap-4 items-center p-3 border transition-colors group ${
                          item.optimized ? "border-green-500/20 bg-green-500/5" : "border-[#E5E1D8] bg-white"
                        }`}>
                        <EditableCell value={item.step} onSave={v => setProcessSteps(prev => prev.map(s => s.id === item.id ? { ...s, step: v } : s))} className="text-sm text-[#2D2A26] font-medium" placeholder="步骤" />
                        <EditableCell value={item.time} onSave={v => setProcessSteps(prev => prev.map(s => s.id === item.id ? { ...s, time: v } : s))} className="text-xs text-red-400 font-mono" placeholder="耗时" />
                        <button onClick={() => toggleOptimized(item.id)}
                          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${item.optimized ? "bg-green-500/20 text-green-400" : "bg-[#F3F1ED] text-[#9E9B96] hover:bg-green-500/10 hover:text-green-400"}`}>
                          {item.optimized ? "✅ 已优化" : item.auto}
                        </button>
                        <EditableCell value={item.tool} onSave={v => setProcessSteps(prev => prev.map(s => s.id === item.id ? { ...s, tool: v } : s))} className="text-xs text-[#9E9B96]" placeholder="推荐工具" />
                        <button onClick={() => deleteProcessStep(item.id)} className="opacity-0 group-hover:opacity-100 text-[#A3A3A3] hover:text-red-400 transition-all p-1">
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="p-8 border border-[#E5E1D8] bg-[#FAF9F6] mt-6">
                  <p className="text-sm text-[#2D2A26] font-bold mb-1">预计优化效果</p>
                  <p className="text-xs text-[#9E9B96]">
                    已优化 <span className="text-green-400 font-bold">{optimizedSteps}/{processSteps.length}</span> 个环节 · 
                    人工介入环节：{processSteps.length} → <span className="text-green-400 font-bold">{processSteps.length - optimizedSteps}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
