"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ExternalLink,
  Factory,
  HeartPulse,
  Megaphone,
  MessagesSquare,
  MonitorPlay,
  MousePointerClick,
  Play,
  PlayCircle,
  ScanSearch,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import styles from "./case-library.module.css";
import type {
  CaseExperience,
  ExperienceFilter,
  ExperienceKind,
  ProjectRecord,
} from "./case-library-data";
import { getCaseExperienceEvidence } from "./case-library-data";

const filters: Array<{ id: ExperienceFilter; label: string; icon: LucideIcon }> = [
  { id: "all", label: "全部体验", icon: Sparkles },
  { id: "video", label: "视频演示", icon: PlayCircle },
  { id: "interactive", label: "可操作 Demo", icon: MousePointerClick },
];

const categoryIcons: Record<string, LucideIcon> = {
  销售运营: Building2,
  经营管理: Workflow,
  工业质检: Factory,
  客户服务: MessagesSquare,
  内容生产: Megaphone,
  业务诊断: ScanSearch,
  产品体验: HeartPulse,
};

const kindLabels: Record<ExperienceKind, string> = {
  video: "视频演示",
  interactive: "互动体验",
};

function ExperienceStage({ item }: { item: CaseExperience }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [surfaceSrc, setSurfaceSrc] = useState("");
  const evidence = getCaseExperienceEvidence(item.id);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setStatus("loading");
      setSurfaceSrc(
        item.kind === "video"
          ? item.media ?? ""
          : item.embedSrc ?? item.href
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [item.embedSrc, item.href, item.kind, item.media]);

  return (
    <section className={styles.stage} aria-live="polite">
      <header className={styles.stageHeader}>
        <div>
          <span>{item.category}</span>
          <strong>{item.title}</strong>
        </div>
        <Link href={item.href} target="_blank" rel="noopener noreferrer">
          全屏打开 <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </header>

      <div className={styles.stageIntro}>
        <strong>{item.whatItIs}</strong>
      </div>

      <div className={styles.stageViewport} data-kind={item.kind}>
        {status === "loading" && (
          <div className={styles.loadingState}>
            <span>LOADING EXPERIENCE</span>
            <div />
          </div>
        )}
        {status === "error" && (
          <div className={styles.errorState}>
            <strong>演示暂时没有加载成功</strong>
            <p>可以使用右上角的新窗口入口继续体验。</p>
          </div>
        )}
        {item.kind === "video" && item.media ? (
          <video
            src={surfaceSrc || undefined}
            controls
            playsInline
            preload="metadata"
            poster={item.poster}
            onLoadedMetadata={() => setStatus("ready")}
            onLoadedData={() => setStatus("ready")}
            onCanPlay={() => setStatus("ready")}
            onError={() => setStatus("error")}
          >
            <source
              src={item.media}
              type={item.media.endsWith(".webm") ? "video/webm" : "video/mp4"}
            />
          </video>
        ) : (
          <iframe
            src={surfaceSrc || undefined}
            title={`${item.title} 互动演示`}
            loading="lazy"
            allow="microphone"
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />
        )}
      </div>

      <div className={styles.stageBody}>
        <div className={styles.stageMeta}>
          <span data-kind={item.kind}>
            {item.kind === "video" ? <Play size={13} aria-hidden="true" /> : <MousePointerClick size={13} aria-hidden="true" />}
            {kindLabels[item.kind]}
          </span>
          <span data-evidence={evidence.level}>{evidence.label}</span>
          <span>{item.duration}</span>
        </div>
        <h2>{item.subtitle}</h2>
        <p>{item.summary}</p>
        <p className={styles.evidenceNote}>{evidence.note}</p>

        <div className={styles.experienceFlow}>
          <article>
            <span>输入</span>
            <strong>原始资料</strong>
            <p>{item.input}</p>
          </article>
          <article>
            <span>运行</span>
            <strong>实际过程</strong>
            <p>{item.experience}</p>
          </article>
          <article>
            <span>产物</span>
            <strong>输出与确认</strong>
            <p>{item.outcome}</p>
          </article>
        </div>

        <div className={styles.stageFooter}>
          <div className={styles.tagRow}>
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <Link href={item.href} className={styles.primaryAction}>
            进入完整体验 <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectArchive({ projects }: { projects: ProjectRecord[] }) {
  return (
    <section className={styles.projectArchive}>
      <div className={styles.projectArchiveHeading}>
        <span>项目档案</span>
        <h2>已经做过的项目和产品。</h2>
      </div>
      <div className={styles.projectRows}>
        {projects.map((project) => (
          <article className={styles.projectRow} key={project.id}>
            <span className={styles.projectNumber}>{project.index}</span>
            <div className={styles.projectCopy}>
              <small>{project.subtitle}</small>
              <strong>{project.title}</strong>
              <p>{project.summary}</p>
              <span className={styles.projectNote}>{project.evidenceNote}</span>
            </div>
            <div className={styles.projectActions}>
              <span data-native-route={project.nativeRoute}>{project.evidenceLabel}</span>
              <Link href={project.href}>
                {project.actionLabel} <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CaseLibraryClient({
  experiences,
  projectRecords,
}: {
  experiences: CaseExperience[];
  projectRecords: ProjectRecord[];
}) {
  const [activeFilter, setActiveFilter] = useState<ExperienceFilter>("all");
  const [activeId, setActiveId] = useState(experiences[0]?.id ?? "");

  useEffect(() => {
    document.body.classList.add("case-library-body");

    return () => {
      document.body.classList.remove("case-library-body");
    };
  }, []);

  const filteredExperiences = useMemo(
    () =>
      experiences.filter(
        (experience) => activeFilter === "all" || experience.kind === activeFilter
      ),
    [activeFilter, experiences]
  );

  const activeExperience =
    filteredExperiences.find((experience) => experience.id === activeId) ??
    filteredExperiences[0] ??
    experiences[0];

  return (
    <main className={styles.page}>
      <div className={styles.gridField} aria-hidden="true" />

      <header className={styles.nav}>
        <Link href="/sales-materials" className={styles.backLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          销售物料
        </Link>
        <Link href="/" className={styles.brand}>
          <span>A</span>
          AILA / 项目与 Demo
        </Link>
        <div className={styles.navLinks}>
          <Link href="/work">项目档案</Link>
          <Link href="/contact">
            预约演示 <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              <MonitorPlay size={15} aria-hidden="true" />
              AILA / 项目与 Demo
            </p>
            <h1>
              让老板做
              <em>老板该做的事情。</em>
            </h1>
          </div>
          <aside>
            <strong>{experiences.length.toString().padStart(2, "0")}</strong>
            <span>个流程、产品和原型</span>
            <p>从询盘、客服到工业质检。</p>
          </aside>
        </section>

        <section className={styles.library}>
          <div className={styles.libraryToolbar}>
            <div>
              <span>Demo</span>
              <strong>流程、产品和原型。</strong>
            </div>
            <div className={styles.filters} role="tablist" aria-label="体验类型筛选">
              {filters.map((filter) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter.id}
                  data-experience-filter={filter.id}
                  key={filter.id}
                  className={activeFilter === filter.id ? styles.filterActive : styles.filterButton}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <filter.icon size={14} aria-hidden="true" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.libraryLayout}>
            <nav className={styles.caseIndex} aria-label="体验案例列表">
              {filteredExperiences.map((item) => {
                const Icon = categoryIcons[item.category] ?? Sparkles;
                const isActive = activeExperience?.id === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    data-experience-id={item.id}
                    className={isActive ? styles.caseActive : styles.caseButton}
                    aria-pressed={isActive}
                    onClick={() => setActiveId(item.id)}
                  >
                    <span className={styles.caseNumber}>{item.index}</span>
                    <span className={styles.caseCopy}>
                      <small>
                        {item.category} / {kindLabels[item.kind]}
                      </small>
                      <strong>{item.title}</strong>
                      <span>{item.summary}</span>
                      <small className={styles.caseEvidence}>{getCaseExperienceEvidence(item.id).label}</small>
                    </span>
                    <span className={styles.caseSignal}>
                      <Icon size={17} aria-hidden="true" />
                      <small>{item.duration}</small>
                    </span>
                  </button>
                );
              })}
            </nav>

            {activeExperience ? (
              <ExperienceStage key={activeExperience.id} item={activeExperience} />
            ) : (
              <div className={styles.emptyState}>
                <MonitorPlay size={30} aria-hidden="true" />
                <strong>当前筛选下还没有体验</strong>
              </div>
            )}
          </div>
        </section>

        <ProjectArchive projects={projectRecords} />

        <footer className={styles.footer}>
          <span>AILA / 项目与 Demo</span>
          <Link href="/sales-materials">
            回到销售物料 <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
