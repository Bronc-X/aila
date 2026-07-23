"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HeartHandshake,
  Images,
  Maximize2,
  PackageCheck,
  ScanSearch,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "../site.module.css";

type RecentCase = {
  k: string;
  title: string;
  href: string;
  label: string;
  summary: string;
  detail: string;
  images: string[];
  scopes: string[];
  icon: LucideIcon;
};

const recentCases: RecentCase[] = [
  {
    k: "01",
    title: "得物生图模型",
    href: "/work/dewu-image",
    label: "企业生产案例",
    summary: "商品上身图背景合成、批量处理、质检报告与 ZIP 交付。",
    detail: "真实工作台把商品图、背景匹配、批量处理、人工复核和最终交付接在一起。",
    images: ["/projects/dewu/home.png", "/projects/dewu/review.png", "/projects/dewu/result.png"],
    scopes: ["批量合成", "质检复核", "ZIP 交付"],
    icon: Images,
  },
  {
    k: "02",
    title: "招标智能体",
    href: "/work/bid-agent",
    label: "企业案例 / 投标工作台",
    summary: "招标文件、评分规则、强制条款、企业资料和标书输出。",
    detail: "真实投标工作台把文件、规则、项目知识库和方案材料放在同一处理界面。",
    images: ["/now/bid-data-management-desktop.png"],
    scopes: ["资料核对", "规则拆解", "标书协作"],
    icon: PackageCheck,
  },
  {
    k: "03",
    title: "Kemo",
    href: "/work/kemo",
    label: "研究交付系统",
    summary: "访谈录音、转写、术语复核、研究备忘录与公众号文章。",
    detail: "Kemo 把访谈资料、转写结果、术语复核和研究交付串成一条可回看的工作流。",
    images: ["/projects/kemo/key-visual.png"],
    scopes: ["访谈转写", "术语复核", "研究交付"],
    icon: Cpu,
  },
  {
    k: "04",
    title: "深圳跨境询盘到报价 Agent",
    href: "/work/fde-case-library.html#crossborder",
    label: "已跑通企业案例",
    summary: "企业真实询盘 → 结构化需求 → 检索与验证 → 报价与 CRM 回写。",
    detail: "来自昨晚已跑通的企业实战案例库，展示从询盘进入到报价回写的完整链路。",
    images: ["/projects/fde-cases/crossborder.png"],
    scopes: ["询盘处理", "产品验证", "报价回写"],
    icon: ScanSearch,
  },
  {
    k: "05",
    title: "深圳移民公司 AI 中控",
    href: "/work/fde-case-library.html#immigration",
    label: "已跑通企业案例",
    summary: "内容生产 → 企业微信询盘 → 顾问预评估 → 签约办案 → 老板中控。",
    detail: "来自昨晚已跑通的企业实战案例库，展示企业微信、案件状态和老板经营中控。",
    images: ["/projects/fde-cases/immigration.png"],
    scopes: ["企微入口", "案件状态", "经营中控"],
    icon: PackageCheck,
  },
  {
    k: "06",
    title: "ViolinMaster",
    href: "/work/violinmaster",
    label: "音乐教授模型工作台",
    summary: "练习录音、曲谱理解、教师反馈与练习诊断。",
    detail: "每次建议都回到录音、曲谱和具体练习段落，形成可复核的反馈路径。",
    images: ["/now/violinmaster-desktop.png"],
    scopes: ["练习录音", "曲谱理解", "诊断反馈"],
    icon: Bot,
  },
  {
    k: "07",
    title: "小红书自动化工具",
    href: "/work/xhs-automation",
    label: "内容生产与审核",
    summary: "选题、素材、笔记草稿、质量检查与发布确认。",
    detail: "候选稿可以批量，结论不能批量；项目保留素材、审核和发布确认。",
    images: ["/now/auto-red-book-github.png", "/tools-showcase/xhs-matrix-editorial-hero.webp"],
    scopes: ["选题建档", "质量检查", "发布确认"],
    icon: ScanSearch,
  },
  {
    k: "08",
    title: "图生视频平台",
    href: "/work/video-platform",
    label: "产品一致性与分镜生产链",
    summary: "四视图上传、分镜、一致性约束、视频生成与后期交付。",
    detail: "项目把一致性、分镜和后期检查写进工作台，而不是只展示一段生成结果。",
    images: ["/projects/video-platform/home.png", "/projects/video-platform/storyboard.png"],
    scopes: ["四视图", "Harness 约束", "视频交付"],
    icon: PackageCheck,
  },
];

export default function RecentCaseGallery() {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeCase = activeCaseIndex === null ? null : recentCases[activeCaseIndex];

  useEffect(() => {
    if (!activeCase) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCaseIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setActiveImageIndex((current) => (current - 1 + activeCase.images.length) % activeCase.images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveImageIndex((current) => (current + 1) % activeCase.images.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeCase]);

  const openCase = (caseIndex: number, imageIndex = 0) => {
    setActiveCaseIndex(caseIndex);
    setActiveImageIndex(imageIndex);
  };

  const moveImage = (direction: -1 | 1) => {
    if (!activeCase) return;
    setActiveImageIndex((current) => (current + direction + activeCase.images.length) % activeCase.images.length);
  };

  return (
    <>
      <div className={styles.companionCaseGrid}>
        {recentCases.map((item, caseIndex) => (
          <article className={styles.galleryCaseCard} key={item.k}>
            <button
              type="button"
              className={styles.galleryMediaButton}
              onClick={() => openCase(caseIndex)}
              aria-label={`查看 ${item.title} 原图${item.images.length > 1 ? "集" : ""}`}
            >
              <span className={styles.galleryMediaBackdrop} aria-hidden="true">
                <Image src={item.images[0]} alt="" fill sizes="(max-width: 900px) 100vw, 44vw" />
              </span>
              <span className={styles.galleryMediaFrame}>
                <Image src={item.images[0]} alt={`${item.title} screenshot`} fill sizes="(max-width: 900px) 100vw, 44vw" />
              </span>
              <span className={styles.galleryCount}>
                {item.images.length > 1 ? <Images size={15} /> : <Maximize2 size={15} />}
                {item.images.length > 1 ? `${item.images.length} 张` : "原图"}
              </span>
            </button>
            <div className={styles.galleryBody}>
              <div className={styles.galleryTitleRow}>
                <small>{item.k}</small>
                <item.icon size={22} />
              </div>
              <h3>{item.title}</h3>
              <p>
                <strong>{item.label}</strong>
                <br />
                {item.summary}
              </p>
              <div className={styles.caseScope}>
                {item.scopes.map((scope) => (
                  <span key={scope}>{scope}</span>
                ))}
              </div>
              <button type="button" className={styles.caseLink} onClick={() => openCase(caseIndex)}>
                查看原图{item.images.length > 1 ? "集" : ""} <Maximize2 size={14} />
              </button>
              <Link href={item.href} className={styles.caseLink}>
                打开项目页 <Maximize2 size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {activeCase && (
        <div className={styles.caseModalBackdrop} role="dialog" aria-modal="true" aria-label={`${activeCase.title} 图集`}>
          <div className={styles.caseModal}>
            <button type="button" className={styles.modalClose} onClick={() => setActiveCaseIndex(null)} aria-label="关闭图集">
              <X size={20} />
            </button>
            <div className={styles.caseModalMedia}>
              {activeCase.images.length > 1 && (
                <button type="button" className={styles.modalNavButton} onClick={() => moveImage(-1)} aria-label="上一张">
                  <ChevronLeft size={24} />
                </button>
              )}
              <div className={styles.modalImageWrap}>
                <Image
                  src={activeCase.images[activeImageIndex]}
                  alt={`${activeCase.title} screenshot ${activeImageIndex + 1}`}
                  fill
                  sizes="92vw"
                  priority
                />
              </div>
              {activeCase.images.length > 1 && (
                <button type="button" className={styles.modalNavButton} onClick={() => moveImage(1)} aria-label="下一张">
                  <ChevronRight size={24} />
                </button>
              )}
            </div>
            <aside className={styles.caseModalContent}>
              <small>
                {activeCase.k} / {activeImageIndex + 1} of {activeCase.images.length}
              </small>
              <h3>{activeCase.title}</h3>
              <p>
                <strong>{activeCase.label}</strong>
                <br />
                {activeCase.detail}
              </p>
              <div className={styles.thumbRail}>
                {activeCase.images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={index === activeImageIndex ? styles.thumbActive : ""}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`查看第 ${index + 1} 张`}
                  >
                    <Image src={image} alt="" fill sizes="7rem" />
                  </button>
                ))}
              </div>
              <Link href={activeCase.href} className={styles.archiveModalLink}>
                打开项目页 <Maximize2 size={14} />
              </Link>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
