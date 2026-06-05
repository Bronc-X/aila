import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRunDir, loadRun } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const sourceUrl = getAllowedSourceUrl(request.url);

  try {
    const { runId } = await params;
    const run = await loadRun(runId);
    if (run.status !== "Ready") {
      return Response.json({ error: "STL is not ready" }, { status: 404 });
    }

    const fileName = path.basename(run.files.stl ?? "model.stl");
    const safeFileName = fileName === "stl" ? "model.stl" : fileName;
    if (sourceUrl) {
      return remoteStlResponse(sourceUrl, run.runId);
    }

    const bytes = await readStlBytes(run.runId, safeFileName, sourceUrl ?? run.files.stlSourceUrl);
    return stlResponse(bytes, run.runId);
  } catch {
    if (sourceUrl) {
      const { runId } = await params;
      return remoteStlResponse(sourceUrl, runId);
    }

    return Response.json({ error: "Run not found" }, { status: 404 });
  }
}

async function readStlBytes(runId: string, fileName: string, sourceUrl?: string) {
  try {
    return await readFile(path.join(getRunDir(runId), fileName));
  } catch (error) {
    if (!sourceUrl) throw error;
  }

  return readRemoteStlBytes(sourceUrl);
}

async function readRemoteStlBytes(sourceUrl: string) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Remote STL fetch failed: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function remoteStlResponse(sourceUrl: string, runId: string) {
  const response = await fetch(sourceUrl);
  if (!response.ok || !response.body) {
    return Response.json({ error: `Remote STL fetch failed: ${response.status}` }, { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": `attachment; filename="${runId}.stl"`,
      "Content-Type": "model/stl"
    }
  });
}

function stlResponse(bytes: Buffer, runId: string) {
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": `attachment; filename="${runId}.stl"`,
      "Content-Type": "model/stl"
    }
  });
}

function getAllowedSourceUrl(requestUrl: string) {
  const source = new URL(requestUrl).searchParams.get("source");
  if (!source) return null;

  try {
    const url = new URL(source);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!host.endsWith(".tripo3d.com") && !host.endsWith(".tripo3d.ai")) return null;
    if (!url.pathname.toLowerCase().endsWith(".stl")) return null;
    return url.toString();
  } catch {
    return null;
  }
}
