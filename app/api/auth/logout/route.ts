import { NextResponse } from "next/server";

import { buildClearedSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(buildClearedSessionCookie());
  return response;
}
