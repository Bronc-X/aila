# AILA 技术栈声明

## 框架与运行时

- 框架：Next.js 16 App Router
- UI 运行时：React 19
- 语言：TypeScript
- 包管理：npm
- 运行时：Node.js

## 核心依赖

- 动画库：Framer Motion
- 图标库：Lucide React
- 状态管理：Zustand、React state、localStorage，按现有模块边界选择
- CSS 方案：Tailwind CSS 4
- 3D / 可视化：Three.js、Recharts，按现有页面需要使用
- 后端集成：Next.js Route Handlers；Lusie 相关能力包含 Supabase 与外部生成链路

## 构建与部署

- 构建命令：`npm run build`
- 开发命令：`npm run dev`
- 静态检查：`npm run lint`
- Lusie 回归：修改 `/lusie`、`/api/lusie/*`、3D/STL/下载链路时运行 `npm run test:baseline`
- 部署目标：Vercel

## 关键边界

- Next.js 16 有破坏性变化；涉及框架 API 时先读 `node_modules/next/dist/docs/`。
- AI 演示入口默认走项目约定的 Mock 或现有路由，不能擅自接入新的外部 OpenAI/Gemini/Notion API。
- 只按当前任务引入依赖；不要为一次性需求添加新的状态库、UI 库或包装层。
