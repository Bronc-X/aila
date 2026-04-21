"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, ArrowLeft, Mic, MicOff, Square, FileText, Lightbulb, Send,
  Copy, Check, RefreshCw, Clock, User, Bot, Sparkles, Phone, Mail, Database, Upload, Trash2, Presentation
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { ExportButton } from "@/components/ui/ExportButton";
import { AIMessageBubble, ThinkingIndicator, ClaudeInput } from "@/components/ui/ClaudeUI";
import { postJson, type ChatApiResponse } from "@/lib/api-client";

// ── 类型 ──────────────────────────────
interface ConversationEntry {
  id: string;
  speaker: "客户" | "销售";
  text: string;
  timestamp: string;
  keywords?: string[];
}

interface AISummary {
  needs: string[];
  objections: string[];
  opportunities: string[];
  nextSteps: string[];
}

interface TalkSuggestion {
  type: "应对异议" | "追问深挖" | "促成交易" | "建立信任";
  content: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: string[];
}

// ── 关键词高亮 ──────────────────────────────
const HIGHLIGHT_KEYWORDS = ["预算", "价格", "成本", "竞品", "对手", "效率", "痛点", "需求", "CRM", "系统", "方案", "试用", "免费", "担心", "顾虑", "太贵", "不确定"];

function highlightText(text: string) {
  const parts: { text: string; isKeyword: boolean }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliestIdx = remaining.length;
    let foundKeyword = "";
    for (const kw of HIGHLIGHT_KEYWORDS) {
      const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
      if (idx !== -1 && idx < earliestIdx) {
        earliestIdx = idx;
        foundKeyword = kw;
      }
    }
    if (foundKeyword && earliestIdx < remaining.length) {
      if (earliestIdx > 0) parts.push({ text: remaining.slice(0, earliestIdx), isKeyword: false });
      parts.push({ text: remaining.slice(earliestIdx, earliestIdx + foundKeyword.length), isKeyword: true });
      remaining = remaining.slice(earliestIdx + foundKeyword.length);
    } else {
      parts.push({ text: remaining, isKeyword: false });
      remaining = "";
    }
  }
  return parts;
}

// ── Demo 数据 ──────────────────────────────
const demoConversation: ConversationEntry[] = [
  { id: "1", speaker: "销售", text: "张总您好，我是XX科技的小王。上次您提到贵公司在客户管理方面遇到一些困难，想跟您深入聊聊。", timestamp: "14:02" },
  { id: "2", speaker: "客户", text: "对，我们现在客户信息散在各个业务员手里，有些用Excel，有些用微信记录。人一走，客户资源就跟着走了。", timestamp: "14:02", keywords: ["客户", "Excel"] },
  { id: "3", speaker: "销售", text: "理解，这确实是很多企业的痛点。那贵公司目前大概有多少活跃客户在管理？", timestamp: "14:03", keywords: ["痛点"] },
  { id: "4", speaker: "客户", text: "大概3000多个吧，但说实话能稳定联系的可能就500个。剩下的基本都断了联系了。", timestamp: "14:03" },
  { id: "5", speaker: "销售", text: "500活跃客户，2500个沉默客户。如果做好存量激活，这是很大的增长空间。", timestamp: "14:04", keywords: ["效率"] },
  { id: "6", speaker: "客户", text: "道理我都懂，但我们试过一些CRM系统，业务员不愿意用。觉得太贵了太麻烦了，还不如自己记。", timestamp: "14:04", keywords: ["CRM", "太贵", "顾虑"] },
];

const demoSummary: AISummary = {
  needs: ["集中管理客户信息，防止人员流失导致客户流失", "激活2500个沉默客户", "降低业务员使用CRM的门槛"],
  objections: ["过去试过CRM系统，业务员不愿使用", "认为CRM操作太复杂", "觉得价格太贵"],
  opportunities: ["3000+ 客户体量，有规模化管理的刚需", "2500个沉默客户 = 大量待激活增长空间", "对问题有清晰认知，愿意讨论解决方案"],
  nextSteps: ["强调AI自动录入功能，解决'嫌麻烦'的核心异议", "展示沉默客户激活案例和ROI数据", "建议安排一次15分钟的线上演示"],
};

const demoSuggestions: TalkSuggestion[] = [
  { type: "应对异议", content: "张总，您说的CRM用不起来这个问题特别好。传统CRM确实需要手动录入太多东西。我们的方案不一样——业务员正常打电话、发微信，AI自动识别客户信息并归档，完全不需要额外操作。" },
  { type: "追问深挖", content: "那2500个沉默客户里面，如果按照以往经验，您觉得大概多少比例是有可能被重新激活的？他们当初为什么断联了？" },
  { type: "促成交易", content: "这样吧张总，我们可以先拿100个沉默客户做个测试，用AI分析他们的历史行为，推荐最佳的回访时机和话术。一周时间看效果，如果不好我们不收费。" },
  { type: "建立信任", content: "我理解您的顾虑。其实XX行业的李总之前跟您情况一模一样，他用了两个月之后，业务员反馈效率提升了40%，他如果方便我可以帮您拉个群。" },
];

// ── 回访策略卡片类型 ──────────────────────────────
interface FollowupCard {
  title: string;
  icon: string;
  items: string[];
}

export default function SalesPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [suggestions, setSuggestions] = useState<TalkSuggestion[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"realtime" | "knowledge" | "followup" | "insights">("realtime");
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // ── ASR 语音识别 ──
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<"客户" | "销售">("销售");
  const [interimText, setInterimText] = useState("");
  const entryCounterRef = useRef(0);

  // ── 回访 ──
  const [customerName, setCustomerName] = useState("");
  const [customerContext, setCustomerContext] = useState("");
  const [followupCards, setFollowupCards] = useState<FollowupCard[]>([]);
  const [followupLoading, setFollowupLoading] = useState(false);

  // ── 灵感追问 (Gemini 多轮对话) ──
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── 对话时间轴统计 ──
  const salesCount = conversation.filter(e => e.speaker === "销售").length;
  const customerCount = conversation.filter(e => e.speaker === "客户").length;
  const totalCount = salesCount + customerCount;
  const salesPct = totalCount > 0 ? Math.round((salesCount / totalCount) * 100) : 0;

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── 知识库配置 ──
  const [kbSellingPoints, setKbSellingPoints] = useState("");
  const [kbCompetitors, setKbCompetitors] = useState("");
  const [kbFiles, setKbFiles] = useState<{name: string, size: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sales-knowledge-base");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKbSellingPoints(parsed.sellingPoints || "");
        setKbCompetitors(parsed.competitors || "");
        setKbFiles(parsed.files || []);
      } catch {}
    }
  }, []);

  const saveKnowledgeBase = useCallback(() => {
    localStorage.setItem("sales-knowledge-base", JSON.stringify({
      sellingPoints: kbSellingPoints,
      competitors: kbCompetitors,
      files: kbFiles
    }));
  }, [kbSellingPoints, kbCompetitors, kbFiles]);

  const tabs = [
    { id: "realtime" as const, label: "实时对话", icon: Mic },
    { id: "knowledge" as const, label: "知识库预训练", icon: Database },
    { id: "followup" as const, label: "智能回访", icon: Phone },
    { id: "insights" as const, label: "灵感追问", icon: Lightbulb },
  ];

  // ── ASR 真实录音 ──────────────────────────────
  const handleStartRecording = useCallback(() => {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器");
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
      if (finalTranscript.trim()) {
        entryCounterRef.current += 1;
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newEntry: ConversationEntry = {
          id: `asr-${entryCounterRef.current}`,
          speaker: currentSpeaker,
          text: finalTranscript.trim(),
          timestamp: ts,
          keywords: HIGHLIGHT_KEYWORDS.filter(kw => finalTranscript.includes(kw)),
        };
        setConversation(prev => [...prev, newEntry]);
        setInterimText("");

        // 实时分析交由大模型 useEffect 监听处理
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // no-speech 是常见的静默错误，不处理
      // 其他错误静默忽略，不打断用户体验
    };

    recognition.onend = () => {
      // 如果还在录音状态但引擎停了（Chrome 有 60 秒自动断开），自动重启
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch { /* 忽略重复启动 */ }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [currentSpeaker]);

  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // 防止自动重启
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText("");
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ── 实时大模型分析 (取代 Demo 数据) ──
  useEffect(() => {
    // 只有在录音状态下，并且达到一定的对话轮次才触发（避免频繁请求）
    if (!isRecording || conversation.length < 3) return;
    // 每累积新增一定的话语，或达到偶数轮次
    if (conversation.length % 2 !== 0) return;
    if (conversation[conversation.length - 1].id.startsWith("demo-")) return; // 排除 demo 数据

const analyzeConversation = async () => {
      try {
        const textLog = conversation.map(c => `${c.speaker === "销售" ? "我方销售" : "客户"}: ${c.text}`).join("\n");
        const data = await postJson<ChatApiResponse>("/api/ai/chat", {
          messages: [
            { 
              role: "system", 
              content: `你是一个顶级的B2B销售总监监听助手。请分析以下最新对话日志，预测客户异议并给出我方下一步的应答建议。
                
【我方产品知识库预设】
核心卖点：${kbSellingPoints || "暂无预设"}
竞对劣势/常见异议：${kbCompetitors || "暂无预设"}
请在生成话术时，尽可能融入或参照以上知识库中的卖点，并重点针对竞对进行防守。

请务必返回严格的JSON格式数据，结构如下：
{"suggestions": [{"type": "应对异议" 或 "追问深挖" 或 "促成交易" 或 "建立信任", "content": "建议销售说的话术（必须结合知识库）", "reason": "原因分析"}], "summary": {"painPoints": ["痛点1"], "objections": ["异议1"], "actionItems": ["下一步动作"]}}
直接输出JSON，不要任何包裹符号和解释。` 
            },
            { role: "user", content: textLog },
          ],
          temperature: 0.7,
        });
        const content = data.choices?.[0]?.message?.content || "";
        const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
        
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
           setSuggestions(parsed.suggestions.map((s: any, i: number) => ({
             id: `live-sugg-${Date.now()}-${i}`,
             type: s.type || "next_step",
             title: s.type === "objection" ? "发现异议阻力" : s.type === "pricing" ? "价格谈判信号" : s.type === "competitor" ? "竞对干预" : "跟进建议",
             content: s.content,
             reason: s.reason
           })));
        }
        if (parsed.summary && conversation.length >= 6) {
           setSummary(parsed.summary);
        }
       } catch {
          // AI 分析错误时静默忽略，不影响对话流
       }
    };
    
    analyzeConversation();
  }, [conversation, isRecording]);

  // ── Demo 模式 ──────────────────────────────
  const handleStartDemo = () => {
    setConversation([]);
    setSummary(null);
    setSuggestions([]);
    setIsRecording(true);
    demoConversation.forEach((entry, i) => {
      setTimeout(() => {
        setConversation((prev) => [...prev, entry]);
        if (i >= 3) setSuggestions(demoSuggestions.slice(0, Math.min(i - 2, 4)));
        if (i === demoConversation.length - 1) setSummary(demoSummary);
      }, (i + 1) * 2000);
    });
    setTimeout(() => setIsRecording(false), (demoConversation.length + 1) * 2000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── 回访策略 (结构化卡片输出) ──────────────────────────────
const handleFollowup = async () => {
    if (!customerName.trim()) return;
    setFollowupLoading(true);
    setFollowupCards([]);
    try {
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: "你是一个资深销售顾问。根据客户信息生成结构化的回访策略。请按以下JSON格式输出(不要包含markdown代码块标记)：[{\"title\":\"最佳回访时间\",\"icon\":\"⏰\",\"items\":[...]},{\"title\":\"开场话术\",\"icon\":\"💬\",\"items\":[...]},{\"title\":\"预判异议\",\"icon\":\"⚠️\",\"items\":[...]},{\"title\":\"促成策略\",\"icon\":\"🎯\",\"items\":[...]}]" },
          { role: "user", content: `客户：${customerName}\n背景：${customerContext || "暂无"}` },
        ],
      });
      const content = data.choices?.[0]?.message?.content || "";

      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        throw new Error("回访策略返回格式异常");
      }

      setFollowupCards(parsed);
    } catch (error) {
      setFollowupCards([
        { title: "回访建议", icon: "📋", items: [error instanceof Error ? error.message : "网络异常，请重试"] },
      ]);
    } finally {
      setFollowupLoading(false);
    }
  };

  // ── 灵感追问 (Gemini 多轮对话) ──────────────────────────────
const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: userMsg };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatLoading(true);
    try {
      const history = [...chatMessages, newUserMsg].map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const data = await postJson<ChatApiResponse>("/api/ai/chat", {
        messages: [
          { role: "system", content: "你是一个资深销售教练，擅长深度分析销售对话和客户心理。回答要具体、有洞察力。当引用用户之前的对话内容时，用【引用】标注。回答控制在300字以内。" },
          ...history,
        ],
      });
      const reply = data.choices?.[0]?.message?.content || "分析失败，请重试";
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: error instanceof Error ? error.message : "网络异常，请重试" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <header className="sticky top-0 z-40 border-b border-[#E5E1D8] bg-white/95 backdrop-blur-md pt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-end justify-between mb-10">
          <div className="flex flex-col gap-6">
            <Link href="/tools" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A3A3A3] hover:text-[#D97706] transition-colors uppercase tracking-[0.2em] w-fit">
              <ArrowLeft size={14} /> 返回超级中枢
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-[56px] h-[56px] flex items-center justify-center rounded-2xl border-2 border-[#E5E1D8] bg-white shadow-sm ring-4 ring-[#FAF9F6]">
                <MessageSquare size={26} className="text-[#D97706]" />
              </div>
              <h1 className="text-[2.5rem] font-black text-[#2D2A26] tracking-tight hover:tracking-normal transition-all duration-300">销售助手</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[13px] font-bold uppercase tracking-wider">正在监听</span>
              </div>
            )}
            <Link href="/slides" className="flex items-center gap-2 text-sm font-mono tracking-wide uppercase text-[#6B6660] hover:text-[#2D2A26] transition-colors">
              <Presentation size={14} /> 课件学习
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex gap-12 -mb-px mt-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-2 pb-5 text-base font-bold border-b-4 transition-all ${
                activeTab === tab.id ? "border-[#D97706] text-[#2D2A26]" : "border-transparent text-[#6B6660] hover:text-[#9E9B96]"
              }`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

        {/* ═══════════════ 实时对话 (Gong.io 式) ═══════════════ */}
        {activeTab === "realtime" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_320px_320px] gap-6 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm hover:border-[#D97706] transition-all p-6 max-h-[600px] overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                    <FileText size={18} className="text-[#D97706]"/> 实时对话
                  </h2>
                  <div className="flex gap-2">
                    {!isRecording && conversation.length === 0 && (
                      <button onClick={handleStartDemo} className="bg-[#D97706] text-white font-bold uppercase tracking-wide hover:bg-[#DDD] border border-[#D97706] transition-colors !py-2 !px-4 text-sm flex items-center gap-1.5">
                        <Sparkles size={14} /> 演示模式
                      </button>
                    )}
                    {!isRecording && (
                      <>
                        <select
                          value={currentSpeaker}
                          onChange={(e) => setCurrentSpeaker(e.target.value as "客户" | "销售")}
                          className="text-xs border border-[#E5E1D8] text-[#6B6660] bg-white px-2 py-2 rounded-lg focus:outline-none focus:border-[#D97706]">
                          <option value="销售">我是销售</option>
                          <option value="客户">我是客户</option>
                        </select>
                        <button onClick={handleStartRecording}
                          className="bg-white text-[#6B6660] border border-[#E5E1D8] font-bold uppercase tracking-wide hover:border-[#D97706] hover:text-[#D97706] transition-colors !py-2 !px-4 text-sm flex items-center gap-1.5 rounded-lg shadow-sm">
                          <Mic size={14} /> 开始录音
                        </button>
                      </>
                    )}
                    {isRecording && (
                      <button onClick={handleStopRecording}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all rounded-lg">
                        <Square size={12} /> 停止录音
                      </button>
                    )}
                  </div>
                </div>

                {/* 说话比例分析 */}
                {conversation.length > 0 && (
                  <div className="mb-4 p-3 border border-[#E5E1D8] bg-[#FAF9F6] rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#9E9B96] font-bold uppercase tracking-wider">说话比例</span>
                      <span className="text-[#2D2A26] font-medium">销售 {salesPct}% / 客户 {100 - salesPct}%</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full">
                      <motion.div animate={{ width: `${salesPct}%` }}
                        className="h-full bg-[#D97706]" />
                      <motion.div animate={{ width: `${100 - salesPct}%` }}
                        className="h-full bg-[#E5E1D8]" />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mt-4">
                  {conversation.length === 0 && !interimText ? (
                    <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-[#E5E1D8] rounded-xl m-2">
                      <Mic size={32} className="text-[#A3A3A3] mb-3" />
                      <p className="text-[#6B6660] font-medium mb-1">点击&ldquo;开始录音&rdquo;进行实时语音转写</p>
                      <p className="text-sm text-[#9E9B96]">AI 将实时转写对话并提取关键异议与痛点</p>
                      <p className="text-xs text-[#A3A3A3] mt-2">也可点击&ldquo;演示模式&rdquo;查看预设效果</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {conversation.map((entry) => {
                        const parts = highlightText(entry.text);
                        return (
                          <motion.div key={entry.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${entry.speaker === "销售" ? "" : "flex-row-reverse"}`}>
                            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold rounded-lg ${
                              entry.speaker === "销售" ? "bg-[#D97706]/10 text-[#D97706]" : "bg-[#F5F3EE] text-[#6B6660]"
                            }`}>
                              {entry.speaker === "销售" ? <User size={14} /> : "客"}
                            </div>
                            <div className={`px-4 py-3 text-[15px] leading-relaxed rounded-2xl break-words ${
                              entry.speaker === "销售"
                                ? "bg-[#FAF9F6] border border-[#E5E1D8] text-[#2D2A26] rounded-tl-sm"
                                : "bg-white border border-[#E5E1D8] text-[#6B6660] rounded-tr-sm shadow-sm"
                            }`}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-xs font-semibold ${entry.speaker === "销售" ? "text-[#D97706]" : "text-[#2D2A26]"}`}>{entry.speaker}</span>
                                <span className="text-[10px] text-[#A3A3A3] font-mono">{entry.timestamp}</span>
                              </div>
                              <span>
                                {parts.map((p, i) => p.isKeyword ? (
                                  <span key={i} className="text-[#D97706] font-bold bg-[#D97706]/10 px-1 rounded-sm mx-0.5">{p.text}</span>
                                ) : (
                                  <span key={i}>{p.text}</span>
                                ))}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                  {/* ASR 实时转写气泡 */}
                  {interimText && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-xs font-bold rounded-lg bg-[#D97706]/10 text-[#D97706]">
                        <Mic size={14} />
                      </div>
                      <div className="max-w-[80%] px-4 py-3 text-[15px] leading-relaxed rounded-2xl bg-[#FEF3C7] border border-[#D97706]/20 text-[#92400E] rounded-tl-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#D97706]">正在听...</span>
                          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        </div>
                        {interimText}
                      </div>
                    </motion.div>
                  )}
                  <div ref={conversationEndRef} />
                </div>
              </div>
            </motion.div>

            {/* AI 实时摘要 */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm hover:border-[#D97706] transition-all p-6">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2 mb-6">
                  <Bot size={18} className="text-[#D97706]" /> 实时战况摘要
                </h2>
                {!summary ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-[#E5E1D8] rounded-xl m-2">
                    <Bot size={28} className="text-[#A3A3A3] mb-3" />
                    <p className="text-sm text-[#9E9B96]">对话进行中将自动生成六度摘要</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {[
                      { label: "🎯 客户需求", items: summary.needs, color: "text-[#D97706] bg-[#D97706]/10" },
                      { label: "⚠️ 异议/顾虑", items: summary.objections, color: "text-red-600 bg-red-500/10" },
                      { label: "💡 突破机会", items: summary.opportunities, color: "text-green-600 bg-green-500/10" },
                      { label: "📋 下一步行动", items: summary.nextSteps, color: "text-blue-600 bg-blue-500/10" },
                    ].map((section) => (
                      <div key={section.label} className="bg-[#FAF9F6] border border-[#E5E1D8] p-4 rounded-xl">
                        <h3 className={`inline-block text-xs font-bold px-2 py-1 rounded-md mb-3 ${section.color}`}>{section.label}</h3>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-[13px] text-[#6B6660] leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#A3A3A3]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* 话术建议 */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm hover:border-[#D97706] transition-all p-6">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2 mb-6">
                  <Lightbulb size={18} className="text-[#D97706]" /> 话术支援 (实时打补丁)
                </h2>
                {suggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-[#E5E1D8] rounded-xl m-2">
                    <Lightbulb size={28} className="text-[#A3A3A3] mb-3" />
                    <p className="text-sm text-[#9E9B96] mb-1">AI 正在深度解码对话意图</p>
                    <p className="text-[13px] text-[#A3A3A3]">稍后将推送高段位救场话术</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((s, i) => {
                      const typeColor = { "应对异议": "bg-red-50 text-red-600 border-red-100", "追问深挖": "bg-blue-50 text-blue-600 border-blue-100", "促成交易": "bg-green-50 text-green-600 border-green-100", "建立信任": "bg-yellow-50 text-[#D97706] border-yellow-100" }[s.type];
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          className="p-8 rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] group cursor-pointer hover:border-[#D97706] hover:shadow-sm transition-all relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${typeColor}`}>{s.type}</span>
                            <button onClick={() => handleCopy(s.content, `sug-${i}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-white border border-[#E5E1D8] hover:border-[#D97706] hover:text-[#D97706]">
                              {copied === `sug-${i}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-[#6B6660]" />}
                            </button>
                          </div>
                          <p className="text-[13px] text-[#2D2A26] leading-relaxed font-medium">{s.content}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 知识库预训练 ═══════════════ */}
        {activeTab === "knowledge" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm p-8 space-y-8">
              <div className="border-b border-[#E5E1D8] pb-6">
                <h2 className="text-2xl font-bold text-[#2D2A26] flex items-center gap-2 mb-2">
                  <Database className="text-[#D97706]" size={24} /> 销售知识库预训练
                </h2>
                <p className="text-[#6B6660]">录入核心卖点与参考资料，AI 将在实时监听时自动匹配对应的杀手锏话术。</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">本品核心卖点 (Selling Points)</label>
                    <textarea value={kbSellingPoints} onChange={e => {setKbSellingPoints(e.target.value); setTimeout(saveKnowledgeBase, 100)}}
                      placeholder="例如：\n1. AI自动化录入，业务员免操作\n2. 相比竞品，部署周期只需3天..." 
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-4 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none text-sm min-h-[160px] resize-y" rows={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">常见异议与话术 (Objections & Handlings)</label>
                    <textarea value={kbCompetitors} onChange={e => {setKbCompetitors(e.target.value); setTimeout(saveKnowledgeBase, 100)}}
                      placeholder="例如：\n客户嫌贵怎么说：提醒客户算一笔人力成本账...\n客户觉得系统难用：演示我们的语音免写功能..." 
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-4 text-[#2D2A26] placeholder-[#C5C0B8] focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none text-sm min-h-[160px] resize-y" rows={6} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">文档资料投喂</label>
                  <p className="text-xs text-[#9E9B96] mb-4">拖拽 PDF, Word 等文件到此处，AI 会对文档内容进行向量化读取。</p>
                  
                  <div className="border-2 border-dashed border-[#E5E1D8] rounded-xl bg-[#FAF9F6] p-8 text-center hover:border-[#D97706] transition-colors cursor-pointer"
                    onClick={() => {
                        const newFile = {name: `产品白皮书_v${Math.floor(Math.random()*10)}.pdf`, size: `${(Math.random()*5+1).toFixed(1)}MB`};
                        setKbFiles([...kbFiles, newFile]);
                        setTimeout(saveKnowledgeBase, 100);
                    }}>
                    <Upload size={32} className="mx-auto mb-3 text-[#A3A3A3]" />
                    <p className="text-sm font-bold text-[#2D2A26] mb-1">点击或拖拽文件上传</p>
                    <p className="text-xs text-[#A3A3A3]">支持 PDF, DOCX, TXT</p>
                  </div>

                  {kbFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <span className="text-xs font-bold text-[#9E9B96] uppercase">已上传的语料 ({kbFiles.length})</span>
                      {kbFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-600 font-bold text-[10px]">PDF</div>
                            <div>
                              <div className="text-sm font-medium text-[#2D2A26]">{f.name}</div>
                              <div className="text-[10px] text-[#A3A3A3]">{f.size} • 向量化已完成</div>
                            </div>
                          </div>
                          <button onClick={() => {
                            const newFiles = kbFiles.filter((_, idx) => idx !== i);
                            setKbFiles(newFiles);
                            setTimeout(saveKnowledgeBase, 100);
                          }} className="p-1.5 text-[#A3A3A3] hover:text-red-500 hover:bg-red-50 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ 智能回访 (HubSpot 结构化卡片) ═══════════════ */}
        {activeTab === "followup" && (
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm hover:border-[#D97706] transition-all p-6 text-[#2D2A26] space-y-4">
                <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
                  <Phone size={18} className="text-[#D97706]" /> 智能回访策略
                </h2>
                <div>
                  <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">客户名称 *</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="例如：张总 / 李经理" className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2D2A26] placeholder-[#A3A3A3] focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all outline-none text-[15px]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#6B6660] mb-2 uppercase tracking-wide">背景信息 / 上次沟通记录</label>
                  <textarea value={customerContext} onChange={(e) => setCustomerContext(e.target.value)}
                    placeholder="详细描述沟通要点、客户关注点、异议等..." className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2D2A26] placeholder-[#A3A3A3] focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all outline-none text-[15px] min-h-[140px] resize-y" rows={5} />
                </div>
                <button onClick={handleFollowup} disabled={followupLoading || !customerName.trim()}
                  className="bg-[#D97706] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#B45309] shadow-sm transition-all w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {followupLoading ? <><RefreshCw size={18} className="animate-spin" /> 推演中...</> : <><Sparkles size={18} /> 生成高转化回访剧本</>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="border border-[#E5E1D8] bg-white rounded-xl shadow-sm hover:border-[#D97706] transition-colors p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D2A26]">工作协同卡片</h2>
                  {followupCards.length > 0 && (
                    <ExportButton content={followupCards.map(c => `【${c.title}】\n${c.items.join("\n")}`).join("\n\n")} filename={`回访策略_${customerName}.txt`} />
                  )}
                </div>
                {followupCards.length === 0 && !followupLoading ? (
                  <div className="flex flex-col items-center justify-center h-[350px] text-center border-2 border-dashed border-[#E5E1D8] rounded-xl m-2">
                    <Phone size={28} className="text-[#A3A3A3] mb-3" />
                    <p className="text-[#6B6660] font-medium">完善左侧客户信息后生成</p>
                    <p className="text-sm text-[#9E9B96] mt-2">AI 将吐出包含破冰话术、最佳时间等详尽的结构化指导卡</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {followupCards.map((card, i) => (
                      <motion.div key={card.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                        className="p-5 border border-[#E5E1D8] bg-[#FAF9F6] rounded-xl hover:border-[#D97706] hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4 border-b border-[#E5E1D8] pb-3">
                          <span className="text-xl bg-white w-8 h-8 rounded-full flex justify-center items-center shadow-sm">{card.icon}</span>
                          <h4 className="text-[15px] font-bold text-[#2D2A26]">{card.title}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {card.items.map((item, j) => (
                            <li key={j} className="text-[#6B6660] text-sm leading-relaxed flex items-start gap-2">
                              <span className="text-[#D97706] mt-1 shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════ 灵感追问 (Gemini 多轮对话) ═══════════════ */}
        {activeTab === "insights" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="border border-[#E5E1D8] bg-[#FAF9F6] rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow transition-shadow" style={{ height: "680px" }}>
              <div className="px-12 py-4 border-b border-[#E5E1D8] bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706]/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-[#D97706]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D2A26]">AI 销售教练</div>
                    <div className="text-xs text-[#9E9B96]">多轮深度分析 · 粘贴对话记录或直接提问</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Lightbulb size={32} className="text-[#A3A3A3] mb-4" />
                    <p className="text-[#6B6660] mb-2">你可以粘贴对话记录让我分析，或者直接提问</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {["分析一段客户对话", "如何应对价格异议", "客户说再考虑怎么办", "如何提高转化率"].map(q => (
                        <button key={q} onClick={() => { setChatInput(q); }}
                          className="px-3 py-1.5 border border-[#E5E1D8] rounded-full text-[#6B6660] bg-white text-xs hover:border-[#D97706] hover:text-[#D97706] transition-colors">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <AIMessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {chatLoading && (
                  <ThinkingIndicator label="教练思考中..." />
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-12 py-4 border-t border-[#E5E1D8] bg-[#FAF9F6]">
                <ClaudeInput 
                  value={chatInput} 
                  onChange={setChatInput} 
                  onSend={handleSendChat} 
                  isLoading={chatLoading} 
                  placeholder="粘贴对话记录或输入你的疑问..." 
                />
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
