import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

declare global {
  var __ailaRegisterRateLimit: Map<string, RateLimitBucket> | undefined;
}

function getRateLimitStore() {
  if (!global.__ailaRegisterRateLimit) {
    global.__ailaRegisterRateLimit = new Map<string, RateLimitBucket>();
  }

  return global.__ailaRegisterRateLimit;
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function hitRateLimit(ip: string) {
  const now = Date.now();
  const store = getRateLimitStore();
  const current = store.get(ip);

  if (!current || current.resetAt <= now) {
    store.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  store.set(ip, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    if (hitRateLimit(getClientIp(request))) {
      return NextResponse.json(
        {
          error: "RATE_LIMITED",
          message: "请求过于频繁，请 15 分钟后再试。",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = normalizeText(body?.name, 80);
    const phone = normalizeText(body?.phone, 40);
    const company = normalizeText(body?.company, 120);
    const inviteCode = normalizeText(body?.inviteCode, 32).toUpperCase();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "NAME_AND_PHONE_REQUIRED", message: "姓名和手机号为必填项。" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          name,
          phone,
          company: company || null,
          invite_code: inviteCode || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Registration insert error:", error);
      return NextResponse.json(
        {
          error: "DATABASE_ERROR",
          message: "报名信息保存失败，请稍后再试或联系工作人员。",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "报名信息已提交，顾问会尽快和你确认名额与价格。",
        registrationId:
          data && typeof data === "object" && "id" in data && typeof data.id === "string"
            ? data.id
            : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "服务器内部错误，请稍后再试。" },
      { status: 500 }
    );
  }
}
