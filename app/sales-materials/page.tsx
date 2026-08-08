import type { Metadata } from "next";

import { deliveryCases, productLabs, type WorkItem } from "../work/work-data";
import SalesMaterialsClient from "./SalesMaterialsClient";
import type { SalesCase } from "./types";

export const metadata: Metadata = {
  title: "AILA 企业案例与 Demo | 项目、产品与流程",
  description: "企业项目、运行产品、可操作 Demo 与各自的公开边界。",
};

const workItems = new Map<string, WorkItem>(
  [...deliveryCases, ...productLabs].map((item) => [item.slug, item])
);

function fromWork(
  slug: string,
  overrides: Omit<SalesCase, "id" | "title" | "summary" | "image" | "href" | "metrics" | "evidence">
): SalesCase {
  const item = workItems.get(slug);

  if (!item) {
    throw new Error(`Missing work item: ${slug}`);
  }

  const image = item.image ?? item.media?.find((media) => media.type === "image")?.src;

  if (!image) {
    throw new Error(`Missing sales image: ${slug}`);
  }

  if (!item.evidence) {
    throw new Error(`Missing case evidence: ${slug}`);
  }

  return {
    id: item.slug,
    title: item.title,
    summary: item.summary,
    image,
    href: `/work/${item.slug}`,
    metrics: item.metrics,
    evidence: item.evidence,
    ...overrides,
  };
}

const salesCases: SalesCase[] = [
  fromWork("survey-decision-system", {
    kicker: "FIELD DELIVERY / 01",
    lane: "业务诊断 · 决策系统",
    proof: "real_delivery",
    tags: ["数据口径", "报告生成", "人工复核"],
    focus: "问卷数据归口，报告按固定口径生成。",
  }),
  fromWork("ecommerce-product-radar", {
    kicker: "FIELD DELIVERY / 02",
    lane: "增长运营 · Workflow",
    proof: "real_delivery",
    tags: ["候选池", "批量筛查", "团队复盘"],
    focus: "内容筛查生成候选池，团队保留复核。",
  }),
  fromWork("commercial-poster-workshop", {
    kicker: "FIELD DELIVERY / 03",
    lane: "内容生产 · 素材系统",
    proof: "real_delivery",
    tags: ["批量出品", "风格参数", "投放测试"],
    focus: "品牌素材按参数批量出图，供投放测试。",
  }),
  fromWork("dewu-image", {
    kicker: "REAL PRODUCT / 04",
    lane: "视觉生产 · 质检交付",
    proof: "real_product",
    tags: ["批量合成", "质量复核", "ZIP 交付"],
    focus: "商品图生成、审核和 ZIP 交付在一个工作台完成。",
  }),
  fromWork("expert-agent", {
    kicker: "REAL PRODUCT / 05",
    lane: "诊断交付 · Agent-ready",
    proof: "real_product",
    tags: [" readiness 评估", "行动清单", "证据归档"],
    focus: "咨询判断、行动清单和证据归档组成一个交付包。",
  }),
  fromWork("weld-vision", {
    kicker: "VERIFIED PROTOTYPE / 06",
    lane: "工业视觉 · 运行原型",
    proof: "verified_prototype",
    tags: ["现场检查", "3D 视图", "结果确认"],
    focus: "3D 点云输出尺寸指标与 PASS / NG，并保留人工确认。",
  }),
];

export default function SalesMaterialsPage() {
  return <SalesMaterialsClient cases={salesCases} />;
}
