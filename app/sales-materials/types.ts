import type { CaseEvidence, EvidenceLevel } from "../work/work-data";

export type SalesProof = Extract<
  EvidenceLevel,
  "real_delivery" | "real_product" | "verified_prototype"
>;

export type SalesCase = {
  id: string;
  title: string;
  kicker: string;
  lane: string;
  proof: SalesProof;
  summary: string;
  image: string;
  href: string;
  metrics: Array<{ label: string; value: string }>;
  tags: string[];
  focus: string;
  evidence: CaseEvidence;
};
