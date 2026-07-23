"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  Activity,
  ArrowLeft,
  CircleDot,
  Database,
  Gauge,
  ScanLine,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import styles from "./demo.module.css";

type InspectionSample = {
  id: string;
  batch: string;
  result: "PASS" | "NG" | "REVIEW";
  defect: string;
  position: string;
  confidence: string;
  metrics: Array<{
    label: string;
    value: string;
    threshold: string;
    status: "pass" | "fail" | "review";
  }>;
};

const inspectionSamples: InspectionSample[] = [
  {
    id: "W-0147",
    batch: "B26-0716-A",
    result: "NG",
    defect: "咬边深度超限",
    position: "X 135.2 mm",
    confidence: "94.2%",
    metrics: [
      { label: "焊缝宽度", value: "6.42 mm", threshold: "5.80–7.20", status: "pass" },
      { label: "余高", value: "1.82 mm", threshold: "≤ 2.20", status: "pass" },
      { label: "咬边深度", value: "0.82 mm", threshold: "≤ 0.50", status: "fail" },
      { label: "路径偏移", value: "0.16 mm", threshold: "≤ 0.35", status: "pass" },
    ],
  },
  {
    id: "W-0148",
    batch: "B26-0716-A",
    result: "PASS",
    defect: "未发现超限项",
    position: "全长 228.6 mm",
    confidence: "97.8%",
    metrics: [
      { label: "焊缝宽度", value: "6.18 mm", threshold: "5.80–7.20", status: "pass" },
      { label: "余高", value: "1.64 mm", threshold: "≤ 2.20", status: "pass" },
      { label: "咬边深度", value: "0.18 mm", threshold: "≤ 0.50", status: "pass" },
      { label: "路径偏移", value: "0.11 mm", threshold: "≤ 0.35", status: "pass" },
    ],
  },
  {
    id: "W-0149",
    batch: "B26-0716-B",
    result: "REVIEW",
    defect: "反光缺失点",
    position: "X 72.8–86.4 mm",
    confidence: "71.6%",
    metrics: [
      { label: "焊缝宽度", value: "6.36 mm", threshold: "5.80–7.20", status: "pass" },
      { label: "余高", value: "—", threshold: "≤ 2.20", status: "review" },
      { label: "咬边深度", value: "—", threshold: "≤ 0.50", status: "review" },
      { label: "数据完整率", value: "84.7%", threshold: "≥ 95%", status: "review" },
    ],
  },
];

const resultLabels = {
  PASS: "合格",
  NG: "不合格",
  REVIEW: "人工复核",
} as const;

export default function WeldVisionDemo() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState(inspectionSamples[0].id);
  const activeSample = inspectionSamples.find((sample) => sample.id === activeId) ?? inspectionSamples[0];
  const pointCloud = useMemo(
    () =>
      Array.from({ length: 96 }, (_, index) => {
        const progress = index / 95;
        const x = 72 + progress * 616;
        const wave = Math.sin(progress * Math.PI * 10) * 7;
        const envelope = Math.sin(progress * Math.PI) * 18;
        const offset = Math.sin(index * 12.73) * 8;
        return {
          x,
          y: 214 + wave + offset,
          radius: 0.8 + ((index * 7) % 5) * 0.22,
          opacity: 0.26 + ((index * 11) % 7) * 0.08,
          envelope,
        };
      }),
    []
  );

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set("[data-weld-reveal]", { opacity: 1, y: 0 });
      if (reducedMotion) return;

      gsap.from("[data-weld-reveal]", {
        opacity: 0,
        y: 18,
        duration: 0.72,
        stagger: 0.055,
        ease: "power3.out",
      });
      gsap.fromTo(
        "[data-scan-beam]",
        { left: "12%" },
        {
          left: "88%",
          duration: 3.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
      gsap.to("[data-defect-marker]", {
        scale: 1.16,
        duration: 0.82,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center",
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-sample-panel]",
        { opacity: 0.42, y: 8 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.035, ease: "power2.out" }
      );
    },
    { scope: rootRef, dependencies: [activeId], revertOnUpdate: true }
  );

  return (
    <main className={styles.page} ref={rootRef}>
      <header className={styles.topbar} data-weld-reveal>
        <Link href="/work/weld-vision" className={styles.backLink}>
          <ArrowLeft size={16} />
          返回项目
        </Link>
        <div className={styles.systemName}>
          <span>WELD VISION</span>
          <strong>3D INSPECTION WORKSTATION</strong>
        </div>
        <div className={styles.systemStatus}>
          <i />
          EDGE NODE 01
        </div>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.leftRail} data-weld-reveal>
          <div className={styles.railHeading}>
            <small>INSPECTION QUEUE</small>
            <strong>3 条焊缝</strong>
          </div>
          <div className={styles.sampleList}>
            {inspectionSamples.map((sample) => (
              <button
                className={sample.id === activeId ? styles.sampleActive : styles.sampleButton}
                key={sample.id}
                type="button"
                aria-pressed={sample.id === activeId}
                onClick={() => setActiveId(sample.id)}
              >
                <span>
                  <strong>{sample.id}</strong>
                  <small>{sample.batch}</small>
                </span>
                <b data-result={sample.result}>{sample.result}</b>
              </button>
            ))}
          </div>

          <div className={styles.sensorStack}>
            <div>
              <ScanLine size={17} />
              <span>
                <small>3D PROFILER</small>
                <strong>ONLINE</strong>
              </span>
            </div>
            <div>
              <Database size={17} />
              <span>
                <small>POINT CLOUD</small>
                <strong>2.8 M pts</strong>
              </span>
            </div>
            <div>
              <Gauge size={17} />
              <span>
                <small>SCAN RATE</small>
                <strong>180 mm/s</strong>
              </span>
            </div>
          </div>
        </aside>

        <section className={styles.mainStage}>
          <div className={styles.stageHeader} data-weld-reveal data-sample-panel>
            <div>
              <small>SAMPLE DATA · {activeSample.id}</small>
              <h1>焊缝三维形貌</h1>
            </div>
            <div className={styles.resultBadge} data-result={activeSample.result}>
              {activeSample.result === "PASS" ? <ShieldCheck size={19} /> : <TriangleAlert size={19} />}
              <span>
                <small>{activeSample.result}</small>
                <strong>{resultLabels[activeSample.result]}</strong>
              </span>
            </div>
          </div>

          <div className={styles.scanViewport} data-weld-reveal data-sample-panel>
            <div className={styles.scanBeam} data-scan-beam />
            <svg viewBox="0 0 760 390" role="img" aria-label={`${activeSample.id} 焊缝三维形貌样例`}>
              <defs>
                <linearGradient id="plateGradient" x1="0" x2="1">
                  <stop offset="0" stopColor="#182127" />
                  <stop offset="0.5" stopColor="#273239" />
                  <stop offset="1" stopColor="#121a1f" />
                </linearGradient>
                <linearGradient id="weldGradient" x1="0" x2="1">
                  <stop offset="0" stopColor="#7f9ca4" />
                  <stop offset="0.48" stopColor="#d9e7e7" />
                  <stop offset="1" stopColor="#789097" />
                </linearGradient>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className={styles.gridLines}>
                {Array.from({ length: 14 }, (_, index) => (
                  <line key={`vertical-${index}`} x1={42 + index * 52} y1="44" x2={42 + index * 52} y2="346" />
                ))}
                {Array.from({ length: 7 }, (_, index) => (
                  <line key={`horizontal-${index}`} x1="42" y1={44 + index * 50} x2="718" y2={44 + index * 50} />
                ))}
              </g>

              <path
                d="M54 256 C170 232 246 250 362 220 C480 190 574 220 706 174 L706 302 C580 326 462 308 352 328 C228 350 146 322 54 340 Z"
                fill="url(#plateGradient)"
                stroke="#405058"
                strokeWidth="1.2"
              />
              <path
                d="M68 238 C174 213 250 238 360 207 C475 174 580 205 692 158"
                fill="none"
                stroke="#0b1114"
                strokeWidth="34"
                strokeLinecap="round"
              />
              <path
                d="M68 238 C174 213 250 238 360 207 C475 174 580 205 692 158"
                fill="none"
                stroke="url(#weldGradient)"
                strokeWidth="23"
                strokeLinecap="round"
                filter="url(#softGlow)"
              />
              <path
                d="M68 234 C174 209 250 234 360 203 C475 170 580 201 692 154"
                fill="none"
                stroke="#ecf7f5"
                strokeOpacity="0.68"
                strokeWidth="2.1"
                strokeLinecap="round"
              />

              <g className={styles.pointCloud}>
                {pointCloud.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y - point.envelope}
                    r={point.radius}
                    opacity={point.opacity}
                  />
                ))}
              </g>

              {activeSample.result !== "PASS" && (
                <g data-defect-marker>
                  <circle cx={activeSample.result === "NG" ? 438 : 288} cy={activeSample.result === "NG" ? 190 : 224} r="18" />
                  <circle cx={activeSample.result === "NG" ? 438 : 288} cy={activeSample.result === "NG" ? 190 : 224} r="4.5" />
                  <line
                    x1={activeSample.result === "NG" ? 438 : 288}
                    y1={activeSample.result === "NG" ? 168 : 202}
                    x2={activeSample.result === "NG" ? 438 : 288}
                    y2={activeSample.result === "NG" ? 137 : 171}
                  />
                  <text x={activeSample.result === "NG" ? 450 : 300} y={activeSample.result === "NG" ? 135 : 169}>
                    {activeSample.result === "NG" ? "UNDERCUT" : "DATA VOID"}
                  </text>
                </g>
              )}
            </svg>

            <div className={styles.viewportMeta}>
              <span>X 0 — 228.6 mm</span>
              <span>Z RANGE ± 4.0 mm</span>
              <span>RES 0.08 mm</span>
            </div>
          </div>

          <div className={styles.profilePanel} data-weld-reveal data-sample-panel>
            <div className={styles.profileHeading}>
              <span>
                <Activity size={16} />
                PROFILE X = {activeSample.result === "NG" ? "135.2" : activeSample.result === "PASS" ? "102.8" : "78.4"} mm
              </span>
              <small>基准平面 / 焊趾 / 余高</small>
            </div>
            <svg viewBox="0 0 760 132" role="img" aria-label="焊缝截面轮廓">
              <path className={styles.profileBaseline} d="M18 102 L742 102" />
              <path
                className={styles.profileCurve}
                d={
                  activeSample.result === "NG"
                    ? "M18 102 C176 102 248 100 302 91 C334 85 350 52 382 42 C414 52 426 91 466 98 C552 104 640 102 742 102"
                    : activeSample.result === "PASS"
                      ? "M18 102 C176 102 252 100 312 90 C346 84 358 59 382 51 C408 58 424 88 462 96 C548 103 638 102 742 102"
                      : "M18 102 C176 102 246 100 308 92 C342 87 354 61 382 54 M424 86 C440 94 458 98 478 100 C566 104 648 102 742 102"
                }
              />
              <line className={styles.measureLine} x1="382" y1="51" x2="382" y2="102" />
              <text x="391" y="72">{activeSample.metrics[1].value}</text>
            </svg>
          </div>
        </section>

        <aside className={styles.rightRail}>
          <div className={styles.decisionCard} data-weld-reveal data-sample-panel>
            <small>RULE DECISION</small>
            <strong data-result={activeSample.result}>{resultLabels[activeSample.result]}</strong>
            <p>{activeSample.defect}</p>
            <dl>
              <div>
                <dt>位置</dt>
                <dd>{activeSample.position}</dd>
              </div>
              <div>
                <dt>置信度</dt>
                <dd>{activeSample.confidence}</dd>
              </div>
              <div>
                <dt>规则集</dt>
                <dd>ISO 5817 · C</dd>
              </div>
            </dl>
          </div>

          <div className={styles.metricList} data-weld-reveal data-sample-panel>
            <div className={styles.metricTitle}>
              <CircleDot size={16} />
              几何计量
            </div>
            {activeSample.metrics.map((metric) => (
              <div className={styles.metricItem} key={metric.label} data-status={metric.status}>
                <span>
                  <small>{metric.label}</small>
                  <strong>{metric.value}</strong>
                </span>
                <b>{metric.threshold}</b>
              </div>
            ))}
          </div>

          <div className={styles.pipeline} data-weld-reveal>
            <small>PIPELINE</small>
            {["3D 采集", "高度图归一", "焊缝定位", "几何计量", "规则判定"].map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                <i />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <footer className={styles.footer} data-weld-reveal>
        <span>RUNNING PROTOTYPE</span>
        <p>界面使用样例数据；现场验收需接入真实 3D 传感器、企业阈值与复核记录。</p>
        <b>v0.1 · 2026.07.16</b>
      </footer>
    </main>
  );
}
