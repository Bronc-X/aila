import type { Metadata } from "next";
import { notFound } from "next/navigation";

import UniverseNodeClient from "../UniverseNodeClient";
import { universe, universeNodeMap } from "../universe-data";

type NodePageProps = {
  params: Promise<{ nodeId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return universe.nodes.map((node) => ({ nodeId: node.id }));
}

export async function generateMetadata({ params }: NodePageProps): Promise<Metadata> {
  const { nodeId } = await params;
  const node = universeNodeMap.get(nodeId);

  return node
    ? {
        title: `${node.title} | FDE Delivery Galaxy`,
        description: node.summary,
      }
    : {};
}

export default async function UniverseNodePage({ params }: NodePageProps) {
  const { nodeId } = await params;
  const node = universeNodeMap.get(nodeId);
  if (!node) notFound();

  const relatedNodes = universe.relations
    .map((relation) => {
      const relatedId = relation.source === node.id ? relation.target : relation.target === node.id ? relation.source : null;
      if (!relatedId) return null;
      const relatedNode = universeNodeMap.get(relatedId);
      return relatedNode ? { relation, node: relatedNode } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return <UniverseNodeClient node={node} relatedNodes={relatedNodes} />;
}
