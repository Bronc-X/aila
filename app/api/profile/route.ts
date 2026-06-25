import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "请先登录后再保存资料" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { 
      name, 
      company, 
      industry, 
      industry_label, 
      company_size, 
      pain_points, 
      pain_point_labels, 
      ai_experience 
    } = body;

    // 独立插入到 user_profiles 表
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from('user_profiles')
      .insert([{
        name,
        company,
        industry,
        industry_label,
        company_size,
        pain_points,
        pain_point_labels,
        ai_experience
      }]);

    if (error) {
      console.error('Supabase insert user_profiles error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: `信息保存失败: ${error.message || '未知错误'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Profile API error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
