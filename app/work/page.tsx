import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BrainCircuit,
  FileSearch,
  HeartHandshake,
  Music2,
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
    note: "把“想做海报生成器”拆成风格输入、生成路径和公开站点，先上线可试用版本。",
    icon: Sparkles,
  },
  {
    name: "PathPilot",
    href: "https://www.pathpilot.space",
    label: "小红书高精准职位投递",
    note: "把内容平台线索、职位匹配和投递动作收成一条可复盘的求职工作流。",
    icon: MapPinned,
  },
  {
    name: "JobPath",
    href: "https://jobpath-seven.vercel.app",
    label: "职场天赋定位产品",
    note: "把职业判断、问答路径和结果页做成能被分享、能被追问的产品原型。",
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
          <Link href="/tools">工具</Link>
          <Link href="/work/training-system">陪跑</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Sparkles size={16} />
            Work archive / delivery evidence
          </p>
          <h1>自己的作品，放在最前面。</h1>
          <p className={styles.lede}>
            Cosic、智能招标、Lotus、AntiAnxiety 和更多项目都放在同一个作品档案里。
          </p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>WORK</strong>
          <span>自己的产品、开源项目、陪跑成果和企业案例，统一放进可检查的作品档案。</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>自己的作品，都放在这里。</h2>
          <p>能打开的给入口，能看源码的给仓库。主标看项目名，副标看它解决什么。</p>
        </div>
        <div className={styles.workGrid}>
          <a href="https://github.com/Bronc-X/Cosic.git" target="_blank" rel="noopener noreferrer" className={styles.workCard}>
            <small>Product</small>
            <Music2 size={30} />
            <h3>Cosic</h3>
            <p>个人电台和桌面音乐助手，重点是听歌、找歌、整理歌单。</p>
            <span className={styles.resourceLink}>
              打开 GitHub <ArrowUpRight size={14} />
            </span>
          </a>
          <a href="https://github.com/Bronc-X/public-tender.git" target="_blank" rel="noopener noreferrer" className={styles.workCard}>
            <small>Product</small>
            <FileSearch size={30} />
            <h3>智能招标智能体</h3>
            <p>本地招标工作台，处理资料、标书和项目知识库。</p>
            <span className={styles.resourceLink}>
              打开 GitHub <ArrowUpRight size={14} />
            </span>
          </a>
          <a href="https://github.com/Bronc-X/Lotus" target="_blank" rel="noopener noreferrer" className={styles.workCard}>
            <div className={styles.lotusCardBrand} aria-hidden="true">
              <Image
                src="/brand/toni-lotus/toni-lotus-pdf-lockup-light.svg"
                alt=""
                fill
                sizes="420px"
              />
            </div>
            <small>Open source</small>
            <h3>Lotus × Toni</h3>
            <p>Toni 的 Agent Operating Layer，把协作规则、质量门禁和项目启动协议沉淀成可复用系统。</p>
            <span className={styles.resourceLink}>
              打开 GitHub <ArrowUpRight size={14} />
            </span>
          </a>
          <a href="https://www.antianxiety.app" target="_blank" rel="noopener noreferrer" className={styles.workCard}>
            <small>Experiment</small>
            <HeartHandshake size={24} />
            <h3>AntiAnxiety</h3>
            <p>健康记录和状态提醒实验，用真实使用反馈打磨方向。</p>
            <span className={styles.resourceLink}>
              打开站点 <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>陪跑项目的价值，是把想法推到可打开。</h2>
        <p>MoviePainter、PathPilot、JobPath 都从一句模糊需求开始，收束成能访问、能演示、能继续迭代的版本。</p>
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
          <h2>近期案例，看判断方式。</h2>
          <p>多数项目不公开源码，所以这里重点展示截图、流程边界和我实际负责的拆解部分。</p>
        </div>
        <RecentCaseGallery />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>早期档案，沉淀可复用路径。</h2>
          <p>企业交付、产品实验和课程系统，保留的是从现场问题到可运行流程的做法。</p>
        </div>
        <ArchiveCaseGallery />
      </section>

      <section className={styles.cta}>
        <h2>如果你也有一个卡住的业务环节，先发现场材料。</h2>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.button}>发我场景</Link>
          <Link href="/" className={styles.ghost}>回到首页 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
