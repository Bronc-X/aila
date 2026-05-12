import { probeStorageUpload } from "@/lib/lusie/server/storage";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await probeStorageUpload(), {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
