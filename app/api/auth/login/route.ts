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
        { error: "INVALID_INVITE_CODE", message: "请输入邀请码" },
        { status: 400 }
      );
    }

    const grantedScope = getInviteScope(inviteCode);

    if (!grantedScope) {
      return NextResponse.json(
        { error: "INVALID_INVITE_CODE", message: "邀请码无效" },
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
              ? "这个邀请码不能访问课件，请输入 2049"
              : "这个邀请码不能访问 AI 工具，请输入 2026",
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
      { error: "INTERNAL_SERVER_ERROR", message: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
