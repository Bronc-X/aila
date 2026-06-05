import Link from "next/link";
import { ArrowUpRight, Boxes } from "lucide-react";
import styles from "../site.module.css";

const modules = [
  {
    title: "获客中心",
    sub: "MARKETING",
    text: "把海报、短视频脚本、分发文案和素材处理收进同一条内容出品线。",
    tags: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    href: "/tools/acquisition",
  },
  {
    title: "销售助手",
    sub: "SALES",
    text: "记录对话重点、客户异议、回访节奏和下一步动作，让销售跟进不断档。",
    tags: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    href: "/tools/sales",
  },
  {
    title: "验证工坊",
    sub: "RESEARCH",
    text: "把想法、原型假设、市场线索和企业资料放在同一张工作台上验证。",
    tags: ["多角色评审", "原型验证", "市场线索", "资产盘点"],
    href: "/tools/research",
  },
  {
    title: "老板仪表盘",
    sub: "DASHBOARD",
    text: "把日报、回访进度和成交变化整理成能快速扫读的经营视图。",
    tags: ["经营看板", "经营报告", "回访追踪", "成交分析"],
    href: "/tools/operations",
  },
  {
    title: "图生 3D 等待态",
    sub: "ACTION",
    text: "用于漫长模型生成过程的进度展示，包含 3D 打印循环视频、WebM/MP4 兜底和羽化边缘。",
    tags: ["生成等待", "3D 打印", "循环视频", "Vercel 探针"],
    href: "/aila/print-loading-animation",
  },
  {
    title: "行政效率",
    sub: "ADMIN",
    text: "合同、纪要、排班和流程诊断，先接住每天都在消耗人的行政任务。",
    tags: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    href: "/tools/admin",
  },
  {
    title: "智能客服",
    sub: "SERVICE",
    text: "把常见问答、回访话术、舆情波动和客户反馈集中到可复盘面板。",
    tags: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    href: "/tools/service",
  },
  {
    title: "海报方案助手",
    sub: "PROPOSAL",
    text: "把活动信息、预算人数和品牌资料整理成方案页、宣传文案、海报提示词和 PPTX 初稿。",
    tags: ["活动方案", "宣传文案", "海报提示词", "PPTX 导出"],
    href: "https://github.com/xiahui001/Activity-plan.git",
  },
  {
    title: "小红书自动二创",
    sub: "XHS MATRIX",
    text: "围绕 5 个账号生成候选图文草稿，保留人工筛选、审核和发布确认，不做黑箱自动发布。",
    tags: ["矩阵草稿", "热点参考", "质量检查", "客服线索"],
    href: "https://github.com/xiahui001/auto-red-book.git",
  },
];

const consoleRows = [
  ["Marketing", "poster / copy / video brief"],
  ["Sales", "dialogue / follow-up / script"],
  ["Research", "idea / prototype / trend"],
  ["Dashboard", "daily / weekly / deal view"],
  ["Service", "knowledge / feedback / sentiment"],
  ["Proposal", "activity / poster / deck"],
  ["XHS", "draft / review / lead"],
];

const cooperationSteps = [
  ["01", "诊断", "看材料、岗位、数据入口和真实阻力，先找最值得动的一处。"],
  ["02", "原型", "做一个能点击、能演示、能被业务方挑刺的版本。"],
  ["03", "落地", "把模块接进具体岗位，明确谁使用、谁复核、谁负责。"],
  ["04", "训练", "把使用节奏、异常处理和复盘方法交给团队。"],
];

export default function AilaPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/tools">工具</Link>
          <Link href="/work/training-system">陪跑</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Boxes size={16} /> AILA enterprise console</p>
          <h1>AILA 已升级为 8 大工具模块。</h1>
          <p className={styles.lede}>
            新增海报方案助手和小红书自动二创。现在内容项目也被放进可演示、可复核的工具矩阵。
          </p>
        </div>
        <aside className={styles.consoleFrame}>
          <div className={styles.consoleRows}>
            {consoleRows.map(([name, value]) => (
              <div key={name}>
                <span>{name}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>八个模块，对应企业最常见的业务卡点。</h2>
          <p>总览页负责说明结构，工具页负责让你继续下钻。先看得懂，再决定哪里值得接入真实系统。</p>
        </div>
        <div className={styles.moduleGrid}>
          {modules.map((module, index) => (
            <article className={styles.moduleCard} key={module.title}>
              <small>{String(index + 1).padStart(2, "0")} · {module.sub}</small>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
              <div className={styles.inlineMetrics}>
                {module.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              {module.href.startsWith("http") ? (
                <a href={module.href} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                  查看 GitHub <ArrowUpRight size={14} />
                </a>
              ) : (
                <Link href={module.href} className={styles.resourceLink}>
                  进入工作台 <ArrowUpRight size={14} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand} id="cooperation">
        <h2>企业合作流程，收进 AILA。</h2>
        <p>真正接进一家公司，不能从功能清单开始。先诊断一条业务链，再进入原型、落地和训练。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.offerGrid}>
          {cooperationSteps.map(([k, title, text]) => (
            <article className={styles.offer} key={title}>
              <small>{k}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>想做企业内部 AI 工具，先选一条业务链来验证。</h2>
        <div className={styles.actions}>
          <Link href="/tools" className={styles.button}>进入工具演示</Link>
          <Link href="/contact" className={styles.ghost}>发我场景 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
