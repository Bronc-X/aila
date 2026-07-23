import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "aila_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_TOOLS_INVITE_CODE = "2026";
const DEFAULT_SLIDES_INVITE_CODE = "2049";
const DEFAULT_SESSION_SECRET = "aila-local-session-secret";

export type SessionScope = "tools" | "slides";

export type SessionPayload = {
  inviteCodes: string[];
  scopes: SessionScope[];
  issuedAt: number;
  expiresAt: number;
};

type LegacySessionPayload = {
  inviteCode?: string;
  inviteCodes?: string[];
  scopes?: SessionScope[];
  issuedAt: number;
  expiresAt: number;
};

const INVITE_SCOPE_CONFIG: Array<{ scope: SessionScope; codes: string[] }> = [
  {
    scope: "tools",
    codes: [DEFAULT_TOOLS_INVITE_CODE, process.env.AILA_LOGIN_INVITE_CODE?.trim()].filter(
      Boolean
    ) as string[],
  },
  {
    scope: "slides",
    codes: [DEFAULT_SLIDES_INVITE_CODE, process.env.AILA_SLIDES_INVITE_CODE?.trim()].filter(
      Boolean
    ) as string[],
  },
];

function getSessionSecret() {
  return process.env.AILA_SESSION_SECRET?.trim() || DEFAULT_SESSION_SECRET;
}

function encodeBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function sign(value: string) {
  return encodeBase64Url(createHmac("sha256", getSessionSecret()).update(value).digest());
}

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values));
}

function isSessionScope(value: unknown): value is SessionScope {
  return value === "tools" || value === "slides";
}

function normalizeInviteCodes(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueValues(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

function parseCookieHeader(header: string | null) {
  const pairs = (header || "").split(";").map((item) => item.trim()).filter(Boolean);
  const cookies = new Map<string, string>();

  for (const pair of pairs) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    cookies.set(key, decodeURIComponent(value));
  }

  return cookies;
}

export function getInviteScope(inviteCode: string): SessionScope | null {
  const normalized = inviteCode.trim();

  if (!normalized) {
    return null;
  }

  const match = INVITE_SCOPE_CONFIG.find((entry) => entry.codes.includes(normalized));
  return match?.scope ?? null;
}

export function isValidInviteCode(inviteCode: string) {
  return getInviteScope(inviteCode) !== null;
}

export function sessionHasScope(session: SessionPayload | null, scope: SessionScope) {
  return Boolean(session?.scopes.includes(scope));
}

const publicToolShowcasePaths = new Set([
  "/tools/activity-plan",
  "/tools/auto-red-book",
]);

export function getRequiredScopeForPath(pathname: string): SessionScope | null {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (publicToolShowcasePaths.has(normalizedPathname)) {
    return null;
  }

  if (
    normalizedPathname.startsWith("/tools") ||
    normalizedPathname.startsWith("/api/ai") ||
    normalizedPathname === "/api/profile"
  ) {
    return "tools";
  }

  if (normalizedPathname.startsWith("/slides")) {
    return "slides";
  }

  return null;
}

function normalizeSessionPayload(payload: LegacySessionPayload) {
  const inviteCodes = normalizeInviteCodes(payload.inviteCodes);
  const legacyInviteCode = typeof payload.inviteCode === "string" ? payload.inviteCode.trim() : "";
  const mergedInviteCodes = uniqueValues([
    ...inviteCodes,
    ...(legacyInviteCode ? [legacyInviteCode] : []),
  ]);
  const scopesFromPayload = Array.isArray(payload.scopes)
    ? uniqueValues(payload.scopes.filter(isSessionScope))
    : [];
  const inferredScopes = mergedInviteCodes
    .map((inviteCode) => getInviteScope(inviteCode))
    .filter((scope): scope is SessionScope => Boolean(scope));
  const mergedScopes = uniqueValues([...scopesFromPayload, ...inferredScopes]);

  if (
    mergedInviteCodes.length === 0 ||
    mergedScopes.length === 0 ||
    payload.expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  return {
    inviteCodes: mergedInviteCodes,
    scopes: mergedScopes,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
  } satisfies SessionPayload;
}

export function createSessionToken(
  input:
    | string
    | {
        inviteCodes: string[];
        scopes: SessionScope[];
      }
) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + SESSION_TTL_SECONDS;
  const normalized =
    typeof input === "string"
      ? normalizeSessionPayload({
          inviteCode: input,
          issuedAt,
          expiresAt,
        })
      : normalizeSessionPayload({
          inviteCodes: input.inviteCodes,
          scopes: input.scopes,
          issuedAt,
          expiresAt,
        });

  if (!normalized) {
    throw new Error("Cannot create session without a valid invite scope");
  }

  const payload: SessionPayload = {
    inviteCodes: normalized.inviteCodes,
    scopes: normalized.scopes,
    issuedAt,
    expiresAt,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as LegacySessionPayload;
    return normalizeSessionPayload(payload);
  } catch {
    return null;
  }
}

export function getSessionFromCookieHeader(header: string | null) {
  const cookies = parseCookieHeader(header);
  return verifySessionToken(cookies.get(AUTH_COOKIE_NAME));
}

export function getSessionFromRequest(request: { headers: Headers }) {
  return getSessionFromCookieHeader(request.headers.get("cookie"));
}

export function buildSessionCookie(token: string) {
  return {
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function buildClearedSessionCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
