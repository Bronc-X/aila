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
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./prep.module.css";

export const metadata: Metadata = {
  title: "第 0 课预习包 | AI 产品经理转岗陪跑",
  description:
    "AI 产品经理转岗陪跑第 0 课预习资料：视频、工具安装、项目想法卡片、Agent coding 与 Low-code 基础概念。",
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
  ["Cursor", "AI 代码编辑器，可替代 VS Code", "https://cursor.com/"],
  ["Codex App", "OpenAI 的 Agent coding 工具", "https://openai.com/codex/get-started/"],
  ["Codex 官方文档", "Codex Web / IDE / CLI 说明", "https://developers.openai.com/codex"],
  ["Codex CLI", "终端版 Codex", "https://developers.openai.com/codex/cli"],
  ["Claude Code Quickstart", "Claude Code 官方快速开始", "https://code.claude.com/docs/en/quickstart"],
  ["Claude Code Setup", "平台、安装和版本管理", "https://code.claude.com/docs/en/setup"],
];

const concepts = [
  {
    icon: Code2,
    title: "Agent coding",
    body: "不是“让 AI 帮我写代码”，而是让 AI 像协作者一样读文件、改代码、跑命令、看报错、继续修复。",
  },
  {
    icon: Layers3,
    title: "Low-code + Agent coding",
    body: "Low-code 先跑通业务流程，Agent coding 再补定制交互、接口接入、复杂逻辑和可展示能力。",
  },
  {
    icon: ShieldCheck,
    title: "抽象泄露",
    body: "工具会隐藏复杂性，但权限、成本、延迟、幻觉、失败重试这些问题不会消失，需要产品经理主动设计边界。",
  },
  {
    icon: Compass,
    title: "封装和多态",
    body: "把复杂 AI 能力封成简单按钮，同时让同一个能力能替换不同模型、流程或供应商。",
  },
];

const classPlan = [
  ["课程定位", "10 分钟", "明确目标：做出 AI 项目，并能用于转岗表达"],
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
          <a href="#assignment">作业</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <GraduationCap size={17} />
            AI PM Career Sprint · Lesson 0
          </p>
          <h1>第 0 课预习包：AI 产品经理转岗陪跑</h1>
          <p className={styles.lede}>
            用 Low-code 和 Agent coding，从 0 到 1 做出一个可运行、可复盘、可讲述的 AI 项目。
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
            <li>准备 5 句话项目想法卡片</li>
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
          {["看 1-2 个基础视频，先建立共同语言", "安装 Node.js、Git、Codex、Claude Code", "准备一个自己的 AI 项目想法", "提交环境自检结果"].map((item) => (
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
          <span>如果 Codex 或 Claude Code CLI 暂时不可用，也可以先提交 App / 登录成功截图。</span>
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <MessageSquareText size={16} />
            Core Concepts
          </p>
          <h2>需要先理解的 4 个概念</h2>
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
          <h2>课前作业：项目想法卡片</h2>
        </div>
        <div className={styles.assignmentGrid}>
          <div className={styles.templateBox}>
            <h3>请用 5 句话写清楚</h3>
            <pre>{`我想做的项目是：
目标用户是：
用户现在的痛点是：
我准备用 AI 帮用户完成：
第一个可展示版本长这样：`}</pre>
          </div>
          <div className={styles.templateBox}>
            <h3>好的项目方向通常满足</h3>
            <ul>
              <li>有明确用户，不是“所有人”</li>
              <li>有真实场景，不是只做 ChatGPT 套壳</li>
              <li>2-4 周内能做出第一版</li>
              <li>有可展示结果：网页、报告、看板、工作流、自动化助手</li>
              <li>面试时能讲出产品判断和技术取舍</li>
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
        <h2>从第一天开始积累面试表达</h2>
        <p>
          AI PM 的竞争力不是“会用 AI”，而是能把问题定义清楚、把 Agent 驾驭起来、把结果验证出来，并且讲得让面试官相信。
        </p>
      </section>
    </main>
  );
}
