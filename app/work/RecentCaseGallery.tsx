"use client";

import Image from "next/image";
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
    title: "Sparkooo",
    label: "公益项目 / 宠物防走失小程序",
    summary: "从走失场景反推入口，把扫码、联系和传播链路做轻。",
    detail: "重点不是做一张好看的页面，而是让宠物牌、二维码、小程序入口和联系人动作接起来。适合公益项目先用最短链路验证传播，再继续补管理后台和运营机制。",
    images: ["/cases/toni/1.png"],
    scopes: ["小程序入口", "扫码联系", "公益传播"],
    icon: HeartHandshake,
  },
  {
    k: "02",
    title: "GROUD",
    label: "中俄物流集散管理平台",
    summary: "把跨境物流里的订单、节点、角色和集散关系放稳。",
    detail: "系统核心是把原本靠人记、靠表传的节点信息收进同一条管理链路。陪跑重点放在业务对象拆分、权限边界、状态流转和可追踪的操作记录。",
    images: ["/cases/toni/2.jpg"],
    scopes: ["物流节点", "订单流转", "角色权限"],
    icon: Boxes,
  },
  {
    k: "03",
    title: "免安装小龙虾",
    label: "硬件 + 轻量 IDE + speaking coding",
    summary: "从硬件形态迭代到轻量开发环境，让设备进入 AI coding 工作流。",
    detail: "这一组是硬件项目持续迭代后的形态：免安装小龙虾、轻量 IDE、speaking coding。重点是把设备、开发界面和语音/Agent 操作合成一个低门槛工作流。",
    images: ["/cases/toni/3.1.jpg", "/cases/toni/3.2.jpg"],
    scopes: ["硬件形态", "轻量 IDE", "Speaking coding"],
    icon: Cpu,
  },
  {
    k: "04",
    title: "量化策略分析",
    label: "85%+ 胜率 / 超 5 倍潜力股推荐",
    summary: "策略核心不外放，展示信号、筛选逻辑和可解释结果。",
    detail: "陪跑边界是把敏感策略藏住，把可展示的判断过程做清楚。页面只呈现信号分析、候选筛选、风险提示和结果解释，适合现场演示，不适合公开核心参数。",
    images: ["/cases/toni/4.1.jpg", "/cases/toni/4.2.jpg"],
    scopes: ["信号分析", "策略解释", "风险提示"],
    icon: ScanSearch,
  },
  {
    k: "05",
    title: "全国门店管理系统",
    label: "头部咨询顾问公司",
    summary: "把门店动作、数据回收和顾问复盘变成可检查的系统链路。",
    detail: "这个案例服务的是多门店经营管理。关键在于让门店填报、顾问查看、总部汇总和后续复盘形成稳定闭环，而不是让数据停留在一次性表格里。",
    images: ["/cases/toni/5.1.png", "/cases/toni/5.2.jpg"],
    scopes: ["门店管理", "数据回收", "顾问复盘"],
    icon: PackageCheck,
  },
  {
    k: "06",
    title: "电商贸易 RPA",
    label: "自动化执行工具",
    summary: "从重复操作里拆出稳定步骤，让脚本、浏览器和人工复核各归其位。",
    detail: "陪跑重点不是盲目自动化，而是先拆出可以稳定执行的动作，再保留必要的人工复核位置。这样 RPA 不会变成黑箱，也更容易被业务继续使用。",
    images: ["/cases/toni/6.jpg"],
    scopes: ["RPA", "流程拆解", "人工复核"],
    icon: Bot,
  },
  {
    k: "07",
    title: "LLM + Obsidian",
    label: "个人知识库 1 天速通版",
    summary: "一天内搭起输入、索引、检索和输出路径，先能用，再谈优雅。",
    detail: "这个项目追求的是快速打通个人知识流，而不是一上来做复杂知识工程。先让输入、标签、检索和 LLM 输出跑起来，再按真实使用习惯优化结构。",
    images: ["/cases/toni/7.1.jpg", "/cases/toni/7.2.jpg"],
    scopes: ["知识库", "LLM 检索", "1 天速通"],
    icon: ScanSearch,
  },
  {
    k: "08",
    title: "私有项目档案",
    label: "企业内部使用 / 截图展示",
    summary: "多数项目不公开源码，能展示的是截图、流程和判断方式。",
    detail: "这类案例的价值在于判断方式：如何从现场流程里找出最短可用版本，如何决定哪些部分做系统、哪些部分保留人工，以及如何让交付不止停在演示。",
    images: ["/cases/toni/8.jpg"],
    scopes: ["私有交付", "流程截图", "方法复盘"],
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
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
