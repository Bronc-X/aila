import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Sparkles } from "lucide-react";
import ToniSpatialHero from "./components/ToniSpatialHero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.home}>
      <ToniSpatialHero />

      <section className={styles.signalPanel} aria-label="Toni positioning">
        <p className={styles.eyebrow}>
          <Sparkles size={16} />
          AI product builder / enterprise workflow designer
        </p>
        <h1>Toni，把 AI 系统做成真实可用的业务现场。</h1>
        <p className={styles.lede}>
          从想法、原型到上线工具，帮助团队把复杂流程变成能运行、能交付、能复用的系统。
        </p>
        <div className={styles.actions}>
          <Link href="/work" className={styles.primary}>
            <BriefcaseBusiness size={18} />
            看代表作品
          </Link>
          <Link href="/services" className={styles.secondary}>
            企业合作方式
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
