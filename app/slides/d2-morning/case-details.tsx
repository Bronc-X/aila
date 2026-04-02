import React from "react";
import { Megaphone, Coins, Blocks, Headphones, CheckCircle2 } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  marketing: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Megaphone size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">获客引擎：内容军团的自动化</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">推荐栈: Coze / Midjourney / Kimi / 扣子</p>
        </div>
      </div>
      <div className="space-y-6">
        <h4 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D2A26]">
          典型实操场景：
        </h4>
        <ul className="space-y-4 text-[var(--text-secondary)] text-lg">
          <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>文案洗稿神器：</b> 一键抓取爆文链接，使用 Agent（搭载特定人设 Prompt）将其转化成为品牌调性的软文矩阵。</p></li>
          <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>海报高并发输出：</b> 锁定商品图后基于垫词大批量跑图，绕开传统繁重的影棚拍摄流程。</p></li>
          <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>SEO 霸屏：</b> 让模型批量生成高含金量博客，占据搜索入口的 90% 长尾词。</p></li>
        </ul>
      </div>
    </div>
  ),

  sales: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Coins size={40} className="text-green-400" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">销售转化：缩减阻力，极限成单</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">推荐栈: Salesforce Einstein / 飞书妙记 / Notion AI</p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-lg text-[var(--text-secondary)] leading-loose">
           顶尖销售的本质在于“共情”与“洞察”，而整理资料是对他们能力的最大浪费。目前最佳实践是：
           <br />采用智能会议录音进行全量采集。会后立即由通义听悟/飞书妙记提取客户诉求与“痛点、抗拒点”。随后指令 CRM 助手生成千人千面的跟进邮件，一键下发至邮件营销自动流（MailChimp 等），成单转化缩短至少 3 个触点环节。
        </p>
      </div>
    </div>
  ),

  ops: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Blocks size={40} className="text-[var(--brand-accent)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">运营与决策：用自然语言管理数据</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">推荐栈: ChatGPT Code Interpreter / 钉钉/企微大模型底座</p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-xl text-[#2D2A26] font-bold bg-[#111] p-12 border-l-4 border-[var(--brand-accent)] rounded-lg">
           "你再也不用写 VLOOKUP 或者复杂的 SQL。数据就是供你对话的朋友。"
        </p>
        <p className="text-[var(--text-secondary)] leading-loose text-lg mt-4">
           老板的终局体验：将杂乱巨大的销售 CSV 原表拖入处理框，输入“我明早要开股东大会，分析上个月北亚区的净利流失核心因素，并做成可视化漏斗图”。3分钟获取 15 页报告——这正是企业精细化运营脱离人力依赖的历史转折点。
        </p>
      </div>
    </div>
  ),

  service: (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Headphones size={40} className="text-[#888]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">无休客服：知识资产的复利</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">推荐栈: FastGPT / Dify 原生 RAG</p>
        </div>
      </div>
      <div className="space-y-6">
         <p className="text-lg text-[var(--text-secondary)] leading-loose">
           过去的客服 AI 只能做“关键词匹配”，稍有复杂逻辑即变为人工智障，气走客户。<br/>
           今年大基建落定后的 RAG（检索增强）：你只需把企业的产品图册（PDF）、过往话术库（Word）丢给后端向量库。它会形成一个能够结合上下文，基于你公司规范解答极其刁钻客诉的<span className="text-[#2D2A26] font-bold ml-1">专业技术工程师</span>体验，甚至能根据情绪安抚用户。
        </p>
      </div>
    </div>
  )
};
