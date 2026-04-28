<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AILA 项目特定约束

> 通用工程协议、意图路由、质量门禁、技能库声明均已写入全局 `~/.gemini/GEMINI.md`。
> 本文件仅包含 **AILA 项目独有** 的约束。

## 技术栈

- Next.js 16 (App Router) + React 19
- Framer Motion（动画）
- Lucide React（图标）
- dnd-kit（拖拽，按需安装）
- localStorage（轻量持久化）

## 设计语言

- 背景: 暖白/纯白（如 `#FAF9F6` 或 `bg-white`）
- 主边框: `border-[#E5E1D8]`，hover: `border-[#D97706]`
- 文字层级: `#111` > `#444` > `#666` > `#888`
- 品牌高亮/按钮主态: `#D97706`（琥珀橙），用于突出CTA
- 按钮次态: `bg-[#F3F1ED] text-[#444] border-[#E5E1D8]`
- 卡片: `bg-[#F3F1ED]` 或纯白，保持空间呼吸感，绝不使用纯黑
- 动效风格: 只用 Framer Motion 的 `opacity`/`y`/`x` + spring，无花哨特效

## AI 引擎

- 所有 AI 交互走 `/api/ai/chat/route.ts` 的 Mock 引擎
- 不接任何外部 API（OpenAI/Gemini/Notion 等）
- Mock 引擎返回高拟真的业务数据
