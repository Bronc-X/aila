import Link from "next/link";
import { ArrowRight, Box, Database, Eye, Plane, Sparkles } from "lucide-react";
import LegacyPageMotionShell from "../components/LegacyPageMotionShell";
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
    <LegacyPageMotionShell>
      <main className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.brand}>
            <span>T</span>
            Toni
          </Link>
          <div className={styles.links}>
            <Link href="/work">作品</Link>
            <Link href="/tools">工具</Link>
            <Link href="/aila">FDE</Link>
            <Link href="/contact">关于 / 联系</Link>
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <Plane size={16} />
              Lusie AI / 航模项目
            </p>
            <h1>航模项目分成展示与生成两条路径。</h1>
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
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>两个入口，各自承担清楚的任务。</h2>
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
            <strong>生成链路</strong>
            <span>概念图到 STL 贯穿同一流程。</span>
          </div>
          <div>
            <Database size={24} />
            <strong>项目记录</strong>
            <span>保存历史、版本与模型来源，便于回溯。</span>
          </div>
        </section>
      </main>
    </LegacyPageMotionShell>
  );
}
