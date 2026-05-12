"use client";

import dynamic from "next/dynamic";

const ShipModelShowcase = dynamic(
  () => import("../_shipmodel/lusie/LusieApp").then((module) => module.App),
  {
    ssr: false,
    loading: () => <div className="lusie-loading">Lusie 展示页加载中...</div>
  }
);

export function LusieShowcaseClient() {
  return (
    <div className="lusie-showcase-scope">
      <ShipModelShowcase />
    </div>
  );
}
