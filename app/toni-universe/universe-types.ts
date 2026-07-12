export type UniverseLayer = "core" | "delivery" | "capability" | "proof";
export type UniverseStatus = "live" | "delivered" | "prototype" | "archive";
export type UniverseRelationType = "flow" | "enables" | "proves" | "compounds";

export type UniverseNode = {
  id: string;
  layer: UniverseLayer;
  status: UniverseStatus;
  title: string;
  english: string;
  summary: string;
  detail: string;
  color: string;
  weight: number;
  position: [number, number, number];
  href: string;
  tags: string[];
};

export type UniverseRelation = {
  source: string;
  target: string;
  type: UniverseRelationType;
};

export type UniversePath = {
  id: string;
  title: string;
  description: string;
  nodeIds: string[];
};

export type UniverseData = {
  meta: {
    title: string;
    coreBusiness: string;
    eyebrow: string;
    headline: string;
    intro: string;
  };
  nodes: UniverseNode[];
  relations: UniverseRelation[];
  paths: UniversePath[];
};
