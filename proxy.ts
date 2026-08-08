import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getRequiredScopeForPath, getSessionFromRequest, sessionHasScope } from "./lib/auth";

export function proxy(request: NextRequest) {
  const requiredScope = getRequiredScopeForPath(request.nextUrl.pathname);

  if (!requiredScope) {
    return NextResponse.next();
  }

  const session = getSessionFromRequest(request);

  if (sessionHasScope(session, requiredScope)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message:
          requiredScope === "slides"
            ? "请先完成课件访问验证"
            : "请先登录后再使用此功能",
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/tools/:path*",
    "/slides/:path*",
    "/ai-learning/:path*",
    "/api/ai/:path*",
    "/api/profile",
  ],
};
