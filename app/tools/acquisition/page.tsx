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
  User,
  Package,
  Layers,
  Maximize2,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
import { ExportButton } from "@/components/ui/ExportButton";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import {
  postJson,
  type ChatApiResponse,
  type ImageApiResponse,
} from "@/lib/api-client";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── 行业提示词映射 ──
const INDUSTRY_HINTS: Record<string, { placeholder: string; defaultDesc: string }> = {
  ecommerce: { placeholder: "例如：选品助手，跨境爆款预测", defaultDesc: "跨境电商平台" },
  manufacturing: { placeholder: "例如：智能质检系统，数字孪生工厂", defaultDesc: "智能制造" },
  fmcg: { placeholder: "例如：门店导购，库存智能预测", defaultDesc: "新零售" },
  service: { placeholder: "例如：智能排班系统，客户画像分析", defaultDesc: "服务业" },
  software: { placeholder: "例如：代码助手，智能运维平台", defaultDesc: "SaaS" },
  education: { placeholder: "例如：个性化教学，智能题库系统", defaultDesc: "教育科技" },
  healthcare: { placeholder: "例如：智能诊断辅助，健康管理平台", defaultDesc: "医疗健康" },
  agriculture: { placeholder: "例如：精准农业系统，农产品溯源", defaultDesc: "农业科技" },
  finance: { placeholder: "例如：智能风控系统，保险核保助手", defaultDesc: "金融保险" },
  logistics: { placeholder: "例如：智能调度系统，仓储机器人", defaultDesc: "智慧物流" },
  realestate: { placeholder: "例如：智能看房助手，房价预测分析", defaultDesc: "智慧地产" },
  other: { placeholder: "例如：流程解决方案，智能管理平台", defaultDesc: "通用行业" },
};

// ── 模特模板 ──
const MODEL_TEMPLATES = [
  { id: "model-1", name: "商务女性", preview: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", desc: "职业装站姿", style: "border-[#E5E1D8]" },
  { id: "model-2", name: "元气女性", preview: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop", desc: "日常时尚", style: "border-[#E5E1D8]" },
  { id: "model-3", name: "精英男性", preview: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop", desc: "成熟稳重", style: "border-[#E5E1D8]" },
  { id: "model-4", name: "阳光青年", preview: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop", desc: "时尚穿搭", style: "border-[#E5E1D8]" },
];

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

interface EditorFile {
  id: string;
  name: string;
  file: File;
  preview: string;
  category: "model" | "product";
}

// ── 初始数据 ──────────────────────────────
const POSTER_STYLES = [
  { name: "极简科技", src: "", size: "1080×1080", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)" },
  { name: "暗黑高端", src: "", size: "1080×1080", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
  { name: "活力橙色", src: "", size: "1080×1080", gradient: "linear-gradient(135deg, #a8f06a 0%, #22d665 50%, #15803d 100%)" },
  { name: "商务蓝灰", src: "", size: "1080×1080", gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)" },
];

const INITIAL_STORYBOARD: StoryboardRow[] = [
  { id: "1", scene: "01", time: "0-3s", shot: "产品特写 · 慢推", narration: "你见过能让效率翻5倍的工具吗？", note: "暗调打光，产品居中" },
  { id: "2", scene: "02", time: "3-8s", shot: "痛点场景 · 快切", narration: "每天重复的工作，耗尽了你多少时间？", note: "办公室加班画面×3" },
  { id: "3", scene: "03", time: "8-15s", shot: "产品演示 · 录屏", narration: "一句话，繁琐工作交给系统", note: "实际操作录屏，加速播放" },
  { id: "4", scene: "04", time: "15-20s", shot: "流程对比 · 动态图表", narration: "同样的任务，用更少步骤完成", note: "展示前后流程对比" },
  { id: "5", scene: "05", time: "20-25s", shot: "CTA · 品牌落版", narration: "预约演示，先看是否适合你的流程", note: "Logo + 二维码 + 引导语" },
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

  // ── 从 localStorage 读取用户行业 ──
  const [userIndustry, setUserIndustry] = useState("");
  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("aila-user-profile") || "{}");
      if (profile.industry) {
        setUserIndustry(profile.industry);
        setSelectedIndustry(profile.industry === "fmcg" ? "fmcg" : profile.industry === "manufacturing" ? "manufacturing" : profile.industry === "ecommerce" ? "ecommerce" : "ecommerce");
      }
    } catch { /* 忽略 */ }
  }, []);
  const industryHint = INDUSTRY_HINTS[userIndustry] || INDUSTRY_HINTS["other"];

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ── 短视频 state ──
  const [videoTopic, setVideoTopic] = useState("");
  const [videoDuration, setVideoDuration] = useState("30秒");
  const [storyboard, setStoryboard] = useState<StoryboardRow[]>(INITIAL_STORYBOARD);
  const [videoGenerated, setVideoGenerated] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // ── 素材编辑 state（模特+产品工作流） ──
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorModelFiles, setEditorModelFiles] = useState<EditorFile[]>([]);
  const [editorProductFiles, setEditorProductFiles] = useState<EditorFile[]>([]);
  const [selectedModelTemplate, setSelectedModelTemplate] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState("gradient-1");
  const [editorGenerating, setEditorGenerating] = useState(false);
  const [editorGeneratingText, setEditorGeneratingText] = useState("内容合成中...");
  const [editorResults, setEditorResults] = useState<string[]>([]);
  const [activeEditorTool, setActiveEditorTool] = useState<string | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);

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
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: `你是一个资深的全平台营销文案专家。你擅长为${industryLabel}行业创作针对不同平台的营销文案。\n请严格按照以下格式输出，为每个平台生成独立的文案版本，用 --- 分隔。\n每个平台文案需要：\n1. 符合该平台的内容调性和算法偏好\n2. 包含合适的emoji和标签\n3. 突出产品核心卖点\n4. 包含明确的行动号召(CTA)\n5. 语气风格：${toneLabel}` },
          { role: "user", content: `请为以下产品生成${platformNames}平台的营销文案：\n产品名称：${productName}\n产品描述：${productDesc || "（请根据产品名称推断）"}\n目标平台：${platformNames}\n行业：${industryLabel}\n语气：${toneLabel}` },
        ],
        temperature: 0.8,
      });
      setResult(data.choices?.[0]?.message?.content || "生成失败，请重试");
    } catch (error) {
      setResult(error instanceof Error ? error.message : "网络错误，请检查连接后重试");
    }
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
      const data = await postJson<ImageApiResponse>("/api/ai/image", {
        prompt: `设计一张极简高级的营销海报背景，主题：${posterName}。要求：无需文字，背景纯净，符合${industries.find(i => i.id === selectedIndustry)?.label || '电商'}行业，采用高饱和度主色调，体现专业和现代感。`,
      });

      if (!data.urls || data.urls.length === 0) {
        throw new Error("海报生成失败，请稍后重试");
      }

      setPosterStyles(prev => [
        { ...prev[0], name: "风格一：极简科技", src: data.urls?.[0] || "", size: posterSelectedSize },
        { ...prev[1], name: "风格二：暗黑高端", src: data.urls?.[1] || "", size: posterSelectedSize },
        { ...prev[2], name: "风格三：活力橙色", src: data.urls?.[2] || "", size: posterSelectedSize },
        { ...prev[3], name: "风格四：商务蓝灰", src: data.urls?.[3] || "", size: posterSelectedSize }
      ]);
      setPosterGenerated(true);
      setSelectedPoster(0);
    } catch (error) {
      setPosterGenerated(false);
      setSelectedPoster(null);
      alert(error instanceof Error ? error.message : "海报生成失败，请稍后重试");
    } finally {
      setPosterLoading(false);
    }
  };

  // ── 短视频脚本生成 ──
  const handleGenerateVideo = async () => {
    if (!videoTopic.trim()) return;
    setVideoLoading(true);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: `你是一个专业的短视频创作导演，擅长制作${videoDuration}的商业短视频。请按照分镜表格式输出脚本。每行包含：场景号、时间段、镜头描述、旁白/字幕、拍摄备注。用---分隔每个分镜。` },
          { role: "user", content: `请为以下主题生成一个${videoDuration}的短视频分镜脚本：${videoTopic}` },
        ],
      });
      const content = data.choices?.[0]?.message?.content || "";

      const blocks = content.split(/---+/).map((block) => block.trim()).filter(Boolean);
      if (blocks.length === 0) {
        throw new Error("短视频脚本生成失败，请稍后重试");
      }

      const rows = blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        return {
          id: `${Date.now()}-${index}`,
          scene: (index + 1).toString().padStart(2, "0"),
          time: lines[1] || "",
          shot: lines[2] || lines[0] || "",
          narration: lines[3] || "",
          note: lines[4] || "",
        };
      });

      setStoryboard(rows.length > 0 ? rows : INITIAL_STORYBOARD);
      setVideoGenerated(true);
    } catch (error) {
      setVideoGenerated(false);
      alert(error instanceof Error ? error.message : "短视频脚本生成失败，请稍后重试");
    }
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
        <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-24 lg:px-32 flex items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-0">
            <Link href="/tools" className="flex items-center gap-1.5 text-sm text-[#9E9B96] hover:text-[#2D2A26] transition-colors">
              <ArrowLeft size={16} /> 返回工具演示
            </Link>
            <div className="w-px h-5 bg-[#E5E1D8] mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6]">
                <Target size={16} className="text-[#2D2A26]" />
              </div>
              <span className="font-semibold text-sm">获客中心</span>
            </div>
          </div>
          <Link
            href="/slides"
            className="flex items-center gap-2 text-sm font-mono tracking-wide uppercase text-[#6B6660] hover:text-[#2D2A26] transition-colors"
          >
            <Presentation size={14} /> 课件学习
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-24 lg:px-32 flex flex-wrap gap-4 md:gap-12 -mb-px mt-2 overflow-x-auto">
          {subTools.map((tool) => (
            <button key={tool.id} onClick={() => setActiveSubTool(tool.id)}
              className={`flex items-center gap-2 px-2 pb-5 text-base font-bold border-b-4 transition-all ${
                activeSubTool === tool.id ? "border-[#22d665] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}>
              <tool.icon size={14} /> {tool.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 md:px-24 lg:px-32 py-8">

        {/* ═══════════════ 文案矩阵 (Jasper 式) ═══════════════ */}
        {activeSubTool === "copywriting" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 md:p-12 space-y-5">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                  <Wand2 size={18} className="text-[#22d665]" /> 文案矩阵生成器
                </h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品/服务名称 <span className="text-red-400">*</span></label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                    placeholder={industryHint.placeholder} className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品描述 / 核心卖点</label>
                  <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)}
                    placeholder={`描述你的${industryHint.defaultDesc}产品功能、优势和目标客户`} className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none font-mono text-sm min-h-[100px] resize-y" rows={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">所属行业</label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((ind) => (
                      <button key={ind.id} onClick={() => setSelectedIndustry(ind.id)}
                        className={`px-3 py-1.5 text-sm transition-all border ${selectedIndustry === ind.id ? "border-[#22d665] bg-[rgba(34, 214, 101,0.12)] text-[#22d665]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
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
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-all border ${selectedPlatforms.includes(p.id) ? "border-[#22d665] bg-[rgba(34, 214, 101,0.08)] text-[#2D2A26]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
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
                        className={`px-3 py-1.5 rounded-full text-sm transition-all border ${selectedTone === t.id ? "border-[#22d665] bg-[rgba(234,88,12,0.12)] text-[#22d665]" : "border-[#E5E1D8] text-[#6B6660] hover:border-[#A3A3A3]"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={loading || !productName.trim() || selectedPlatforms.length === 0}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                    {loading ? <><RefreshCw size={18} className="animate-spin" /> 正在生成...</> : <><Sparkles size={18} /> 一键生成全平台文案</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 md:p-12 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#2D2A26]">生成结果</h2>
                  {result && (
                    <div className="flex gap-2">
                      <button onClick={() => handleCopy(result, "all")}
                        className="bg-[#FAF9F6] text-[#6B6660] border border-[#A3A3A3] font-bold uppercase tracking-wide hover:border-[#22d665] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1">
                        {copied === "all" ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 全部复制</>}
                      </button>
                      <ExportButton content={Object.values(editedBlocks).length > 0 ? resultBlocks.map((b, i) => editedBlocks[`block-${i}`] || b).join("\n\n---\n\n") : result} filename={`文案矩阵_${productName}_${new Date().toISOString().slice(0,10)}.txt`} />
                      <button onClick={handleGenerate} disabled={loading}
                        className="bg-[#FAF9F6] text-[#6B6660] border border-[#A3A3A3] font-bold uppercase tracking-wide hover:border-[#22d665] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1">
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
              <p className="text-sm text-[#6B6660] mt-1">生成多平台适配的营销文案草稿，便于人工筛选和二次修改</p>
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" className="flex flex-col items-center justify-center h-[400px]">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Sparkles size={28} className="text-[#22d665] mb-3" />
                      </motion.div>
                    <p className="text-[#9E9B96]">正在为 {selectedPlatforms.length} 个平台生成文案...</p>
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
                                className="w-full bg-[#FAF9F6] border border-[#22d665]/20 text-[#2D2A26] text-sm p-3 outline-none focus:border-[#22d665] transition-colors min-h-[120px] resize-y font-mono" />
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
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 mb-6 rounded-xl">
            <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">批量海报草稿</h2>
            <p className="text-[#666] mb-8">输入产品信息，生成多风格海报方向，再由人工筛选和修正</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">产品/活动名称 *</label>
                  <input type="text" value={posterName} onChange={e => setPosterName(e.target.value)}
                    placeholder="例如：双十一大促" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none text-sm rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">尺寸规格</label>
                  <div className="flex gap-2">
                    {["1:1 方图", "9:16 竖版", "16:9 横版", "3:4 小红书"].map(s => (
                      <button key={s} onClick={() => setPosterSelectedSize(s)}
                        className={`px-3 py-2 border text-xs transition-colors ${posterSelectedSize === s ? "border-[#22d665] text-[#2D2A26] bg-[#F3F1ED]" : "border-[#E5E1D8] text-[#666] hover:border-[#22d665] hover:text-[#2D2A26]"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleGeneratePoster} disabled={posterLoading || !posterName.trim()}
                className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors flex items-center justify-center gap-2 py-3 px-16 disabled:opacity-50">
                {posterLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成 4 张海报</>}
              </button>
            </div>

            {/* 海报预览 — 可点击大图 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {posterStyles.map((poster, i) => (
                <motion.div key={poster.name}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: posterGenerated ? 1 : 0.4, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className={`relative overflow-hidden border transition-all cursor-pointer group rounded-xl ${
                    selectedPoster === i ? "border-[#22d665] ring-2 ring-[#22d665]/30" : "border-[#E5E1D8] hover:border-[#22d665]"
                  }`}>
                  {poster.src ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={poster.src} alt={poster.name} className="w-full aspect-square object-cover"
                      onClick={() => posterGenerated && setSelectedPoster(selectedPoster === i ? null : i)} />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center cursor-pointer"
                      style={{ background: (poster as any).gradient || "linear-gradient(135deg, #667eea, #764ba2)" }}
                      onClick={() => posterGenerated && setSelectedPoster(selectedPoster === i ? null : i)}>
                      <div className="text-center text-white">
                    <div className="text-3xl font-black mb-2">{posterName || "产品海报"}</div>
                        <div className="text-sm opacity-70">{poster.name}</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-sm text-white font-mono uppercase tracking-wider">{poster.name}</span>
                    <span className="text-xs text-white/60 block">{posterSelectedSize} · {poster.size}</span>
                  </div>
                  {selectedPoster === i && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#22d665] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  {/* 大图查看按钮 */}
                  {posterGenerated && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); setLightboxOpen(true); }}
                      className="absolute top-2 left-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-black/70">
                      <Maximize2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Lightbox 大图 */}
            {lightboxOpen && (
              <ImageLightbox
                images={posterStyles.map(p => ({ src: p.src, name: p.name, gradient: (p as any).gradient }))}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxOpen(false)}
                onNavigate={(idx) => setLightboxIndex(idx)}
                overlayText={posterOverlayText}
                productTitle={posterName}
              />
            )}

            {/* 选中海报的文字叠加编辑 */}
            <AnimatePresence>
              {selectedPoster !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="border border-[#E5E1D8] bg-white p-6 md:p-8 rounded-xl">
                  <h3 className="text-sm font-bold text-[#2D2A26] mb-4">文字叠加编辑 — {posterStyles[selectedPoster].name}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-[#9E9B96] mb-1">叠加文字</label>
                      <textarea value={posterOverlayText} onChange={e => setPosterOverlayText(e.target.value)}
                        placeholder="输入要叠加到海报上的文字..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] text-sm placeholder-[#C5C0B8] outline-none focus:border-[#22d665] transition-colors min-h-[80px] resize-y rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-[#9E9B96]">预览效果</span>
                      <div className="relative w-32 h-32 border border-[#E5E1D8] overflow-hidden rounded-lg">
                        {posterStyles[selectedPoster].src ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={posterStyles[selectedPoster].src} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-[8px] font-bold"
                            style={{ background: (posterStyles[selectedPoster] as any).gradient || "#667eea" }}>
                            {posterName}
                          </div>
                        )}
                        {posterOverlayText && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2">
                            <span className="text-white text-[10px] font-bold text-center leading-tight">{posterOverlayText}</span>
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
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 mb-6 rounded-xl">
            <h2 className="text-2xl font-bold text-[#2D2A26] mb-2">短视频脚本 + 分镜</h2>
            <p className="text-[#666] mb-8">描述产品卖点，生成完整分镜表，每行可编辑拖拽排序</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">视频主题 *</label>
                  <input type="text" value={videoTopic} onChange={e => setVideoTopic(e.target.value)}
                    placeholder="例如：产品开箱测评" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#22d665] transition-colors outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">视频时长</label>
                  <div className="flex gap-2">
                    {["15秒", "30秒", "60秒", "3分钟"].map(d => (
                      <button key={d} onClick={() => setVideoDuration(d)}
                        className={`px-4 py-2 border text-sm transition-colors ${videoDuration === d ? "border-[#22d665] text-[#2D2A26] bg-[#F3F1ED]" : "border-[#E5E1D8] text-[#666] hover:border-[#22d665] hover:text-[#2D2A26]"}`}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleGenerateVideo} disabled={videoLoading || !videoTopic.trim()}
                  className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#22d665] transition-colors flex items-center justify-center gap-2 py-3 px-16 disabled:opacity-50">
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
                  className="px-4 py-2 border border-dashed border-[#E5E1D8] text-[#6B6660] text-sm hover:border-[#22d665] hover:text-[#2D2A26] transition-colors flex items-center gap-1 w-full justify-center">
                  <Plus size={14} /> 新增分镜
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* ═══════════════ 素材编辑 (模特+产品合成工作流) ═══════════════ */}
        {activeSubTool === "editor" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 md:p-8 mb-6 rounded-xl">
            <h2 className="text-xl font-bold text-[#2D2A26] mb-1">素材合成工作台</h2>
            <p className="text-sm text-[#666] mb-6">上传模特图+产品图，合成后批量生成海报</p>

              {/* 工具选择卡片（可点击选中） */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {[
                  { id: "compose", label: "模特+产品合成", desc: "智能贴合姿势", icon: "👗", hot: true },
                  { id: "cutout", label: "智能抠图", desc: "一键去除背景", icon: "✂️" },
                  { id: "background", label: "批量换背景", desc: "适配电商场景", icon: "🎨" },
                  { id: "resize", label: "多尺寸适配", desc: "1图→6平台尺寸", icon: "📐" },
              { id: "enhance", label: "修图增强", desc: "调色·锐化·降噪", icon: "✨" },
                  { id: "poster", label: "文字海报合成", desc: "图片+文案→海报", icon: "🖼️" },
                ].map((item, i) => (
                  <motion.button key={item.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveEditorTool(activeEditorTool === item.id ? null : item.id)}
                    className={`relative border p-4 text-left transition-all cursor-pointer rounded-xl ${
                      activeEditorTool === item.id
                        ? "border-[#22d665] bg-[#22d665]/5 shadow-sm"
                        : "border-[#E5E1D8] bg-white hover:border-[#22d665]"
                    }`}>
                    {item.hot && (
                      <span className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 bg-[#22d665] text-white font-bold rounded-full">HOT</span>
                    )}
                    <span className="text-lg mb-1.5 block">{item.icon}</span>
                    <h3 className={`text-sm font-bold mb-0.5 ${activeEditorTool === item.id ? "text-[#22d665]" : "text-[#2D2A26]"}`}>{item.label}</h3>
                    <p className="text-[11px] text-[#9E9B96]">{item.desc}</p>
                    {activeEditorTool === item.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-[#22d665] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* 模特+产品上传工作流 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 模特图上传 */}
                <div className="border-2 border-dashed border-[#E5E1D8] rounded-xl p-6 text-center hover:border-[#22d665] transition-colors">
                  <input ref={modelInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).map(f => ({
                          id: Date.now().toString() + Math.random(),
                          name: f.name, file: f, preview: URL.createObjectURL(f), category: "model" as const
                        }));
                        setEditorModelFiles(prev => [...prev, ...files]);
                      }
                    }} />
                  <User size={28} className="mx-auto mb-3 text-[#9E9B96]" />
                  <p className="text-sm font-bold text-[#2D2A26] mb-1">模特图</p>
                  <p className="text-xs text-[#9E9B96] mb-3">上传模特照片（可选）</p>
                  {editorModelFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {editorModelFiles.map(f => (
                        <div key={f.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E5E1D8]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                          <button onClick={() => setEditorModelFiles(prev => prev.filter(x => x.id !== f.id))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white">
                            <Trash2 size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <button onClick={() => modelInputRef.current?.click()}
                    className="text-xs px-4 py-2 border border-[#E5E1D8] rounded-lg text-[#6B6660] hover:border-[#22d665] hover:text-[#22d665] transition-colors">
                    <Upload size={12} className="inline mr-1" /> 上传模特图
                  </button>
                </div>

                {/* 产品图上传 */}
                <div className="border-2 border-dashed border-[#E5E1D8] rounded-xl p-6 text-center hover:border-[#22d665] transition-colors">
                  <input ref={productInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).map(f => ({
                          id: Date.now().toString() + Math.random(),
                          name: f.name, file: f, preview: URL.createObjectURL(f), category: "product" as const
                        }));
                        setEditorProductFiles(prev => [...prev, ...files]);
                      }
                    }} />
                  <Package size={28} className="mx-auto mb-3 text-[#9E9B96]" />
                  <p className="text-sm font-bold text-[#2D2A26] mb-1">产品图 <span className="text-red-400">*</span></p>
                  <p className="text-xs text-[#9E9B96] mb-3">上传产品照片（必须）</p>
                  {editorProductFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {editorProductFiles.map(f => (
                        <div key={f.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E5E1D8]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                          <button onClick={() => setEditorProductFiles(prev => prev.filter(x => x.id !== f.id))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white">
                            <Trash2 size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <button onClick={() => productInputRef.current?.click()}
                    className="text-xs px-4 py-2 border border-[#E5E1D8] rounded-lg text-[#6B6660] hover:border-[#22d665] hover:text-[#22d665] transition-colors">
                    <Upload size={12} className="inline mr-1" /> 上传产品图
                  </button>
                </div>
              </div>

              {/* 没有上传模特图时显示模特模板选择 */}
              {editorModelFiles.length === 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#9E9B96] mb-3 uppercase">或选择模特模板</label>
                  <div className="grid grid-cols-4 gap-3">
                    {MODEL_TEMPLATES.map(tpl => (
                      <button key={tpl.id} onClick={() => setSelectedModelTemplate(selectedModelTemplate === tpl.id ? null : tpl.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${selectedModelTemplate === tpl.id
                          ? "border-[#22d665] shadow-sm" : "border-[#E5E1D8] hover:border-[#22d665]"}`}>
                        <div className={`w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden flex items-center justify-center border-2 ${selectedModelTemplate === tpl.id ? "border-[#22d665]" : tpl.style}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tpl.preview} alt={tpl.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs font-bold text-[#2D2A26]">{tpl.name}</div>
                        <div className="text-[10px] text-[#9E9B96]">{tpl.desc}</div>
                        {selectedModelTemplate === tpl.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1 inline-block">
                            <Check size={14} className="text-[#22d665] mx-auto" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 背景选择 */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#9E9B96] mb-3 uppercase">海报背景风格</label>
                <div className="flex gap-3">
                  {[
                    { id: "gradient-1", style: "bg-gradient-to-br from-lime-100 to-emerald-50", label: "暖色" },
                    { id: "gradient-2", style: "bg-gradient-to-br from-blue-100 to-indigo-50", label: "冷色" },
                    { id: "gradient-3", style: "bg-gradient-to-br from-gray-800 to-gray-900", label: "暗黑" },
                    { id: "gradient-4", style: "bg-white", label: "纯白" },
                    { id: "gradient-5", style: "bg-gradient-to-br from-rose-100 to-pink-50", label: "粉色" },
                  ].map(bg => (
                    <button key={bg.id} onClick={() => setSelectedBackground(bg.id)}
                      className={`flex flex-col items-center gap-1.5 transition-all ${selectedBackground === bg.id ? "scale-110" : "hover:scale-105"}`}>
                      <div className={`w-12 h-12 rounded-xl ${bg.style} border-2 ${selectedBackground === bg.id ? "border-[#22d665]" : "border-[#E5E1D8]"}`} />
                      <span className="text-[10px] text-[#9E9B96]">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={async () => {
                  if (editorProductFiles.length === 0) return;
                  setEditorGenerating(true);
                  try {
                    // Helper: file to base64
                    const fileToBase64 = (file: File) => new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.readAsDataURL(file);
                    });

                    // 读取所有产品图的 Base64
                    const productB64Images = [];
                    for (const pf of editorProductFiles) {
                       if (pf.file) {
                         const b64 = await fileToBase64(pf.file);
                         productB64Images.push(b64);
                       }
                    }

                    let modelPart = "";
                    let finalModelPreview: string | null = null;
                    let finalModelB64: string | null = null;
                    if (editorModelFiles.length > 0) {
                      modelPart = `将画面中完美替换融合上传的人物特征（请保留用户的模特整体身形与长相），并让该人物身上自然穿戴/使用用户指定的产品。`;
                      finalModelPreview = editorModelFiles[0].preview;
                      finalModelB64 = await fileToBase64(editorModelFiles[0].file);
                    } else if (selectedModelTemplate) {
                      const tpl = MODEL_TEMPLATES.find(t => t.id === selectedModelTemplate);
                      modelPart = `主角为${tpl?.name}（${tpl?.desc}），模特需完美展现并生动穿戴/使用附带图片中的产品。`;
                      finalModelPreview = tpl?.preview || null;
                      finalModelB64 = tpl?.preview || null; // 已经是静态图片URL，可直接用作 image_url
                    }

                    const prompt = `商业级海报合成，背景为${
                      selectedBackground.includes("pink") ? "淡粉色温柔氛围" : 
                      selectedBackground.includes("amber") ? "暖波浪光影质感" : 
                      selectedBackground.includes("blue") ? "冷峻高级蓝调" : 
                      selectedBackground.includes("gray") ? "暗黑极简未来感" : "纯白高级留白"
                    }。产品为【附带的图片】。${modelPart}主体必须突出产品本身属性与模特的绝佳配合，没任何杂乱文字，顶级商业摄影大片，构图完美，高级感拉满。`;
                    
                    const variationsPerProduct = 1;
                    const finalResults: any[] = [];
                    
                    for (let pIdx = 0; pIdx < editorProductFiles.length; pIdx++) {
                      const pf = editorProductFiles[pIdx];
                      const productB64 = pf.file ? await fileToBase64(pf.file) : null;
                      
                       for (let v = 0; v < variationsPerProduct; v++) {
                          setEditorGeneratingText(`正在合成 第 ${pIdx + 1}/${editorProductFiles.length} 件产品...`);
                          // 只有 1 张，不再需要补充随机要求
                          const vPrompt = prompt;

                          try {
                            const data = await postJson<ImageApiResponse>("/api/ai/image", {
                              prompt: vPrompt,
                              images: productB64 ? [productB64] : [],
                              modelImage: finalModelB64,
                            });

                            if (data.urls && data.urls.length > 0) {
                              finalResults.push({
                                id: `synth-${pf.name}-${v}`,
                                productPreview: pf.preview,
                                productName: `${pf.name.replace(/\.[^/.]+$/, "")} (方案${v+1})`,
                                isAiGenerated: true,
                                resultUrl: data.urls[0],
                                bgStyle: selectedBackground,
                                modelPreview: finalModelPreview
                              });
                            }
                          } catch (e) {
                            console.error("生成异常: ", e);
                          }
                       }
                    }
                    
                    if (finalResults.length > 0) {
                      setEditorResults(finalResults as any);
                    } else {
                      alert("合成失败，所有变体请求均未返回图像结果");
                    }
                  } catch (e) {
                    alert("合成服务异常，请重试");
                  } finally {
                    setEditorGenerating(false);
    setEditorGeneratingText("内容合成中...");
                  }
                }}
                disabled={editorGenerating || editorProductFiles.length === 0}
                className="bg-[#22d665] text-white font-bold uppercase tracking-wide hover:bg-[#15803d] border border-[#22d665] transition-colors w-full flex items-center justify-center gap-2 py-3 rounded-xl disabled:opacity-50">
                {editorGenerating ? (
                  <><RefreshCw size={18} className="animate-spin" /> {editorGeneratingText}</>
                ) : (
                  <><Layers size={18} /> 一键批量合成 {editorProductFiles.length > 0 ? `(${editorProductFiles.length}张产品)` : ""}</>
                )}
              </button>
            </div>

            {/* 合成结果展示 — 真实的 AI 渲染结果 */}
            {editorResults.length > 0 && (
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 md:p-8 rounded-xl">
                <h3 className="text-sm font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#22d665]"/> 合成结果 ({editorResults.length}张)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(editorResults as any[]).map((item: any, i: number) => {
                    return (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E5E1D8] bg-white relative cursor-pointer hover:shadow-lg transition-shadow">
                        {/* 真实的合成图展示 */}
                        <div className="w-full h-full relative cursor-zoom-in" onClick={() => {
                          setLightboxIndex(i);
                          setLightboxOpen(true);
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.resultUrl} alt="Synthesized Poster" className="w-full h-full object-cover" />
                        </div>
                        {/* 底部标签层叠 */}
                        <div className="absolute pl-2 pb-1.5 bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
                          <span className="text-[10px] text-white/90">产品: {item.productName}</span>
                        </div>
                        {/* 角标 */}
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-[#22d665] border border-[#22d665]/40 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={8}/> 智能合成
                        </div>
                        {/* 模特小头像展示 */}
                        {item.modelPreview && (
                           <div className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                             <img src={item.modelPreview} alt="model ref" className="w-full h-full object-cover" />
                           </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                {/* 增加放大预览组件 */}
                {lightboxOpen && (
                  <ImageLightbox
                    images={editorResults.map(p => ({ src: (p as any).resultUrl, name: (p as any).productName }))}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                    onNavigate={(idx) => setLightboxIndex(idx)}
                  />
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
