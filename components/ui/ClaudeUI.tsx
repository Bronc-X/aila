"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, ChevronRight } from "lucide-react";

/* ============================================
   Claude 风格 AI 交互组件库
   - TypingIndicator: 思考中指示器（跳动点）
   - TypewriterText: 打字机效果文字输出
   - ArtifactPanel: 侧滑 Artifact 面板
   - AIMessageBubble: Claude 风格的消息气泡
   ============================================ */

/** 思考中指示器 — 模拟 Claude 的三点跳动 */
export function ThinkingIndicator({ label = "AI 正在思考" }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 py-4 px-5"
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#D97706]"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-sm text-[#9E9B96] font-medium">{label}</span>
    </motion.div>
  );
}

/** 打字机效果文字 — 模拟流式输出 */
export function TypewriterText({
  text,
  speed = 20,
  onComplete,
  className = "",
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setIsComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        // 一次追加多个字符使速度更流畅
        const charsToAdd = Math.min(3, text.length - indexRef.current);
        setDisplayed(text.slice(0, indexRef.current + charsToAdd));
        indexRef.current += charsToAdd;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={className}>
      <span>{displayed}</span>
      {!isComplete && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-[#D97706] ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

/** Claude 风格消息气泡 */
export function AIMessageBubble({
  role,
  content,
  isStreaming = false,
  avatar,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  avatar?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 py-5 px-6 ${isUser ? "" : "bg-[#F5F3EE] rounded-xl"}`}
    >
      {/* 头像 */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isUser ? "bg-[#E5E1D8] text-[#7A7570]" : "bg-[#D97706] text-white"
      }`}>
        {avatar || (isUser ? "U" : <Sparkles size={16} />)}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-[#9E9B96] mb-2 uppercase tracking-wider">
          {isUser ? "你" : "AI 助手"}
        </div>
        {isStreaming ? (
          <TypewriterText
            text={content}
            speed={15}
            className="text-[15px] text-[#2D2A26] leading-relaxed whitespace-pre-wrap"
          />
        ) : (
          <div className="text-[15px] text-[#2D2A26] leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        )}

        {/* 操作栏 */}
        {!isUser && !isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E1D8]"
          >
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-[#9E9B96] hover:text-[#D97706] transition-colors px-2 py-1 rounded-md hover:bg-[#FAF9F6]"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "已复制" : "复制"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** 侧滑 Artifact 面板 — 模拟 Claude 的 Artifact 抽屉 */
export function ArtifactPanel({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          />
          {/* 面板 */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-white border-l border-[#E5E1D8] shadow-2xl flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E1D8]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-[#D97706]/10 flex items-center justify-center">
                  <Sparkles size={14} className="text-[#D97706]" />
                </div>
                <span className="text-sm font-semibold text-[#2D2A26]">{title}</span>
              </div>
              <button
                onClick={onClose}
                className="text-[#9E9B96] hover:text-[#2D2A26] transition-colors text-sm"
              >
                关闭
              </button>
            </div>
            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** 输入框 — Claude 风格的圆角输入 */
export function ClaudeInput({
  value,
  onChange,
  onSend,
  placeholder = "发送消息...",
  isLoading = false,
}: {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="border border-[#E5E1D8] rounded-xl bg-white shadow-sm focus-within:border-[#D97706] focus-within:shadow-md transition-all">
      <div className="flex items-end gap-2 p-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none outline-none text-[15px] text-[#2D2A26] placeholder-[#A3A3A3] bg-transparent max-h-32 leading-relaxed"
          style={{ minHeight: "24px" }}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className="w-9 h-9 rounded-lg bg-[#D97706] text-white flex items-center justify-center hover:bg-[#B45309] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
