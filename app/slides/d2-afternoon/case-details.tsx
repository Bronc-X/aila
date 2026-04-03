import React from "react";
import { Search, GitPullRequest, LineChart } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  step1: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <Search className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">测算耗损 / 现场演练示例</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#D97706]">核心目标：找到投入产出比（ROI）最低的地方</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 例如：新媒体运营部 3 人，年薪共计 36万。</li>
          <li>• 实际产出：每天生产 2 篇图文，转化率不到 1%。</li>
          <li>• 隐形成本：老板亲自审核文案每天耗费 1 小时。</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（请各位现场打开手机计算器，算一算自己的那本账）</p>
    </div>
  ),

  step2: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <GitPullRequest className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">植入硅基 / 架构设计</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#D97706]">核心动作：切开业务流，让 AI 直接替代岗位</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 引入 [AI 获客引擎] Agent：成本降至几乎无感。</li>
          <li>• 设定 SOP（标准操作程序）：每天抓取 50 个行业热点。</li>
          <li>• 输出设定：批量生成带商用文案的图文并自动分发至平台。</li>
          <li>• 人力冗余处理：原 3 人团队缩减为 1 人作为“大模型饲养员和运营统筹”。</li>
        </ul>
      </div>
    </div>
  ),

  step3: (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6 flex items-center gap-4">
        <LineChart className="text-[var(--brand-glow)]" size={36} />
        <h2 className="text-3xl font-black text-[#2D2A26] tracking-normal">利润锁定 / 财报视角</h2>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E5E1D8] space-y-4">
        <p className="font-bold text-[#D97706]">这不仅是工具升级，这是净利重构</p>
        <ul className="space-y-2 text-[#6B6660]">
          <li>• 直接成本下降：36万年薪直降至 12万，立马省出 24万 <strong>纯利</strong>。</li>
          <li>• 产能增加：每天 2 篇剧增至 每天 200 篇，极大概率捕捉爆款。</li>
          <li>• 其他无形资产：不用再交五险一金，零请假，零跳槽，零负面情绪。</li>
        </ul>
      </div>
      <p className="text-sm text-[#A3A3A3] italic">（这是每个月真切进入您公司账户的钱）</p>
    </div>
  ),

  qa: (
    <div className="space-y-8 text-center py-10">
      <h2 className="text-4xl font-black text-[#2D2A26] tracking-normal mb-4">准备好切除公司病灶了吗？</h2>
      <p className="text-xl text-[#6B6660]">接下来进入 1v1 商业规划解局时间。</p>
      <div className="mt-8">
         <span className="inline-block bg-[#D97706] text-white px-8 py-3 rounded-full font-bold shadow-lg">请联系现场业务专家评估</span>
      </div>
    </div>
  )
};
