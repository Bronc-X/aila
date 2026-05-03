import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Moon } from "lucide-react";
import styles from "../site.module.css";

const principles = [
  ["先到现场", "从一张表、一段对话、一次交付卡顿开始，看清事情真正发生的地方。"],
  ["先见雏形", "能点、能试、能被追问的版本，往往比厚厚一份方案更接近答案。"],
  ["先让人用住", "交付之后还要有人愿意打开、敢于判断，并能把结果带回日常工作。"],
];

const capabilityMap = [
  ["产品判断", "把含混的想法落到业务目标、流程瓶颈、使用角色和判断指标上。"],
  ["界面与交互", "把复杂流程收进清楚的界面、状态和操作节奏里，让人自然知道下一步。"],
  ["工作流设计", "把数据、工具、提示词和人工复核编排成稳定链路，能跑，也能追责。"],
  ["训练交付", "用课程、案例和工具把团队带上手，让方法留在组织里继续生长。"],
];

const timeline = [
  ["01", "拆问题", "明确谁使用、输入什么、输出给谁、错了怎么回滚。"],
  ["02", "做系统", "从演示原型推进到可试用工具，让需求接受真实反馈。"],
  ["03", "训练人", "把系统讲清楚，把团队带会，也把复盘方法留下。"],
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
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
          <p className={styles.eyebrow}>
            <Moon size={16} />
            Product builder / Independent developer
          </p>
          <h1>Toni，把产品判断和业务流程做成可交付系统。</h1>
          <p className={styles.lede}>
            独立开发者，长期做 ToB 场景里的原型、工具和训练交付。从 MVP 到生产级应用，我关心的是系统能否进入真实流程，被人持续使用，并留下说得清的业务结果。
          </p>
        </div>
        <aside className={styles.portraitPanel}>
          <div className={styles.portraitFrame}>
            <Image src="/speaker-toni.jpg" alt="Toni portrait" fill sizes="(max-width: 900px) 100vw, 34vw" priority />
          </div>
          <div className={styles.statStrip}>
            <div>
              <strong>Flow</strong>
              <span>产品与工作流</span>
            </div>
            <div>
              <strong>UX</strong>
              <span>交互和界面</span>
            </div>
            <div>
              <strong>Ops</strong>
              <span>训练和落地</span>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>工作方式很简单：先把混乱理出骨架。</h2>
          <p>
            合作开始时，我先问最朴素的几个问题：谁使用，输入什么，输出给谁，结果错了由谁复核。
          </p>
        </div>
        <div className={styles.grid}>
          {principles.map(([title, text]) => (
            <article className={styles.card} key={title}>
              <small>Principle</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.playbook}>
          <aside className={styles.playbookIndex}>
            <strong>One person, full chain.</strong>
            <ul className={styles.playbookList}>
              <li>业务判断、界面结构和交付责任放在同一张桌上看。</li>
              <li>从可演示原型到团队训练，交付不断线。</li>
              <li>工具效果要接上使用机制，才不会上线后闲置。</li>
            </ul>
          </aside>
          <div className={styles.mapList}>
            {capabilityMap.map(([title, text]) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.timelineGrid}>
          {timeline.map(([k, title, text]) => (
            <article className={styles.timelineItem} key={title}>
              <small>{k}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>想判断是否合拍，可以先看这些已经落过地的作品。</h2>
        <div className={styles.actions}>
          <Link href="/work" className={styles.button}>
            进入作品
          </Link>
          <Link href="/aila#cooperation" className={styles.ghost}>
            合作方式 <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
