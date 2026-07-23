import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  FileSearch,
  HeartHandshake,
  Music2,
  MapPinned,
  Plane,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "../site.module.css";
import ArchiveCaseGallery from "./ArchiveCaseGallery";
import RecentCaseGallery from "./RecentCaseGallery";
import { workItems } from "./work-data";

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
    name: "mophro",
    href: "/work/mophro",
    label: "近期陪跑项目",
    note: "项目资料、界面截图、录屏和交付范围待补。",
    icon: Sparkles,
  },
];

const pendingProjects = workItems.filter((item) => item.evidenceStatus === "pending");

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
          <Link href="/work">案例</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Sparkles size={16} />
            Work archive / delivery evidence
          </p>
          <h1>已上线产品与真实项目证据。</h1>
        </div>
        <aside className={styles.heroPanel}>
          <strong>WORK</strong>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>已上线产品。</h2>
          <p>FDE 进入企业的价值，是 AI + 业务 + 研发的深度定制。</p>
        </div>
        <div className={styles.workGrid}>
          <Link href="/work/cosic" className={styles.workCard}>
            <small>Product</small>
            <Music2 size={30} />
            <h3>Cosic</h3>
            <p>个人电台和桌面音乐助手，重点是听歌、找歌、整理歌单。</p>
            <span className={styles.resourceLink}>
              查看项目档案 <ArrowUpRight size={14} />
            </span>
          </Link>
          <Link href="/work/bid-agent" className={styles.workCard}>
            <small>Product</small>
            <FileSearch size={30} />
            <h3>智能招标智能体</h3>
            <p>本地招标工作台，处理资料、标书和项目知识库。</p>
            <span className={styles.resourceLink}>
              查看项目档案 <ArrowUpRight size={14} />
            </span>
          </Link>
          <Link href="/work/lotus" className={styles.workCard}>
            <div className={styles.lotusCardBrand} aria-hidden="true">
              <Image
                src="/brand/toni-lotus/lotus-runtime-wordmark-paper.svg"
                alt=""
                fill
                sizes="420px"
              />
            </div>
            <small>Open source</small>
            <h3>Lotus × Toni</h3>
            <p>Toni 的 Agent Operating Layer，把协作规则、质量门禁和项目启动协议沉淀成可复用系统。</p>
            <span className={styles.resourceLink}>
              查看项目档案 <ArrowUpRight size={14} />
            </span>
          </Link>
          <Link href="/work/antianxiety" className={styles.workCard}>
            <small>Experiment</small>
            <HeartHandshake size={24} />
            <h3>AntiAnxiety</h3>
            <p>健康记录和状态提醒实验，用真实使用反馈打磨方向。</p>
            <span className={styles.resourceLink}>
              查看项目档案 <ArrowUpRight size={14} />
            </span>
          </Link>
          <Link href="/work/lusie" className={styles.workCard}>
            <small>Production</small>
            <Plane size={30} />
            <h3>Lusie</h3>
            <p>从概念图、3D 建模、任务进度到 STL 下载的航模交付链路。</p>
            <span className={styles.resourceLink}>
              查看项目档案 <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>近期企业案例</h2>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>近期陪跑</h2>
        </div>
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
          <h2>待补媒体</h2>
        </div>
        <div className={styles.archiveRail}>
          {pendingProjects.map((item) => (
            <Link key={item.slug} href={`/work/${item.slug}`} className={styles.archiveRow}>
              <FileSearch size={24} />
              <div>
                <small>{item.sub}</small>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
              </div>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>近期案例，看判断方式。</h2>
        </div>
        <RecentCaseGallery />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>早期档案，沉淀可复用路径。</h2>
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
