import Link from "next/link";
import { ArrowUpRight, Boxes } from "lucide-react";
import styles from "../site.module.css";

const modules = [
  {
    title: "获客中心",
    sub: "MARKETING",
    text: "把海报、脚本、分发文案和素材处理收进同一条出品线。",
    tags: ["批量海报", "短视频", "文案矩阵", "素材编辑"],
    href: "/tools/acquisition",
  },
  {
    title: "销售助手",
    sub: "SALES",
    text: "跟住对话、异议、回访和下一次触达，让销售动作不断档。",
    tags: ["实时对话", "话术提示", "智能回访", "灵感追问"],
    href: "/tools/sales",
  },
  {
    title: "研发工坊",
    sub: "RESEARCH",
    text: "把想法、原型、市场判断和数字资产放在一起推演。",
    tags: ["头脑风暴", "快速原型", "市场研判", "资产盘点"],
    href: "/tools/research",
  },
  {
    title: "老板仪表盘",
    sub: "DASHBOARD",
    text: "把日报、回访进度和成交变化整理成老板看得懂的经营视图。",
    tags: ["经营看板", "经营报告", "回访追踪", "成交分析"],
    href: "/tools/operations",
  },
  {
    title: "行政效率",
    sub: "ADMIN",
    text: "合同、纪要、排班和流程诊断，集中处理那些每天都要耗人的小事。",
    tags: ["合同助手", "会议纪要", "排班优化", "流程诊断"],
    href: "/tools/admin",
  },
  {
    title: "智能客服",
    sub: "SERVICE",
    text: "把常见问答、回访话术、舆情波动和客户反馈集中处理。",
    tags: ["智能客服", "回访话术", "舆情监控", "客户之声"],
    href: "/tools/service",
  },
];

const consoleRows = [
  ["Marketing", "poster / copy / video brief"],
  ["Sales", "dialogue / follow-up / script"],
  ["Research", "idea / prototype / trend"],
  ["Dashboard", "daily / weekly / deal view"],
  ["Service", "knowledge / feedback / sentiment"],
];

const cooperationSteps = [
  ["01", "诊断", "看材料、岗位、数据入口和真实阻力，先找最值得动的一处。"],
  ["02", "原型", "做一个能演示、能追问、能被业务方挑刺的版本。"],
  ["03", "落地", "把模块接进具体岗位，明确谁使用、谁复核、谁负责。"],
  ["04", "训练", "把使用节奏、异常回滚和复盘方法交给团队。"],
];

export default function AilaPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/tools">工具</Link>
          <Link href="/about">关于</Link>
          <Link href="/contact">联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Boxes size={16} /> AILA enterprise console</p>
          <h1>AILA 是一套面向企业经营现场的工具矩阵。</h1>
          <p className={styles.lede}>
            它围绕获客、销售、研发、老板仪表盘、行政效率和客服六条线展开。每个模块都有对应工具页，可以继续进入工作台。
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
          <h2>六个模块，全部可以继续进入详情。</h2>
          <p>总览页负责说明结构，工具页负责承接体验。卡片不再停在介绍层。</p>
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
              <Link href={module.href} className={styles.resourceLink}>
                进入工作台 <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand} id="cooperation">
        <h2>企业合作流程，收进 AILA。</h2>
        <p>原来的企业合作页不再单独作为主入口。真正接进一家公司，要从诊断开始，再进入原型、落地和训练。</p>
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
        <h2>要做企业内部系统，先选一个模块开始聊。</h2>
        <div className={styles.actions}>
          <Link href="/tools" className={styles.button}>进入工具大厅</Link>
          <Link href="/contact" className={styles.ghost}>联系 Toni <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
