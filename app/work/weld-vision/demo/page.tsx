import type { Metadata } from "next";

import WeldVisionDemo from "./WeldVisionDemo";

export const metadata: Metadata = {
  title: "焊缝视觉检测工作台 | Toni Work",
  description: "3D 焊缝形貌、几何计量与规则判定工作台原型。",
};

export default function WeldVisionDemoPage() {
  return <WeldVisionDemo />;
}
