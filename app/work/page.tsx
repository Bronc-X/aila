import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import styles from "../site.module.css";

const deliveryCases = [
  {
    k: "01",
    title: "咨询行业问卷统计与智能决策系统",
    text: "基于定制化问卷统计系统，把商业增长策略、数据洞察和报告生成收进自动化流程。交付记录里的口径是：5 天完成业务梳理和搭建，后续每次运行约 10 分钟。",
    metrics: [
      ["周期", "5 天交付"],
      ["人力", "节省约 2 周"],
      ["效能", "提升 300%"],
    ],
    image: "/cases/media__1775491662965.jpg",
  },
  {
    k: "02",
    title: "电商爆品极速筛查雷达",
    text: "面向低粉账号短视频爆品筛选，从人工一天不到 10 个首品，改造成 5 分钟锁定 300+ 过去一周爆品，再用智能二次过滤辅助选品。",
    metrics: [
      ["速度", "24h → 5 分钟"],
      ["规模", "300+ 爆品池"],
      ["效率", "30 倍选品"],
    ],
    image: "/cases/media__1775491662974.png",
  },
  {
    k: "03",
    title: "商用级电商自动化海报工坊",
    text: "围绕模特、商品和带货物料做商用级图片生产流程，目标不是娱乐生图，而是能替代拍摄场地和摄制成本的高可用素材矩阵。",
    metrics: [
      ["替代", "棚拍/模特费"],
      ["成本", "年省约 45 万"],
      ["产出", "千量级物料"],
    ],
    image: "/cases/media__1775491663001.png",
  },
];

const productLabs = [
  {
    title: "aila.",
    sub: "B 端企业全链路 Agent 工具矩阵",
    text: "把获客、销售、研发、行政、客服和老板仪表盘整理成统一的企业 AI 控制台方向。当前站点以演示和 Mock 流程呈现，不在页面内接外部模型 API。",
    href: "/aila",
  },
  {
    title: "antios.",
    sub: "iOS 原生健康 Agent 平台",
    text: "旧作品集中定义为健康状态运行时：第一输入源不是文字，而是 Apple Watch 采集的 HRV、静息心率、睡眠分期等生理参数，再压缩为强类型状态变量供 Agent 推理。",
    href: "/portfolio",
  },
  {
    title: "QuantMAx.",
    sub: "边际影响力量化策略",
    text: "旧作品集中定义为量化策略实验：关注热度排名短时间跃升、价格尚未同步反应的边际影响力信号。策略核心闭源，只展示产品叙事和界面方向。",
    href: "/portfolio",
  },
];

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}><span>T</span>Toni</Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Sparkles size={16} /> Selected systems and delivery cases</p>
          <h1>作品页只放已经有明确场景、数据或产品定义的项目。</h1>
          <p className={styles.lede}>
            这里分两类：一类是有明确数据结果的企业交付案例；另一类是 Toni Studio 里的产品实验。
          </p>
        </div>
        <aside className={styles.heroPanel}>
          <strong>Real archive</strong>
          <span>问卷统计、爆品筛查、海报工坊、AILA、Antios、QuantMAx。</span>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>企业交付案例：从成本、效率和可用物料看结果。</h2>
          <p>这些案例只保留已有交付口径，重点看周期、成本、效率和可用产出。</p>
        </div>
        <div className={styles.caseGrid}>
          {deliveryCases.map((item) => (
            <article className={styles.caseCard} key={item.title}>
              <div className={styles.mediaFrame}>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 44vw" />
              </div>
              <div>
                <small>{item.k}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className={styles.metricTags}>
                  {item.metrics.map(([label, value]) => (
                    <span key={label}>
                      <small>{label}</small>
                      <strong>{value}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkBand}>
        <h2>旧作品集不是“漂亮页面”，它有三个产品方向。</h2>
        <p>AILA 是企业 Agent 工具矩阵；Antios 是健康状态运行时；QuantMAx 是量化信号产品实验。新页面需要承接这些真实方向，而不是重新编一套泛泛的品牌故事。</p>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          {productLabs.map((item) => (
            <article className={styles.card} key={item.title}>
              <small>{item.sub}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link href={item.href} className={styles.resourceLink}>查看方向 <ArrowUpRight size={14} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>要看企业 AI 工具矩阵，进入 AILA。</h2>
        <div className={styles.actions}>
          <Link href="/aila" className={styles.button}>看 AILA</Link>
          <Link href="/services" className={styles.ghost}>看合作方式 <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </main>
  );
}
