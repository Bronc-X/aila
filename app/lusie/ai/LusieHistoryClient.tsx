"use client";

import { Download, FileDown, History, Clock, Database } from "lucide-react";
import { useMemo, useState } from "react";
import type { ModelCategory, ModelRun } from "../_shipmodel/types";
import { ModelViewer } from "../_shipmodel/components/ModelViewer";

type Props = {
  runs: ModelRun[];
};

export function LusieHistoryClient({ runs }: Props) {
  const deliverableRuns = runs.filter(isDeliverableRun);
  const latest = deliverableRuns[0];

  return (
    <div className="toybox-app">
      <header className="toybox-header">
        <div className="brand-row">
          <a className="brand-title" href="/lusie/ai">Lusie ai</a>
        </div>
        <div className="header-actions">
          <span className="status-chip">Tripo STL history</span>
        </div>
      </header>

      <main className="utility-page history-workspace">
        <section className="utility-panel wide">
          <div className="utility-icon">
            <History size={30} />
          </div>
          <div>
            <span className="section-label">Tripo STL history</span>
            <h1>生成后台清单</h1>
            <p>这里只展示已经由 Tripo 生成成功、带有 STL 文件和源文件信息的成品记录；普通配置保存和未完成概念图不会冒充交付模型。</p>
          </div>

          <div className="history-summary">
            <Spec icon={<Database size={18} />} label="真实成品" value={`${deliverableRuns.length} 条`} />
            <Spec icon={<Clock size={18} />} label="最近更新" value={latest ? formatLocalTime(latest.updatedAt) : "暂无"} />
            <Spec icon={<FileDown size={18} />} label="可下载 STL" value={`${deliverableRuns.length} 个`} />
          </div>

          {deliverableRuns.length ? (
            <div className="history-list" aria-label="真实 STL 生成历史">
              {deliverableRuns.map((run) => (
                <HistoryRecordCard key={run.runId} run={run} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Clock size={24} />
              <strong>暂无真实 STL 成品历史</strong>
              <span>完成一次真实 Tripo STL 生成后，这里会出现可追溯的成品记录。</span>
            </div>
          )}

          <div className="action-row">
            <a className="button primary" href="/lusie/ai">回到参数页</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function HistoryRecordCard({ run }: { run: ModelRun }) {
  const [stlLoadFailed, setStlLoadFailed] = useState(false);
  const selectedConcept = run.concepts.find((concept) => concept.id === run.selectedConceptId) ?? run.concepts[0];
  const dimensions = useMemo(() => getModelDimensions(run.input.targetLengthMm), [run.input.targetLengthMm]);
  const inspection = getInspectionProfile(run.input.category);
  const stlHref = withStlSource(run.files.stl ?? `/api/lusie/runs/${encodeURIComponent(run.runId)}/download/stl`, run.files.stlSourceUrl);
  const stlSourceLabel = run.files.stlSourceUrl ? "Tripo source" : "local STL";
  const stlState = stlLoadFailed ? "STL 预览待恢复" : "STL 可下载";

  return (
    <article className="history-record-card">
      <header className="history-record-head">
        <div>
          <span className="section-label">{formatLocalTime(run.createdAt)}</span>
          <h2>{run.input.style} {run.input.subtype}</h2>
        </div>
        <span className="history-status-chip ready">STL 就绪</span>
      </header>

      <div className="history-record-grid">
        <section className="history-media-panel" aria-label="生成预览图">
          <span className="history-panel-title">预览图</span>
          <div className="history-preview-frame">
            {selectedConcept?.imageUrl ? <img alt={selectedConcept.title} src={selectedConcept.imageUrl} /> : null}
          </div>
          <p>{selectedConcept?.title ?? "概念预览已记录"}</p>
        </section>

        <section className="history-media-panel" aria-label="最终 3D 效果图">
          <span className="history-panel-title">3D 效果</span>
          <div className="history-model-frame">
            <ModelViewer
              category={run.input.category}
              subtype={run.input.subtype}
              primaryColor={run.input.primaryColor}
              accentColor={run.input.accentColor}
              status="Ready"
              stlUrl={stlHref}
              dimensions={dimensions}
              viewMode="joint"
              stlFallback="empty"
              onStlLoadError={() => setStlLoadFailed(true)}
            />
          </div>
        </section>

        <section className="history-detail-panel" aria-label="参数配置">
          <span className="history-panel-title">参数配置</span>
          <dl className="history-param-grid">
            <Detail label="类别" value={run.input.category} />
            <Detail label="原型" value={run.input.subtype} />
            <Detail label="风格" value={run.input.style} />
            <Detail label="尺寸" value={`${dimensions.length} x ${dimensions.width} x ${dimensions.height} mm`} />
            <Detail label="打印时间" value={inspection.printTime} />
            <Detail label="STL 状态" value={stlState} />
            <Detail label="主色" value={run.input.primaryColor} />
            <Detail label="辅色" value={run.input.accentColor} />
            <Detail label="标识" value={run.input.markingText || run.input.label || "未加标识"} />
            <Detail label="runId" value={run.runId} />
            <Detail label="STL 文件" value={`${run.runId}.stl`} />
            <Detail label="STL 信息" value={`${dimensions.length} mm / geometry only / ${stlSourceLabel}`} />
          </dl>
          <p>{run.input.description}</p>
          <p className="history-stl-note">历史记录保存的是可打印 STL 几何文件入口；3D 窗口只显示 STL 网格预览，不再用旧参数模型代替成品。</p>
          <div className="history-file-row">
            <a className="button primary" href={stlHref}>
              <Download size={17} />
              下载 STL
            </a>
            <span>{formatLocalTime(run.updatedAt)} 更新</span>
          </div>
        </section>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="spec-card">
      <div className="spec-title">
        {icon}
        {label}
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function isDeliverableRun(run: ModelRun) {
  return run.status === "Ready" && Boolean(run.runId && run.files.stl && (run.files.stlSourceUrl || run.files.stlPersisted));
}

function withStlSource(href: string, sourceUrl?: string) {
  if (!sourceUrl) return href;
  return `${href}${href.includes("?") ? "&" : "?"}source=${encodeURIComponent(sourceUrl)}`;
}

function getModelDimensions(length: number) {
  return {
    length,
    width: Math.round(length * 0.46),
    height: Math.round(length * 0.32)
  };
}

function getInspectionProfile(category: ModelCategory) {
  if (category === "aircraft") return { printTime: "约 4h 40m @ 0.2mm" };
  if (category === "ship") return { printTime: "约 5h 10m @ 0.2mm" };
  return { printTime: "约 4h 15m @ 0.2mm" };
}

function formatLocalTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
