<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# GStack-Antigravity 桥接协议 v1.0

> 本文件将 gstack 的工程方法论适配到 Antigravity IDE 环境。
> gstack 原始 Skill 文件位于 `/Users/broncin/Desktop/project/gstack/` 目录。
> 当需要查阅完整方法论细节时，用 `view_file` 读取对应的 `SKILL.md`。

## 全局环境

- **gstack 参考路径**: `/Users/broncin/Desktop/project/gstack`
- **project 根目录**: `/Users/broncin/Desktop/project`
- **AILA 项目根目录**: `/Users/broncin/Desktop/project/4.18培训/aila`
- **运行环境**: Antigravity IDE（非 Claude Code，无 `~/.claude/skills/` 二进制依赖）
- **Skill 引用方式**: 通过 `view_file` 工具读取 `/Users/broncin/Desktop/project/gstack/<skill-name>/SKILL.md`，提取其中的**思维框架**和**评审标准**执行，跳过所有 bash preamble 脚本

## 核心原则

1. **执行 gstack 的思维，而非脚本** — gstack 的价值在于其审查标准、质量门禁和认知模式，不在于 bash 命令
2. **Antigravity 原生工具替代** — 用 `run_command`/`grep_search`/`view_file` 替代 gstack 的 bash preamble
3. **宪法优先** — 每次重要任务开始前，先阅读本文件和 `/Users/broncin/Desktop/project/.agents/RULES.md`

---

## 意图路由（与 RULES.md 场景完全对齐）

### 场景 A：大型新功能开发 / 核心逻辑重写

**触发条件**：需求涉及新页面、新组件系统、多文件联动、核心业务流程等。

**流程**：

1. **CEO Review（产品思考）**
   - 读取 gstack 参考: `view_file /Users/broncin/Desktop/project/gstack/plan-ceo-review/SKILL.md`
   - 输出：业务价值、用户核心路径、Edge Cases、产品参考矩阵
   - 写入 `implementation_plan.md` 作为 artifact

2. **Eng Review（架构锁定）**
   - 读取 gstack 参考: `view_file /Users/broncin/Desktop/project/gstack/plan-eng-review/SKILL.md`
   - 输出：文件清单、数据流、依赖图、复杂度评估
   - 追加到 `implementation_plan.md`

3. 🚧 **强制拦截** — 暂停并询问用户："以上产品与技术方案是否通过？"

4. **编码执行** — 按 task.md 清单逐项推进

5. **局部审查（每完成一个工具页面后）**
   - 运行 `npm run build` 确认无编译错误
   - 用 `grep_search` 检查新增代码是否有 TODO/FIXME/console.log 残留
   - 确认交互闭环：每个按钮/输入都有响应

6. **全局审查（全部完成后）**
   - 读取 gstack 参考: `view_file /Users/broncin/Desktop/project/gstack/review/SKILL.md`
   - 逐文件审查代码质量、DRY 违规、错误处理
   - 读取 gstack 参考: `view_file /Users/broncin/Desktop/project/gstack/qa/SKILL.md`
   - 启动 `npm run dev`，逐页验证交互

### 场景 B：Bug 修复与疑难杂症

**触发条件**：报错日志、功能失效、构建失败。

**流程**：

1. 不急着改代码，先梳理 Bug 触发链路
2. 读取 gstack 参考: `view_file /Users/broncin/Desktop/project/gstack/investigate/SKILL.md`
3. 定位根因 → 修复 → 运行 `npm run build` 验证

### 场景 C：前端 UI 微调

**触发条件**：仅涉及颜色、边距、动画、文案。

**流程**：直接定位组件文件精准修改，修改后告知用户确认视觉效果。

### 场景 D：代码重构

**触发条件**：优化代码结构、提取公共组件。

**流程**：

1. 先审查目标代码（对照 gstack review 标准）
2. 小步重构，每步 `npm run build` 验证
3. 重构不能改变业务逻辑

---

## 质量门禁（翻译自 gstack 核心标准）

### 编码质量检查清单

每次提交代码后自检：

- [ ] **零静默失败** — 每个 catch 块都有用户可见的反馈
- [ ] **状态完整性** — 每个 loading 状态都有对应的 loaded/error 状态
- [ ] **空状态设计** — 每个列表/表格都有空状态提示
- [ ] **交互确认** — 每个按钮点击都有视觉反馈（loading/disabled/动画）
- [ ] **DRY** — 重复超过 3 次的模式应提取为组件
- [ ] **无残留** — 无 console.log、无 TODO、无硬编码中文路径
- [ ] **类型安全** — 无 `any` 类型，接口定义完整

### 设计质量检查清单

- [ ] **Jobsian 一致性** — OLED 黑 `#000` + 边框 `#111` + 文字层级 `#FFF/#888/#555/#333`
- [ ] **动效克制** — 只用 Framer Motion 的 `opacity`/`y`/`x` + spring，无花哨特效
- [ ] **响应式** — 所有 grid 布局在窄屏下优雅降级
- [ ] **可访问性** — 所有交互元素有 hover 状态和 focus 样式

---

## Antigravity 原生审查命令

以下命令替代 gstack 的 bash preamble，在 Antigravity 中可直接执行：

### 构建验证
```
run_command: npm run build
```

### 代码残留检查
```
grep_search: console.log  (排除 node_modules)
grep_search: TODO|FIXME|HACK|XXX  (排除 node_modules)
```

### 依赖审计
```
run_command: npm ls --depth=0
```

### 端口清理 + 开发服务器
```
run_command: killall node 2>/dev/null; rm -rf .next && npm run dev
```

---

## 项目特定约束

### 技术栈
- Next.js 16 (App Router) + React 19
- Framer Motion（动画）
- Lucide React（图标）
- dnd-kit（拖拽，按需安装）
- localStorage（轻量持久化）

### 设计语言
- 背景: `#000`（OLED 纯黑）
- 主边框: `border-[#111]`，hover: `border-[#333]`
- 文字层级: `#FFF` > `#888` > `#555` > `#333`
- 按钮主态: `bg-white text-black` + `font-bold uppercase tracking-widest`
- 按钮次态: `bg-black text-[#CCC] border-[#333]`
- 卡片: 无圆角（或极小），无阴影，靠边框区分层级

### AI 引擎
- 所有 AI 交互走 `/api/ai/chat/route.ts` 的 Mock 引擎
- 不接任何外部 API（OpenAI/Gemini/Notion 等）
- Mock 引擎返回高拟真的业务数据
