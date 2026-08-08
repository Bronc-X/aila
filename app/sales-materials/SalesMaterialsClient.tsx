"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  Filter,
  Layers3,
  MonitorPlay,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import styles from "./sales-materials.module.css";
import type { SalesCase, SalesProof } from "./types";

type FilterKey = "all" | SalesProof;

const filters: Array<{ id: FilterKey; label: string }> = [
  { id: "all", label: "全部真实项目" },
  { id: "real_delivery", label: "真实交付" },
  { id: "real_product", label: "真实运行产品" },
  { id: "verified_prototype", label: "真实运行原型" },
];

const proofLabels: Record<SalesProof, string> = {
  real_delivery: "真实交付",
  real_product: "真实运行产品",
  verified_prototype: "真实运行原型",
};

const proofIcons: Record<SalesProof, typeof CircleDot> = {
  real_delivery: Check,
  real_product: ShieldCheck,
  verified_prototype: Sparkles,
};

function proofLabel(proof: SalesProof) {
  return proofLabels[proof];
}

function permissionLabel(permission: SalesCase["evidence"]["clientPermission"]) {
  if (permission === "confirmed") return "公开授权已确认";
  if (permission === "internal_only") return "对外匿名展示";
  return "公开授权待确认";
}

export default function SalesMaterialsClient({ cases }: { cases: SalesCase[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState(cases[0]?.id ?? "");

  useEffect(() => {
    document.body.classList.add("sales-materials-body");

    return () => {
      document.body.classList.remove("sales-materials-body");
    };
  }, []);

  const filteredCases = useMemo(
    () => cases.filter((item) => activeFilter === "all" || item.proof === activeFilter),
    [activeFilter, cases]
  );

  const selectedCase =
    filteredCases.find((item) => item.id === selectedId) ?? filteredCases[0] ?? cases[0];

  return (
    <main className={styles.page}>
      <div className={styles.ambientGrid} aria-hidden="true" />

      <header className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>A</span>
          <span>AILA / SALES MATERIALS</span>
        </Link>
        <nav className={styles.navLinks} aria-label="销售物料导航">
          <a href="#cases">案例库</a>
          <a href="#method">协作方式</a>
          <Link href="/case-library">体验 Demo</Link>
          <a href="#next">下一步</a>
        </nav>
        <div className={styles.navActions}>
          <button type="button" className={styles.printButton} onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" />
            打印物料
          </button>
          <Link href="/work" className={styles.textLink}>
            完整项目库 <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span />
              AILA / 企业服务
            </p>
            <h1>
              让老板做
              <em>老板该做的事情。</em>
            </h1>
            <p className={styles.heroLead}>
              询盘、资料、状态更新和常见回复，经常占掉老板的时间。
              有规则的部分交给流程，价格、承诺和关键判断由负责人确认。
            </p>
            <div className={styles.heroActions}>
              <a href="#cases" className={styles.primaryAction}>
                项目案例 <ChevronRight size={16} aria-hidden="true" />
              </a>
              <Link href="/case-library" className={styles.secondaryAction}>
                打开 Demo <MonitorPlay size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className={styles.signalPanel}>
            <div className={styles.panelTopline}>
              <span>项目 / 产品 / 原型</span>
              <span>AILA</span>
            </div>
            <div className={styles.signalNumber}>{cases.length.toString().padStart(2, "0")}</div>
            <p>销售、客户服务、工业质检和内容生产。</p>
            <div className={styles.signalRule} />
            <div className={styles.signalRows}>
              <div>
                <span>真实交付</span>
                <strong>{cases.filter((item) => item.proof === "real_delivery").length}</strong>
              </div>
              <div>
                <span>运行产品</span>
                <strong>{cases.filter((item) => item.proof === "real_product").length}</strong>
              </div>
              <div>
                <span>运行原型</span>
                <strong>{cases.filter((item) => item.proof === "verified_prototype").length}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.purposeBand} id="purpose">
          <div className={styles.purposeIntro}>
            <p className={styles.sectionKicker}>为什么做这件事</p>
            <h2>老板的时间，留给报价、判断和关键客户。</h2>
            <p>
              资料整理、状态更新和常见回复可以交给流程。价格、风险和对外承诺仍由负责人确认。
            </p>
          </div>
          <div className={styles.purposeList}>
            <article>
              <strong>流程处理</strong>
              <p>资料整理、状态更新、常见问题和固定规则。</p>
            </article>
            <article>
              <strong>负责人确认</strong>
              <p>报价、风险、例外和对外发送。</p>
            </article>
            <article>
              <strong>运行记录</strong>
              <p>输入资料、执行步骤、输出文件和审批结果。</p>
            </article>
          </div>
        </section>

        <section className={styles.methodBand} id="method">
          <div className={styles.methodIntro}>
            <p className={styles.sectionKicker}>协作方式</p>
            <h2>把现有流程、试运行和实施范围定下来。</h2>
            <p>
              询盘、材料、质检、客服，都可以成为第一条流程。
            </p>
          </div>
          <div className={styles.methodSteps}>
            <article>
              <span>01</span>
              <strong>现有流程</strong>
              <p>参与角色、输入资料、系统和卡点。</p>
            </article>
            <article>
              <span>02</span>
              <strong>试运行</strong>
              <p>用脱敏样例或现有资料生成运行记录、产物和人工确认点。</p>
            </article>
            <article>
              <span>03</span>
              <strong>实施范围</strong>
              <p>接入系统、负责人、审批节点和上线顺序。</p>
            </article>
          </div>
        </section>

        <section className={styles.casesSection} id="cases">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>项目</p>
              <h2>项目、产品和原型。</h2>
            </div>
            <p className={styles.sectionDescription}>
              项目来源、已验证产物和公开范围。
            </p>
          </div>

          <div className={styles.filterBar} role="tablist" aria-label="案例证据筛选">
            <div className={styles.filterLabel}>
              <Filter size={15} aria-hidden="true" />
              项目状态
            </div>
            <div className={styles.filterOptions}>
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  role="tab"
                  aria-selected={activeFilter === filter.id}
                  className={activeFilter === filter.id ? styles.filterActive : styles.filterButton}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <span className={styles.filterCount}>{filteredCases.length.toString().padStart(2, "0")} 个项目</span>
          </div>

          {selectedCase && (
            <article className={styles.focusCase}>
              <div className={styles.focusMedia}>
                <Image src={selectedCase.image} alt={selectedCase.title} fill sizes="(max-width: 900px) 100vw, 54vw" priority />
                <div className={styles.mediaShade} />
                <span className={styles.focusMediaLabel}>{selectedCase.kicker}</span>
                <span className={styles.mediaCorner}>项目资料</span>
              </div>
              <div className={styles.focusContent}>
                <div className={styles.focusMeta}>
                  <span className={styles.proofBadge} data-proof={selectedCase.proof}>
                    {(() => {
                      const Icon = proofIcons[selectedCase.proof];
                      return <Icon size={13} aria-hidden="true" />;
                    })()}
                    {proofLabel(selectedCase.proof)}
                  </span>
                  <span>{selectedCase.lane}</span>
                </div>
                <h3>{selectedCase.title}</h3>
                <p className={styles.focusSummary}>{selectedCase.summary}</p>
                <div className={styles.focusMetrics}>
                  {selectedCase.metrics.map((metric) => (
                    <div key={`${metric.label}-${metric.value}`}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
                <div className={styles.evidenceStrip}>
                  <div>
                    <span>项目来源</span>
                    <strong>{selectedCase.evidence.sourceProject}</strong>
                  </div>
                  <div>
                    <span>已验证交付物</span>
                    <strong>{selectedCase.evidence.deliverables.join(" / ")}</strong>
                  </div>
                  <div>
                    <span>公开边界</span>
                    <strong>{permissionLabel(selectedCase.evidence.clientPermission)}</strong>
                  </div>
                </div>
                <div className={styles.focusActions}>
                  <Link href={selectedCase.href} className={styles.primaryAction}>
                    打开完整档案 <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                  <span className={styles.focusNote}>{selectedCase.evidence.note}</span>
                </div>
              </div>
            </article>
          )}

          <div className={styles.caseGrid}>
            {filteredCases.map((item, index) => {
              const Icon = proofIcons[item.proof];
              const isSelected = item.id === selectedCase?.id;

              return (
                <article className={`${styles.caseCard} ${index === 0 ? styles.caseCardLead : ""}`} key={item.id}>
                  <button
                    type="button"
                    className={`${styles.caseImageButton} ${isSelected ? styles.caseImageSelected : ""}`}
                    onClick={() => setSelectedId(item.id)}
                    aria-label={`查看 ${item.title} 摘要`}
                  >
                    <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 32vw" />
                    <span className={styles.caseImageOverlay} />
                    <span className={styles.caseImageCode}>{item.kicker}</span>
                    <span className={styles.caseImageAction}>
                      <Layers3 size={14} aria-hidden="true" />
                      选中
                    </span>
                  </button>
                  <div className={styles.caseBody}>
                    <div className={styles.caseTopline}>
                      <span>{item.lane}</span>
                      <Icon size={15} aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.focus}</p>
                    <div className={styles.tagRow}>
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.caseFooter}>
                      <span className={styles.proofLabel} data-proof={item.proof}>
                        {proofLabel(item.proof)}
                      </span>
                      <Link href={item.href} aria-label={`打开 ${item.title} 完整档案`}>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.proofSection}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionKicker}>项目状态</p>
              <h2>交付、产品和原型，证据不一样。</h2>
            </div>
            <p className={styles.sectionDescription}>
              每项都标明当前可以验证的内容。
            </p>
          </div>
          <div className={styles.proofGrid}>
            <article>
              <span className={styles.proofIndex}>01</span>
              <h3>真实交付</h3>
              <p>项目范围、交付物和相关资料已经留存。对外展示遵守授权范围。</p>
            </article>
            <article>
              <span className={styles.proofIndex}>02</span>
              <h3>真实运行产品</h3>
              <p>产品或工作台可以直接打开，能看到输入、过程和产物。</p>
            </article>
            <article>
              <span className={styles.proofIndex}>03</span>
              <h3>真实运行原型</h3>
              <p>原型可以操作和复现，样例数据和接入范围会如实写明。</p>
            </article>
          </div>
        </section>

        <section className={styles.nextSection} id="next">
          <div>
            <p className={styles.sectionKicker}>开始</p>
            <h2>从一件每天都在发生的事开始。</h2>
            <p>
              一封询盘、一批材料，或者一段客服对话。
            </p>
          </div>
          <Link href="/contact" className={styles.primaryAction}>
            说说这件事 <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
