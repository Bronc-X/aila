<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AILA 项目特定约束

> 通用工程协议、意图路由、质量门禁、技能库声明均以 Codex 根目录 `C:\Users\Administrator\.codex\AGENTS.md` 为准。
> 每次读代码或执行较重要任务前，先读全局 `AGENTS.md`，再读本文件和 `.agents/rules/` 下的项目规则。
> 本文件仅包含 **AILA 项目独有** 的约束，避免重复复制全局协议。

## 技术栈

- Next.js 16 (App Router) + React 19
- TypeScript + Tailwind CSS 4
- Framer Motion（动画）
- Lucide React（图标）
- dnd-kit（拖拽，按需安装）
- Zustand / localStorage（轻量状态与持久化，按现有模块实际使用）

## 规则读取顺序

1. 先读 `C:\Users\Administrator\.codex\AGENTS.md`，用于确认全局流程、技能路由和质量门禁。
2. 再读项目根 `AGENTS.md`，用于确认 AILA 的技术栈、设计语言和 AI 边界。
3. 涉及视觉或技术选型时，补读 `.agents/rules/design-system.md` 与 `.agents/rules/tech-stack.md`。
4. 涉及 Next.js API、路由、缓存、服务端组件或构建行为时，先查 `node_modules/next/dist/docs/` 中对应文档，再写代码。

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
