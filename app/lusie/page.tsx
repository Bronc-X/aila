import Link from "next/link";
import { ArrowRight, Box, Database, Eye, Plane, Sparkles } from "lucide-react";
import styles from "../site.module.css";

const entryCards = [
  {
    href: "/lusie/showcase",
    label: "Public page",
    title: "静态展示页",
    copy: "先看 Lusie 的公开展示、赛事入口和项目介绍。适合给外部用户快速了解。",
    action: "进入展示页",
    icon: Eye,
  },
  {
    href: "/lusie/ai",
    label: "AI workspace",
    title: "AI 工作台",
    copy: "用文字和参数生成概念图，再转成可下载的 3D 航模文件。",
    action: "进入工作台",
    icon: Sparkles,
  },
];

export default function LusiePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/tools">工具</Link>
          <Link href="/work/training-system">陪跑</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Plane size={16} />
            Lusie AI / 航模项目
          </p>
          <h1>航模项目先分两条路。</h1>
          <p className={styles.lede}>
            一个给用户看项目，一个给用户试 AI 生成。这样从 Toni 主页进来，不会直接掉进复杂工作台。
          </p>
          <div className={styles.actions}>
            <Link href="/lusie/showcase" className={styles.button}>
              看展示页
              <ArrowRight size={17} />
            </Link>
            <Link href="/lusie/ai" className={styles.ghost}>
              进 AI 工作台
              <Sparkles size={17} />
            </Link>
          </div>
        </div>
        <aside className={styles.heroPanel}>
          <strong>LUSIE</strong>
          <span>第一步先把入口理顺；下一步再把原 Vite 工作台迁成 Toni.asia 站内功能。</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>两个入口，各做一件事。</h2>
          <p>静态展示负责介绍和承接，AI 工作台负责生成和交付。后续会共用同一套 Supabase 存储。</p>
        </div>
        <div className={styles.lusieChoiceGrid}>
          {entryCards.map((entry) => {
            const Icon = entry.icon;
            return (
              <Link href={entry.href} className={styles.lusieChoiceCard} key={entry.href}>
                <div>
                  <span>{entry.label}</span>
                  <Icon size={30} />
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.copy}</p>
                <strong>
                  {entry.action}
                  <ArrowRight size={18} />
                </strong>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.lusieStatusBand}>
        <div>
          <Box size={24} />
          <strong>AI 生成</strong>
          <span>OpenAI 图片生成 + Tripo 3D 建模，迁入 Next API 后接入。</span>
        </div>
        <div>
          <Database size={24} />
          <strong>存储</strong>
          <span>Supabase 用来保存历史记录；模型文件建议再接对象存储。</span>
        </div>
      </section>
    </main>
  );
}
