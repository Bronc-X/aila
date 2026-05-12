"use client";

import dynamic from "next/dynamic";

const ShipModelWorkspace = dynamic(
  () => import("../_shipmodel/toybox/ToyBoxApp").then((module) => module.ToyBoxApp),
  {
    ssr: false,
    loading: () => <div className="lusie-loading">Lusie AI 工作台加载中...</div>
  }
);

export function LusieAiClient() {
  return (
    <div className="lusie-ai-scope">
      <ShipModelWorkspace />
    </div>
  );
}
