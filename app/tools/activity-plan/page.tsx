import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import PortfolioCaseMotion from "../_components/PortfolioCaseMotion";
import styles from "../portfolio-case.module.css";

export const metadata: Metadata = {
  title: "海报方案助手 | Toni 作品案例",
  description: "把活动信息、品牌资产和交付约束整理成方案页、宣传文案、海报方向与 PPTX 初稿。",
};

const process = [
  ["01", "收口输入", "先确认活动目标、参与对象、预算人数、时间地点和必须沿用的品牌物料。"],
  ["02", "排方案结构", "把目标、流程、物料、预算和负责人排成一份可以评审的方案骨架。"],
  ["03", "组织视觉方向", "从品牌板和历史资产中选择可复用元素，再形成海报构图与文案方向。"],
  ["04", "打包交付", "方案页、宣传文案、海报提示词和 PPTX 初稿一起交付，方便团队继续修改。"],
];

const outputs = [
  ["01 / PLAN", "活动方案页", "交代目标、流程、人员、预算和风险，不用华丽词替代执行细节。"],
  ["02 / COPY", "宣传文案", "按公众号、群通知和现场物料分别组织，不把一段文案到处复制。"],
  ["03 / VISUAL", "海报方向", "说明主体、构图、色彩、留白和必须出现的信息，便于继续出图。"],
  ["04 / DECK", "PPTX 初稿", "先把汇报顺序和页面关系搭好，再由负责人做最后定稿。"],
];

export default function ActivityPlanPage() {
  return (
    <PortfolioCaseMotion variant="proposal">
      <main className={styles.casePage}>
        <nav className={styles.topbar} aria-label="海报方案助手导航">
          <Link className={styles.backLink} href="/aila">
            <ArrowLeft size={14} /> 返回 AILA 资产层
          </Link>
          <span className={styles.topMeta}>TONI / ENTERPRISE FDE ASSET 07</span>
          <a
            className={styles.sourceLink}
            href="https://github.com/xiahui001/Activity-plan.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            项目源码 <ArrowUpRight size={14} />
          </a>
        </nav>

        <section className={styles.hero}>
          <span className={styles.caseNumber} aria-hidden="true">07</span>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-case-hero>Case 07 / Proposal System</p>
            <h1 className={styles.heroTitle} data-case-hero>把活动方案做成一套能交付的出品包。</h1>
            <p className={styles.heroSummary} data-case-hero>
              活动信息、品牌物料、预算人数先被整理成结构，再进入文案、海报和演示文件。重点不是“写得快”，而是让每份输出都能继续评审和修改。
            </p>
            <div className={styles.heroActions} data-case-hero>
              <a className={styles.primaryAction} href="https://github.com/xiahui001/Activity-plan.git" target="_blank" rel="noopener noreferrer">
                查看项目证据 <ArrowUpRight size={15} />
              </a>
              <Link className={styles.secondaryAction} href="/work/commercial-poster-workshop">
                查看相关作品
              </Link>
            </div>
            <div className={styles.heroFacts} data-case-hero>
              <div className={styles.heroFact}><strong>4</strong><span>类成套输出</span></div>
              <div className={styles.heroFact}><strong>1</strong><span>次人工定稿</span></div>
              <div className={styles.heroFact}><strong>PPTX</strong><span>可继续编辑</span></div>
            </div>
          </div>
          <figure className={styles.heroVisual} data-case-hero data-case-parallax>
            <Image
              src="/tools-showcase/activity-plan-editorial-hero.webp"
              alt="活动方案、品牌物料、海报构图与演示文件组成的项目工作台"
              fill
              preload
              sizes="(max-width: 1100px) 92vw, 54vw"
            />
          </figure>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.sectionGrid}>
            <aside className={styles.sectionRail}>
              <span className={styles.sectionIndex}>01 / DELIVERY LOGIC</span>
            </aside>
            <div>
              <h2 className={styles.sectionTitle}>不是再写一份方案，而是先把交付顺序排清楚。</h2>
              <div className={styles.processList}>
                {process.map(([index, title, copy]) => (
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
          <div className={styles.splitEvidence}>
            <div className={styles.evidenceCopy}>
              <span className={styles.eyebrow}>Asset library</span>
              <h2>先读品牌资产，再谈海报方向。</h2>
              <ul className={styles.assetList}>
                <li><strong>品牌板</strong><span>标志、色彩、版式边界</span></li>
                <li><strong>历史海报</strong><span>保留有效构图，淘汰无效套路</span></li>
                <li><strong>活动约束</strong><span>预算、人数、渠道、现场物料</span></li>
                <li><strong>交付格式</strong><span>方案页、图片、文案、PPTX</span></li>
              </ul>
            </div>
            <figure className={styles.evidenceImage} data-case-parallax>
              <Image
                src="/brand/toni-asia/toni-asia-brand-board-image2.png"
                alt="Toni Asia 品牌识别板"
                fill
                sizes="(max-width: 760px) 92vw, 48vw"
              />
            </figure>
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.galleryHeader}>
            <div>
              <span className={styles.eyebrow}>Production evidence</span>
              <h2>用真实页面和成片说明完成度。</h2>
            </div>
          </div>
          <div className={styles.galleryStack}>
            <figure className={styles.imageFrame} data-case-parallax>
              <Image
                src="/tools-showcase/commercial-poster-workshop.webp"
                alt="商业海报工坊作品详情页面"
                fill
                sizes="(max-width: 1100px) 92vw, 66vw"
              />
            </figure>
            <div className={styles.posterGrid}>
              {[
                ["/posters/poster_minimal_tech.png", "极简科技海报"],
                ["/posters/poster_business_blue.png", "商务蓝海报"],
                ["/posters/poster_orange_vibrant.png", "活力橙海报"],
                ["/posters/poster_dark_luxury.png", "深色质感海报"],
              ].map(([src, alt]) => (
                <figure className={styles.posterTile} key={src}>
                  <Image src={src} alt={alt} fill sizes="(max-width: 760px) 92vw, 18vw" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} data-case-reveal>
          <div className={styles.sectionGrid}>
            <aside className={styles.sectionRail}>
              <span className={styles.sectionIndex}>04 / OUTPUTS</span>
            </aside>
            <div>
              <h2 className={styles.sectionTitle}>一份活动输入，拆成四种真正能接着用的结果。</h2>
              <div className={styles.outputGrid}>
                {outputs.map(([index, title, copy]) => (
                  <article className={styles.outputCard} key={index}>
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
              <span className={styles.eyebrow}>Working boundary</span>
              <h2>系统负责整理，人负责拍板。</h2>
              <p>活动方案涉及预算、品牌和现场责任，最后定稿必须回到负责人手里。工具只缩短整理和第一版成形的时间。</p>
            </div>
            <ul className={styles.boundaryList}>
              <li><strong>不自动发布</strong>所有宣传内容先进入人工确认。</li>
              <li><strong>不伪造数据</strong>预算、人数和效果指标没有来源时明确留空。</li>
              <li><strong>不替代品牌判断</strong>视觉方向必须服从既有品牌资产和活动语境。</li>
            </ul>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Toni / Enterprise FDE portfolio / 2026</span>
          <Link className={styles.textLink} href="/tools/auto-red-book">下一案例：小红书自动二创 →</Link>
        </footer>
      </main>
    </PortfolioCaseMotion>
  );
}
