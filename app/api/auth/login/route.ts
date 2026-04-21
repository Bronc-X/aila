import { NextRequest, NextResponse } from "next/server";

import {
  buildSessionCookie,
  createSessionToken,
  getInviteScope,
  getRequiredScopeForPath,
  getSessionFromRequest,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim() : "";
    const nextPath = typeof body?.nextPath === "string" ? body.nextPath.trim() : "";

    if (!inviteCode) {
      return NextResponse.json(
        { error: "INVALID_INVITE_CODE", message: "璇疯緭鍏ラ個璇风爜" },
        { status: 400 }
      );
    }

    const grantedScope = getInviteScope(inviteCode);

    if (!grantedScope) {
      return NextResponse.json(
        { error: "INVALID_INVITE_CODE", message: "閭€璇风爜鏃犳晥" },
        { status: 401 }
      );
    }

    const existingSession = getSessionFromRequest(request);
    const inviteCodes = Array.from(new Set([...(existingSession?.inviteCodes ?? []), inviteCode]));
    const scopes = Array.from(new Set([...(existingSession?.scopes ?? []), grantedScope]));
    const requiredScope = nextPath.startsWith("/") ? getRequiredScopeForPath(nextPath) : null;

    if (requiredScope && !scopes.includes(requiredScope)) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_SCOPE",
          message:
            requiredScope === "slides"
              ? "璇ヤ釜閭€璇风爜涓嶈冻浠ヨ闂浠讹紝璇疯緭鍏?2049"
              : "璇ヤ釜閭€璇风爜涓嶈冻浠ヨ闂?AI 宸ュ叿锛岃杈撳叆 2026",
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      grantedScope,
      scopes,
    });
    response.cookies.set(buildSessionCookie(createSessionToken({ inviteCodes, scopes })));
    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "鐧诲綍澶辫触锛岃绋嶅悗閲嶈瘯" },
      { status: 500 }
    );
  }
}
