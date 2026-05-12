import { probeStorageUpload } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = process.env.LUSIE_STORAGE_PROBE_TOKEN;
  if (!token || request.headers.get("x-lusie-probe-token") !== token) {
    return Response.json({ ok: false, message: "Storage probe is disabled." }, { status: 404 });
  }

  return Response.json(await probeStorageUpload(), {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
