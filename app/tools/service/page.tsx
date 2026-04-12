"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones, ArrowLeft, Bot, Phone, Shield, BarChart2, Sparkles, RefreshCw,
  Copy, Check, Send, MessageCircle, Plus, X, Tag, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronUp, Edit3, Presentation,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { ExportButton } from "@/components/ui/ExportButton";
import { EditableCell } from "@/components/ui/EditableCell";
import { AIMessageBubble, ThinkingIndicator, ClaudeInput } from "@/components/ui/ClaudeUI";

// ── 类型 ──────────────────────────────
interface ChatMsg { role: "user" | "assistant"; content: string; rating?: "up" | "down"; }

interface SentimentItem {
  id: string;
  platform: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  time: string;
  reply: string;
  processed: boolean;
}

interface WordCloudItem {
  word: string;
  size: string;
  count: number;
  reviews: string[];
}

// ── 初始数据 ──────────────────────────────
const INITIAL_SENTIMENTS: SentimentItem[] = [
  { id: "1", platform: "大众点评", content: "服务态度很差，等了半小时都没人理我，下次不会再来了", sentiment: "negative", time: "2小时前", reply: "", processed: false },
  { id: "2", platform: "小红书", content: "这家产品质量真不错，用了三个月效果明显，推荐给大家～", sentiment: "positive", time: "5小时前", reply: "", processed: false },
  { id: "3", platform: "微博", content: "客服电话永远打不通，微信也不回，这是什么服务？@XX官方", sentiment: "negative", time: "1天前", reply: "", processed: false },
  { id: "4", platform: "抖音评论", content: "价格跟说好的不一样，感觉被坑了", sentiment: "negative", time: "1天前", reply: "", processed: false },
  { id: "5", platform: "知乎", content: "对比了几家，XX的功能确实领先，但价格偏高，适合预算充足的团队", sentiment: "neutral", time: "3天前", reply: "", processed: false },
];

const WORD_CLOUD_DATA: WordCloudItem[] = [
  { word: "效率提升", size: "text-3xl", count: 524, reviews: ["用了之后工作效率提升了至少30%", "团队整体效率提升明显", "再也不用加班处理表格了"] },
  { word: "操作简单", size: "text-2xl", count: 389, reviews: ["上手很快，基本不需要培训", "界面直观，老员工也能用", "功能虽多但不复杂"] },
  { word: "响应及时", size: "text-xl", count: 267, reviews: ["客服回复很快", "技术支持当天就解决了", "售后跟进很积极"] },
  { word: "价格偏高", size: "text-lg", count: 156, reviews: ["功能好但价格确实不便宜", "小企业有点负担重", "希望能出个精简版"] },
  { word: "功能强大", size: "text-2xl", count: 412, reviews: ["功能覆盖很全面", "数据分析功能特别好用", "比市面上大多数产品都强"] },
  { word: "客服专业", size: "text-lg", count: 198, reviews: ["客服很耐心", "问题解决很专业", "培训讲解很到位"] },
  { word: "数据安全", size: "text-xl", count: 234, reviews: ["数据存储放心", "有合规认证", "希望支持私有化部署"] },
  { word: "推荐朋友", size: "text-lg", count: 178, reviews: ["已经推荐给同行了", "身边好几个老板都在用", "值得推荐的产品"] },
  { word: "学习成本", size: "text-base", count: 89, reviews: ["高级功能需要学", "希望新手引导做好一点", "文档可以更详细"] },
];

const SATISFACTION_DATA = [
  { stars: "5星", count: 687, pct: 55, reviews: ["十分满意！", "超出预期", "完美解决了我们的问题"] },
  { stars: "4星", count: 312, pct: 25, reviews: ["整体不错，细节可以优化", "性价比还行", "功能够用"] },
  { stars: "3星", count: 149, pct: 12, reviews: ["一般般，有些功能缺失", "体验中等", "不好不坏"] },
  { stars: "2星", count: 62, pct: 5, reviews: ["不太满意", "稳定性有问题", "和宣传有差距"] },
  { stars: "1星", count: 37, pct: 3, reviews: ["很差", "不推荐", "浪费钱"] },
];

const STORAGE_KEY_SENTIMENTS = "aila-service-sentiments";
const STORAGE_KEY_QUICKREPLIES = "aila-service-quickreplies";

export default function ServicePage() {
  const [activeTab, setActiveTab] = useState<"chatbot" | "followup" | "pr" | "voice">("chatbot");

  // ── 智能客服 ──
  const [faqInput, setFaqInput] = useState("");
  const [botName, setBotName] = useState("小智");
  const [botPersona, setBotPersona] = useState("亲切专业");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [botConfigured, setBotConfigured] = useState(false);
  const [knowledgeTags, setKnowledgeTags] = useState<string[]>(["产品介绍", "价格方案", "技术支持"]);
  const [newTag, setNewTag] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>(["你好，有什么可以帮你？", "稍等，我帮你查一下", "收到，马上处理"]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── 回访话术 ──
  const [selectedScene, setSelectedScene] = useState("");
  const [followupContext, setFollowupContext] = useState("");
  const [followupResult, setFollowupResult] = useState("");
  const [followupLoading, setFollowupLoading] = useState(false);

  // ── 舆情监控 ──
  const [sentiments, setSentiments] = useState<SentimentItem[]>(INITIAL_SENTIMENTS);
  const [replyGenerating, setReplyGenerating] = useState<string | null>(null);

  // ── 客户之声 ──
  const [selectedWord, setSelectedWord] = useState<WordCloudItem | null>(null);
  const [selectedStar, setSelectedStar] = useState<typeof SATISFACTION_DATA[0] | null>(null);

  const tabs = [
    { id: "chatbot" as const, label: "智能客服", icon: Bot },
    { id: "followup" as const, label: "回访话术", icon: Phone },
    { id: "pr" as const, label: "舆情监控", icon: Shield },
    { id: "voice" as const, label: "客户之声", icon: BarChart2 },
  ];

  // localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SENTIMENTS);
    if (saved) try { setSentiments(JSON.parse(saved)); } catch { /* 忽略 */ }
    const savedReplies = localStorage.getItem(STORAGE_KEY_QUICKREPLIES);
    if (savedReplies) try { setQuickReplies(JSON.parse(savedReplies)); } catch { /* 忽略 */ }
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY_SENTIMENTS, JSON.stringify(sentiments)); }, [sentiments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_QUICKREPLIES, JSON.stringify(quickReplies)); }, [quickReplies]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  // ── 配置Bot ──
  const handleConfigureBot = () => {
    setBotConfigured(true);
    setChatMessages([{ role: "assistant", content: `你好！我是${botName}，很高兴为您服务 😊\n\n我已经学习了您提供的产品知识，可以回答客户的相关问题。\n\n请试着像客户一样问我一个问题吧！` }]);
  };

  // ── 发送消息 ──
  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个叫"${botName}"的智能客服，人设风格：${botPersona}。\n知识库：${faqInput || "这是一家科技公司，主营AI解决方案。价格：基础版5000元/月，企业版20000元/月。支持7天免费试用。"}\n知识标签：${knowledgeTags.join("、")}\n回答要求：1.语气${botPersona} 2.回答具体实用 3.200字以内 4.无法回答则建议联系人工` },
            ...chatMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
            { role: "user" as const, content: userMsg },
          ],
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.choices?.[0]?.message?.content || "抱歉，请联系人工客服 🙏" }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "网络异常，请稍后重试" }]);
    } finally { setChatLoading(false); }
  };

  // ── 消息评价 ──
  const rateMessage = (idx: number, rating: "up" | "down") => {
    setChatMessages(prev => prev.map((m, i) => i === idx ? { ...m, rating } : m));
  };

  // ── 知识库标签 ──
  const addTag = () => {
    if (newTag.trim() && !knowledgeTags.includes(newTag.trim())) {
      setKnowledgeTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };
  const removeTag = (tag: string) => setKnowledgeTags(prev => prev.filter(t => t !== tag));

  // ── 回访话术生成 ──
  const handleFollowupGenerate = async () => {
    if (!selectedScene) return;
    setFollowupLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个客服培训专家。根据回访场景生成一份决策树式的话术脚本。格式：每个阶段包含：阶段名、话术、客户可能反应及应对。用---分隔阶段。` },
            { role: "user", content: `回访场景：${selectedScene}\n客户背景：${followupContext || "暂无"}` },
          ],
        }),
      });
      const data = await res.json();
      setFollowupResult(data.choices?.[0]?.message?.content || "生成失败");
    } catch { setFollowupResult("网络错误，请重试"); }
    finally { setFollowupLoading(false); }
  };

  // ── 舆情生成回复 ──
  const generateReply = async (id: string) => {
    setReplyGenerating(id);
    const item = sentiments.find(s => s.id === id);
    if (!item) return;
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "你是品牌公关专家。根据客户评价生成得体的官方回复。要求：1.真诚道歉(如负面) 2.提供解决方案 3.100字以内 4.语气专业温暖" },
            { role: "user", content: `平台：${item.platform}\n评价内容：${item.content}\n情绪：${item.sentiment}` },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "回复生成失败";
      setSentiments(prev => prev.map(s => s.id === id ? { ...s, reply } : s));
    } catch {
      setSentiments(prev => prev.map(s => s.id === id ? { ...s, reply: "生成失败，请重试" } : s));
    } finally { setReplyGenerating(null); }
  };

  const markProcessed = (id: string) => {
    setSentiments(prev => prev.map(s => s.id === id ? { ...s, processed: true } : s));
  };

  // ── 统计 ──
  const posCount = sentiments.filter(s => s.sentiment === "positive").length;
  const negCount = sentiments.filter(s => s.sentiment === "negative").length;
  const neuCount = sentiments.filter(s => s.sentiment === "neutral").length;
  const total = sentiments.length;

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
                <Headphones size={16} className="text-[#2D2A26]" />
              </div>
              <span className="font-semibold text-sm">智能客服</span>
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

        {/* ═══════════════ 智能客服 (Coze/Dify Agent 构建器式) ═══════════════ */}
        {activeTab === "chatbot" && (
          <div className="grid lg:grid-cols-[380px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                  <Bot size={18} /> Agent 配置
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9E9B96] mb-1">客服名称</label>
                    <input type="text" value={botName} onChange={(e) => setBotName(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-2.5 text-[#2D2A26] text-sm outline-none focus:border-[#D97706] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9E9B96] mb-1">人设风格</label>
                    <select value={botPersona} onChange={e => setBotPersona(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-2.5 text-[#2D2A26] text-sm outline-none">
                      <option>亲切专业</option>
                      <option>正式严谨</option>
                      <option>活泼可爱</option>
                      <option>简洁高效</option>
                    </select>
                  </div>
                </div>

                {/* 知识库标签 */}
                <div>
                  <label className="block text-xs text-[#9E9B96] mb-2">知识库标签</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {knowledgeTags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#F3F1ED] text-[#9E9B96] border border-[#E5E1D8]">
                        <Tag size={10} /> {tag}
                        <button onClick={() => removeTag(tag)} className="text-[#6B6660] hover:text-red-400 ml-0.5"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTag()}
                      placeholder="新标签..." className="flex-1 bg-[#FAF9F6] border border-[#E5E1D8] px-2 py-1 text-xs text-[#2D2A26] outline-none focus:border-[#D97706] transition-colors" />
                    <button onClick={addTag} className="px-2 py-1 border border-[#E5E1D8] text-[#6B6660] text-xs hover:border-[#D97706] hover:text-[#2D2A26] transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* 快捷回复 */}
                <div>
                  <label className="block text-xs text-[#9E9B96] mb-2">快捷回复</label>
                  <div className="space-y-1">
                    {quickReplies.map((r, i) => (
                      <div key={i} className="flex items-center gap-1 group">
                        <EditableCell value={r} onSave={v => setQuickReplies(prev => prev.map((q, j) => j === i ? v : q))} className="text-xs text-[#9E9B96] flex-1" />
                        <button onClick={() => setQuickReplies(prev => prev.filter((_, j) => j !== i))}
                          className="opacity-0 group-hover:opacity-100 text-[#A3A3A3] hover:text-red-400 transition-all"><X size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => setQuickReplies(prev => [...prev, ""])}
                      className="text-xs text-[#6B6660] hover:text-[#2D2A26] transition-colors flex items-center gap-1">
                      <Plus size={12} /> 添加快捷回复
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#9E9B96] mb-2">产品知识/FAQ</label>
                  <textarea value={faqInput} onChange={(e) => setFaqInput(e.target.value)}
                    placeholder="粘贴产品介绍、FAQ..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-xs min-h-[120px] resize-y" rows={5} />
                </div>
                <button onClick={handleConfigureBot}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-2.5 text-sm">
                  <Sparkles size={16} /> {botConfigured ? "重新训练" : "训练 Agent"}
                </button>
              </div>
            </motion.div>

            {/* 对话测试 + 满意度评价 */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors flex flex-col" style={{ height: "680px" }}>
                <div className="px-5 py-4 border-b border-[#E5E1D8] flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center border border-[#E5E1D8] bg-[#FAF9F6] text-sm font-bold text-[#2D2A26]">
                    {botName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D2A26]">{botName}</div>
                    <div className="text-xs text-green-400">● 在线</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {!botConfigured ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle size={32} className="text-[#A3A3A3] mb-3" />
                      <p className="text-[#9E9B96]">先在左侧配置并训练 Agent</p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((msg, i) => (
                        <div key={i} className="relative group">
                          <AIMessageBubble role={msg.role} content={msg.content} avatar={msg.role === "assistant" ? botName[0] : undefined} />
                          {/* 满意度评价按钮 */}
                          {msg.role === "assistant" && i > 0 && (
                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-[#E5E1D8] rounded-md shadow-sm p-1">
                              <button onClick={() => rateMessage(i, "up")}
                                className={`p-1 transition-colors ${msg.rating === "up" ? "text-green-500 bg-green-50 rounded" : "text-[#A3A3A3] hover:text-green-500 hover:bg-[#FAF9F6] rounded"}`}>
                                <ThumbsUp size={14} />
                              </button>
                              <button onClick={() => rateMessage(i, "down")}
                                className={`p-1 transition-colors ${msg.rating === "down" ? "text-red-500 bg-red-50 rounded" : "text-[#A3A3A3] hover:text-red-500 hover:bg-[#FAF9F6] rounded"}`}>
                                <ThumbsDown size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {chatLoading && <ThinkingIndicator label={`${botName} 处理请求中...`} />}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* 快捷回复 + 输入 */}
                {botConfigured && quickReplies.length > 0 && (
                  <div className="px-5 py-3 border-t border-[#E5E1D8] flex gap-2 overflow-x-auto bg-[#FAF9F6]">
                    {quickReplies.filter(r => r).map((r, i) => (
                      <button key={i} onClick={() => { setChatInput(r); }}
                        className="whitespace-nowrap px-3 py-1.5 border border-[#E5E1D8] rounded-full text-xs text-[#6B6660] bg-white hover:border-[#D97706] hover:text-[#D97706] shadow-sm hover:shadow transition-all font-medium">
                        {r}
                      </button>
                    ))}
                  </div>
                )}
                <div className="px-5 py-4 border-t border-[#E5E1D8] bg-white">
                  <ClaudeInput 
                    value={chatInput} 
                    onChange={setChatInput} 
                    onSend={handleSendMessage} 
                    isLoading={chatLoading || !botConfigured} 
                    placeholder={botConfigured ? "模拟客户提问..." : "请先验证并训练好 Agent"} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 回访话术 ═══════════════ */}
        {activeTab === "followup" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 space-y-5 rounded-xl">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2"><Phone size={18} /> 智能回访话术</h2>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">回访场景</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["售后满意度", "续费提醒", "沉默客户激活", "升级推荐", "投诉安抚", "生日关怀"].map(s => (
                      <button key={s} onClick={() => setSelectedScene(s)}
                        className={`px-3 py-2.5 border text-sm text-left transition-colors ${selectedScene === s ? "border-[#D97706] text-[#2D2A26] bg-[#F3F1ED]" : "border-[#E5E1D8] text-[#666] hover:border-[#D97706] hover:text-[#2D2A26]"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9E9B96] mb-2">客户背景（选填）</label>
                  <textarea value={followupContext} onChange={e => setFollowupContext(e.target.value)}
                    placeholder="例如：使用产品3个月，最近2周活跃度下降..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] p-3 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] transition-colors outline-none font-mono text-sm min-h-[100px] resize-y" rows={3} />
                </div>
                <button onClick={handleFollowupGenerate} disabled={followupLoading || !selectedScene}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {followupLoading ? <><RefreshCw size={18} className="animate-spin" /> 生成中...</> : <><Sparkles size={18} /> 生成回访脚本</>}
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] hover:border-[#A3A3A3] transition-colors p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">话术脚本</h2>
                  {followupResult && <ExportButton content={followupResult} filename={`回访话术_${selectedScene}.txt`} />}
                </div>
                {!followupResult ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center">
                    <Phone size={28} className="text-[#6B6660] mb-3" />
                    <p className="text-[#9E9B96]">选择场景后生成话术脚本</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {followupResult.split(/---+/).map((block, i) => block.trim() && (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="p-8 border border-[#E5E1D8] bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] px-2 py-0.5 bg-[#F3F1ED] text-[#2D2A26] uppercase tracking-wider font-mono">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="text-sm text-[#9E9B96] whitespace-pre-wrap leading-relaxed">{block.trim()}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 舆情监控 (美洽式实时仪表盘) ═══════════════ */}
        {activeTab === "pr" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#2D2A26]">舆情公关监控</h2>
                <p className="text-xs text-[#6B6660] mt-1">实时监测 · AI 生成回复 · 一键标记已处理</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="px-3 py-1.5 border border-green-500/30 bg-green-500/5 text-green-400 rounded-full">正面 {total > 0 ? Math.round(posCount/total*100) : 0}%</div>
                <div className="px-3 py-1.5 border border-[#A3A3A3] bg-[#F3F1ED] text-[#9E9B96] rounded-full">中性 {total > 0 ? Math.round(neuCount/total*100) : 0}%</div>
                <div className="px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 rounded-full">负面 {total > 0 ? Math.round(negCount/total*100) : 0}%</div>
              </div>
            </div>
            <div className="space-y-3">
              {sentiments.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className={`border bg-[#FAF9F6] transition-colors p-5 ${item.processed ? "border-[#0a0a0a] opacity-60" : "border-[#E5E1D8] hover:border-[#A3A3A3]"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-[#666]">{item.platform}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                      item.sentiment === "negative" ? "bg-red-500/10 text-red-400" : item.sentiment === "positive" ? "bg-green-500/10 text-green-400" : "bg-[#F3F1ED] text-[#9E9B96]"
                    }`}>
                      {item.sentiment === "negative" ? "负面" : item.sentiment === "positive" ? "正面" : "中性"}
                    </span>
                    <span className="text-[10px] text-[#A3A3A3] ml-auto">{item.time}</span>
                    {item.processed && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">已处理</span>}
                  </div>
                  <p className="text-sm text-[#9E9B96] mb-3 leading-relaxed">{item.content}</p>
                  {item.reply ? (
                    <div className="p-3 bg-white border border-[#E5E1D8] mb-2">
                      <p className="text-[10px] text-[#6B6660] mb-1">AI 建议回复：</p>
                      <EditableCell value={item.reply} onSave={v => setSentiments(prev => prev.map(s => s.id === item.id ? { ...s, reply: v } : s))} className="text-xs text-[#9E9B96]" type="textarea" />
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    {!item.reply && (
                      <button onClick={() => generateReply(item.id)} disabled={replyGenerating === item.id}
                        className="text-xs text-[#6B6660] hover:text-[#2D2A26] border border-[#E5E1D8] px-3 py-1.5 hover:border-[#D97706] transition-colors flex items-center gap-1">
                        {replyGenerating === item.id ? <><RefreshCw size={12} className="animate-spin" /> 生成中</> : <><Sparkles size={12} /> 生成回复</>}
                      </button>
                    )}
                    {item.reply && !item.processed && (
                      <button onClick={() => markProcessed(item.id)}
                        className="text-xs text-green-400/70 hover:text-green-400 border border-green-500/20 px-3 py-1.5 hover:border-green-500/50 transition-colors flex items-center gap-1">
                        <Check size={12} /> 标记已处理
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ 客户之声 (可交互词云 + 柱状图) ═══════════════ */}
        {activeTab === "voice" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-6">
              <div className="space-y-6">
                {/* 可点击词云 */}
                <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 rounded-xl">
                  <h3 className="text-base font-bold text-[#2D2A26] mb-2">客户之声分析</h3>
                  <p className="text-xs text-[#6B6660] mb-6">基于 1,247 条客户评价 · 点击关键词查看原始评价</p>
                  <div className="flex flex-wrap gap-3 justify-center py-6">
                    {WORD_CLOUD_DATA.map(item => (
                      <button key={item.word} onClick={() => setSelectedWord(selectedWord?.word === item.word ? null : item)}
                        className={`${item.size} font-bold tracking-normal transition-all cursor-pointer ${
                          selectedWord?.word === item.word ? "text-[#2D2A26] scale-110" : "text-[#2D2A26]/60 hover:text-[#2D2A26] hover:scale-105"
                        }`}>
                        {item.word}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {selectedWord && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-[#E5E1D8]">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-[#2D2A26]">&ldquo;{selectedWord.word}&rdquo; · {selectedWord.count} 次提及</h4>
                            <button onClick={() => setSelectedWord(null)} className="text-[#6B6660] hover:text-[#2D2A26]"><X size={14} /></button>
                          </div>
                          <div className="space-y-2">
                            {selectedWord.reviews.map((r, i) => (
                              <div key={i} className="text-xs text-[#9E9B96] p-2 bg-white border border-[#E5E1D8]">&ldquo;{r}&rdquo;</div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 可点击满意度柱状图 */}
                <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 rounded-xl">
                  <h3 className="text-base font-bold text-[#2D2A26] mb-4">满意度分布 · 点击查看评价样本</h3>
                  <div className="space-y-2">
                    {SATISFACTION_DATA.map(item => (
                      <div key={item.stars}>
                        <button onClick={() => setSelectedStar(selectedStar?.stars === item.stars ? null : item)}
                          className={`flex items-center gap-3 w-full text-left transition-colors ${selectedStar?.stars === item.stars ? "opacity-100" : "opacity-70 hover:opacity-100"}`}>
                          <span className="text-xs text-[#9E9B96] w-8">{item.stars}</span>
                          <div className="flex-1 h-5 bg-white overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.5 }}
                              className={`h-full ${selectedStar?.stars === item.stars ? "bg-white/20" : "bg-[#E5E1D8]"}`} />
                          </div>
                          <span className="text-xs text-[#6B6660] w-20 text-right">{item.count} ({item.pct}%)</span>
                        </button>
                        <AnimatePresence>
                          {selectedStar?.stars === item.stars && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden">
                              <div className="ml-10 mt-2 space-y-1 mb-2">
                                {item.reviews.map((r, i) => (
                                  <div key={i} className="text-xs text-[#9E9B96] p-1.5 bg-white border border-[#E5E1D8]">&ldquo;{r}&rdquo;</div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI 洞察报告 */}
              <div className="border border-[#E5E1D8] bg-[#FAF9F6] p-6 rounded-xl">
                <h3 className="text-base font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
                  <Sparkles size={16} /> AI 客户洞察报告
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "核心优势（继续保持）", items: ["效率提升是客户最高频提及的正面词（42%）", "操作简单性获得高度评价", "客服专业度是竞品差异化亮点"] },
                    { title: "改进机会（重点关注）", items: ["价格敏感度较高，建议推出阶梯定价", "学习成本偏高，需优化新手引导", "移动端体验有提升空间"] },
                    { title: "增长信号", items: ["「推荐朋友」词频上升 23%，NPS 良好", "企业版需求增长明显", "续费率 89%，高于行业 76%"] },
                  ].map(section => (
                    <div key={section.title} className="p-8 border border-[#E5E1D8] bg-white">
                      <h4 className="text-sm font-semibold text-[#2D2A26] mb-2">{section.title}</h4>
                      <ul className="space-y-1.5">
                        {section.items.map((item, i) => (
                          <li key={i} className="text-xs text-[#9E9B96] pl-3 relative before:absolute before:left-0 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#F3F1ED] leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
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
