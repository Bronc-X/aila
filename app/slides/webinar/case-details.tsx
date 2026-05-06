import React from "react";
import {
  CheckCircle2, ChevronRight, Target, AlertTriangle,
  BarChart3, Image, ShoppingBag, Zap, XCircle, DollarSign, Lightbulb
} from "lucide-react";

export const caseDetails: Record<string, React.ReactNode> = {

  /* ━━━━━━ 案例① PYXL超级数据分析 ━━━━━━ */
  "pyxl": (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 flex items-center gap-3">
          <BarChart3 className="text-[var(--brand-glow)]" size={32} /> PYXL · 超级数据分析
        </h2>
        <p className="text-[var(--text-muted)] text-lg mt-1">10万行数据 → 3分钟出可执行洞察</p>
      </div>
      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg">
        <p><b className="text-[#2D2A26]">场景痛点：</b>企业每月产生海量销售数据、客户反馈、渠道ROI，散落在几十个Excel表格中。传统做法是安排3个分析师花5天整理，结果还可能带有主观偏差。老板等不起，决策靠直觉。</p>
        <p><b className="text-[#2D2A26]">PYXL 怎么做：</b>一键导入全量数据源（Excel/CSV/数据库/API），AI自动识别数据维度、清洗异常值、建立关联模型。用户只需用自然语言提问："哪个品类组合利润率最高？""上海区域的客户流失率为什么在涨？"——AI 3分钟给出交叉分析、趋势预测、可视化图表和具体的行动建议。</p>
        <p><b className="text-[#2D2A26]">真实结果：</b>某消费品公司用 AI 分析3年销售数据，发现了一个被团队忽略的高利润品类组合，重新调整产品矩阵后，季度利润<b>增长23%</b>，相当于多赚了<b>¥380万</b>。</p>
      </div>
      <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <p className="text-[var(--brand-glow)] font-bold flex items-center gap-2">
          <Lightbulb size={18} /> 启示：数据不值钱，洞察才值钱。AI帮你把埋在Excel里的金矿挖出来。
        </p>
      </div>
    </div>
  ),

  /* ━━━━━━ 案例② AI模特+产品生图 ━━━━━━ */
  "ai_model": (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 flex items-center gap-3">
          <Image className="text-[var(--brand-glow)]" size={32} /> AI模特 · 产品生图
        </h2>
        <p className="text-[var(--text-muted)] text-lg mt-1">一张白底图 → 无限风格、无限场景的商用大片</p>
      </div>
      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg">
        <p><b className="text-[#2D2A26]">传统成本：</b>一套产品图（模特+摄影师+场地+后期）= ¥10,000-28,000，周期7-14天。每季上新50个SKU，每个拍6组图，算一下这笔天文数字。</p>
        <p><b className="text-[#2D2A26]">AI生图流程：</b>上传产品白底图 → 选择目标人群（欧美/亚洲/中东） → AI自动匹配模特体型、肤色、姿势 → 生成街拍风、INS风、电商白底、杂志封面等多场景 → 一键出图100+张。</p>
        <p><b className="text-[#2D2A26]">额外收益：</b>以前A/B测试不同风格图的点击率是奢望（成本太高），现在生图成本为零，可以随意测试。某服装品牌通过AI生图A/B测试，点击转化率<b>提升35%</b>。</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-600 font-bold text-sm mb-1">传统拍摄成本</p>
          <p className="text-2xl font-black text-red-600">¥10,000-28,000</p>
          <p className="text-red-400 text-xs">每套 / 7-14天</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-600 font-bold text-sm mb-1">AI 生图成本</p>
          <p className="text-2xl font-black text-green-600">¥0</p>
          <p className="text-green-400 text-xs">每套 / 10分钟</p>
        </div>
      </div>
    </div>
  ),

  /* ━━━━━━ 案例③ 小红书爆款筛选+二创 ━━━━━━ */
  "xiaohongshu": (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h2 className="text-3xl font-black text-[#2D2A26] mb-2 flex items-center gap-3">
          <ShoppingBag className="text-[var(--brand-glow)]" size={32} /> 小红书 · 爆款AI筛选+二创
        </h2>
        <p className="text-[var(--text-muted)] text-lg mt-1">AI选品+AI文案+AI海报 = 全自动二创流水线</p>
      </div>
      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-lg">
        <p><b className="text-[#2D2A26]">🔍 AI选品：</b>实时抓取小红书全品类热门笔记，按互动量/增长率/竞争度三维评分。传统选品团队靠人工刷小红书2天才能整理出一份选品报告，AI 10分钟搞定，且覆盖面是人工的100倍。</p>
        <p><b className="text-[#2D2A26]">✍️ AI文案：</b>分析TOP100爆文的标题结构、正文节奏、emoji密度、种草话术。AI自动生成原生「小红书体」文案——看起来像真人写的，但效率提升360倍（3小时/篇 → 30秒/篇）。</p>
        <p><b className="text-[#2D2A26]">🎨 AI海报：</b>根据产品图+文案风格，自动生成小红书封面图。多尺寸多风格批量出图，不需要设计师。</p>
      </div>
      <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
        <p className="text-[var(--brand-glow)] font-bold">
          ★ 某美妆团队：3人用AI矩阵运营50个小红书号，月均笔记产出2000+条，获客成本降低72%。
        </p>
      </div>
    </div>
  ),

  /* ━━━━━━ 补充 Modal ━━━━━━ */

  "nvidia": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">NVIDIA 《2026 产业前瞻报告》</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        超过 <strong className="text-gradient">88%</strong> 的财富500强企业高管明确表示，在核心业务链整合大模型后，营收增长有直接受惠。
      </p>
    </div>
  ),

  "window": (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <h3 className="text-3xl font-black text-[#2D2A26]">转型生死线：18个月</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-loose">
        大模型每半年完成一次底层认知突进，应用壁垒搭建时间被极度压缩。传统企业的缓冲期仅剩 <strong className="text-[#22d665]">18个月</strong>。
      </p>
    </div>
  ),

  "chaos_detail": (
    <div className="space-y-8">
      <h3 className="text-3xl font-black text-[#2D2A26]">AI培训行业：鱼龙混杂的真相</h3>
      <div className="space-y-6">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="font-bold text-red-600 mb-3 text-lg">骗局一：卖课型</h4>
          <p className="text-[var(--text-secondary)]">录好视频卖你几千块，学完只会跟ChatGPT聊天。你的流程、数据、团队协作一个没变。<b>本质：信息差倒卖</b></p>
        </div>
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
          <h4 className="font-bold text-emerald-600 mb-3 text-lg">骗局二：卖工具型</h4>
          <p className="text-[var(--text-secondary)]">打着培训旗号卖SaaS订阅。不续费能力归零。<b>本质：工具锁定</b></p>
        </div>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-bold text-yellow-600 mb-3 text-lg">骗局三：空谈型</h4>
          <p className="text-[var(--text-secondary)]">请几个专家讲趋势PPT，听完激动，回去不知道第一步做什么。<b>本质：焦虑贩卖</b></p>
        </div>
      </div>
    </div>
  ),

  "employee_boss": (
    <div className="space-y-8">
      <h3 className="text-3xl font-black text-[#2D2A26]">老板与员工的割裂如何弥合</h3>
      <div className="bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--border-subtle)]">
        <h4 className="text-xl font-bold text-[#2D2A26] mb-4 flex items-center gap-2">
          <ChevronRight className="text-[var(--brand-glow)]" /> 破局方案
        </h4>
        <ul className="space-y-4 text-[var(--text-secondary)]">
          <li className="flex items-start gap-3"><span className="text-[var(--brand-glow)] mt-1">•</span><p><b>设立容错期：</b>鼓励尝试，初期探索不计绩效。</p></li>
          <li className="flex items-start gap-3"><span className="text-[var(--brand-glow)] mt-1">•</span><p><b>重新定义人效：</b>AI省下的时间做高价值工作，不是裁人。</p></li>
          <li className="flex items-start gap-3"><span className="text-[var(--brand-glow)] mt-1">•</span><p><b>先从轻量级入手：</b>先让员工尝到AI写邮件、润色周报的爽感。</p></li>
        </ul>
      </div>
    </div>
  ),

  /* ━━━━━━ Agent 架构深度解读 ━━━━━━ */
  "agent_arch": (
    <div className="space-y-8">
      <div className="border-b border-white/[0.06] pb-6">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Zap className="text-lime-500" size={32} /> Agent 架构：从单兵到军团
        </h2>
        <p className="text-neutral-500 text-lg mt-1">2026年AI最核心的能力跃迁——不是更聪明，而是会"协作"了</p>
      </div>
      <div className="space-y-6 text-neutral-400 leading-relaxed text-lg">
        <p><b className="text-white">什么是 Agent？</b> 简单说：以前的 AI 是"你问一句它答一句"的应答机器。而 Agent 是拥有<b className="text-lime-400">目标感</b>的 AI——你给它一个目标（比如"帮我分析这份销售数据并生成周报"），它会自己拆解任务、调用工具、校验结果，直到把事情做完。</p>
        <p><b className="text-white">什么是 Subagent / 多Agent协作？</b> 一个 Agent 做不完的复杂任务，会被自动拆解成多个子任务，分配给不同的专业 Subagent 并行执行。就像一个项目经理把任务分给设计、文案、投放三个团队同时干——只不过这些"团队"全部是 AI，且<b className="text-lime-400">秒级完成</b>。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <h4 className="text-lime-500 font-bold text-sm mb-3">Hermes Agent</h4>
          <p className="text-neutral-500 text-sm leading-relaxed">自学习型私人 AI。每次完成任务后，会把成功经验提炼成"技能文档"存下来。<b className="text-white">用得越多越聪明</b>——像一个会自己进化的员工。</p>
        </div>
        <div className="p-5 rounded-xl border border-lime-600/20 bg-lime-600/[0.04]">
          <h4 className="text-lime-500 font-bold text-sm mb-3">Claude Managed Agent</h4>
          <p className="text-neutral-500 text-sm leading-relaxed">企业级托管团队。不需要你搭服务器、写代码。直接部署一个<b className="text-white">自主决策的 AI 团队</b>，它们会自动分工、互相校验、汇整输出。</p>
        </div>
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <h4 className="text-lime-500 font-bold text-sm mb-3">Subagent 并行架构</h4>
          <p className="text-neutral-500 text-sm leading-relaxed">把复杂任务拆成独立子任务，多个 Agent 同时执行。一个人类需要 3 天的工作，<b className="text-white">5 个 Subagent 并行只需 3 分钟</b>。</p>
        </div>
      </div>
      <div className="p-6 bg-lime-600/[0.06] rounded-xl border border-lime-600/20">
        <p className="text-lime-400 text-sm font-semibold">★ 核心洞察：2026年的竞争不再是"谁的AI更聪明"，而是<span className="text-white">谁能把AI编排成一支纪律严明的数字军团</span>。单兵作战的时代已经过去了。</p>
      </div>
    </div>
  ),

  /* ━━━━━━ 硅基军团实战案例 ━━━━━━ */
  "silicon_army": (
    <div className="space-y-8">
      <div className="border-b border-white/[0.06] pb-6">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Target className="text-lime-500" size={32} /> 硅基军团：3人干出20人的活
        </h2>
        <p className="text-neutral-500 text-lg mt-1">一个真实的跨境电商 Agent 协作案例</p>
      </div>
      <div className="space-y-6 text-neutral-400 leading-relaxed text-lg">
        <p><b className="text-white">团队规模：</b>3 个人——1 个运营负责人 + 1 个设计 + 1 个客服。但他们管着 <b className="text-lime-400">8 个国家的站点</b>，月 GMV 超过 200 万。</p>
        <p><b className="text-white">怎么做到的？</b> 他们搭建了一套多 Agent 协作体系：</p>
      </div>
      <div className="space-y-4">
        {[
          { step: "① 选品 Agent（Hermes）", desc: "每天自动扫描全网热销品，生成选品报告。过去需要运营主管刷 3 天的数据，现在 10 分钟搞定。", time: "10分钟" },
          { step: "② 文案 Agent（Claude）", desc: "输入一个产品链接，自动生成日/英/德/法/西/阿 6 种语言的 SEO 标题 + 卖点描述 + A+ 图文。", time: "2分钟/SKU" },
          { step: "③ 视觉 Agent（Subagent）", desc: "设计师只需拍一张白底图，AI 自动生成 8 种场景图 + 多尺寸广告素材 + 短视频脚本。", time: "5分钟/套" },
          { step: "④ 客服 Agent（7×24）", desc: "6 种语言实时应答询盘，复杂问题自动升级到人工。凌晨 3 点的中东客户也不会流失。", time: "秒级响应" },
          { step: "⑤ 指挥中枢（Orchestrator）", desc: "所有 Agent 的任务调度、进度追踪、异常报警——全自动。运营负责人每天只需看 15 分钟日报。", time: "持续运行" },
        ].map(item => (
          <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <div className="shrink-0">
              <span className="text-emerald-400 font-mono text-xs">{item.time}</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{item.step}</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-center">
          <p className="text-red-400/70 text-xs mb-1">传统团队配置</p>
          <p className="text-2xl font-black text-red-400/60 line-through">20人 + ¥180万/年</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
          <p className="text-emerald-400 text-xs mb-1">Agent 军团配置</p>
          <p className="text-2xl font-black text-white">3人 + ¥8万/年</p>
        </div>
      </div>
    </div>
  ),
};
