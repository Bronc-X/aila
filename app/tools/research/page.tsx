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
  { value: "expired", label: "部分过期", color: "bg-orange-500/10 text-orange-400" },
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
  { label: "市场规模", value: "¥4,280亿", change: "+38%", sub: "2026E", detail: "2024年市场规模约¥3,100亿，预计2026年达到¥4,280亿。主要增长驱动力：\n1. 政策推动新能源基建\n2. 技术成本下降30%\n3. 企业数字化转型加速" },
  { label: "头部玩家", value: "12 家", change: "CR5 = 62%", sub: "集中度中等", detail: "Top 5 玩家占据62%市场份额：\n1. A公司 - 18%\n2. B公司 - 15%\n3. C公司 - 12%\n4. D公司 - 9%\n5. E公司 - 8%\n\n机会：长尾市场仍有38%份额可争夺" },
  { label: "增速预期", value: "26.5%", change: "CAGR", sub: "2024-2028", detail: "年复合增长率26.5%，分阶段：\n- 2024-2025: 35% (爆发期)\n- 2025-2026: 28% (增长期)\n- 2026-2028: 18% (稳定期)\n\n风险：宏观经济放缓可能下调3-5个百分点" },
];

const STORAGE_KEY_ASSETS = "aila-research-assets";
const STORAGE_KEY_NOTES = "aila-research-notes";

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<"brainstorm" | "prototype" | "market" | "assets">("brainstorm");

  // ── 头脑风暴 ──
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
    { id: "brainstorm" as const, label: "头脑风暴", icon: Brain },
    { id: "prototype" as const, label: "快速原型", icon: Zap },
    { id: "market" as const, label: "市场研判", icon: TrendingUp },
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

  // ── 头脑风暴生成便签卡片 ──
  const handleBrainstorm = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStickyNotes([]);
    const selectedRoleData = selectedRoles.map(id => roles.find(r => r.id === id)).filter(Boolean);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: `你是一个多角色创新工作坊主持人。请模拟以下角色讨论。每个角色输出1-2个核心观点，用---分隔每个角色的发言。格式：角色名\n观点内容` },
          { role: "user", content: `主题：${topic}\n参与角色：${selectedRoleData.map(r => r?.label).join("、")}` },
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
          { role: "system", content: "你是一个产品验证专家。请从以下维度评估产品构想：\n1.市场需求评分(1-10)及理由\n2.技术可行性评分(1-10)及理由\n3.竞品差异化评分(1-10)及理由\n4.商业模型评分(1-10)及理由\n5.SWOT分析(优势/劣势/机会/威胁各2-3条)\n6.MVP功能清单(5-8个核心功能，用checkbox格式)\n最后给出总体建议。" },
          { role: "user", content: `产品构想：${protoIdea}` },
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
              <span className="font-semibold text-sm">研发工坊</span>
            </div>
          </div>
          <Link href="/slides" className="flex items-center gap-2 text-sm font-mono tracking-wide uppercase text-[#6B6660] hover:text-[#2D2A26] transition-colors">
            <Presentation size={14} /> 课件学习
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex gap-12 -mb-px mt-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-2 pb-5 text-base font-bold border-b-4 transition-all ${
                activeTab === tab.id ? "border-[#D97706] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}><tab.icon size={14} /> {tab.label}</button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-8">

        {/* ═══════════════ 头脑风暴 (Miro 便签板式) ═══════════════ */}
        {activeTab === "brainstorm" && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Brain size={18} /> AI 多角色头脑风暴</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">讨论主题 *</label>
                  <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
                    placeholder="例如：如何用AI降低制造业质检成本？" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[100px] resize-y" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">参与角色（多选）</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button key={r.id} onClick={() => toggleRole(r.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-sm transition-all border ${
                          selectedRoles.includes(r.id) ? "border-[#D97706] bg-[#F3F1ED] text-[#2D2A26]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"
                        }`}><span>{r.emoji}</span> {r.label}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleBrainstorm} disabled={loading || !topic.trim() || selectedRoles.length === 0}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {loading ? <><RefreshCw size={18} className="animate-spin" /> 讨论中...</> : <><Sparkles size={18} /> 开始头脑风暴</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">便签板</h2>
                  {stickyNotes.length > 0 && (
                    <ExportButton content={stickyNotes.map(n => `[${n.role}] ${n.content} (投票:${n.vote} 状态:${n.status})`).join("\n\n")} filename="头脑风暴.txt" />
                  )}
                </div>
                {stickyNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Brain size={32} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">选择角色并输入主题</p>
                    <p className="text-sm text-[#6B6660]">每个角色生成一张「便签卡片」</p>
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
                          <button onClick={() => voteNote(note.id, 1)} className="text-[10px] px-2 py-0.5 border border-[#E5E1D8] text-[#6B6660] hover:border-[#D97706] hover:text-[#2D2A26] transition-colors">+1</button>
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

        {/* ═══════════════ 快速原型 (Notion AI 结构化输出) ═══════════════ */}
        {activeTab === "prototype" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Zap size={18} /> 快速原型验证</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品构想 *</label>
                  <textarea value={protoIdea} onChange={e => setProtoIdea(e.target.value)}
                    placeholder="描述你的产品idea：解决什么问题？目标用户？核心功能？" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[140px] resize-y" rows={5} />
                </div>
                <button onClick={handleProtoValidate} disabled={protoLoading || !protoIdea.trim()}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {protoLoading ? <><RefreshCw size={18} className="animate-spin" /> 分析中...</> : <><Sparkles size={18} /> AI 验证分析</>}
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
                    <p className="text-[#9E9B96]">描述产品构想后生成</p>
                    <p className="text-sm text-[#6B6660]">AI将输出多维评分 + SWOT + MVP清单</p>
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

        {/* ═══════════════ 市场研判 (Gemini Canvas 式) ═══════════════ */}
        {activeTab === "market" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 mb-6 rounded-xl">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">市场趋势研判</h2>
              <p className="text-[#666] mb-8">点击数据卡片展开详情面板</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {MARKET_CARDS.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                  className={`border bg-white p-5 cursor-pointer transition-all rounded-xl ${expandedCard === i ? "border-[#D97706] shadow-sm" : "border-[#E5E1D8] hover:border-[#D97706]"}`}>
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
                <h2 className="text-xl font-bold text-[#2D2A26]">数字资产盘点</h2>
                <p className="text-xs text-[#6B6660] mt-1">Notion 式数据表格 · 行内编辑 · 状态管理 · localStorage 持久化</p>
              </div>
              <button onClick={addAsset} className="px-4 py-2 border border-[#E5E1D8] text-[#666] text-sm hover:border-[#D97706] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                <Plus size={14} /> 新增资产
              </button>
            </div>
            <div className="border border-[#E5E1D8] bg-[#FAF9F6]">
              <div className="grid grid-cols-[140px_100px_110px_70px_1fr_40px] gap-px px-5 py-3 border-b border-[#E5E1D8] text-[10px] text-[#6B6660] font-semibold uppercase tracking-wider">
                <span>资产类别</span><span>数量</span><span>归档状态</span><span>风险</span><span>描述</span><span></span>
              </div>
              {assets.map((asset) => (
                <div key={asset.id} className="grid grid-cols-[140px_100px_110px_70px_1fr_40px] gap-px px-5 py-3 border-b border-[#0a0a0a] hover:bg-[#FAF9F6] transition-colors items-center group">
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
