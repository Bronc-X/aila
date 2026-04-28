import Link from "next/link";
import { ArrowUpRight, Boxes } from "lucide-react";
import styles from "../site.module.css";

const modules = [
  ["获客中心", "MARKETING", "批量 AI 海报生成、短视频脚本、全平台文案矩阵、素材智能编辑。", ["批量海报", "短视频", "文案矩阵", "素材编辑"]],
  ["销售助手", "SALES", "实时对话分析、销售话术提示、智能回访策略、灵感追问引导。", ["实时对话", "话术提示", "智能回访", "灵感追问"]],
  ["研发工坊", "RESEARCH", "AI 头脑风暴、快速原型验证、市场趋势研判、数字资产盘点。", ["头脑风暴", "快速原型", "市场研判", "资产盘点"]],
  ["老板仪表盘", "DASHBOARD", "智能仪表盘、AI 日报周报、回访进度追踪、成交数据分析。", ["智能仪表盘", "AI 报告", "回访追踪", "成交分析"]],
  ["行政效率", "ADMIN", "合同文档助手、会议纪要、排班优化、流程自动化诊断。", ["合同助手", "会议纪要", "排班优化", "流程诊断"]],
  ["智能客服", "SERVICE", "智能客服配置、回访话术、舆情公关助手、客户之声分析。", ["智能客服", "回访话术", "舆情监控", "客户之声"]],
];

const consoleRows = [
  ["Marketing", "poster / copy / video brief"],
  ["Sales", "dialogue / follow-up / script"],
  ["Research", "idea / prototype / trend"],
  ["Dashboard", "daily / weekly / deal view"],
  ["Service", "knowledge / feedback / sentiment"],
];

const boundaries = [
  ["当前站点", "按项目规则，AI 交互走 Mock 引擎，不在本站接 OpenAI/Gemini/Notion 等外部 API。"],
  ["产品方向", "AILA 的价值是把六条业务线做成统一工作台，让企业看到 AI 可以接入哪些真实流程。"],
  ["交付方式", "先演示模块和流程，再根据企业场景决定是否做定制化系统。"],
];

export default function AilaPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Boxes size={16} /> AILA enterprise console</p>
          <h1>AILA 是旧项目里已经定义过的企业 AI 工具矩阵。</h1>
          <p className={styles.lede}>
            它不是凭空编出来的新概念，而是从旧工具区、旧作品集和旧首页共同抽出来的六条业务线：获客、销售、研发、老板仪表盘、行政效率、智能客服。
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
          <h2>六个模块，对应旧系统里真实存在的工具入口。</h2>
          <p>这里保留旧工具页的模块定义和工具标签，只把语言整理成更适合对外介绍的产品页。</p>
        </div>
        <div className={styles.moduleGrid}>
          {modules.map(([title, sub, text, tags], index) => (
            <article className={styles.moduleCard} key={title as string}>
              <small>{String(index + 1).padStart(2, "0")} · {sub}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className={styles.inlineMetrics}>
                {(tags as string[]).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>我不会把 Mock 演示说成已经接入外部模型。</h2>
        <p>当前项目规则明确：所有 AI 交互走站内 Mock 引擎。AILA 页面展示的是产品结构、工具模块和企业工作流方向；真正企业落地时，再根据客户系统和权限决定接入方式。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.timelineGrid}>
          {boundaries.map(([title, text]) => (
            <article className={styles.timelineItem} key={title}>
              <small>Boundary</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>如果要把 AILA 接入真实公司，就从诊断开始。</h2>
        <div className={styles.actions}>
          <Link href="/services" className={styles.button}>看企业合作</Link>
          <Link href="/tools" className={styles.ghost}>进入旧工具区 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
