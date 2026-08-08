import type { Metadata } from "next";

import CaseLibraryClient from "./CaseLibraryClient";
import { workItems } from "../work/work-data";
import { caseExperiences, type ProjectRecord } from "./case-library-data";

export const metadata: Metadata = {
  title: "AILA Demo 与项目库 | 流程、产品与项目",
  description: "可操作流程、运行产品、项目档案与各自的证据边界。",
};

export default function CaseLibraryPage() {
  const projectRecords: ProjectRecord[] = workItems
    .filter((item) => item.evidenceStatus !== "pending")
    .map((item, index) => ({
      id: item.slug,
      index: String(index + 1).padStart(2, "0"),
      title: item.title,
      subtitle: item.sub,
      summary: item.summary,
      evidenceLabel: item.nativeRoute
        ? "站内原生路由"
        : item.evidence?.level === "real_delivery"
          ? "真实交付证据"
          : item.evidence?.level === "real_product"
            ? "真实产品证据"
            : item.evidence?.level === "verified_prototype"
              ? "运行原型证据"
              : "项目档案",
      evidenceNote: item.evidence?.note
        ?? (item.nativeRoute
          ? "站内原生路由。外部服务、数据和权限以实际项目配置为准。"
          : "项目档案与媒体证据；未纳入本仓库的功能不作为可运行产品展示。"),
      href: item.nativeRoute ?? `/work/${item.slug}`,
      actionLabel: item.nativeRoute ? "打开原生路由" : "查看项目档案",
      nativeRoute: Boolean(item.nativeRoute),
    }));

  return (
    <CaseLibraryClient
      experiences={caseExperiences}
      projectRecords={projectRecords}
    />
  );
}
