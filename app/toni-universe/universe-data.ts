import rawUniverse from "@/data/toni-universe.json";

import type { UniverseData } from "./universe-types";

export const universe = rawUniverse as UniverseData;

export const universeNodeMap = new Map(universe.nodes.map((node) => [node.id, node]));

export function getUniverseNodeHref(nodeId: string) {
  return `/toni-universe/${encodeURIComponent(nodeId)}`;
}

export function getUniverseNodeDestination(nodeId: string) {
  return universeNodeMap.get(nodeId)?.href ?? getUniverseNodeHref(nodeId);
}
