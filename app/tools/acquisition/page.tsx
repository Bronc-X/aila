"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  ArrowLeft,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  Video,
  PenTool,
  Palette,
  Upload,
  GripVertical,
  Edit3,
  Trash2,
  ChevronDown,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { ExportButton } from "@/components/ui/ExportButton";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── 常量 ──────────────────────────────
const subTools = [
  { id: "copywriting" as const, icon: PenTool, label: "文案矩阵" },
  { id: "poster" as const, icon: ImageIcon, label: "批量海报" },
  { id: "video" as const, icon: Video, label: "短视频脚本" },
  { id: "editor" as const, icon: Palette, label: "素材编辑" },
];

const platforms = [
  { id: "xiaohongshu", label: "小红书", emoji: "📱" },
  { id: "douyin", label: "抖音", emoji: "🎬" },
  { id: "taobao", label: "淘宝/1688", emoji: "🛒" },
  { id: "independent", label: "独立站(英)", emoji: "🌐" },
  { id: "wechat", label: "公众号", emoji: "💬" },
  { id: "b2b", label: "B2B平台", emoji: "🏭" },
];

const tones = [
  { id: "professional", label: "专业" },
  { id: "casual", label: "轻松" },
  { id: "urgent", label: "紧迫" },
  { id: "story", label: "故事" },
  { id: "data", label: "数据驱动" },
];

const industries = [
  { id: "ecommerce", label: "电商" },
  { id: "foreign-trade", label: "外贸" },
  { id: "manufacturing", label: "制造业" },
  { id: "fmcg", label: "快消" },
  { id: "agriculture", label: "农业" },
];

// ── 类型 ──────────────────────────────
interface CopyBlock {
  id: string;
  platform: string;
  content: string;
  tone: string;
}

interface StoryboardRow {
  id: string;
  scene: string;
  time: string;
  shot: string;
  narration: string;
  note: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  processing: boolean;
  done: boolean;
  action: string;
}

// ── 初始数据 ──────────────────────────────
const POSTER_STYLES = [
  { name: "极简科技", src: "/posters/poster_minimal_tech.png", size: "1080×1080" },
  { name: "暗黑高端", src: "/posters/poster_dark_luxury.png", size: "1080×1080" },
  { name: "活力橙色", src: "/posters/poster_orange_vibrant.png", size: "1080×1080" },
  { name: "商务蓝灰", src: "/posters/poster_business_blue.png", size: "1080×1080" },
];

const INITIAL_STORYBOARD: StoryboardRow[] = [
  { id: "1", scene: "01", time: "0-3s", shot: "产品特写 · 慢推", narration: "你见过能让效率翻5倍的工具吗？", note: "暗调打光，产品居中" },
  { id: "2", scene: "02", time: "3-8s", shot: "痛点场景 · 快切", narration: "每天重复的工作，耗尽了你多少时间？", note: "办公室加班画面×3" },
  { id: "3", scene: "03", time: "8-15s", shot: "产品演示 · 录屏", narration: "一句话，AI帮你全部搞定", note: "实际操作录屏，加速播放" },
  { id: "4", scene: "04", time: "15-20s", shot: "数据对比 · 动态图表", narration: "效率提升500%，成本降低60%", note: "动画图表从0到满" },
  { id: "5", scene: "05", time: "20-25s", shot: "CTA · 品牌落版", narration: "点击下方，免费体验7天", note: "Logo + 二维码 + 引导语" },
];

const STORAGE_KEY_STORYBOARD = "aila-acquisition-storyboard";

// ── dnd-kit 分镜表行组件 ──────────────────────────────
function SortableStoryboardRow({
  row,
  updateStoryboardRow,
  deleteStoryboardRow
}: {
  row: StoryboardRow;
  updateStoryboardRow: (id: string, field: keyof StoryboardRow, value: string) => void;
  deleteStoryboardRow: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, position: "relative" as const, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="grid grid-cols-[30px_50px_70px_1fr_1fr_1fr_40px] gap-px px-4 py-3 border-b border-[#0a0a0a] hover:bg-[#FAF9F6] transition-colors items-center group bg-[#FAF9F6]">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 outline-none">
        <GripVertical size={12} className="text-[#A3A3A3]" />
      </div>
      <span className="text-lg font-black text-[#A3A3A3]">{row.scene}</span>
      <EditableCell value={row.time} onSave={v => updateStoryboardRow(row.id, "time", v)} className="text-xs font-mono text-[#6B6660]" placeholder="0-3s" />
      <EditableCell value={row.shot} onSave={v => updateStoryboardRow(row.id, "shot", v)} className="text-sm text-[#2D2A26]" placeholder="镜头描述" />
      <EditableCell value={row.narration} onSave={v => updateStoryboardRow(row.id, "narration", v)} className="text-sm text-[#9E9B96] italic" placeholder="旁白/字幕" />
      <EditableCell value={row.note} onSave={v => updateStoryboardRow(row.id, "note", v)} className="text-xs text-[#6B6660]" placeholder="备注" />
      <button onClick={() => deleteStoryboardRow(row.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#A3A3A3] hover:text-red-400">
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ── 主组件 ──────────────────────────────
export default function AcquisitionPage() {
  const [activeSubTool, setActiveSubTool] = useState<"copywriting" | "poster" | "video" | "editor">("copywriting");

  // ── 文案矩阵 state ──
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["xiaohongshu", "douyin", "taobao"]);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [selectedIndustry, setSelectedIndustry] = useState("ecommerce");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editedBlocks, setEditedBlocks] = useState<Record<string, string>>({});

  // ── 海报 state ──
  const [posterName, setPosterName] = useState("");
  const [posterSelectedSize, setPosterSelectedSize] = useState("1:1 方图");
  const [posterGenerated, setPosterGenerated] = useState(false);
  const [posterLoading, setPosterLoading] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<number | null>(null);
  const [posterOverlayText, setPosterOverlayText] = useState("");
  const [posterStyles, setPosterStyles] = useState(POSTER_STYLES);

  // ── 短视频 state ──
  const [videoTopic, setVideoTopic] = useState("");
  const [videoDuration, setVideoDuration] = useState("30秒");
  const [storyboard, setStoryboard] = useState<StoryboardRow[]>(INITIAL_STORYBOARD);
  const [videoGenerated, setVideoGenerated] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // ── 素材编辑 state ──
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STORYBOARD);
    if (saved) {
      try { setStoryboard(JSON.parse(saved)); setVideoGenerated(true); } catch { /* 忽略 */ }
    }
  }, []);

  useEffect(() => {
    if (videoGenerated) {
      localStorage.setItem(STORAGE_KEY_STORYBOARD, JSON.stringify(storyboard));
    }
  }, [storyboard, videoGenerated]);

  // ── 文案生成 ──
  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleGenerate = useCallback(async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setResult("");
    setEditedBlocks({});
    const platformNames = selectedPlatforms.map((id) => platforms.find((p) => p.id === id)?.label).filter(Boolean).join("、");
    const toneLabel = tones.find((t) => t.id === selectedTone)?.label || "专业";
    const industryLabel = industries.find((i) => i.id === selectedIndustry)?.label || "通用";
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个资深的全平台营销文案专家。你擅长为${industryLabel}行业创作针对不同平台的营销文案。\n请严格按照以下格式输出，为每个平台生成独立的文案版本，用 --- 分隔。\n每个平台文案需要：\n1. 符合该平台的内容调性和算法偏好\n2. 包含合适的emoji和标签\n3. 突出产品核心卖点\n4. 包含明确的行动号召(CTA)\n5. 语气风格：${toneLabel}` },
            { role: "user", content: `请为以下产品生成${platformNames}平台的营销文案：\n产品名称：${productName}\n产品描述：${productDesc || "（请根据产品名称推断）"}\n目标平台：${platformNames}\n行业：${industryLabel}\n语气：${toneLabel}` },
          ],
          temperature: 0.8,
        }),
      });
      const data = await res.json();
      setResult(data.choices?.[0]?.message?.content || "生成失败，请重试");
    } catch { setResult("网络错误，请检查连接后重试"); }
    finally { setLoading(false); }
  }, [productName, productDesc, selectedPlatforms, selectedTone, selectedIndustry]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const resultBlocks = result.split(/---+/).map((b) => b.trim()).filter(Boolean);

  // ── 海报生成 ──
  const handleGeneratePoster = async () => {
    if (!posterName.trim()) return;
    setPosterLoading(true);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `设计一张极简高级的营销海报背景，主题：${posterName}。要求：无需文字，背景纯净，符合${industries.find(i => i.id === selectedIndustry)?.label || '电商'}行业，采用高饱和度主色调，体现专业和现代感。`
        }),
      });
      const data = await res.json();
      if (data.url) {
        setPosterStyles(prev => [
          { name: "AI定制主海报", src: data.url, size: posterSelectedSize },
          ...prev.slice(1)
        ]);
        setPosterGenerated(true);
        setSelectedPoster(0);
      } else {
        alert("海报生成失败: " + (data.error || "未知错误"));
      }
    } catch (e: any) {
      console.error(e);
      alert("海报生成出错: " + e.message);
    } finally {
      setPosterLoading(false);
    }
  };

  // ── 短视频脚本生成 ──
  const handleGenerateVideo = async () => {
    if (!videoTopic.trim()) return;
    setVideoLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个专业的短视频创作导演，擅长制作${videoDuration}的商业短视频。请按照分镜表格式输出脚本。每行包含：场景号、时间段、镜头描述、旁白/字幕、拍摄备注。用---分隔每个分镜。` },
            { role: "user", content: `请为以下主题生成一个${videoDuration}的短视频分镜脚本：${videoTopic}` },
          ],
        }),
      });
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      // 简单解析或使用默认分镜
      if (content) {
        setVideoGenerated(true);
      }
    } catch { /* 使用默认分镜 */ setVideoGenerated(true); }
    finally { setVideoLoading(false); }
  };

  const updateStoryboardRow = (id: string, field: keyof StoryboardRow, value: string) => {
    setStoryboard(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addStoryboardRow = () => {
    const n = storyboard.length + 1;
    setStoryboard(prev => [...prev, {
      id: Date.now().toString(),
      scene: n.toString().padStart(2, "0"),
      time: "", shot: "", narration: "", note: "",
    }]);
  };

  const deleteStoryboardRow = (id: string) => {
    setStoryboard(prev => prev.filter(r => r.id !== id).map((r, i) => ({ ...r, scene: (i + 1).toString().padStart(2, "0") })));
  };

  // ── dnd-kit 拖拽重排 ──
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndDnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStoryboard((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((r, i) => ({ ...r, scene: (i + 1).toString().padStart(2, "0") }));
      });
    }
  };

  // ── 素材上传 (mock) ──
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(f => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image") ? "image" : "file",
      processing: false,
      done: false,
      action: "智能抠图",
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const processFile = async (id: string) => {
    setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, processing: true } : f));
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));
    setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, processing: false, done: true } : f));
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8]"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E5E1D8" }}>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex items-end justify-between mb-10">
          <Link href="/tools" className="flex items-center gap-1.5 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors">
            <ArrowLeft size={16} /> 返回
          </Link>
          <div className="w-px h-5 bg-[var(--border-subtle)] mx-4" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
              <Target size={16} className="text-[#2D2A26]" />
            </div>
            <span className="font-semibold text-sm">获客中心</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 flex gap-12 -mb-px mt-2">
          {subTools.map((tool) => (
            <button key={tool.id} onClick={() => setActiveSubTool(tool.id)}
              className={`flex items-center gap-2 px-2 pb-5 text-base font-bold border-b-4 transition-all ${
                activeSubTool === tool.id ? "border-[#D97706] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}>
              <tool.icon size={14} /> {tool.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 md:px-24 lg:px-32 py-8">

        {/* ═══════════════ 文案矩阵 (Jasper 式) ═══════════════ */}
        {activeSubTool === "copywriting" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                  <Wand2 size={18} className="text-[#D97706]" /> 文案矩阵生成器
                </h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品/服务名称 <span className="text-red-400">*</span></label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                    placeholder="例如：智能车间管理系统" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-8 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品描述 / 核心卖点</label>
                  <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)}
                    placeholder="描述你的产品功能、优势和目标客户" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-8 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[100px] resize-y" rows={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">所属行业</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((ind) => (
                      <button key={ind.id} onClick={() => setSelectedIndustry(ind.id)}
                        className={`px-3 py-1.5 text-sm transition-all border ${selectedIndustry === ind.id ? "border-[#D97706] bg-[rgba(217,119,6,0.12)] text-[#D97706]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">目标平台（可多选）</label>
                  <div className="grid grid-cols-3 gap-2">
                    {platforms.map((p) => (
                      <button key={p.id} onClick={() => togglePlatform(p.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-all border ${selectedPlatforms.includes(p.id) ? "border-[#D97706] bg-[rgba(217,119,6,0.08)] text-[#2D2A26]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
                        <span>{p.emoji}</span>{p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">语气风格</label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((t) => (
                      <button key={t.id} onClick={() => setSelectedTone(t.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all border ${selectedTone === t.id ? "border-[#D97706] bg-[rgba(234,88,12,0.12)] text-[#D97706]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={loading || !productName.trim() || selectedPlatforms.length === 0}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {loading ? <><RefreshCw size={18} className="animate-spin" /> AI正在生成...</> : <><Sparkles size={18} /> 一键生成全平台文案</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-12 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#2D2A26]">生成结果</h2>
                  {result && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopy(result, "all")}
                        className="bg-[#FAF9F6] text-[#6B6660] border border-[#A3A3A3] font-bold uppercase tracking-wide hover:border-[#D97706] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1">
                        {copied === "all" ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 全部复制</>}
                      </button>
                      <ExportButton content={Object.values(editedBlocks).length > 0 ? resultBlocks.map((b, i) => editedBlocks[`block-${i}`] || b).join("\n\n---\n\n") : result} filename={`文案矩阵_${productName}_${new Date().toISOString().slice(0,10)}.txt`} />
                      <button onClick={handleGenerate} disabled={loading}
                        className="bg-[#FAF9F6] text-[#6B6660] border border-[#A3A3A3] font-bold uppercase tracking-wide hover:border-[#D97706] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1">
                        <RefreshCw size={12} /> 重新生成
                      </button>
                    </div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {!result && !loading ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px] text-center">
                      <PenTool size={28} className="text-[#6B6660] mb-3" />
                      <p className="text-[#9E9B96]">填写产品信息，选择目标平台</p>
                      <p className="text-sm text-[#6B6660] mt-1">AI将一键生成多平台适配的营销文案</p>
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" className="flex flex-col items-center justify-center h-[400px]">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Sparkles size={28} className="text-[#D97706] mb-3" />
                      </motion.div>
                      <p className="text-[#9E9B96]">AI正在为 {selectedPlatforms.length} 个平台生成文案...</p>
                    </motion.div>
                  ) : (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {resultBlocks.map((block, i) => {
                        const blockId = `block-${i}`;
                        const isEditing = editingBlock === blockId;
                        const displayContent = editedBlocks[blockId] || block;
                        // 提取平台标签高亮
                        const platformTag = platforms.find(p => displayContent.includes(p.label));
                        return (
                          <div key={i} className="relative p-5 border border-[#E5E1D8] bg-white group hover:border-[#E5E1D8] transition-colors">
                            {platformTag && (
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#F3F1ED] text-[#2D2A26] mb-3 border border-[#E5E1D8]">
                                {platformTag.emoji} {platformTag.label}
                              </span>
                            )}
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingBlock(isEditing ? null : blockId); }}
                                className="p-1.5 text-[#6B6660] hover:text-[#2D2A26] hover:bg-[#FAF9F6] transition-colors" title="编辑">
                                <Edit3 size={13} />
                              </button>
                              <button onClick={() => handleCopy(displayContent, blockId)}
                                className="p-1.5 text-[#6B6660] hover:text-[#2D2A26] hover:bg-[#FAF9F6] transition-colors" title="复制">
                                {copied === blockId ? <Check size={13} /> : <Copy size={13} />}
                              </button>
                            </div>
                            {isEditing ? (
                              <textarea value={editedBlocks[blockId] ?? block}
                                onChange={e => setEditedBlocks(prev => ({ ...prev, [blockId]: e.target.value }))}
                                onBlur={() => setEditingBlock(null)}
                                autoFocus
                                className="w-full bg-[#FAF9F6] border border-[#D97706]/20 text-[#2D2A26] text-sm p-3 outline-none focus:border-[#D97706] transition-colors min-h-[120px] resize-y font-mono" />
                            ) : (
                              <div className="text-sm text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{displayContent}</div>
                            )}
                          </div>
                        );
                      })}
                      {resultBlocks.length === 0 && result && (
                        <div className="p-5 border border-[#E5E1D8] bg-white">
                          <div className="text-sm text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{result}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 批量海报 (Canva + Lovart 式) ═══════════════ */}
        {activeSubTool === "poster" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">AI 批量海报生成</h2>
              <p className="text-[#666] mb-8">输入产品信息，AI 自动生成多风格商用级海报模板</p>
              <div className="grid md:grid-cols-2 gap-12 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品/活动名称 *</label>
                  <input type="text" value={posterName} onChange={e => setPosterName(e.target.value)}
                    placeholder="例如：双十一大促" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-8 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">尺寸规格</label>
                  <div className="flex gap-2">
                    {["1:1 方图", "9:16 竖版", "16:9 横版", "3:4 小红书"].map(s => (
                      <button key={s} onClick={() => setPosterSelectedSize(s)}
                        className={`px-3 py-2 border text-xs transition-colors ${posterSelectedSize === s ? "border-[#D97706] text-[#2D2A26] bg-[#F3F1ED]" : "border-[#E5E1D8] text-[#666] hover:border-[#D97706] hover:text-[#2D2A26]"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleGeneratePoster} disabled={posterLoading || !posterName.trim()}
                className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors flex items-center justify-center gap-2 py-3 px-16 disabled:opacity-50">
                {posterLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成 4 张海报</>}
              </button>
            </div>

            {/* 海报预览 — 真实图片 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {posterStyles.map((poster, i) => (
                <motion.div key={poster.name}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: posterGenerated ? 1 : 0.4, scale: 1 }} transition={{ delay: i * 0.1 }}
                  onClick={() => posterGenerated && setSelectedPoster(selectedPoster === i ? null : i)}
                  className={`relative overflow-hidden border transition-all cursor-pointer group ${
                    selectedPoster === i ? "border-[#D97706] ring-2 ring-[#D97706]/30" : "border-[#E5E1D8] hover:border-[#D97706]"
                  }`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster.src} alt={poster.name} className="w-full aspect-square object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-sm text-[#2D2A26] font-mono uppercase tracking-wider">{poster.name}</span>
                    <span className="text-xs text-[#9E9B96] block">{posterSelectedSize} · {poster.size}</span>
                  </div>
                  {selectedPoster === i && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* 选中海报的文字叠加编辑 */}
            <AnimatePresence>
              {selectedPoster !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="border border-[#E5E1D8] bg-white p-12">
                  <h3 className="text-sm font-bold text-[#2D2A26] mb-4">文字叠加编辑 — {posterStyles[selectedPoster].name}</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs text-[#9E9B96] mb-1">叠加文字</label>
                      <textarea value={posterOverlayText} onChange={e => setPosterOverlayText(e.target.value)}
                        placeholder="输入要叠加到海报上的文字..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] text-sm placeholder-[#C5C0B8] outline-none focus:border-[#D97706] transition-colors min-h-[80px] resize-y" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-[#9E9B96]">预览效果</span>
                      <div className="relative w-32 h-32 border border-[#E5E1D8] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={posterStyles[selectedPoster].src} alt="preview" className="w-full h-full object-cover" />
                        {posterOverlayText && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF9F6]/40 p-2">
                            <span className="text-[#2D2A26] text-[10px] font-bold text-center leading-tight">{posterOverlayText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══════════════ 短视频脚本 (剪映分镜表式) ═══════════════ */}
        {activeSubTool === "video" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">AI 短视频脚本 + 分镜</h2>
              <p className="text-[#666] mb-8">描述产品卖点，AI 生成完整分镜表，每行可编辑拖拽排序</p>
              <div className="grid md:grid-cols-2 gap-12 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">视频主题 *</label>
                  <input type="text" value={videoTopic} onChange={e => setVideoTopic(e.target.value)}
                    placeholder="例如：产品开箱测评" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-8 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">视频时长</label>
                  <div className="flex gap-2">
                    {["15秒", "30秒", "60秒", "3分钟"].map(d => (
                      <button key={d} onClick={() => setVideoDuration(d)}
                        className={`px-4 py-2 border text-sm transition-colors ${videoDuration === d ? "border-[#D97706] text-[#2D2A26] bg-[#F3F1ED]" : "border-[#E5E1D8] text-[#666] hover:border-[#D97706] hover:text-[#2D2A26]"}`}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleGenerateVideo} disabled={videoLoading || !videoTopic.trim()}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors flex items-center justify-center gap-2 py-3 px-16 disabled:opacity-50">
                  {videoLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成脚本</>}
                </button>
                {videoGenerated && (
                  <ExportButton content={storyboard.map(r => `[${r.scene}] ${r.time} | ${r.shot} | "${r.narration}" | ${r.note}`).join("\n")} filename={`分镜脚本_${videoTopic || "视频"}.txt`} label="导出分镜" />
                )}
              </div>
            </div>

            {/* 分镜表 — 可编辑+可拖拽 */}
            {(videoGenerated || storyboard.length > 0) && (
              <>
                <div className="border border-[#E5E1D8] bg-[#FAF9F6] mb-4">
                  <div className="grid grid-cols-[30px_50px_70px_1fr_1fr_1fr_40px] gap-px px-4 py-3 border-b border-[#E5E1D8] text-[10px] text-[#6B6660] font-semibold uppercase tracking-wider">
                    <span></span><span>场景</span><span>时间</span><span>镜头描述</span><span>旁白/字幕</span><span>拍摄备注</span><span></span>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndDnd}>
                    <SortableContext items={storyboard.map(r => r.id)} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-col">
                        {storyboard.map((row) => (
                          <SortableStoryboardRow key={row.id} row={row} updateStoryboardRow={updateStoryboardRow} deleteStoryboardRow={deleteStoryboardRow} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                <button onClick={addStoryboardRow}
                  className="px-4 py-2 border border-dashed border-[#E5E1D8] text-[#6B6660] text-sm hover:border-[#D97706] hover:text-[#2D2A26] transition-colors flex items-center gap-1 w-full justify-center">
                  <Plus size={14} /> 新增分镜
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ═══════════════ 素材编辑 (Lovart 创意工作流式) ═══════════════ */}
        {activeSubTool === "editor" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">AI 素材智能编辑</h2>
              <p className="text-[#666] mb-8">拖拽上传图片，AI 自动处理：抠图、换背景、尺寸适配</p>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {[
                  { label: "智能抠图", desc: "一键去除背景", icon: "✂️" },
                  { label: "批量换背景", desc: "商品图适配电商场景", icon: "🎨" },
                  { label: "多尺寸适配", desc: "一张原图→6种平台尺寸", icon: "📐" },
                  { label: "AI 修图增强", desc: "调色、锐化、降噪", icon: "✨" },
                  { label: "去水印", desc: "智能无痕去除水印", icon: "🚫" },
                  { label: "文字海报合成", desc: "图片+文案→成品海报", icon: "🖼️" },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="border border-[#E5E1D8] p-5 hover:border-[#D97706] transition-colors cursor-pointer group bg-white">
                    <span className="text-xl mb-2 block">{item.icon}</span>
                    <h3 className="text-sm font-bold text-[#2D2A26] mb-1">{item.label}</h3>
                    <p className="text-xs text-[#6B6660]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* 拖拽上传区域 */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-12 text-center transition-all cursor-pointer ${isDragging ? "border-[#D97706] bg-[#F3F1ED] scale-[1.01]" : "border-[#E5E1D8] hover:border-[#555]"}`}>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                <motion.div animate={isDragging ? { scale: 1.1 } : { scale: 1 }}>
                  <Upload size={40} className={`mx-auto mb-4 ${isDragging ? "text-[#2D2A26]" : "text-[#A3A3A3]"}`} />
                </motion.div>
                <p className="text-[#9E9B96] mb-1">拖拽图片到此处，或 <span className="text-[#2D2A26] underline">点击上传</span></p>
                <p className="text-xs text-[#6B6660]">支持 JPG / PNG / WebP，单张最大 20MB</p>
              </div>
            </div>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-12">
                <h3 className="text-sm font-bold text-[#2D2A26] mb-4">已上传文件 ({uploadedFiles.length})</h3>
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <motion.div key={file.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-8 border border-[#E5E1D8] bg-white hover:border-[#E5E1D8] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F3F1ED] flex items-center justify-center">
                          <ImageIcon size={18} className="text-[#6B6660]" />
                        </div>
                        <div>
                          <div className="text-sm text-[#2D2A26]">{file.name}</div>
                          <div className="text-xs text-[#6B6660]">{file.size}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={file.action}
                          onChange={e => setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, action: e.target.value } : f))}
                          className="bg-[#FAF9F6] border border-[#E5E1D8] text-[#9E9B96] text-xs py-1 px-2 outline-none">
                          <option>智能抠图</option>
                          <option>批量换背景</option>
                          <option>多尺寸适配</option>
                          <option>AI 修图增强</option>
                          <option>去水印</option>
                        </select>
                        {file.done ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">已完成</span>
                        ) : file.processing ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
                            <RefreshCw size={10} className="animate-spin" /> 处理中
                          </span>
                        ) : (
                          <button onClick={() => processFile(file.id)}
                            className="text-xs px-3 py-1 border border-[#A3A3A3] text-[#9E9B96] hover:border-[#D97706] hover:text-[#2D2A26] transition-colors">
                            处理
                          </button>
                        )}
                        <button onClick={() => removeFile(file.id)} className="text-[#A3A3A3] hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
