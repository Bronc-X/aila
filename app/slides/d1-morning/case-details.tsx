import React from "react";
import { 
  Building2, Users, Lightbulb, Zap, ShoppingBag, 
  Factory, Brain, Globe, FileText, CheckCircle2, ChevronRight,
  TrendingUp, DollarSign, Cpu, BarChart3, Target, Bot
} from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {
  // --- S9 中国真实落地案例拆解 ---
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
            <Users className="text-[#22d665]" /> 过去的痛点
          </h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            酒店面临的海量"非标准诉求"（如：多拿两瓶水、发票开错了、空调不制热）以前全靠前台或总机人工录单分发。不仅响应慢，且流转链条长，SOP 超过 100 多项，新员工培训周期极高。
          </p>
        </div>
        <div>
          <h4 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D2A26]">
            <Zap className="text-green-400" /> AI 的重构逻辑
          </h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            引入 AI 打造智能双闭环系统。AI 直接作为总机的"智能耳目"，监听、理解客户录音/文字并秒级分发至保洁/维修工单系统。意图识别准确率从传统语音助手的 60% 飙升至现在的 <b>95%以上</b>。
          </p>
        </div>
      </div>
      <div className="p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3 flex items-center gap-2">
          <Lightbulb /> 给老板的启示
        </h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          不要妄图用 AI 颠覆最核心的商业模式，而是找准企业最"厚重"、耗散最高的人力环节（调度岗、客服岗）。先用 Agent 砍掉"传声筒"环节， ROI 往往是最快、最高的。
        </p>
      </div>
    </div>
  ),

  "siwei": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <FileText size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">四维图新：AI合规审核颠覆传统效率</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">审核周期从300+小时缩短至个位数小时</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>背景：</b>高精度地图企业面临严苛的合规审核体系——每一轮产品发布需要经过数百份技术文档的交叉比对，传统方式由法务+技术组3-5人耗时300+小时逐条审核。</p>
        <p><b>AI改造：</b>部署基于 RAG（检索增强生成）技术的合规大模型，将企业内部合规库、法律案例、行业标准全量导入。AI 自动识别文本中的合规风险点，按严重等级排序并给出修改建议。</p>
        <p><b>结果：</b>审核周期缩短 <strong>95%</strong>，释放法务团队聚焦高价值战略合规规划，年节省外付律所费用约 <strong>¥200万+</strong>。</p>
      </div>
    </div>
  ),

  "catl": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Factory size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">宁德时代：工业大模型重构产线精度</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">制造偏差降50% / 原型设计缩短50%</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>痛点：</b>锂电池极片涂布工序对一致性要求极高。传统依赖人工抽检+经验调参，在百亿级产线规模下，误差累积带来的损耗触目惊心——一条产线一年因偏差报废的材料价值达千万级。</p>
        <p><b>AI方案：</b>部署工业大模型对全工序的传感器数据进行实时学习和预测。当温度、压力、速度的微小偏移即将引发涂布偏差时，AI提前200ms介入自适应调参。同时用生成式AI加速电芯结构原型设计。</p>
        <p><b>结果：</b>涂布偏差降低 <strong>50%</strong>，材料报废率骤降，原型设计周期从数周缩短至 <strong>数天</strong>，年节省成本数千万级。</p>
      </div>
    </div>
  ),

  "jd": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <ShoppingBag size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">京东工业：智能供应链重构</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">仓储周转提速30% / 供应商成本降50%+</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>背景：</b>工业品供应链SKU极多（数百万级），传统ERP系统在智能推荐、需求预测和供应商匹配上几乎无法给出高质量建议。采购部门日常60%时间在多平台比价和沟通协调上。</p>
        <p><b>AI改造：</b>部署AI驱动的采购大脑——基于历史交易数据+实时市场价格的智能匹配Agent，自动完成供应商筛选、价格预测、仓储优化。</p>
        <p><b>结果：</b>周转效率提升 <strong>30%</strong>，供应商综合采购成本降低 <strong>50%+</strong>，采购人员工作时间释放40%投入战略级供应商关系管理。</p>
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
      <div className="p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3 flex items-center gap-2">
          <Lightbulb /> 技术杠杆本质
        </h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          内容生成的边际成本已近乎为 0。过去受制于"员工语言能力"和"制作周期"的市场拓展，现在只需一套跑通的 API 工作流即可全球复制。这是降维打击。
        </p>
      </div>
    </div>
  ),

  "salesforce": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Target size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">Salesforce Agentforce：销售团队产能释放</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">销售周期缩短 25% / 赢单率提升 15%</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-xl font-bold mb-4 text-[#2D2A26]">销售原本的"脏活"</h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            高级销售（AE）每天花大量时间在录入会议录音、查资料写跟进邮件、填CRM漏斗。这些动作消耗了黄金谈判时间。Salesforce内部研究显示，销售人员仅有 <strong>28%</strong> 的时间用于真正的客户沟通。
          </p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4 text-[#2D2A26]">Agentforce 化后</h4>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            AI Agent 自动旁听会议提炼 Action Items、自动起草高度个性化逼单邮件、预测客户关闭率并在CRM标记预警。销售有效沟通时间从28%飙升至 <strong>65%+</strong>。跟进邮件生成时间从45分钟降至 <strong>2分钟</strong>。
          </p>
        </div>
      </div>
      <div className="p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3">我们的企业AI服务如何落地</h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          我们为企业提供的不是通用工具，而是 <strong>定制化的AI企业级解决方案</strong>：<br/>
          <strong>1)</strong> 用IDE级编程为你搭建专属销售智能体应用——不是聊天机器人，是全流程嵌入CRM的自动化引擎<br/>
          <strong>2)</strong> 构建100+专家Agent矩阵，覆盖销售话术、客户画像、竞品分析、合同审核全链路<br/>
          <strong>3)</strong> 无缝接入飞书/钉钉等企业管理App的CLI，零代码迁移，员工无痛升级
        </p>
      </div>
    </div>
  ),

  "amazon": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <ShoppingBag size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">Amazon AI 推荐引擎：35%营收来自算法</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">每一个"猜你喜欢"背后全是算力重构</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>数据解读：</b>Amazon 年度财报披露，其高达 <strong>35%</strong> 的营收直接来自AI推荐引擎——"买了A的人也买了B"、"你可能还需要C"。这不是一个边缘功能，而是核心利润引擎。</p>
        <p><b>我们的企业AI服务：</b>我们为企业构建 <strong>私有数字资产知识库</strong>——将你10年积累的产品数据、客户行为、行业洞察全部注入企业专属大脑。不是通用ChatGPT，是只懂你业务的 <strong>专家级AI引擎</strong>，能做个性化推荐、智能定价、库存预测。</p>
        <p><b>交付成果：</b>企业私有知识库 + 100+细分领域专家Agent + 飞书/钉钉深度集成 = 全员即时调用的 <strong>"企业外脑"</strong>。从新人培训到高管决策，一套系统覆盖。</p>
      </div>
    </div>
  ),

  "pepsico": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <Factory size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">PepsiCo 数字孪生：AI预判90%产线异常</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">产能提升20% / 非计划停机降低85%</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>技术方案：</b>PepsiCo在全球数十条灌装线上部署了"数字孪生"——将物理产线的实时数据（温度、压力、转速、振动频率）导入AI模型，构建一个虚拟映射的数字产线。</p>
        <p><b>AI做了什么：</b>AI在虚拟环境中7×24小时预演各种故障场景，当它检测到某个设备的振动频率偏离正常范围0.5%时——这个变化人工根本察觉不了——立刻触发预防性维护工单。</p>
        <p><b>结果：</b>非计划停机减少 <strong>85%</strong>，产能利用率提升 <strong>20%</strong>。一条灌装线一年节省的维修+停机损失约 <strong>$2M</strong>。</p>
      </div>
      <div className="p-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-lg font-bold text-[var(--brand-glow)] mb-3">我们的交付方式</h4>
        <p className="text-[var(--text-secondary)] leading-loose">
          我们用 <strong>IDE级专业编程</strong> 为企业定制开发：<br/>
          <strong>1)</strong> 企业级AI应用——不是玩具Demo，是生产级、可商用的完整系统<br/>
          <strong>2)</strong> 三位数以上的细分专家Agent集群——覆盖你业务的每一个决策节点<br/>
          <strong>3)</strong> 企业管理系统深度集成（飞书/钉钉/企微CLI无痛接入），员工0学习成本<br/>
          <strong className="text-[var(--brand-glow)]">这是高价值、高回报的AI企业服务，不是卖软件，是帮你重构核心竞争力。</strong>
        </p>
      </div>
    </div>
  ),

  // --- 效率对比表格详情 ---
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
        大模型目前每半年完成一次底层认知突进，导致应用层的壁垒搭建时间被极度压缩。资本和市场给予传统企业的数字化缓冲期仅剩 <strong className="text-[#22d665]">18 个月</strong>，逾期将陷入成本结构被跨代际碾压的"绝望谷谷底"。
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
        借助具备联网搜索能力的研报 Agent（如 Perplexity / 秘塔），只需输入竞品名称与指定调研维度，30分钟内完成全网数千页信息的爬取、筛选、图表化和总结归因，不仅免去了"两人一周"的手工梳理，且逻辑严密性甚至超过了初中级分析师。
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

  // --- 员工心理 ---
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
        <div className="bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-subtle)]">
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
              <p className="text-[var(--text-secondary)]"><b>重新定义"人效"：</b> AI 帮你省下的时间，不是为了裁掉你，而是为了让你去干原来"没精力去做的高价值事情"，例如更深度的客户面谈、战略思考。</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="text-[var(--brand-glow)] mt-1">•</div>
              <p className="text-[var(--text-secondary)]"><b>先从最好玩的场景入手：</b> 不要一上来就强推繁杂的系统对接，先通过 AI 写请假邮件、AI 润色周报这些轻量级触点，让全员尝到"爽感"。</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),

  // --- 老板误区详情 ---
  "myth_cost": (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#2D2A26]">"AI太贵了"——真的吗？</h3>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        一个残酷的现实：你现在花在一个初级运营身上的月薪（含社保、办公、管理成本），大约 <strong>¥8,000-12,000</strong>。而一个 GPT-5.4 API 调用的成本？每100万字约 <strong>¥3</strong>。一个 Coze/Dify 工作流的月使用费？<strong>¥0（免费版就够用）</strong>。
      </p>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        真正的成本不在AI工具本身，而在你不用AI时，每天都在多花的那些人力成本。<strong className="text-[#2D2A26]">不用AI才是最贵的选择。</strong>
      </p>
    </div>
  ),
  "myth_unstable": (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#2D2A26]">"AI不稳定"——是的，如果你不会用</h3>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        2023年的AI确实会"胡说八道"（幻觉率高达15-20%）。但2026年的GPT-5.4、Claude 4.5的幻觉率已降至 <strong>3%以下</strong>。关键在于：设计好提示词（Prompt Engineering）+ 设置校验流程（Human-in-the-loop），AI的准确率可以超过初级员工。
      </p>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        有位老板说"AI帮我写的合同有错"——那你有没有想过，你的实习生写的合同<strong className="text-[#2D2A26]">错误率更高</strong>，只是你已经习惯了人犯错？
      </p>
    </div>
  ),
  "myth_replace": (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#2D2A26]">"AI会取代我的员工"——角度不对</h3>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        AI取代的是<strong>任务</strong>，不是<strong>岗位</strong>。它接管的是人不应该花时间做的低价值重复劳动——数据录入、格式排版、信息搜集、固定话术回复。
      </p>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        真实数据：用了AI的公司，<strong className="text-[#2D2A26]">裁员率反而更低</strong>。因为同样的人做了5倍的产出，公司增长更快，需要更多人去开拓新业务。这不是裁员工具，是增长工具。
      </p>
    </div>
  ),
  "myth_wait": (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#2D2A26]">"等技术成熟再上"——最危险的想法</h3>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        你的竞争对手不会等你。在座各位想一想：如果你的同行已经用AI把获客成本降了40%、把销售响应时间从24小时变成3分钟——他报价就是比你低，响应就是比你快——你还有什么优势？
      </p>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        先用 <strong>80%可用的AI</strong> 跑起来，比追求100%完美再动手<strong className="text-[#2D2A26]">有效1000倍</strong>。因为AI在进化，你一边用一边学，你的对手也是。先发优势=组织学习曲线优势。
      </p>
    </div>
  ),
  "myth_buy": (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#2D2A26]">"买个系统就行了"——花钱解决不了的问题</h3>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        AI不是像ERP那样买来装上就完事了。它需要跟你的<strong>业务流程深度结合</strong>——你的客户画像、你的话术风格、你的产品参数、你的行业知识。这些东西，没有任何供应商比你更了解。
      </p>
      <p className="text-[var(--text-secondary)] leading-loose text-lg">
        所以正确路径是：先理解AI能做什么 → 对照自己的业务找切入点 → 小步快跑落地 → 迭代优化。<strong className="text-[#2D2A26]">这两天我们就是帮你走完这条路。</strong>
      </p>
    </div>
  ),

  "baiguoyuan": (
    <div className="space-y-8">
      <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] pb-6">
        <ShoppingBag size={40} className="text-[var(--brand-glow)]" />
        <div>
          <h3 className="text-3xl font-black text-[#2D2A26]">百果园：AI驱动的会员精细化运营</h3>
          <p className="text-[var(--text-muted)] text-lg mt-1">复购率提升35% / 会员生命周期价值翻倍</p>
        </div>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-loose">
        <p><b>痛点：</b>百果园作为万店规模的水果零售连锁，拥有8000万+会员。但传统的短信/APP推送活动千篇一律，打开率持续走低。会员沉默率高达60%——大量用户注册后再也不来。</p>
        <p><b>AI改造：</b>部署AI会员运营大脑，基于购买历史、时令偏好、地理位置、消费能力等多维画像，为每个会员生成个性化的触达方案——精准推送他爱吃的品类优惠、他常去的门店的到货通知。</p>
        <p><b>结果：</b>沉默会员激活率提升 <strong>200%</strong>，精准推送打开率从3%飙升至 <strong>18%</strong>，会员复购率提升 <strong>35%</strong>。这不是技术炫技，是直接反映在营收上的增量。</p>
      </div>
    </div>
  ),
};
