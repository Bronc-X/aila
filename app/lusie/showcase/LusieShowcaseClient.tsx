"use client";

import dynamic from "next/dynamic";

import LusieSurfaceMotion from "../LusieSurfaceMotion";

const ShipModelShowcase = dynamic(
  () => import("../_shipmodel/lusie/LusieApp").then((module) => module.App),
  {
    ssr: false,
    loading: () => <div className="lusie-loading">Lusie 展示页加载中...</div>
  }
);

export function LusieShowcaseClient() {
  return (
    <LusieSurfaceMotion variant="showcase">
      <div className="lusie-showcase-scope">
        <ShipModelShowcase />
      </div>
    </LusieSurfaceMotion>
  );
}
