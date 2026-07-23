"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, ArrowLeft, Brain, Zap, TrendingUp, Database, Sparkles, RefreshCw,
  Copy, Check, Plus, X, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, GripVertical, Presentation,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { StatusDropdown } from "@/components/ui/StatusDropdown";
import { ExportButton } from "@/components/ui/ExportButton";
import { postJson, type ChatApiResponse } from "@/lib/api-client";

// ── 类型 ──────────────────────────────
interface StickyNote {
  id: string;
  role: string;
  emoji: string;
  content: string;
  vote: number;
  status: "new" | "adopted" | "rejected";
}

interface AssetRow {
  id: string;
  category: string;
  count: string;
  status: string;
  risk: string;
  desc: string;
}

interface MarketCard {
  label: string;
  value: string;
  change: string;
  sub: string;
  detail: string;
}

// ── 常量 ──────────────────────────────
const roles = [
  { id: "ceo", label: "CEO视角", emoji: "👔" },
  { id: "product", label: "产品经理", emoji: "📋" },
  { id: "engineer", label: "技术专家", emoji: "💻" },
  { id: "marketer", label: "市场营销", emoji: "📢" },
  { id: "finance", label: "财务分析", emoji: "💰" },
  { id: "customer", label: "客户代言", emoji: "🗣️" },
];

const RISK_OPTIONS = [
  { value: "high", label: "高", color: "bg-red-500/10 text-red-400" },
  { value: "medium", label: "中", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "low", label: "低", color: "bg-green-500/10 text-green-400" },
];

const ASSET_STATUS_OPTIONS = [
  { value: "scattered", label: "散落", color: "bg-red-500/10 text-red-400" },
  { value: "partial", label: "部分归档", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "archived", label: "已归档", color: "bg-green-500/10 text-green-400" },
  { value: "expired", label: "部分过期", color: "bg-emerald-500/10 text-emerald-400" },
  { value: "unstandardized", label: "无标准化", color: "bg-red-500/10 text-red-400" },
];

const INITIAL_ASSETS: AssetRow[] = [
  { id: "1", category: "客户数据", count: "12,847条", status: "scattered", risk: "high", desc: "分布在3个Excel + 微信聊天 + 2个CRM" },
  { id: "2", category: "产品文档", count: "286份", status: "partial", risk: "medium", desc: "飞书文档156份 + 本地Word 130份" },
  { id: "3", category: "销售话术", count: "45套", status: "unstandardized", risk: "high", desc: "各业务员自行维护，未统一知识库" },
  { id: "4", category: "培训资料", count: "78份", status: "archived", risk: "low", desc: "已存入企业网盘，分类清晰" },
  { id: "5", category: "合同模板", count: "23套", status: "expired", risk: "medium", desc: "5套已过期未更新法律条款" },
];

const MARKET_CARDS: MarketCard[] = [
  { label: "需求信号", value: "高频", change: "待核实", sub: "来自客户访谈", detail: "先记录客户反复提到的具体问题：谁在处理、每周发生几次、当前用什么办法绕过去。没有真实频次，就不急着估盘子大小。" },
  { label: "竞争替代", value: "3 类", change: "需对照", sub: "人工 / SaaS / 外包", detail: "验证时先列出现有替代方案：人工表格、通用 SaaS、外包服务。新工具只有在速度、质量或复核成本上更清楚，才值得继续做。" },
  { label: "落地风险", value: "4 项", change: "先排雷", sub: "数据 / 权限 / 习惯 / 复核", detail: "真实落地前要确认数据来源、权限范围、岗位习惯和人工复核位置。风险先摆出来，原型才不会停在演示层。" },
];

const STORAGE_KEY_ASSETS = "aila-research-assets";
const STORAGE_KEY_NOTES = "aila-research-notes";

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<"brainstorm" | "prototype" | "market" | "assets">("brainstorm");

  // ── 多角色评审 ──
  const [topic, setTopic] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["ceo", "product", "engineer"]);
  const [loading, setLoading] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [copied, setCopied] = useState(false);

  // ── 快速原型 ──
  const [protoIdea, setProtoIdea] = useState("");
  const [protoResult, setProtoResult] = useState("");
  const [protoLoading, setProtoLoading] = useState(false);
  const [protoChecks, setProtoChecks] = useState<Record<string, boolean>>({});

  // ── 市场研判 ──
  const [marketQuery, setMarketQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // ── 资产盘点 ──
  const [assets, setAssets] = useState<AssetRow[]>(INITIAL_ASSETS);

  const tabs = [
    { id: "brainstorm" as const, label: "多角色评审", icon: Brain },
    { id: "prototype" as const, label: "原型验证", icon: Zap },
    { id: "market" as const, label: "市场线索", icon: TrendingUp },
    { id: "assets" as const, label: "资产盘点", icon: Database },
  ];

  // localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ASSETS);
    if (saved) try { setAssets(JSON.parse(saved)); } catch { /* 忽略 */ }
    const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
    if (savedNotes) try { setStickyNotes(JSON.parse(savedNotes)); } catch { /* 忽略 */ }
  }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets)); }, [assets]);
  useEffect(() => { if (stickyNotes.length > 0) localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(stickyNotes)); }, [stickyNotes]);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  // ── 多角色评审生成便签卡片 ──
  const handleBrainstorm = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStickyNotes([]);
    const selectedRoleData = selectedRoles.map(id => roles.find(r => r.id === id)).filter(Boolean);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: `你是一个业务原型评审主持人。请模拟以下角色评审该业务问题。每个角色输出1-2个核心观点，用---分隔每个角色的发言。格式：角色名\n观点内容` },
          { role: "user", content: `业务问题：${topic}\n参与角色：${selectedRoleData.map(r => r?.label).join("、")}` },
        ],
        temperature: 0.9,
      });
      const content = data.choices?.[0]?.message?.content || "";
      // 解析为便签卡片
      const blocks = content.split(/---+/).filter((b: string) => b.trim());
      const notes: StickyNote[] = blocks.map((block: string, i: number) => {
        const matchRole = selectedRoleData[i % selectedRoleData.length];
        return {
          id: Date.now().toString() + i,
          role: matchRole?.label || "观点",
          emoji: matchRole?.emoji || "💡",
          content: block.trim(),
          vote: 0,
          status: "new" as const,
        };
      });
      setStickyNotes(notes);
    } catch (error) {
      setStickyNotes([
        {
          id: "err",
          role: "系统",
          emoji: "⚠️",
          content: error instanceof Error ? error.message : "生成失败，请重试",
          vote: 0,
          status: "new",
        },
      ]);
    } finally { setLoading(false); }
  };

  const voteNote = (id: string, delta: number) => {
    setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, vote: n.vote + delta } : n));
  };

  const setNoteStatus = (id: string, status: StickyNote["status"]) => {
    setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  // ── 快速原型验证 ──
  const handleProtoValidate = async () => {
    if (!protoIdea.trim()) return;
    setProtoLoading(true);
    setProtoChecks({});
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: "你是一个业务原型验证专家。请从以下维度评估原型设想：\n1.业务痛点评分(1-10)及理由\n2.数据与权限可行性评分(1-10)及理由\n3.人工复核边界评分(1-10)及理由\n4.岗位使用阻力评分(1-10)及理由\n5.主要风险与缓解动作各2-3条\n6.MVP功能清单(5-8个核心功能，用checkbox格式)\n最后给出是否继续投入下一版原型的建议。" },
          { role: "user", content: `原型设想：${protoIdea}` },
        ],
      });
      setProtoResult(data.choices?.[0]?.message?.content || "分析失败");
    } catch (error) {
      setProtoResult(error instanceof Error ? error.message : "网络错误，请重试");
    }
    finally { setProtoLoading(false); }
  };

  // ── 资产操作 ──
  const updateAsset = (id: string, field: keyof AssetRow, value: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addAsset = () => {
    setAssets(prev => [...prev, { id: Date.now().toString(), category: "", count: "", status: "scattered", risk: "medium", desc: "" }]);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

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
                <FlaskConical size={16} className="text-[#2D2A26]" />
              </div>
              <span className="font-semibold text-sm">验证工坊</span>
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

        {/* ═══════════════ 多角色评审 (Miro 便签板式) ═══════════════ */}
        {activeTab === "brainstorm" && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Brain size={18} /> 多角色评审</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">要验证的业务问题 *</label>
                  <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：质检异常太依赖老师傅，怎么先做辅助判断？" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[100px] resize-y" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">参与角色（多选）</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button key={r.id} onClick={() => toggleRole(r.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-sm transition-all border ${
                          selectedRoles.includes(r.id) ? "border-[#22d665] bg-[#F3F1ED] text-[#2D2A26]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"
                        }`}><span>{r.emoji}</span> {r.label}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleBrainstorm} disabled={loading || !topic.trim() || selectedRoles.length === 0}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {loading ? <><RefreshCw size={18} className="animate-spin" /> 评审中...</> : <><Sparkles size={18} /> 生成评审便签</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">便签板</h2>
                  {stickyNotes.length > 0 && (
                    <ExportButton content={stickyNotes.map(n => `[${n.role}] ${n.content} (投票:${n.vote} 状态:${n.status})`).join("\n\n")} filename="多角色评审.txt" />
                  )}
                </div>
                {stickyNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Brain size={32} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">选择角色并输入业务问题</p>
                    <p className="text-sm text-[#6B6660]">每个角色给出一张可取舍的评审便签</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-8">
                    {stickyNotes.sort((a, b) => b.vote - a.vote).map((note, i) => (
                      <motion.div key={note.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                        className={`p-8 border transition-colors ${
                          note.status === "adopted" ? "border-green-500/30 bg-green-500/5" : note.status === "rejected" ? "border-red-500/20 bg-red-500/5 opacity-50" : "border-[#E5E1D8] bg-white hover:border-[#A3A3A3]"
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-[#2D2A26] flex items-center gap-1.5">{note.emoji} {note.role}</span>
                          <div className="flex gap-1">
                            <button onClick={() => setNoteStatus(note.id, "adopted")} title="采纳"
                              className={`p-1 transition-colors ${note.status === "adopted" ? "text-green-400" : "text-[#A3A3A3] hover:text-green-400"}`}>
                              <ThumbsUp size={12} />
                            </button>
                            <button onClick={() => setNoteStatus(note.id, "rejected")} title="否决"
                              className={`p-1 transition-colors ${note.status === "rejected" ? "text-red-400" : "text-[#A3A3A3] hover:text-red-400"}`}>
                              <ThumbsDown size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#9E9B96] leading-relaxed mb-3 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => voteNote(note.id, 1)} className="text-[10px] px-2 py-0.5 border border-[#E5E1D8] text-[#6B6660] hover:border-[#22d665] hover:text-[#2D2A26] transition-colors">+1</button>
                          <span className="text-xs text-[#6B6660] font-mono">{note.vote > 0 ? `+${note.vote}` : note.vote}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 原型验证 (Notion AI 结构化输出) ═══════════════ */}
        {activeTab === "prototype" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Zap size={18} /> 原型验证</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">原型设想 *</label>
                  <textarea value={protoIdea} onChange={e => setProtoIdea(e.target.value)}
                    placeholder="描述要验证的原型：谁使用？输入什么？输出给谁？哪里需要人工确认？" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[140px] resize-y" rows={5} />
                </div>
                <button onClick={handleProtoValidate} disabled={protoLoading || !protoIdea.trim()}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
              {protoLoading ? <><RefreshCw size={18} className="animate-spin" /> 分析中...</> : <><Sparkles size={18} /> 验证分析</>}
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">验证报告</h2>
                  {protoResult && <ExportButton content={protoResult} filename="原型验证.txt" />}
                </div>
                {!protoResult ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <Zap size={32} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">描述原型后生成</p>
          <p className="text-sm text-[#6B6660]">输出风险、复核点和下一版 MVP 清单</p>
                  </div>
                ) : (
                  <div className="p-5 border border-[#E5E1D8] bg-white max-h-[500px] overflow-y-auto">
                    <div className="text-sm text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{protoResult}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 市场线索 (Gemini Canvas 式) ═══════════════ */}
        {activeTab === "market" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 mb-6 rounded-xl">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">市场线索研判</h2>
              <p className="text-[#666] mb-8">先看需求、替代方案和落地风险，再决定是否继续投入原型。</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {MARKET_CARDS.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                  className={`border bg-white p-5 cursor-pointer transition-all rounded-xl ${expandedCard === i ? "border-[#22d665] shadow-sm" : "border-[#E5E1D8] hover:border-[#22d665]"}`}>
                  <div className="text-xs text-[#6B6660] mb-2">{item.label}</div>
                  <div className="text-3xl font-black text-[#2D2A26] mb-1 tracking-normal">{item.value}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-green-400">{item.change}</span>
                    <span className="text-xs text-[#6B6660]">{item.sub}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#A3A3A3]">点击展开</span>
                    {expandedCard === i ? <ChevronUp size={12} className="text-[#6B6660]" /> : <ChevronDown size={12} className="text-[#6B6660]" />}
                  </div>
                  <AnimatePresence>
                    {expandedCard === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-[#E5E1D8]">
                          <p className="text-xs text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{item.detail}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ 资产盘点 (Notion 数据库式) ═══════════════ */}
        {activeTab === "assets" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#2D2A26]">企业资料盘点</h2>
                <p className="text-xs text-[#6B6660] mt-1">先确认材料分散在哪里、是否过期、能不能进入原型验证</p>
              </div>
              <button onClick={addAsset} className="px-4 py-2 border border-[#E5E1D8] text-[#666] text-sm hover:border-[#22d665] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                <Plus size={14} /> 新增资产
              </button>
            </div>
            <div className="overflow-x-auto border border-[#E5E1D8] bg-[#FAF9F6]">
              <div className="grid min-w-[620px] grid-cols-[140px_100px_110px_70px_1fr_40px] gap-px px-5 py-3 border-b border-[#E5E1D8] text-[10px] text-[#6B6660] font-semibold uppercase tracking-wider">
                <span>资产类别</span><span>数量</span><span>归档状态</span><span>风险</span><span>描述</span><span></span>
              </div>
              {assets.map((asset) => (
                <div key={asset.id} className="grid min-w-[620px] grid-cols-[140px_100px_110px_70px_1fr_40px] gap-px px-5 py-3 border-b border-[#0a0a0a] hover:bg-[#FAF9F6] transition-colors items-center group">
                  <EditableCell value={asset.category} onSave={v => updateAsset(asset.id, "category", v)} className="text-sm text-[#2D2A26] font-medium" placeholder="资产类别" />
                  <EditableCell value={asset.count} onSave={v => updateAsset(asset.id, "count", v)} className="text-sm text-[#9E9B96]" placeholder="数量" />
                  <StatusDropdown value={asset.status} options={ASSET_STATUS_OPTIONS} onChange={v => updateAsset(asset.id, "status", v)} />
                  <StatusDropdown value={asset.risk} options={RISK_OPTIONS} onChange={v => updateAsset(asset.id, "risk", v)} />
                  <EditableCell value={asset.desc} onSave={v => updateAsset(asset.id, "desc", v)} className="text-xs text-[#6B6660]" placeholder="描述" />
                  <button onClick={() => deleteAsset(asset.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#A3A3A3] hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3">共 {assets.length} 项资产 · 高风险 {assets.filter(a => a.risk === "high").length} 项</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
