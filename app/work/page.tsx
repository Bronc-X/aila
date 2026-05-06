import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  GitBranch as Github,
  HeartHandshake,
  MapPinned,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "../site.module.css";
import ArchiveCaseGallery from "./ArchiveCaseGallery";
import RecentCaseGallery from "./RecentCaseGallery";

type CompanionProject = {
  name: string;
  href: string;
  label: string;
  note: string;
  icon: LucideIcon;
};

const companionProjects: CompanionProject[] = [
  {
    name: "MoviePainter",
    href: "https://www.moviepainter.xyz",
    label: "电影海报风格生图",
    note: "从风格定位、生成路径到公开站点，陪到可访问版本。",
    icon: Sparkles,
  },
  {
    name: "PathPilot",
    href: "https://www.pathpilot.space",
    label: "小红书高精准职位投递",
    note: "把内容平台、职位匹配和投递动作收成工作流。",
    icon: MapPinned,
  },
  {
    name: "JobPath",
    href: "https://jobpath-seven.vercel.app",
    label: "职场天赋定位产品",
    note: "把判断、问答和结果页做成能被真实打开的原型。",
    icon: BrainCircuit,
  },
];

export default function WorkPage() {
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
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Sparkles size={16} />
            Work archive / companion evidence
          </p>
          <h1>作品档案</h1>
          <p className={styles.lede}>
            公开产品、陪跑项目、私有案例。能打开的给入口，不能公开的留截图。
          </p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>40+</strong>
          <span>近一个月陪跑次数</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>个人产品，已上线 6 个。</h2>
          <p>长期建设，公开可访问。</p>
        </div>
        <div className={styles.grid}>
          <a href="https://github.com/Bronc-X/Lotus" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <small>Open source</small>
            <Github size={24} />
            <h3>Lotus</h3>
            <p>开源一键冷启动 coding 工具包。GitHub 超过 110 stars，多数来自学员真实克隆。</p>
            <span className={styles.resourceLink}>
              打开 GitHub <ArrowUpRight size={14} />
            </span>
          </a>
          <a href="https://www.antianxiety.app" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <small>Product experiment</small>
            <HeartHandshake size={24} />
            <h3>AntiAnxiety</h3>
            <p>反焦虑类项目，围绕记录、状态和行动提醒做产品化实验，近期筹备上架 App Store。</p>
            <span className={styles.resourceLink}>
              打开站点 <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>陪跑项目</h2>
        <p>MoviePainter、PathPilot、JobPath：从想法跑到可访问。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.archiveRail}>
          {companionProjects.map((item) => (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.archiveRow}>
              <item.icon size={24} />
              <div>
                <small>{item.label}</small>
                <strong>{item.name}</strong>
                <p>{item.note}</p>
              </div>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>近期陪跑案例</h2>
          <p>多数项目未开源，以原图和图集展示。</p>
        </div>
        <RecentCaseGallery />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>早期档案</h2>
          <p>企业交付、产品实验、课程系统。</p>
        </div>
        <ArchiveCaseGallery />
      </section>

      <section className={styles.cta}>
        <h2>想针对某类项目展开聊，直接发我你的场景。</h2>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.button}>联系 Toni</Link>
          <Link href="/" className={styles.ghost}>回到宇宙入口 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
