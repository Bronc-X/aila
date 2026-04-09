import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, company, inviteCode } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'NAME_AND_PHONE_REQUIRED', message: '姓名和手机号码为必填项' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    // Note: Assuming Supabase 'registrations' table has an 'invite_code' column.
    const { data, error } = await supabase
      .from('registrations')
      .insert([{ name, phone, company, invite_code: inviteCode }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: `报名失败: ${error.message || error.details || '数据库写入错误'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: '报名成功', data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
