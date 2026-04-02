import React from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, Zap, PackageOpen, Target, Server, Factory, Film } from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  manufacturing: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Factory className="text-[var(--brand-glow)]" size={32} /> 工业制造：从肉眼到算法</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p>
          在高端制造中，良品率每提升0.1%，意味着千万级别的净利润。知名电池制造商引入了“大模型辅助诊断”平台，该平台不仅能够判读图像，还能融合机台环境数据（温度、气压）进行复合归因。
        </p>
        <p>这使得发现瑕疵后的归因判定时间，由原先经验老手主导的<span className="text-red-400 line-through mx-2">分级排查数小时</span>，恐怖压缩至<span className="text-green-400 font-bold mx-2">微秒并发 / 人工核验 3 分钟</span>。</p>
      </div>
    </div>
  ),

  retail: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><PackageOpen className="text-[var(--brand-glow)]" size={32} /> 新零售/出海：一人舰队</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p>
          依托 GPT-4V 及本地部署的 LLaMA 系模型。企业将其串联成了自动执行流：
        </p>
        <ul className="space-y-4 pt-4 border-t border-[#E5E1D8]">
          <li className="flex gap-8"><Target className="text-[var(--brand-primary)] shrink-0" /> <span className="text-[#2D2A26] font-bold">Step 1: 全网洞察。</span> AI 全天候爬取 Reddit, TikTok 的趋势产品进行打分。</li>
          <li className="flex gap-8"><Target className="text-[var(--brand-primary)] shrink-0" /> <span className="text-[#2D2A26] font-bold">Step 2: 极速克隆。</span> 识别爆品后，基于白底图重绘 5 种国家特色消费场景的营销海报。</li>
          <li className="flex gap-8"><Target className="text-[var(--brand-primary)] shrink-0" /> <span className="text-[#2D2A26] font-bold">Step 3: 自发投放。</span> 撰写符合当地口味文案，自动过审上架亚马逊/独立站。</li>
        </ul>
      </div>
    </div>
  ),

  service: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Server className="text-[var(--brand-glow)]" size={32} /> 泛服务业：重塑经验护城河</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p>
          对于培训、律所、企业服务而言，培养一个熟练的“行家里手”成本极高。借助 RAG（检索增强生成技术），公司将过往 10 年的所有合同时纸、诉讼判例、微信客服聊天记录“喂”给大模型。
        </p>
        <p>结果是：新兵入职第一天，即可调用这个拥有十年经验的<span className="text-[var(--brand-glow)] font-bold mx-2">最强大脑</span>进行辅佐，客户满意度和吞吐量实现了代际碾压。</p>
      </div>
    </div>
  ),

  media: (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 tracking-normal flex items-center gap-3"><Film className="text-[var(--brand-glow)]" size={32} /> 内容传媒：边际成本归零</h2>
      </div>
      <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
        <p>以前短视频矩阵需要成排的长尾雇员充当剪辑、文案、配音。而现在通过 Coze/Dify 搭建工作流，一条热点爆发后，从抓取关键词、重组观点、唤醒 Midjourney 绘图、Sora系引擎补帧、到唇型对齐的数字人播读，在服务器后台可以呈百倍级裂变，全面攻陷各大社交平台。</p>
      </div>
    </div>
  ),

  "live-coding": (
    <div className="space-y-10">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-4xl font-black text-gradient mb-2 tracking-normal">45 MIN Live Coding 复盘</h2>
        <p className="text-[var(--text-secondary)]">刚刚在控制台中创造的心智奇迹</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#2D2A26] flex items-center gap-2">
            <Zap className="text-[var(--brand-glow)]" /> 工作流骨架
          </h3>
          <ul className="space-y-4 text-[var(--text-secondary)]">
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 1 接收器：</b> 自动轮询监听特定竞对公众号或网页的发文。</p></li>
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 2 深思考：</b> GPT-4o 瞬间解析竞对卖点，提取核心攻击方向。</p></li>
            <li className="flex gap-3"><CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} /> <p><b>节点 3 终结者：</b> 生成防守反击文案并发放至审核飞书群中。</p></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#2D2A26] flex items-center gap-2">
            <AlertTriangle className="text-red-400" /> 对老板的启示
          </h3>
          <p className="text-[var(--text-secondary)] leading-loose">
            <span className="text-[#2D2A26] bg-[rgba(255,100,100,0.1)] py-1">构建这套防御反击系统，我们没写一行传统业务代码。</span> 
            全凭借简单的模块拼装与系统性思维（System Prompt）。您公司到底还有多少像过去这样依赖人工盯梢、汇总、分发的腐朽环节？
          </p>
        </div>
      </div>
    </div>
  ),
};
