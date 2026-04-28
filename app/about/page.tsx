import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Moon } from "lucide-react";
import styles from "../site.module.css";

const principles = [
  ["先做现场", "不先讲概念，先把业务现场、角色、输入输出和失败边界画清楚。"],
  ["先出原型", "一个能点击、能演示、能被团队质疑的版本，比十页方案更快逼近真实。"],
  ["先让人接住", "系统不是上线就结束，要让老板能判断、员工能使用、团队能复盘。"],
];

const capabilityMap = [
  ["产品判断", "把一句“我们想用 AI”拆成业务目标、流程瓶颈、使用角色和判断指标。"],
  ["界面与交互", "把复杂流程做成清楚的界面、状态和操作节奏，让人知道下一步点哪里。"],
  ["AI 工作流", "把 Prompt、数据、工具和人工复核组合成稳定流程，避免只停在演示层。"],
  ["训练交付", "用课程、案例和工具把团队带上手，形成可重复的 AI 使用动作。"],
];

const timeline = [
  ["01", "拆问题", "明确谁使用、输入什么、输出给谁、错了怎么回滚。"],
  ["02", "做系统", "从演示原型推进到可试用工具，让需求进入真实反馈。"],
  ["03", "训练人", "把系统讲清楚、教会团队、留下复盘方法，而不是只交一个链接。"],
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
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Moon size={16} />
            AI Builder / Independent developer
          </p>
          <h1>Toni，把 AI 产品和业务流程做成可交付系统。</h1>
          <p className={styles.lede}>
            AI Builder、独立开发者，长期做 ToB 场景里的原型、工具和训练交付。从 MVP 到生产级应用，我更关心 AI 能不能进入真实流程，被人用起来，并且留下可复盘的业务结果。
          </p>
        </div>
        <aside className={styles.portraitPanel}>
          <div className={styles.portraitFrame}>
            <Image src="/speaker-toni.jpg" alt="Toni portrait" fill sizes="(max-width: 900px) 100vw, 34vw" priority />
          </div>
          <div className={styles.statStrip}>
            <div>
              <strong>AI</strong>
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
          <h2>工作方式很简单：先把混乱变成结构。</h2>
          <p>
            合作开始时，我不会先问要不要接大模型，而是先问：谁使用、输入什么、输出给谁、结果错了谁复核。
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
              <li>从业务判断到界面结构，不把责任切碎。</li>
              <li>从可演示原型到团队训练，保持交付连续。</li>
              <li>从工具效果到使用机制，避免项目上线后闲置。</li>
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
        <h2>判断我适不适合做你的项目，先看已经拆出来的真实作品。</h2>
        <div className={styles.actions}>
          <Link href="/work" className={styles.button}>
            进入作品
          </Link>
          <Link href="/services" className={styles.ghost}>
            合作方式 <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
