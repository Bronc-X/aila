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
            ? "璇峰厛瀹屾垚璁叉紨璇句欢楠岃瘉"
            : "璇峰厛鐧诲綍鍚庡啀浣跨敤姝ゅ姛鑳?",
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/tools/:path*", "/slides/:path*", "/api/ai/:path*", "/api/profile"],
};
