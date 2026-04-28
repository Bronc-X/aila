import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import styles from "../site.module.css";

const serviceSteps = [
  ["01", "AI 机会诊断", "对应旧训练里的“现场诊断”：抽取企业流程，锁定 AI 可切入的利润增长点。"],
  ["02", "原型冲刺", "对应旧案例里的交付方式：先做可演示原型，而不是先交一份抽象方案。"],
  ["03", "工具落地", "把获客、销售、研发、运营、行政、客服等模块接入具体岗位。"],
  ["04", "团队训练", "把工具使用、结果复核、异常回滚和复盘节奏训练给负责人和执行人员。"],
];

const inputs = [
  ["业务材料", "历史表格、销售对话、客服记录、产品素材、合同文档、会议录音。"],
  ["团队角色", "老板、业务负责人、一线执行、客服、销售、运营和行政。"],
  ["可交付物", "流程地图、工具原型、模块说明、训练材料、复盘指标。"],
];

const fit = [
  ["适合", "已经有真实业务流程、重复劳动和明确负责人，希望把 AI 做成可运行工具。"],
  ["谨慎", "只想要万能提示词、没有数据入口、没有流程 owner，或者不准备改变团队协作方式。"],
];

export default function ServicesPage() {
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
          <p className={styles.eyebrow}><CheckCircle2 size={16} /> Enterprise AI implementation</p>
          <h1>企业合作承接的是可诊断、可原型、可训练的落地路径。</h1>
          <p className={styles.lede}>
            核心不是泛泛聊 AI，而是帮中小企业从利润下滑、团队内卷和流程低效里找到精确切入点，再把它做成业务方能使用和复盘的工具。
          </p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>诊断 → 原型 → 落地 → 训练</strong>
          <span>每一步都应该产出能被业务方使用、判断或复盘的东西。</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.offerGrid}>
          {serviceSteps.map(([k, title, text]) => (
            <article className={styles.offer} key={title}>
              <small>{k}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.playbook}>
          <aside className={styles.playbookIndex}>
            <strong>不是空泛策略会。</strong>
            <ul className={styles.playbookList}>
              <li>不卖概念、不讲空话。</li>
              <li>每个模块对应获客、销售、运营、行政、客服、研发环节。</li>
              <li>现场演练目标是复制到公司落地方案。</li>
            </ul>
          </aside>
          <div className={styles.mapList}>
            {inputs.map(([title, text]) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.twoGrid}>
          {fit.map(([title, text]) => (
            <article className={styles.quote} key={title}>
              <p>{text}</p>
              <strong>{title}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>先看旧案例，再决定从哪条流程开始。</h2>
        <div className={styles.actions}>
          <Link href="/work" className={styles.button}>看真实案例</Link>
          <Link href="/aila" className={styles.ghost}>看 AILA 模块 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
