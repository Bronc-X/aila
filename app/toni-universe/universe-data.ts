import rawUniverse from "@/data/toni-universe.json";

import type { UniverseData } from "./universe-types";

export const universe = rawUniverse as UniverseData;

export const universeNodeMap = new Map(universe.nodes.map((node) => [node.id, node]));

export function getUniverseNodeHref(nodeId: string) {
  return `/toni-universe/${encodeURIComponent(nodeId)}`;
}

export function getUniverseNodeDestination(nodeId: string) {
  const node = universeNodeMap.get(nodeId);
  if (!node) return getUniverseNodeHref(nodeId);
  if (node.href) return node.href;

  if (node.layer === "core") return "/aila";
  if (node.layer === "commercial") return "/toni-universe/commercial-models";

  return getUniverseNodeHref(nodeId);
}
