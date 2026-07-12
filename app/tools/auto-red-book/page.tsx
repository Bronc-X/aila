import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import PortfolioCaseMotion from "../_components/PortfolioCaseMotion";
import styles from "../portfolio-case.module.css";

export const metadata: Metadata = {
  title: "小红书自动二创 | Toni 作品案例",
  description: "围绕五个账号组织选题、证据、素材、候选草稿、质量检查和人工发布确认。",
};

const lanes = [
  ["01", "FDE 现场笔记", "不把培训和销售换个名字就叫 FDE，重点记录数据管道、异构接口、清洗解析与生产责任。"],
  ["02", "模型验真实验室", "围绕中转站 API 的供应链声明、请求特征和能力边界做重复测试，保留可质询的证据。"],
  ["03", "Harness 工程手册", "比较自然语言规则、外部规则文件和完整运行框架，说明各自适用边界与环境依赖。"],
  ["04", "项目拆解", "从现有作品、截图和交付记录中提炼方法，不用抽象口号替代项目过程。"],
  ["05", "客户问题库", "把评论和私信里的真实问题整理成选题、FAQ 和后续沟通线索。"],
];

const workflow = [
  ["01", "选题建档", "记录问题、受众、证据来源和不确定项。"],
  ["02", "资产配对", "从知识库、截图、项目记录和既有文章中选择可支撑内容的材料。"],
  ["03", "分账号改写", "同一事实按不同账号的任务和读者重新组织，不做五份近义复制。"],
  ["04", "质量检查", "检查来源、夸大表述、重复度、敏感结论和图片使用边界。"],
  ["05", "人工确认", "候选稿由人筛选、修改和发布，系统不绕过平台流程。"],
];

export default function AutoRedBookPage() {
  return (
    <PortfolioCaseMotion variant="matrix">
      <main className={styles.casePage}>
        <nav className={styles.topbar} aria-label="小红书自动二创导航">
          <Link className={styles.backLink} href="/tools">
            <ArrowLeft size={14} /> 返回工具总览
          </Link>
          <span className={styles.topMeta}>TONI / CONTENT OPERATIONS ASSET 08</span>
          <a
            className={styles.sourceLink}
            href="https://github.com/xiahui001/auto-red-book.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            项目源码 <ArrowUpRight size={14} />
          </a>
        </nav>

        <section className={styles.hero}>
          <span className={styles.caseNumber} aria-hidden="true">08</span>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-case-hero>Case 08 / Content Operations</p>
            <h1 className={styles.heroTitle} data-case-hero>五个账号，不是把同一篇内容改写五遍。</h1>
            <p className={styles.heroSummary} data-case-hero>
              这套流程把选题、证据、图片、候选草稿和审核记录放进同一条内容生产线。系统负责整理候选，人负责判断什么值得发、哪里还需要查证。
            </p>
            <div className={styles.heroActions} data-case-hero>
              <a className={styles.primaryAction} href="https://github.com/xiahui001/auto-red-book.git" target="_blank" rel="noopener noreferrer">
                查看项目证据 <ArrowUpRight size={15} />
              </a>
              <Link className={styles.secondaryAction} href="/now">查看完整资产库</Link>
            </div>
            <div className={styles.heroFacts} data-case-hero>
              <div className={styles.heroFact}><strong>5</strong><span>个内容角色</span></div>
              <div className={styles.heroFact}><strong>2</strong><span>轮质量检查</span></div>
              <div className={styles.heroFact}><strong>0</strong><span>次自动发布</span></div>
            </div>
          </div>
          <figure className={styles.heroVisual} data-case-hero data-case-parallax>
            <Image
              src="/tools-showcase/xhs-matrix-editorial-hero.webp"
              alt="五条内容线、选题卡、图片样张和人工审核记录组成的内容工作台"
              fill
              preload
              sizes="(max-width: 1100px) 92vw, 54vw"
            />
            <figcaption className={styles.visualCaption}>Editorial review wall / generated for this case study</figcaption>
          </figure>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.sectionGrid}>
            <aside className={styles.sectionRail}>
              <span className={styles.sectionIndex}>01 / EDITORIAL STANCE</span>
              <p>“吃透 AI、打透 AI”不是口号，而是一套选题标准。</p>
            </aside>
            <div>
              <h2 className={styles.sectionTitle}>先把问题查深，再决定如何表达。</h2>
              <p className={styles.leadCopy}>
                内容不追逐泛泛热度。真正值得做的主题，必须来自业务现场、工程约束或可验证的风险，并且能找到截图、记录、请求结果或项目过程作为支撑。
              </p>
              <div className={styles.topicGrid}>
                <article className={styles.topicCard}>
                  <span>FDE / FIELD NOTE</span>
                  <h3>不把销售、培训和标准化内容换一层包装，就当作 FDE。</h3>
                  <p>真正的企业落地要从数据管道开始：清洗、解析、异构端口接入、运行环境、上线责任和后续运营缺一不可。</p>
                </article>
                <article className={styles.topicCard}>
                  <span>TOPIC 01 / MODEL AUTHENTICITY</span>
                  <h3>中转站 API 对接的到底是真模型还是伪装模型？</h3>
                  <p>建立重复测试记录，比较能力边界、响应特征与供应链声明；结论不足时继续保留疑点，不用单次结果下定论。</p>
                </article>
                <article className={styles.topicCard}>
                  <span>TOPIC 02 / HARNESS</span>
                  <h3>企业项目和个人 Agent 的约束管控怎样真正落地？</h3>
                  <p>分别拆解自然语言规则、外部文件和完整框架，说明运行环境、依赖项、维护成本以及何时需要升级方案。</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.galleryHeader}>
            <div>
              <span className={styles.eyebrow}>Five account roles</span>
              <h2>每个账号承担不同的内容任务。</h2>
            </div>
            <p>事实可以共享，角度、结构、素材和读者问题不能复制。</p>
          </div>
          <div className={styles.laneGrid}>
            {lanes.map(([index, title, copy]) => (
              <article className={styles.laneCard} key={index}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.splitEvidence}>
            <figure className={styles.evidenceImage} data-case-parallax>
              <Image
                src="/now/auto-red-book-github.png"
                alt="小红书自动化工具 GitHub 项目页面"
                fill
                sizes="(max-width: 760px) 92vw, 48vw"
              />
            </figure>
            <div className={styles.evidenceCopy}>
              <span className={styles.eyebrow}>Repository evidence</span>
              <h2>展示页面必须能回到真实项目。</h2>
              <p>
                作品页保留 GitHub 项目截图和源码入口，用来说明这不是一张概念图。页面讲清楚的是系统角色、工作流和边界，仓库负责提供进一步的实现证据。
              </p>
              <ul className={styles.assetList}>
                <li><strong>知识内容</strong><span>FDE、模型验真、Harness</span></li>
                <li><strong>视觉资产</strong><span>项目截图、案例图片、品牌素材</span></li>
                <li><strong>候选草稿</strong><span>按账号角色分别组织</span></li>
                <li><strong>审核记录</strong><span>保留人工修改和发布确认</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.sectionGrid}>
            <aside className={styles.sectionRail}>
              <span className={styles.sectionIndex}>04 / WORKFLOW</span>
              <p>从选题证据到发布确认，每一步都能回看。</p>
            </aside>
            <div>
              <h2 className={styles.sectionTitle}>内容生产线的价值，是减少失真，不是增加产量。</h2>
              <div className={styles.processList}>
                {workflow.map(([index, title, copy]) => (
                  <article className={styles.processItem} key={index}>
                    <span>{index}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.boundary}>
            <div className={styles.boundaryCopy}>
              <span className={styles.eyebrow}>Quality boundary</span>
              <h2>候选稿可以批量，结论不能批量。</h2>
              <p>涉及模型真伪、企业项目和工程框架时，任何强结论都需要证据链。系统不替人承担查证和发布责任。</p>
            </div>
            <ul className={styles.boundaryList}>
              <li><strong>不自动发布</strong>草稿必须经过人工筛选与修改。</li>
              <li><strong>不伪造来源</strong>没有证据的数字、案例和测试结论必须删掉或标注未知。</li>
              <li><strong>不做同义复制</strong>五个账号必须有不同任务、不同读者和不同素材选择。</li>
              <li><strong>不绕平台规则</strong>不提供规避风控、批量灌水或冒充真人互动的能力。</li>
            </ul>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Toni / Content operations portfolio / 2026</span>
          <Link className={styles.textLink} href="/tools/activity-plan">← 上一案例：海报方案助手</Link>
        </footer>
      </main>
    </PortfolioCaseMotion>
  );
}
