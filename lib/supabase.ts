import { createClient } from "@supabase/supabase-js";

// 客户端 Supabase 实例
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据类型定义
export interface Profile {
  id: string;
  name: string;
  company: string;
  industry: "ecommerce" | "foreign-trade" | "manufacturing" | "fmcg" | "agriculture" | "other";
  invite_code: string;
  role: "attendee" | "admin";
  created_at: string;
}

export interface InviteCode {
  code: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  created_by: string;
}

export interface ToolUsage {
  id: string;
  user_id: string;
  tool_name: string;
  input_summary: string;
  tokens_used: number;
  created_at: string;
}
