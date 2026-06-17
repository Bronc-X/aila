import "../../_shipmodel/toybox/toybox-scoped.css";
import { listRuns } from "@/lib/lusie/server/storage";
import { LusieHistoryClient } from "../LusieHistoryClient";
import { LusieAiClient } from "../LusieAiClient";

export const dynamic = "force-dynamic";

export default async function LusieAiPathPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;

  if (path[0] === "history") {
    const { runs } = await listRuns();
    return <LusieHistoryClient runs={runs} />;
  }

  return <LusieAiClient />;
}
