import React from "react";
import { Megaphone, Coins, Headphones, Blocks } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  marketing: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <Megaphone className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">AI 获客引擎 / 控制台实景</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#22d665]">核心能力释放点：</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 一键抓取全网热点关键词和竞品爆款</li>
          <li>• 根据产品白底图，瞬间生成 8 种应用场景商用海报</li>
          <li>• 针对小红书/抖音/海外 TikTok 不同调性，批量生成千面文案</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（此处在实训现场将接入真实 AILA 营销助手界面）</p>
    </div>
  ),

  sales: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <Coins className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">AI 销售军师 / 控制台实景</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#22d665]">核心能力释放点：</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 自动录制客户音视频通话并结构化分发核心信息至 CRM</li>
          <li>• 根据客户的历史发言，构建深度的客户 3D 画像</li>
          <li>• 实时弹窗：当客户提到“预算太高”，Agent 瞬间在右侧提示标准反驳话术</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（此处在实训现场将接入真实销冠克隆人界面）</p>
    </div>
  ),

  ops: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <Blocks className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">AI 运营看板 / 控制台实景</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#22d665]">核心能力释放点：</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 抛弃 Excel 繁琐函数，上传 CSV 直接用自然语言对话查询</li>
          <li>• 跨数据源整合：把淘宝销量、抖音投放消耗拉到一起，自动算单客户转化成本</li>
          <li>• 异常报警：毛利突然跌落时，Agent 主动推送归因飞书警报</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（此处在实训现场将运行真实的数据解析大模型）</p>
    </div>
  ),

  service: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <Headphones className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">AI 客服管家 / 控制台实景</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#22d665]">核心能力释放点：</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 基于企业专属知识库的 7x24 小时精准秒回（多语言）</li>
          <li>• 情绪质检仪：敏锐捕捉客户愤怒倾向，第一时间拉群引入人类专家兜底</li>
          <li>• 售后跟进自动化：对特定投诉客户，系统定时触发二次跟进动作</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（此处在实训现场将演示企业知识底座构建全流程）</p>
    </div>
  ),
};
