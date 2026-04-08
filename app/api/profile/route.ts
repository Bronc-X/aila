import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
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
    const { data, error } = await supabase
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
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert user_profiles error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: `信息保存失败: ${error.message || '未知错误'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Profile API error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
