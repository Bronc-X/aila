export type WorkMetric = {
  label: string;
  value: string;
};

export type WorkMedia = {
  type: "image" | "video";
  src: string;
  alt: string;
  caption: string;
  poster?: string;
};

export type EvidenceLevel =
  | "real_delivery"
  | "real_product"
  | "verified_prototype"
  | "reference_build"
  | "pending_evidence";

export type CaseEvidence = {
  level: EvidenceLevel;
  sourceProject: string;
  evidenceAssets: string[];
  liveRoute?: string;
  deliverables: string[];
  clientPermission: "confirmed" | "pending" | "internal_only";
  metricsSource: "run_log" | "delivery_record" | "client_confirmed" | "unverified";
  note: string;
};

export type WorkItem = {
  slug: string;
  k: string;
  title: string;
  sub: string;
  summary: string;
  image?: string;
  media?: WorkMedia[];
  href?: string;
  metrics: WorkMetric[];
  context: string;
  approach: string[];
  outcome: string[];
  nextHref?: string;
  nextLabel?: string;
  nativeRoute?: string;
  visibility?: "public" | "archive";
  evidenceStatus?: "verified" | "pending";
  evidence?: CaseEvidence;
};

export const deliveryCases: WorkItem[] = [
  {
    slug: "survey-decision-system",
    k: "01",
    title: "咨询行业问卷统计与智能决策系统",
    sub: "企业交付案例",
    summary: "把问卷、统计和报告生成放到一条流程里。",
    image: "/cases/media__1775491662965.jpg",
    metrics: [
      { label: "周期", value: "5 天交付" },
      { label: "人力", value: "节省约 2 周" },
      { label: "效能", value: "提升 300%" },
    ],
    context: "原流程依赖人工整理问卷、判断数据口径、再手写报告。每次复用都要重新对齐字段和结论，速度慢，也容易在交接中走样。",
    approach: [
      "先固定问卷字段、评分口径和报告结构，让输入不再散落。",
      "把统计、洞察和报告生成串成一条可重复运行的流程。",
      "保留人工复核位置，方便顾问在关键判断处补充经验。",
    ],
    outcome: [
      "交付记录显示：5 天完成业务梳理与搭建。",
      "后续每次运行约 10 分钟，报告产出稳定。",
      "适合继续扩展成咨询公司的轻量决策后台。",
    ],
    evidence: {
      level: "real_delivery",
      sourceProject: "咨询行业问卷统计与智能决策交付",
      evidenceAssets: ["/cases/media__1775491662965.jpg"],
      deliverables: ["问卷字段口径", "统计与洞察流程", "报告生成结构"],
      clientPermission: "internal_only",
      metricsSource: "delivery_record",
      note: "真实交付项目。对外使用匿名项目描述；效率指标需在正式方案阶段补充原始记录。",
    },
    nextHref: "/contact",
    nextLabel: "聊类似流程",
  },
  {
    slug: "ecommerce-product-radar",
    k: "02",
    title: "电商爆品极速筛查雷达",
    sub: "企业交付案例",
    summary: "把人工刷内容整理成一个可复核的候选池。",
    image: "/cases/media__1775491662974.png",
    metrics: [
      { label: "速度", value: "24h 到 5 分钟" },
      { label: "规模", value: "300+ 爆品池" },
      { label: "效率", value: "30 倍选品" },
    ],
    context: "团队过去靠人工刷内容、记链接、做表格，一天筛不到 10 个首品。真正的问题不在辛苦，而在样本太小，判断也不稳定。",
    approach: [
      "先定义低粉爆品筛选条件，把互动、增长和账号体量纳入判断。",
      "把近期内容批量拉入候选池，再做二次过滤。",
      "给业务方留下人工复核口，避免只看热度而忽略商品匹配度。",
    ],
    outcome: [
      "5 分钟锁定 300+ 近期候选爆品。",
      "选品动作从个人经验变成团队可复盘流程。",
      "后续可接入素材生产和投放测试。",
    ],
    evidence: {
      level: "real_delivery",
      sourceProject: "电商选品筛查流程交付",
      evidenceAssets: ["/cases/media__1775491662974.png"],
      deliverables: ["候选商品池", "筛选规则", "人工复核入口"],
      clientPermission: "internal_only",
      metricsSource: "unverified",
      note: "真实交付项目。页面保留项目资产；涉及效率口径时需与项目原始运行记录核对。",
    },
    nextHref: "/tools",
    nextLabel: "进入 AILA 系统",
  },
  {
    slug: "commercial-poster-workshop",
    k: "03",
    title: "商用级电商自动化海报工坊",
    sub: "企业交付案例",
    summary: "商品图、模特图和投放尺寸，放进同一套出图流程。",
    image: "/cases/media__1775491663001.png",
    metrics: [
      { label: "替代", value: "棚拍/模特费" },
      { label: "成本", value: "年省约 45 万" },
      { label: "产出", value: "千量级物料" },
    ],
    context: "电商投放需要大量图，但摄影棚、模特、设计排期都很重。需求不是做一张好看的图，而是稳定生产一批可投放、可测试、可迭代的物料。",
    approach: [
      "围绕商品图、模特图和场景风格建立素材生产流程。",
      "把尺寸、渠道和风格版本前置成参数。",
      "保留人工选片与修正节点，让产出更接近商业投放标准。",
    ],
    outcome: [
      "日常素材生产从单张设计转向批量出品。",
      "减少棚拍和模特成本，提升 A/B 测试频率。",
      "可继续接入短视频脚本与多平台文案。",
    ],
    evidence: {
      level: "real_delivery",
      sourceProject: "商业级电商自动化海报工坊交付",
      evidenceAssets: ["/cases/media__1775491663001.png", "/tools-showcase/commercial-poster-workshop.webp"],
      deliverables: ["批量物料生产", "风格参数", "投放尺寸版本"],
      clientPermission: "pending",
      metricsSource: "unverified",
      note: "真实交付项目。客户公开授权与成本、产出指标来源仍待补齐。",
    },
    nextHref: "/tools",
    nextLabel: "进入 AILA 系统",
  },
];

export const productLabs: WorkItem[] = [
  {
    slug: "aila",
    k: "04",
    title: "AILA",
    sub: "企业工具矩阵",
    summary: "把获客、销售、验证、行政、客服、老板仪表盘和内容项目整理成可演示的企业工具矩阵。",
    image: "/tools-showcase/activity-plan-editorial-hero.webp",
    media: [
      {
        type: "image",
        src: "/tools-showcase/activity-plan-editorial-hero.webp",
        alt: "AILA 海报方案助手展示页",
        caption: "海报方案助手：从活动信息、品牌物料到方案页与 PPTX 初稿。",
      },
      {
        type: "image",
        src: "/tools-showcase/xhs-matrix-editorial-hero.webp",
        alt: "AILA 小红书矩阵展示页",
        caption: "内容矩阵：保留人工筛选、审核和发布确认的生产界面。",
      },
      {
        type: "image",
        src: "/tools-showcase/commercial-poster-workshop.webp",
        alt: "AILA 商业海报工坊展示",
        caption: "商业素材工坊：把商品图、场景和投放尺寸收进稳定出品流程。",
      },
    ],
    metrics: [
      { label: "模块", value: "8 个工作台" },
      { label: "入口", value: "工具大厅" },
      { label: "状态", value: "可演示" },
    ],
    context: "AILA 承接旧工具区和旧作品集中的企业工具方向。重点不在堆功能名，而在让企业看到哪些流程可以先被接住、先被验证。",
    approach: [
      "把获客、销售、验证、运营、行政、客服和内容项目拆成独立工作台。",
      "每个工作台保留可操作界面，让用户能继续下钻。",
      "对外只展示结构和流程，真实落地再按客户系统与权限接入。",
    ],
    outcome: [
      "从静态介绍变成可进入、可试用的工具矩阵。",
      "适合作为企业诊断后的第一层方案地图。",
      "后续可以把模块详情统一到 /tools/[module] 动态模板。",
    ],
    nextHref: "/tools",
    nextLabel: "进入 AILA 系统",
    nativeRoute: "/tools",
  },
  {
    slug: "antios",
    k: "05",
    title: "Antios",
    sub: "健康状态运行时",
    summary: "以 Apple Watch 生理参数为输入，探索个人健康状态的记录、解释和提醒方式。",
    media: [
      {
        type: "video",
        src: "/antios.mp4",
        alt: "Antios iOS 产品运行视频",
        caption: "iOS 实机界面：状态记录、解释与反馈被放进同一条移动端路径。",
      },
    ],
    metrics: [
      { label: "平台", value: "iOS 原生" },
      { label: "输入", value: "健康传感器" },
      { label: "形态", value: "产品实验" },
    ],
    context: "Antios 来自旧作品集里的健康产品方向。它关心的不是聊天入口，而是怎样让设备持续记录的身体信号形成可理解、可反馈的状态。",
    approach: [
      "以 HRV、静息心率、睡眠分期等数据作为第一输入。",
      "在本地压缩成强类型状态变量，再进入推理链路。",
      "用移动端界面承接状态解释、提醒和反馈。",
    ],
    outcome: [
      "形成清晰的产品叙事和交互方向。",
      "适合作为个人健康 Agent 的原型档案。",
      "核心仍处于产品实验阶段。",
    ],
    nextHref: "/portfolio#antios",
    nextLabel: "查看旧档案",
  },
  {
    slug: "quantmax",
    k: "06",
    title: "QuantMAx",
    sub: "量化信号产品实验",
    summary: "把量化信号的观察、解释和风险提示做成产品界面实验。",
    image: "/now/quant-strategy-analysis.jpg",
    media: [
      {
        type: "image",
        src: "/now/quant-strategy-analysis.jpg",
        alt: "QuantMAx 量化策略分析界面",
        caption: "公开部分只展示候选筛选、信号解释和风险提示，不展示策略核心。",
      },
    ],
    metrics: [
      { label: "领域", value: "A 股分钟级" },
      { label: "策略", value: "闭源核心" },
      { label: "形态", value: "界面实验" },
    ],
    context: "QuantMAx 是旧作品集里的量化策略实验，重点展示产品叙事、信号解释和界面方向，不公开策略核心，也不作为投资建议。",
    approach: [
      "观察热度排名、成交额、时间窗口和价格反应之间的错位。",
      "把策略参数做成可阅读的产品语言。",
      "用界面呈现信号、风险提示和解释结果，而不是暴露底层策略代码。",
    ],
    outcome: [
      "保留为产品实验档案。",
      "适合展示跨领域工程能力。",
      "如需演示，应以现场方式进行，不外放核心策略。",
    ],
    nextHref: "/portfolio#quantmax",
    nextLabel: "查看旧档案",
  },
  {
    slug: "training-system",
    k: "07",
    title: "2026 闭门课训练系统",
    visibility: "archive",
    sub: "课程与交付方法",
    summary: "把两天闭门课沉淀成认知、案例、工具和企业路线图四个连续环节。",
    image: "/ai_bootcamp_avatar.png",
    media: [
      {
        type: "image",
        src: "/ai_bootcamp_avatar.png",
        alt: "2026 闭门课训练系统主视觉",
        caption: "训练系统主视觉：课程不是热闹场，而是企业路线图的起点。",
      },
      {
        type: "image",
        src: "/speaker-toni.jpg",
        alt: "闭门课讲师 Toni",
        caption: "主讲与项目拆解：从业务现场、数据管道到可运行系统。",
      },
      {
        type: "image",
        src: "/speaker-xie.jpg",
        alt: "闭门课联合讲师",
        caption: "联合讲师视角：把认知、案例和执行方法放进连续训练。",
      },
    ],
    metrics: [
      { label: "时长", value: "2 天" },
      { label: "场次", value: "4 个半天" },
      { label: "资料", value: "Slides + 工具" },
    ],
    context: "课程不应该只是热闹场。它要让企业主知道自己先改哪条业务链、谁负责、用什么工具、下一步怎么推进。",
    approach: [
      "第一天建立判断，拆行业案例和现场问题。",
      "第二天进入工具实操，把内容收束成企业自己的路线图。",
      "课后把可复用流程继续接到 AILA 和企业合作诊断。",
    ],
    outcome: [
      "课程结构已沉淀为可复用训练系统。",
      "讲义、案例和工具入口可以从同一详情页进入。",
      "后续不再单独保留 /training 主入口。",
    ],
    nextHref: "/slides",
    nextLabel: "查看讲义",
  },
  {
    slug: "lusie",
    k: "08",
    title: "Lusie",
    sub: "航模生成与交付链路",
    summary: "从概念输入走到图像、3D 模型、任务进度、历史记录和 STL 下载。",
    image: "/lusie/concept-previews/modern-fighter-preview.png",
    media: [
      {
        type: "video",
        src: "/print-loading-animation/print-loading-loop.mp4",
        poster: "/print-loading-animation/print-loading-poster.jpg",
        alt: "Lusie 生成任务进度动效",
        caption: "生成任务的等待画面：长任务保持状态可见，并为失败和下载交付留下位置。",
      },
      {
        type: "image",
        src: "/lusie/concept-previews/modern-fighter-preview.png",
        alt: "Lusie 现代战斗机概念预览",
        caption: "概念预览：文本与参数先形成可检查图像，再进入 3D 建模。",
      },
      {
        type: "image",
        src: "/lusie/concept-previews/classic-tall-ship-preview.png",
        alt: "Lusie 古典帆船概念预览",
        caption: "同一条生产链路支持不同模型类别，并保留来源和版本关系。",
      },
    ],
    metrics: [
      { label: "链路", value: "概念图到 STL" },
      { label: "状态", value: "进度可追踪" },
      { label: "交付", value: "历史与下载" },
    ],
    context: "概念生成只是起点。真正可交付的航模工作台还要处理任务状态、模型来源、失败恢复、历史记录和最终文件下载。",
    approach: [
      "先把展示入口与生成工作台分开，让外部介绍和内部操作各自清楚。",
      "用站内 API 协调概念图、3D 建模、进度查询和文件交付。",
      "保存模型来源与历史记录，让下载结果可以追溯到生成过程。",
    ],
    outcome: [
      "公开展示、生成工作台和历史记录已进入同一站点。",
      "长任务的进度、失败与下载路径有明确反馈。",
      "项目可以继续承接航模赛事、机构服务和模型资产管理。",
    ],
    nextHref: "/lusie",
    nextLabel: "进入 Lusie",
    nativeRoute: "/lusie",
  },
  {
    slug: "lotus",
    k: "09",
    title: "Lotus × Toni",
    sub: "Agent Operating Layer",
    summary: "把工程协议、质量门禁、技能路由和验证方式沉淀成可复用的项目启动系统。",
    image: "/brand/toni-lotus/lotus-runtime-project-card.png",
    media: [
      {
        type: "image",
        src: "/brand/toni-lotus/lotus-runtime-hero.png",
        alt: "LOTUS Runtime Wordmark 项目主视觉",
        caption: "新版几何字标以独立 Sync Kernel 表达运行、路由、验证与完成状态。",
      },
      {
        type: "image",
        src: "/brand/toni-lotus/lotus-runtime-visual-system-board.png",
        alt: "LOTUS Runtime Wordmark 视觉系统板",
        caption: "Ink、Paper、Sync Green 与六个运行时状态被固化为可复用的品牌契约。",
      },
      {
        type: "image",
        src: "/brand/toni-lotus/lotus-runtime-motion-master.png",
        alt: "LOTUS Runtime Wordmark Lottie 动态母版",
        caption: "纯矢量 Lottie 母版支持 IDLE、BOOT、RESOLVE、ROUTE、VERIFY 与 COMPLETE。",
      },
    ],
    metrics: [
      { label: "形态", value: "开源系统" },
      { label: "核心", value: "规则与验证" },
      { label: "用途", value: "项目启动层" },
    ],
    context: "Agent 协作容易把规则留在聊天里，换项目、换会话后就丢失。Lotus 的目标是把稳定约束写进项目可读取、可执行、可验证的表面。",
    approach: [
      "把工程协议、意图路由和质量门禁写成项目级规则。",
      "把调研、调试、前端、发布等流程沉淀为按需读取的技能。",
      "用测试、基线和交付契约证明规则真正进入执行，而不是停在文档。",
    ],
    outcome: [
      "新项目可以从统一工作协议开始，而不是每次重新口头对齐。",
      "规则、技能和验证方式能够持续复用。",
      "Lotus 成为 FDE 交付方法的工程化资产层。",
    ],
    nextHref: "https://github.com/Bronc-X/Lotus",
    nextLabel: "查看开源仓库",
  },
  {
    slug: "cosic",
    k: "10",
    title: "Cosic",
    sub: "Agent Music 桌面系统",
    summary: "围绕听歌、找歌、歌单策划和本地播放控制构建的桌面音乐产品。",
    image: "/now/cosic-01-home.png",
    media: [
      {
        type: "image",
        src: "/now/cosic-01-home.png",
        alt: "Cosic 桌面音乐系统首页",
        caption: "桌面首页：音乐理解、播放控制和场景入口集中在一个可持续使用的界面。",
      },
      {
        type: "image",
        src: "/now/cosic-02-weather.png",
        alt: "Cosic 天气场景音乐界面",
        caption: "场景推荐：天气、时间和听歌偏好成为歌单策划的输入。",
      },
    ],
    metrics: [
      { label: "形态", value: "桌面应用" },
      { label: "输入", value: "音乐与场景" },
      { label: "动作", value: "理解与播放" },
    ],
    context: "音乐产品不能只停在推荐文本。Cosic 需要进入桌面环境，理解用户当前场景，并真正控制本地播放与歌单组织。",
    approach: [
      "把音乐理解、搜索、歌单策划和播放控制拆成清楚模块。",
      "让天气、时间和用户偏好成为可解释的推荐输入。",
      "在桌面端保留实时反馈，让用户知道系统正在理解还是正在执行。",
    ],
    outcome: [
      "形成可运行的桌面音乐系统，而不是聊天演示。",
      "场景推荐与本地播放进入同一条交互路径。",
      "复杂运行环境、语音链路和桌面反馈得到真实验证。",
    ],
    nextHref: "https://github.com/Bronc-X/Cosic",
    nextLabel: "查看开源仓库",
  },
  {
    slug: "antianxiety",
    k: "11",
    title: "AntiAnxiety",
    sub: "个人健康管理闭环",
    summary: "围绕训练计划、身体状态、复盘反馈和行动提醒构建的健身智能体产品。",
    image: "/now/antianxiety-01-dashboard.png",
    media: [
      {
        type: "image",
        src: "/now/antianxiety-01-dashboard.png",
        alt: "AntiAnxiety 训练看板",
        caption: "训练看板：计划、状态和完成情况在同一界面持续更新。",
      },
      {
        type: "image",
        src: "/now/antianxiety-02-os-hub.png",
        alt: "AntiAnxiety OS Hub",
        caption: "OS Hub：把训练、恢复和日常行动组织成个人运行系统。",
      },
      {
        type: "image",
        src: "/now/antianxiety-03-science.png",
        alt: "AntiAnxiety 科学方案页面",
        caption: "科学方案：解释依据、阶段目标和执行动作一起呈现。",
      },
      {
        type: "image",
        src: "/now/antianxiety-04-max-chat.png",
        alt: "AntiAnxiety Max 对话界面",
        caption: "Max 对话：对话只负责承接反馈，核心仍是可执行的健康路径。",
      },
    ],
    metrics: [
      { label: "领域", value: "健身健康" },
      { label: "闭环", value: "计划到复盘" },
      { label: "状态", value: "持续迭代" },
    ],
    context: "健康产品最容易停在泛化建议。AntiAnxiety 把计划、训练记录、身体状态和复盘放在一起，要求每次反馈都能落到下一步行动。",
    approach: [
      "先建立训练与恢复的状态结构，再承接对话和解释。",
      "把计划、完成情况和身体反馈放进连续看板。",
      "用真实使用反馈修正提醒节奏与行动建议。",
    ],
    outcome: [
      "形成从训练计划到复盘反馈的产品闭环。",
      "核心界面已经能够展示连续状态，而不是单次回答。",
      "项目继续以真实使用数据打磨方向。",
    ],
    nextHref: "https://www.antianxiety.app",
    nextLabel: "打开产品站点",
  },
  {
    slug: "bid-agent",
    k: "12",
    title: "智能招标智能体",
    sub: "投标资料与标书工作台",
    summary: "覆盖招标文件解析、评分规则、强制条款、项目知识库和方案材料的本地工作台。",
    image: "/now/bid-data-management-desktop.png",
    media: [
      {
        type: "video",
        src: "/projects/bid-agent/bid-agent-walkthrough.mp4",
        poster: "/now/bid-data-management-desktop.png",
        alt: "智能招标智能体标书制作流程录屏",
        caption: "运行录屏：从招标文件解析、条款与评分点提取，到章节匹配和标书内容生成的连续操作过程。",
      },
      {
        type: "image",
        src: "/now/bid-data-management-desktop.png",
        alt: "智能招标智能体桌面工作台",
        caption: "桌面工作台：文件、评分规则、强制条款和项目资料被放进同一处理界面。",
      },
    ],
    metrics: [
      { label: "场景", value: "企业投标" },
      { label: "重点", value: "漏项控制" },
      { label: "形态", value: "本地工作台" },
    ],
    context: "投标资料多、版本多、强制条款密集。只做文档问答无法承担交付风险，系统必须把文件来源、评分规则和核对动作组织清楚。",
    approach: [
      "把招标文件、企业资料和项目知识库分层管理。",
      "提取评分规则与强制条款，并保留人工核对位置。",
      "让方案生成回到材料依据，避免脱离原文编写。",
    ],
    outcome: [
      "资料、规则和方案材料进入同一工作台。",
      "关键漏项有明确核对路径。",
      "适合继续接入企业权限、模板和交付流程。",
    ],
    nextHref: "https://github.com/raoyiyi4-blip/bid_data_management",
    nextLabel: "查看项目仓库",
  },
  {
    slug: "dewu-image",
    k: "13",
    title: "得物生图模型",
    sub: "企业生产案例",
    summary: "商品图合成、批量处理、质检和 ZIP 交付，放在一个工作台里。",
    image: "/projects/dewu/home.png",
    media: [
      {
        type: "image",
        src: "/projects/dewu/home.png",
        alt: "得物生图模型工作台首页",
        caption: "工作台：商品图、背景匹配与批量任务进入同一生产界面。",
      },
      {
        type: "image",
        src: "/projects/dewu/review.png",
        alt: "得物生图模型质检界面",
        caption: "质检：保留批次状态、结果复核和异常处理。",
      },
      {
        type: "image",
        src: "/projects/dewu/result.png",
        alt: "得物生图模型处理结果",
        caption: "结果：单张与 ZIP 交付都回到可核对的输出。",
      },
    ],
    metrics: [
      { label: "场景", value: "商品上身图" },
      { label: "处理", value: "批量合成" },
      { label: "交付", value: "质检 + ZIP" },
    ],
    context: "项目不是泛化的生图展示，而是把商品图、背景选择、批次处理、人工复核和最终交付接在一起。",
    approach: [
      "把商品素材、背景候选和处理批次放进同一工作台。",
      "为超时、重试、复核和下载保留明确状态。",
      "用真实处理结果检查一致性，再形成可交付压缩包。",
    ],
    outcome: [
      "批量处理与结果复核进入同一条链路。",
      "保留工作台截图和处理结果作为项目证据。",
      "后续可继续接入更多商品规格与质检规则。",
    ],
    evidence: {
      level: "real_product",
      sourceProject: "得物生图模型生产工作台",
      evidenceAssets: ["/projects/dewu/home.png", "/projects/dewu/review.png", "/projects/dewu/result.png"],
      deliverables: ["批处理工作台", "质检复核", "ZIP 交付"],
      clientPermission: "pending",
      metricsSource: "unverified",
      note: "真实运行系统项目。公开客户名称、正式运行数据与授权范围需单独确认。",
    },
    nextHref: "/contact",
    nextLabel: "聊类似生产流程",
  },
  {
    slug: "kemo",
    k: "14",
    title: "Kemo",
    sub: "研究交付系统",
    summary: "访谈录音、转写、术语复核、研究备忘录与公众号文章。",
    image: "/projects/kemo/key-visual.png",
    media: [
      {
        type: "image",
        src: "/projects/kemo/key-visual.png",
        alt: "Kemo 项目视觉",
        caption: "Kemo：把访谈资料与研究交付放进一条可回看的工作流。",
      },
      {
        type: "image",
        src: "/projects/kemo/login.png",
        alt: "Kemo 研究工作台登录入口",
        caption: "本地实际运行的产品入口；登录后进入访谈任务、术语复核与研究交付工作台。",
      },
    ],
    metrics: [
      { label: "输入", value: "访谈录音" },
      { label: "过程", value: "术语复核" },
      { label: "输出", value: "研究交付" },
    ],
    context: "研究资料的难点不只是转写，而是术语、上下文、复核和最终表达不能在交接中丢失。",
    approach: [
      "先保留录音、转写和术语之间的对应关系。",
      "把复核动作放进交付前流程，避免错误直接进入文章。",
      "让研究备忘录和公众号文章都能回到原始材料。",
    ],
    outcome: [
      "形成从访谈到研究内容的连续交付路径。",
      "产品入口已完成本地运行验证，内部工作台待现有账号登录后补录。",
      "不把它重复写成团队 Agent 或知识库模块介绍。",
    ],
    nextHref: "/contact",
    nextLabel: "聊研究交付",
  },
  {
    slug: "violinmaster",
    k: "15",
    title: "ViolinMaster",
    sub: "音乐教授模型工作台",
    summary: "练习录音、曲谱理解、教师反馈与练习诊断。",
    image: "/now/violinmaster-desktop.png",
    media: [
      {
        type: "image",
        src: "/now/violinmaster-desktop.png",
        alt: "ViolinMaster 桌面工作台",
        caption: "桌面工作台：练习录音、曲谱和反馈集中在同一界面。",
      },
    ],
    metrics: [
      { label: "输入", value: "练习录音" },
      { label: "理解", value: "曲谱与演奏" },
      { label: "输出", value: "诊断反馈" },
    ],
    context: "ViolinMaster 关注的是可复核的练习反馈，不是泛化聊天。每次建议都要能落回录音、曲谱和具体段落。",
    approach: [
      "把练习录音与曲谱段落建立对应关系。",
      "将教师反馈拆成可执行的练习动作。",
      "用桌面工作台承接持续练习与复盘。",
    ],
    outcome: [
      "形成专家模型的真实桌面展示。",
      "反馈路径可以回到具体练习材料。",
      "作为自有项目纳入最新案例。",
    ],
    nextHref: "/contact",
    nextLabel: "聊专家工作台",
  },
  {
    slug: "xhs-automation",
    k: "16",
    title: "小红书自动化工具",
    sub: "内容生产与审核",
    summary: "选题、素材、笔记草稿、质量检查与发布确认。",
    image: "/now/auto-red-book-github.png",
    media: [
      {
        type: "image",
        src: "/now/auto-red-book-github.png",
        alt: "小红书自动化工具项目截图",
        caption: "项目截图：选题、素材和审核动作被放进内容生产线。",
      },
      {
        type: "image",
        src: "/tools-showcase/xhs-matrix-editorial-hero.webp",
        alt: "小红书内容矩阵展示页",
        caption: "内容矩阵：候选稿可以批量，结论仍由人确认。",
      },
    ],
    metrics: [
      { label: "输入", value: "选题与素材" },
      { label: "过程", value: "质量检查" },
      { label: "出口", value: "发布确认" },
    ],
    context: "内容生产不等于把同一篇内容改写多遍。项目重点是让证据、素材、候选稿和审核记录在同一条线上。",
    approach: [
      "先建立选题档案，再匹配真实素材。",
      "按账号和渠道生成候选草稿，保留质量检查。",
      "发布前保留人工确认，不把结论交给批量生成。",
    ],
    outcome: [
      "已有仓库截图与案例页资产。",
      "工具页负责具体案例，宇宙只保留项目入口。",
      "可继续接入团队 Agent 的任务分发。",
    ],
    nextHref: "/tools/auto-red-book",
    nextLabel: "查看内容案例",
    nativeRoute: "/tools/auto-red-book",
  },
  {
    slug: "video-platform",
    k: "17",
    title: "图生视频平台",
    sub: "产品一致性与分镜生产链",
    summary: "四视图上传、分镜、产品一致性约束、视频生成与后期交付。",
    image: "/projects/video-platform/home.png",
    media: [
      {
        type: "image",
        src: "/projects/video-platform/home.png",
        alt: "图生视频平台工作台",
        caption: "工作台：参考图、分镜和生成设置处在同一生产上下文。",
      },
      {
        type: "image",
        src: "/projects/video-platform/storyboard.png",
        alt: "图生视频平台分镜步骤",
        caption: "分镜步骤：先约束产品一致性，再进入视频生成与后期。",
      },
    ],
    metrics: [
      { label: "输入", value: "四视图" },
      { label: "控制", value: "Harness 约束" },
      { label: "输出", value: "视频交付" },
    ],
    context: "图生视频的难点在于一致性、分镜和后期交付。项目把这些约束写进工作台，而不是只展示一段生成结果。",
    approach: [
      "先收齐产品参考图和镜头输入。",
      "把一致性规则与分镜步骤放在生成前。",
      "保留后期检查和交付按钮，形成完整工作流。",
    ],
    outcome: [
      "已有真实工作流和基线截图。",
      "适合作为 Harness 与视频生产的项目证据。",
      "公开范围按素材和客户边界继续确认。",
    ],
    nextHref: "/contact",
    nextLabel: "聊视频生产链",
  },
  {
    slug: "expert-agent",
    k: "18",
    title: "企业微信专家 Agent",
    sub: "企业微信入口 / Agent-ready 交付",
    summary: "把九项诊断、证据和行动清单整理成一份交付包。",
    image: "/projects/expert-agent/console.png",
    media: [
      {
        type: "image",
        src: "/projects/expert-agent/diagnostic.png",
        alt: "企业微信专家 Agent 九项诊断界面",
        caption: "九项诊断：业务数据、用户意图、流程、状态、权限与异常恢复逐项留证。",
      },
      {
        type: "image",
        src: "/projects/expert-agent/console.png",
        alt: "企业微信专家 Agent 交付报告界面",
        caption: "交付报告：风险、优先级、行动清单与证据完整度统一导出。",
      },
      {
        type: "image",
        src: "/projects/expert-agent/mobile.png",
        alt: "企业微信专家 Agent 移动端界面",
        caption: "移动端：诊断、行动清单、证据附录与报告导出保持同一交付结构。",
      },
    ],
    evidenceStatus: "verified",
    metrics: [
      { label: "入口", value: "企业微信" },
      { label: "诊断", value: "9 项" },
      { label: "产物", value: "Markdown / JSON" },
    ],
    context: "微信只是入口，交付重点是把业务准备度、证据、风险和下一动作组织成可执行结构。",
    approach: [
      "按九项标准评估页面、流程、数据、权限和异常恢复。",
      "为每项记录证据、风险、优先级与行动。",
      "统一生成交付报告、行动清单和证据附录。",
    ],
    outcome: [
      "真实桌面工作台和移动端界面已恢复。",
      "诊断、行动与报告导出形成完整交付链。",
      "对外名称统一为企业微信专家 Agent。",
    ],
    evidence: {
      level: "real_product",
      sourceProject: "企业微信专家 Agent 诊断交付",
      evidenceAssets: [
        "/projects/expert-agent/diagnostic.png",
        "/projects/expert-agent/console.png",
        "/projects/expert-agent/mobile.png",
      ],
      deliverables: ["九项诊断", "行动清单", "Markdown / JSON 报告"],
      clientPermission: "internal_only",
      metricsSource: "run_log",
      note: "真实运行产品。对外展示采用产品与交付能力描述，不公开客户数据。",
    },
    nextHref: "/contact",
    nextLabel: "聊专家 Agent",
  },
  {
    slug: "weld-vision",
    k: "19",
    title: "焊缝视觉识别",
    sub: "3D 检测工作台原型",
    summary: "看 3D 形貌、几何指标、判定结果和人工复核。",
    image: "/projects/weld-vision/workstation-ng.png",
    media: [
      {
        type: "image",
        src: "/projects/weld-vision/workstation-ng.png",
        alt: "焊缝视觉检测工作台不合格样例",
        caption: "运行原型：咬边深度超限，几何计量与规则判定同步定位。",
      },
      {
        type: "image",
        src: "/projects/weld-vision/workstation-pass.png",
        alt: "焊缝视觉检测工作台合格样例",
        caption: "运行原型：同一工作台切换合格样例，保留测量值、阈值和规则版本。",
      },
    ],
    evidenceStatus: "verified",
    metrics: [
      { label: "形态", value: "运行原型" },
      { label: "输入", value: "3D 样例数据" },
      { label: "判定", value: "计量 + 规则" },
    ],
    context: "检测核心不是让大模型凭图判断，而是把 3D 形貌、几何测量和验收阈值放进同一工作台。",
    approach: [
      "接收点云或高度图，完成焊缝 ROI 与基准平面处理。",
      "测量宽度、余高、咬边深度和路径偏移。",
      "由规则引擎给出合格、不合格或人工复核状态。",
    ],
    outcome: [
      "已完成可切换三类样例的运行工作台。",
      "页面明确标注样例数据，不替代现场传感器验收。",
      "下一步接入真实 3D 采集与企业规则集。",
    ],
    evidence: {
      level: "verified_prototype",
      sourceProject: "焊缝视觉识别 3D 检测工作台",
      evidenceAssets: ["/projects/weld-vision/workstation-ng.png", "/projects/weld-vision/workstation-pass.png"],
      liveRoute: "/work/weld-vision/demo",
      deliverables: ["3D 样例检测", "几何计量", "规则判定与复核"],
      clientPermission: "internal_only",
      metricsSource: "run_log",
      note: "真实运行原型。当前使用可复现样例，不宣称已接入现场传感器或量产线。",
    },
    nextHref: "/work/weld-vision/demo",
    nextLabel: "打开检测工作台",
    nativeRoute: "/work/weld-vision/demo",
  },
  {
    slug: "mophro",
    k: "20",
    title: "mophro",
    sub: "近期陪跑项目 / 待补媒体",
    summary: "项目资料、界面截图、录屏与交付范围待补。",
    evidenceStatus: "pending",
    metrics: [
      { label: "类型", value: "近期陪跑" },
      { label: "状态", value: "占位" },
      { label: "媒体", value: "待补" },
    ],
    context: "mophro 先保留项目位置，等待项目资料、截图、录屏和交付范围确认。",
    approach: ["收到资料后补主题、负责范围和真实媒体。"],
    outcome: ["资料补齐前不归入已完成案例。"],
    evidence: {
      level: "pending_evidence",
      sourceProject: "mophro 近期陪跑项目",
      evidenceAssets: [],
      deliverables: [],
      clientPermission: "pending",
      metricsSource: "unverified",
      note: "尚未补齐项目范围、截图、录屏和可公开证据，不作为对外真实案例。",
    },
    nextHref: "/contact",
    nextLabel: "补充 mophro 资料",
  },
];

export const workItems = [...deliveryCases, ...productLabs];

export function getWorkItem(slug: string) {
  return workItems.find((item) => item.slug === slug);
}
