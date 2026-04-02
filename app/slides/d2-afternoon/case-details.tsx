import React from "react";
import { Search, GitPullRequest, LineChart, MessageSquare, CheckCircle2 } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  step1: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Search size={40} className="text-[#2D2A26]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">找到那个“耗散点”</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">不是什么都需要 AI</p>
        </div>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-loose">
         <p>请各位老板现在拿出工作表。在你的企业里，符合以下特征的环节，就是我们要动刀子的地方：</p>
         <ul className="space-y-4">
           <li className="flex gap-3"><CheckCircle2 className="text-red-400 mt-1 shrink-0" /> 人效极低：占据了大量熟练员工的时间，但产出天花板很明显（如搜集资料、写日报、修图）。</li>
           <li className="flex gap-3"><CheckCircle2 className="text-red-400 mt-1 shrink-0" /> 重度依赖语言/文本交互：如售前支持、客服工单、销售邮件、内容撰写。</li>
           <li className="flex gap-3"><CheckCircle2 className="text-red-400 mt-1 shrink-0" /> 经验极难传承：依靠核心老哥拍脑袋，新人无法立刻复制（如质检、法务合同审查）。</li>
         </ul>
      </div>
    </div>
  ),

  step2: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <GitPullRequest size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">画图纸：用 Agent 思想重塑流转</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">拼乐高式的提效规划</p>
        </div>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-loose">
         <p>在你的草稿纸上，画出原来的数据流动图。<br/>
         现在，擦掉原来图上所有负责传输和浅度思考的人工环节，用你今天上午学到的工具替换掉：</p>
         <p className="text-[#2D2A26] font-mono bg-[#FAF9F6] p-12 rounded-lg border border-[#E5E1D8]">
           例如：“销售听录音(1小时)” → 改为 “通义听悟 API 生成纪要 (1分钟)”<br />
           “助理整理发群(10分钟)” → 改为 “Webhook 转推到企业微信/飞书群 (自动化)”
         </p>
      </div>
    </div>
  ),

  step3: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <LineChart size={40} className="text-green-500" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">算笔账：投资回报 (ROI)</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">别被 API 成本吓到</p>
        </div>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-loose">
         <p>
           现在的 GPT-4o 或者 Claude 3.5 Sonnet 模型 API，一百万字的理解和生成，成本在几块钱到几十块人民币不等！<br/>
           用几块钱，替换掉原本每个月七八千的初级人工成本，以及可能因为情绪疲软带来的错失客户。<br />
           <span className="text-[#2D2A26] mt-4 block">你立刻可以算出来，这项改造在第一个月就能为你收回订阅软件/调用大模型的几倍甚至十倍成本。</span>
         </p>
      </div>
    </div>
  ),

  qa: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <MessageSquare size={40} className="text-[#2D2A26]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">1v1 方案解局</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">带着你的草图上台</p>
        </div>
      </div>
      <div className="text-xl text-[var(--text-secondary)] leading-loose pt-4">
         <p>现场所有的讲师和架构师已就位。带着您刚刚盘点的企业痛点、和画出的改造流草图找我们。我们将为你评估：</p>
         <ul className="list-disc pl-8 mt-4 space-y-4">
           <li>当前业务接大模型的真实可行性（真的有用吗）。</li>
           <li>最具性价比的工具推荐组合。</li>
           <li>如何向组织内部推行这套系统的文化建设建议。</li>
         </ul>
      </div>
    </div>
  )
};
