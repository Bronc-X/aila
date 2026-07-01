import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Compass,
  FileText,
  GraduationCap,
  Laptop,
  Layers3,
  MessageSquareText,
  MonitorDown,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./prep.module.css";

export const metadata: Metadata = {
  title: "T0 课预习包 | Agent Coding 项目陪跑",
  description:
    "T0 课预习资料：视频、工具安装、项目想法卡片、Agent coding、Low-code、抽象边界与规格化表达。",
};

const videos = [
  {
    level: "必看",
    title: "Andrew Ng - AI Prompting for Everyone",
    fit: "所有人，尤其是非技术背景",
    href: "https://www.deeplearning.ai/courses/ai-prompting-for-everyone",
  },
  {
    level: "必看",
    title: "Andrej Karpathy - Intro to Large Language Models",
    fit: "想理解 LLM / Agent 基本原理的人",
    href: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
  },
  {
    level: "选看",
    title: "Andrew Ng - AI for Everyone",
    fit: "产品、业务、商科、文科背景",
    href: "https://www.deeplearning.ai/courses/ai-for-everyone",
  },
  {
    level: "选看",
    title: "Andrew Ng - Generative AI for Everyone",
    fit: "想补生成式 AI 产品常识的人",
    href: "https://www.deeplearning.ai/courses/generative-ai-for-everyone",
  },
  {
    level: "进阶",
    title: "Andrew Ng - Agentic AI",
    fit: "想深入 Agent 工作流的人",
    href: "https://www.deeplearning.ai/courses/agentic-ai",
  },
  {
    level: "进阶",
    title: "Karpathy - Neural Networks: Zero to Hero",
    fit: "技术背景或想补底层直觉的人",
    href: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
  },
];

const tools = [
  ["Node.js LTS", "运行网页项目、安装前端依赖", "https://nodejs.org/en/download"],
  ["Git", "版本管理、连接 GitHub、保存项目记录", "https://git-scm.com/"],
  ["VS Code", "代码编辑器", "https://code.visualstudio.com/"],
  ["Codex 桌面版 App", "本机项目、线程、自动化和 Git 工作台", "https://developers.openai.com/codex/app"],
  ["Codex 官方文档", "Codex App / IDE / CLI 总入口", "https://developers.openai.com/codex"],
  ["Codex CLI", "终端版 Codex 安装与使用", "https://developers.openai.com/codex/cli"],
  ["Claude 桌面版 App", "Claude 桌面应用下载入口", "https://claude.ai/download"],
  ["Claude Code 官方文档", "Claude Code 概览、接口和工作方式", "https://docs.anthropic.com/en/docs/claude-code/overview"],
  ["Claude Code CLI", "终端版 Claude Code 安装与命令", "https://docs.anthropic.com/en/docs/claude-code/quickstart"],
];

const ccSwitchDownloads = [
  [
    "Windows 安装包",
    "Windows 10+ / x64，常规安装用 .msi",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-Windows.msi",
  ],
  [
    "Windows 免安装包",
    "解压后运行 CC-Switch.exe",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-Windows-Portable.zip",
  ],
  [
    "macOS 安装包",
    "macOS 12+，推荐 .dmg",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-macOS.dmg",
  ],
  [
    "macOS 压缩包",
    "备用下载，解压后拖入 Applications",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-macOS.zip",
  ],
];

const apiConfigSteps = [
  ["安装", "先装 Node.js、Codex CLI、Claude Code CLI，再安装 CC Switch。"],
  ["建 Provider", "在 CC Switch 里选择 Codex 或 Claude Code，点击 Add Provider，填入 Base URL、API Key 和模型名。"],
  ["导入 config.toml", "Codex 的配置会落到 ~/.codex/config.toml；重点检查 model_provider、base_url、wire_api、env_key。"],
  ["配置 Claude Code", "Claude Code 走网关时检查 ANTHROPIC_BASE_URL 与 ANTHROPIC_AUTH_TOKEN / ANTHROPIC_API_KEY。"],
  ["启用与验证", "在 CC Switch 首页 Enable provider；分别运行 codex /model、claude /status 做连通性检查。"],
];

const configRefs = [
  ["CC Switch 官网", "https://ccswitch.io/en/"],
  ["CC Switch GitHub Releases", "https://github.com/farion1231/cc-switch/releases"],
  ["CC Switch 安装文档", "https://ccswitch.io/en/docs?section=getting-started&item=installation"],
  ["Codex config.toml 官方参考", "https://developers.openai.com/codex/config-reference"],
  ["Claude Code Settings 官方参考", "https://code.claude.com/docs/en/settings"],
  ["Claude Code LLM Gateway 官方说明", "https://code.claude.com/docs/en/llm-gateway"],
  ["AIHubMix Codex + CC Switch 图文", "https://docs.aihubmix.com/en/api/Codex-CLI"],
  ["New API CC Switch 图文", "https://www.newapi.ai/en/docs/apps/cc-switch"],
  ["SiliconFlow CC Switch 图文", "https://docs.siliconflow.cn/en/usercases/use-siliconcloud-in-ccswitch"],
];

const concepts = [
  {
    icon: Code2,
    title: "Agent coding：把任务变成可执行回路",
    body: "把目标、上下文、工具、日志和验收条件交给 Agent，让它完成读文件、改代码、跑命令、看报错、继续修复的闭环。",
  },
  {
    icon: Layers3,
    title: "编排：先排路径，再排工具",
    body: "一次项目交付通常会串起 Low-code、脚本、浏览器、模型、数据源和测试。编排的核心是定义顺序、输入输出和失败后的下一步。",
  },
  {
    icon: ShieldCheck,
    title: "抽象泄露",
    body: "高层工具会隐藏底层复杂度，权限、成本、延迟、幻觉、状态漂移和失败重试仍会从边界处冒出来。好设计要保留观察点和回退路径。",
  },
  {
    icon: Compass,
    title: "封装：按 Parnas 思路隐藏决策",
    body: "模块边界按“容易变化的设计决策”划分。外部只看接口、契约和禁区，内部实现可以替换、重写或降级。",
  },
  {
    icon: MessageSquareText,
    title: "多态：只认契约",
    body: "搜索器、生成器、验证器都可以有多个实现。只要输入、输出、失败状态和质量门禁一致，上层流程就能替换底层供应商或模型。",
  },
  {
    icon: FileText,
    title: "规格：写出让代码生成代码的代码",
    body: "把需求写成输入、输出、约束、验收、反例和文件边界。规格越像可执行代码，Agent 生成代码时越少靠猜。",
  },
];

const classPlan = [
  ["课程定位", "10 分钟", "明确目标：做出可运行、可验证、可复盘的项目"],
  ["环境检查", "20 分钟", "确认 Node、Git、Codex、Claude Code 可用"],
  ["项目快评", "30 分钟", "每人讲项目想法，现场收敛第一版范围"],
  ["Agent coding 演示", "20 分钟", "演示如何把一句需求变成项目文件和最小原型"],
  ["建项目骨架", "15 分钟", "建立 README、docs、AGENTS.md"],
  ["布置第 1 课任务", "10 分钟", "明确下一次要交付的需求文档和原型"],
];

export default function AiPmPrepPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="页面导航">
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.navLinks}>
          <a href="#videos">视频</a>
          <a href="#tools">工具</a>
          <a href="#api-config">API</a>
          <a href="#assignment">作业</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <GraduationCap size={17} />
            Internal Builder Sprint · T0
          </p>
          <h1>T0 课预习包</h1>
          <p className={styles.lede}>
            用 Low-code 和 Agent coding，把一个想法压成可运行、可验证、可复盘的项目产物。
          </p>
          <div className={styles.actions}>
            <a href="#checklist" className={styles.primaryButton}>
              先看课前清单 <CheckCircle2 size={18} />
            </a>
            <a href="#videos" className={styles.secondaryButton}>
              打开视频资料 <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <aside className={styles.heroPanel} aria-label="第 0 课完成标准">
          <span>更新时间 2026-07-01</span>
          <h2>课前完成标准</h2>
          <ul>
            <li>看 1-2 个基础视频</li>
            <li>安装 Node.js、Git、Codex、Claude Code</li>
            <li>准备 5 句话项目卡片</li>
            <li>提交环境自检结果</li>
          </ul>
        </aside>
      </section>

      <section className={styles.section} id="checklist">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <BookOpenCheck size={16} />
            Start Here
          </p>
          <h2>课前最重要的 4 件事</h2>
        </div>
        <div className={styles.checkGrid}>
          {["看 1-2 个基础视频，先建立共同语言", "安装 Node.js、Git、Codex、Claude Code", "准备一个自己的项目想法", "提交环境自检结果"].map((item) => (
            <article className={styles.checkCard} key={item}>
              <CheckCircle2 size={20} />
              <p>{item}</p>
            </article>
          ))}
        </div>
        <div className={styles.commandBlock}>
          <p>最低自检命令</p>
          <pre>{`node -v
npm -v
git --version
codex --version
claude --version`}</pre>
          <span>如果 Codex 或 Claude Code CLI 暂时不可用，可以先提交 App / 登录成功截图。</span>
        </div>
      </section>

      <section className={styles.section} id="videos">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <Sparkles size={16} />
            Watch List
          </p>
          <h2>优先看的视频</h2>
        </div>
        <div className={styles.videoGrid}>
          {videos.map((item) => (
            <a className={styles.videoCard} href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}>
              <span>{item.level}</span>
              <h3>{item.title}</h3>
              <p>{item.fit}</p>
              <small>
                打开资料 <ArrowUpRight size={14} />
              </small>
            </a>
          ))}
        </div>
        <div className={styles.pathNote}>
          <p>建议顺序</p>
          <ul>
            <li>{"零基础/文商科：AI Prompting for Everyone -> AI for Everyone"}</li>
            <li>{"工程/业务背景：AI Prompting for Everyone -> Intro to LLMs"}</li>
            <li>{"计算机背景：Intro to LLMs -> Agentic AI"}</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="tools">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <Laptop size={16} />
            Setup
          </p>
          <h2>工具安装链接</h2>
        </div>
        <div className={styles.toolList}>
          {tools.map(([name, use, href]) => (
            <a className={styles.toolRow} href={href} target="_blank" rel="noopener noreferrer" key={name}>
              <strong>{name}</strong>
              <span>{use}</span>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
        <div className={styles.commandBlock}>
          <p>Windows 安装 Claude Code 可先尝试</p>
          <pre>irm https://claude.ai/install.ps1 | iex</pre>
        </div>
      </section>

      <section className={styles.section} id="api-config">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <Route size={16} />
            Provider Config
          </p>
          <h2>Claude Code 和 Codex 的 API 配置</h2>
        </div>
        <div className={styles.configLead}>
          <div>
            <h3>推荐路径：用 CC Switch 统一管理 provider</h3>
            <p>
              CC Switch 是跨平台桌面工具，可以集中管理 Claude Code、Codex、Gemini CLI 等工具的 provider、MCP 和系统提示词配置。
              课程里建议把 API key 放在本机工具或环境变量里，项目仓库只保存可共享的规则、文档和示例。
            </p>
          </div>
          <a href="https://ccswitch.io/en/" target="_blank" rel="noopener noreferrer">
            打开 CC Switch 官网 <ArrowUpRight size={16} />
          </a>
        </div>
        <div className={styles.downloadGrid}>
          {ccSwitchDownloads.map(([name, note, href]) => (
            <a className={styles.downloadCard} href={href} target="_blank" rel="noopener noreferrer" key={name}>
              <MonitorDown size={20} />
              <strong>{name}</strong>
              <span>{note}</span>
              <small>下载 <ArrowUpRight size={13} /></small>
            </a>
          ))}
        </div>
        <div className={styles.configGrid}>
          <article className={styles.configPanel}>
            <h3>流程步骤</h3>
            <ol>
              {apiConfigSteps.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </li>
              ))}
            </ol>
          </article>
          <article className={styles.configPanel}>
            <h3>Codex config.toml 检查点</h3>
            <pre>{`# ~/.codex/config.toml
model_provider = "your_provider"

[model_providers.your_provider]
name = "Your Provider"
base_url = "https://your-provider.example/v1"
wire_api = "responses"
env_key = "YOUR_PROVIDER_API_KEY"`}</pre>
            <p>第三方 provider 建议用环境变量承载 key，避免把真实密钥写进 config 截图、文档或 Git 仓库。</p>
          </article>
          <article className={styles.configPanel}>
            <h3>Claude Code 网关检查点</h3>
            <pre>{`# PowerShell
$env:ANTHROPIC_BASE_URL="https://your-gateway.example"
$env:ANTHROPIC_AUTH_TOKEN="sk-..."

# macOS / Linux
export ANTHROPIC_BASE_URL="https://your-gateway.example"
export ANTHROPIC_AUTH_TOKEN="sk-..."`}</pre>
            <p>直接 Anthropic API key 可用 ANTHROPIC_API_KEY；走网关或代理时通常用 ANTHROPIC_BASE_URL 加 Bearer token。</p>
          </article>
        </div>
        <div className={styles.screenshotRail} aria-label="CC Switch 配置流程截图式步骤">
          {[
            ["01", "选择工具", "顶部选择 Codex 或 Claude Code"],
            ["02", "Add Provider", "选择 preset 或手动填 Base URL"],
            ["03", "填 Key", "API Key 只在本机保存"],
            ["04", "Enable", "回首页启用 provider 后重启 CLI"],
          ].map(([number, title, body]) => (
            <article className={styles.mockShot} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className={styles.referenceList}>
          <h3>可参考的官方 / 社区图文</h3>
          <div>
            {configRefs.map(([label, href]) => (
              <a href={href} target="_blank" rel="noopener noreferrer" key={href}>
                {label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <MessageSquareText size={16} />
            Core Concepts
          </p>
          <h2>需要先理解的 6 个概念</h2>
        </div>
        <div className={styles.conceptGrid}>
          {concepts.map((item) => {
            const Icon = item.icon;
            return (
              <article className={styles.conceptCard} key={item.title}>
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="assignment">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <FileText size={16} />
            Assignment
          </p>
          <h2>课前作业：项目卡片</h2>
        </div>
        <div className={styles.assignmentGrid}>
          <div className={styles.templateBox}>
            <h3>请用 5 句话写清楚</h3>
            <pre>{`我想做的项目是：
目标用户是：
用户现在的痛点是：
我准备用系统帮用户完成：
第一个可展示版本长这样：`}</pre>
          </div>
          <div className={styles.templateBox}>
            <h3>好的项目方向通常满足</h3>
            <ul>
              <li>用户边界明确，避免泛化到所有人</li>
              <li>有真实场景，避免停留在聊天壳层</li>
              <li>2-4 周内能做出第一版</li>
              <li>有可展示结果：网页、报告、看板、工作流、自动化助手</li>
              <li>能讲出问题定义、模块边界、约束条件和验证证据</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <Compass size={16} />
            Lesson Flow
          </p>
          <h2>第 0 课会做什么</h2>
        </div>
        <div className={styles.schedule}>
          {classPlan.map(([name, time, goal]) => (
            <article className={styles.scheduleRow} key={name}>
              <strong>{name}</strong>
              <span>{time}</span>
              <p>{goal}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalBand}>
        <h2>从第一天开始积累项目证据</h2>
        <p>
          训练重点是问题定义、上下文组织、模块边界、工具编排、约束表达和验证证据。每一次失败、修复和取舍都要留下可复盘记录。
        </p>
      </section>
    </main>
  );
}
