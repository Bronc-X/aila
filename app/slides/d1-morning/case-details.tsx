import React from "react";
import { 
  Building2, Users, Lightbulb, Zap, ShoppingBag, 
  Factory, Brain, Globe, FileText, CheckCircle2, ChevronRight
} from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  // --- 表格页：中国真实落地案例 (S9) 的拆解 ---
  "atour": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Building2 size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">亚朵酒店：非标诉求的 AI 破局</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">年减30万小时调度工时 / 750万人工成本</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D2A26]">
            <Users className="text-red-400" /> 过去的痛点
          </h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            酒店面临的海量“非标准诉求”（如：多拿两瓶水、发票开错了、空调不制热）以前全靠前台或总机人工录单分发。不仅响应慢，且流转链条长，SOP 超过 100 多项，新员工培训周期极高。
          </p>
        </div>
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D2A26]">
            <Zap className="text-green-400" /> AI 的重构逻辑
          </h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            引入 AI 打造智能双闭环系统。AI 直接作为总机的“智能耳目”，监听、理解客户录音/文字并秒级分发至保洁/维修工单系统。意图识别准确率从传统语音助手的 60% 飙升至现在的 <b>95%以上</b>。
          </p>
        </div>
      </div>
      <div className="p-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3 flex items-center gap-2">
          <Lightbulb /> 给老板的启示
        </h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          不要妄图用 AI 颠覆最核心的商业模式，而是找准企业最“厚重”、耗散最高的人力环节（调度岗、客服岗）。先用 Agent 砍掉“传声筒”环节， ROI 往往是最快、最高的。
        </p>
      </div>
    </div>
  ),

  "cross-border": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Globe size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">某头部跨境电商：无界产能重构</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">人力成本骤降70% / 多语言并发战役</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>执行细节：</b> 以前进军一个新国家站点，需要翻译人员、本地化设计、客服上阵，开城极慢。现在用 AI + 数字人：</p>
        <ul className="space-y-2 list-disc pl-5">
          <li>1分钟让 AI 将 500 个 SKU 详描翻成 8 国语言，且符合当地 SEO 习惯。</li>
          <li>只需1套产品白底图，让 AI 生成契合中东、欧美、日韩审美的场景图和宣传海报。</li>
          <li>用 AI 驱动的 24H 数字人替代全职主播。</li>
        </ul>
      </div>
      <div className="p-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3 flex items-center gap-2">
          <Lightbulb /> 技术杠杆本质
        </h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          内容生成的边际成本已近乎为 0。过去受制于“员工语言能力”和“制作周期”的市场拓展，现在只需一套跑通的 API 工作流即可全球复制。这是降维打击。
        </p>
      </div>
    </div>
  ),

  "salesforce": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <ShoppingBag size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">Salesforce：释放销售团队潜能</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">销售周期缩短 25% / 赢单率提升</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-xl font-bold mb-4 text-[#2D2A26]">销售原本的“脏活”</h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            以前的高级销售（AE）每天要花大量时间录入会议录音、查资料写跟进邮件、填 CRM 漏斗。这些动作消耗了黄金谈判时间。
          </p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4 text-[#2D2A26]">AI Agent 化</h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            引入 Einstein GPT 后：AI 自动旁听会议提炼下一步 Action、自动起草高度个性化的逼单邮件、预测客户关闭率并在 CRM 后台标记预警。
          </p>
        </div>
      </div>
    </div>
  ),

  "nvidia": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">NVIDIA 《2026 产业前瞻报告》</h3>
        <p className="text-[var(--text-muted)] text-lg mt-1">出处验证：NVIDIA 官方白皮书与股东信披露</p>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        根据最新报告抽样调查，超过 <strong className="text-gradient">88%</strong> 的财富 500 强企业高管明确表示，在核心业务链整合专有大模型（如基于 NIM 微服务部署的流式 Agent）后，企业在过去三个季度的营收增长有直接受惠。
      </p>
    </div>
  ),
  "mckinsey": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">麦肯锡全球研究院：AI 的经济学护城河</h3>
        <p className="text-[var(--text-muted)] text-lg mt-1">出处验证：McKinsey "Generative AI and the Future of Work"</p>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        CEO 级别调研显示，将生成式 AI 纳入核心竞争力的前 <strong className="text-green-400">40%</strong> 领跑企业，获得了远超同业 10% 以上的复合收入增长。主要增长极来源于：销售线索精准转化率的提升（预测与个性化）以及研发周期的急剧收缩。
      </p>
    </div>
  ),
  "window": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">达摩院与高盛：转型生死线</h3>
        <p className="text-[var(--text-muted)] text-lg mt-1">出处研判：全球顶级投行与 AI 研究机构共识</p>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        大模型目前每半年完成一次底层认知突进，导致应用层的壁垒搭建时间被极度压缩。资本和市场给予传统企业的数字化缓冲期仅剩 <strong className="text-red-400">18 个月</strong>，逾期将陷入成本结构被跨代际碾压的“绝望谷谷底”。
      </p>
    </div>
  ),
  "eff_1": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">60倍人效验证：营销内容矩阵自动化</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        传统内容团队是流水线：写文→审稿→排版，15人天的产能。引入基于 Claude 3.5 Sonnet / GPT-4o 的自动化写稿矩阵（Agent Workflow）后，完成核心提示词编排仅需 <strong>0.25 人天</strong> 即可一键生成、分发百余篇符合不同平台调性的文案。这是断崖式的降本。
      </p>
    </div>
  ),
  "eff_2": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">56倍人效验证：深度舆情与竞品研报</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        借助具备联网搜索能力的研报 Agent（如 Perplexity / 秘塔），只需输入竞品名称与指定调研维度，30分钟内完成全网数千页信息的爬取、筛选、图表化和总结归因，不仅免去了“两人一周”的手工梳理，且逻辑严密性甚至超过了初中级分析师。
      </p>
    </div>
  ),
  "eff_3": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">8倍人效验证：全天候 7x24 智能数字客服</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        灌注了企业私有知识库（RAG 技术）的大模型客服，在应对高频退换货、产品参数解答、售后政策上，能直接完美终结 <strong>80%</strong> 以上的会话。原本需要 8 人倒班的客服组，现仅需 1 名质检兼策略人员。
      </p>
    </div>
  ),
  "eff_4": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">40倍人效验证：冗长会议的极速榨汁机</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        丢掉录音笔和实习生。Whisper（语音转录）配合 LLM（抽取式总结），让2小时的高密度头脑风暴，在 <strong>3分钟内</strong> 自动生成：待办事项（Action Items）、分歧点摘要（Key Conflicts）以及执行时间表。
      </p>
    </div>
  ),
  "eff_5": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">20倍人效验证：Midjourney 工业化批量出图</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        曾经需要摄影师布景、外模实拍、设计师精修（耗时5天以上）的产品宣发物料。通过垫图与垫词，<strong>2 小时内</strong> 可获得各种场景、各种风格化（赛博朋克、INS风、极简工业）的上百张免抠白底或高精度渲染成片可供挑选。
      </p>
    </div>
  ),

  "employee_boss": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <CheckCircle2 size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">老板与员工的割裂如何弥合</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">AI 是一场自上而下的组织文化变革</p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-[var(--text-secondary)] text-lg leading-loose">
          员工不用 AI 的真正原因不是蠢，而是：<strong className="text-[#2D2A26] bg-[var(--brand-glow)]/20 px-2 ml-1">既怕被抢饭碗，又怕背效率不高的锅。</strong>
        </p>
        <div className="bg-[var(--bg-card)] p-12 rounded-xl border border-[var(--border-subtle)]">
          <h4 className="text-xl font-bold text-[#2D2A26] mb-3 flex items-center gap-2">
            <ChevronRight className="text-[var(--brand-glow)]" /> 破局执行方案
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="text-[var(--brand-glow)] mt-1">•</div>
              <p className="text-[var(--text-secondary)]"><b>设立容错期：</b> 老板要明确发声，鼓励尝试。告诉大家这段时间即使用了AI没提效，甚至初期费时间，都算团队的战略性探索，不计入绩效惩罚。</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="text-[var(--brand-glow)] mt-1">•</div>
              <p className="text-[var(--text-secondary)]"><b>重新定义“人效”：</b> AI 帮你省下的时间，不是为了裁掉你，而是为了让你去干原来“没精力去做的高价值事情”，例如更深度的客户面谈、战略思考。</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="text-[var(--brand-glow)] mt-1">•</div>
              <p className="text-[var(--text-secondary)]"><b>先从最好玩的场景入手：</b> 不要一上来就强推繁杂的系统对接，先通过 AI 写请假邮件、AI 润色周报这些轻量级触点，让全员尝到“爽感”。</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
