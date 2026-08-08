export type ExperienceKind = "video" | "interactive";
export type ExperienceFilter = "all" | ExperienceKind;
export type ExperienceEvidenceLevel =
  | "real_project"
  | "local_reproducible_run"
  | "interactive_demo";

export type ExperienceEvidence = {
  level: ExperienceEvidenceLevel;
  label: string;
  note: string;
};

export type CaseExperience = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  kind: ExperienceKind;
  category: string;
  duration: string;
  summary: string;
  whatItIs: string;
  poster?: string;
  media?: string;
  href: string;
  embedSrc?: string;
  input: string;
  experience: string;
  outcome: string;
  tags: string[];
};

export type ProjectRecord = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  evidenceLabel: string;
  evidenceNote: string;
  href: string;
  actionLabel: string;
  nativeRoute: boolean;
};

const reusableDemoEvidence: ExperienceEvidence = {
  level: "interactive_demo",
  label: "通用互动演示",
  note: "用于说明可迁移的方法和工作台形态，不作为客户项目或真实系统运行记录。",
};

export const caseExperienceEvidence: Record<string, ExperienceEvidence> = {
  crossborder: {
    level: "local_reproducible_run",
    label: "本地可复现执行",
    note: "服务端真实读取脱敏样例、生成运行记录和本地产物；未连接客户邮箱、ERP、CRM 或邮件发送。",
  },
  immigration: {
    level: "local_reproducible_run",
    label: "本地可复现执行",
    note: "服务端真实读取脱敏线索、生成运行记录和建案草案；未连接客户企业微信、案件系统或对外发送。",
  },
  "weld-vision": {
    level: "real_project",
    label: "真实运行原型",
    note: "可直接操作的 3D 质检原型，明确使用可复现样例数据，不替代现场传感器或量产验收。",
  },
  "sales-assistant": reusableDemoEvidence,
  "service-center": reusableDemoEvidence,
  "activity-plan": reusableDemoEvidence,
  "xhs-matrix": reusableDemoEvidence,
  "research-workbench": reusableDemoEvidence,
  antios: {
    level: "real_project",
    label: "真实产品项目",
    note: "展示实际产品运行视频；作为自有产品项目，不等同于企业客户交付案例。",
  },
  "lusie-print": {
    level: "real_project",
    label: "真实产品路由",
    note: "站内保留真实产品界面、任务状态和历史入口；当前本地未配置外部生成 Provider，概念图与模型生成会如实返回配置错误。",
  },
};

export function getCaseExperienceEvidence(id: string): ExperienceEvidence {
  return caseExperienceEvidence[id] ?? reusableDemoEvidence;
}

export const caseExperiences: CaseExperience[] = [
  {
    id: "crossborder",
    index: "01",
    title: "询盘到报价 Agent",
    subtitle: "一封脱敏询盘如何进入销售工作流",
    kind: "interactive",
    category: "销售运营",
    duration: "服务端实跑",
    summary: "把邮件里的要求整理出来，查产品，生成报价草案，最后交给人确认。",
    whatItIs: "读取一封脱敏询盘，生成报价、客户邮件和 CRM 草案，报价前停在销售审批。",
    poster: "/projects/fde-cases/crossborder.png",
    href: "/work/fde-workflow-runner.html?case=crossborder",
    embedSrc: "/work/fde-workflow-runner.html?case=crossborder",
    input: "客户邮件、产品要求、交付时间和合规条件。",
    experience: "服务端创建运行记录，提取需求、匹配产品、生成报价草案，并在销售审批处停下。",
    outcome: "报价草案、客户邮件草案和 CRM 草案记录。金额、折扣和交期仍由销售负责人确认。",
    tags: ["B2B 销售", "服务端实跑", "人工复核"],
  },
  {
    id: "immigration",
    index: "02",
    title: "服务公司 AI 中控",
    subtitle: "老板如何看见线索、顾问与案件状态",
    kind: "interactive",
    category: "经营管理",
    duration: "服务端实跑",
    summary: "读取脱敏线索与材料，生成预评估、材料缺口和建案草案。",
    whatItIs: "读取一条脱敏企微线索，生成预评估、材料缺口和建案草案，在顾问审批处停下。",
    poster: "/projects/fde-cases/immigration.png",
    href: "/work/fde-workflow-runner.html?case=immigration",
    embedSrc: "/work/fde-workflow-runner.html?case=immigration",
    input: "企微线索、客户材料、顾问跟进和案件节点。",
    experience: "服务端核验授权、生成预评估草案；顾问审批后写入本地建案草案。",
    outcome: "预评估草案、材料缺口清单和建案草案。顾问确认预评估后才能进入建案。",
    tags: ["老板中控", "服务端实跑", "案件流程"],
  },
  {
    id: "weld-vision",
    index: "03",
    title: "焊缝视觉质检工作站",
    subtitle: "亲手切换三条焊缝，看系统怎么判定",
    kind: "interactive",
    category: "工业质检",
    duration: "可操作",
    summary: "切换样例，查看点云、尺寸指标和 PASS / NG 判定。",
    whatItIs: "载入焊缝点云，按阈值计算几何指标并给出 PASS / NG 的质检工作站。",
    poster: "/projects/weld-vision/workstation-ng.png",
    href: "/work/weld-vision/demo",
    embedSrc: "/work/weld-vision/demo",
    input: "焊缝点云、几何阈值和企业质检规则。",
    experience: "展示 PASS、NG 和数据缺失样本的判定依据与几何指标。",
    outcome: "样例的 PASS / NG 判定和几何指标。现场传感器和量产验收不在这个 Demo 里。",
    tags: ["工业视觉", "3D 点云", "规则引擎"],
  },
  {
    id: "sales-assistant",
    index: "04",
    title: "销售对话助手",
    subtitle: "边聊边整理重点、异议和下一步",
    kind: "interactive",
    category: "销售运营",
    duration: "可操作",
    summary: "把一段销售对话整理成重点、异议和回访动作。",
    whatItIs: "输入一段销售对话，提取重点、异议和回访动作的工作台。",
    poster: "/cases/ecommerce_dashboard_1775101771068.png",
    href: "/tools/sales",
    embedSrc: "/tools/sales",
    input: "客户对话、业务卖点和常见异议。",
    experience: "工作台提取对话重点与异议，生成建议话术和回访动作。",
    outcome: "重点、异议和回访动作。回复和跟进由销售决定。",
    tags: ["销售对话", "异议处理", "回访任务"],
  },
  {
    id: "service-center",
    index: "05",
    title: "智能客服工作台",
    subtitle: "客户问题如何分流、生成回复并转人工",
    kind: "interactive",
    category: "客户服务",
    duration: "可操作",
    summary: "客户提问后，生成回复、标记情绪，必要时转人工。",
    whatItIs: "输入客户问题，匹配知识材料，生成回复或转人工的客服工作台。",
    poster: "/cases/service_knowledge_1775101783025.png",
    href: "/tools/service",
    embedSrc: "/tools/service",
    input: "客户问题、知识材料、服务规则和历史反馈。",
    experience: "工作台匹配知识材料，生成回复、情绪标记和处理状态。",
    outcome: "回复、情绪标记和处理状态。复杂问题转给人工。",
    tags: ["知识库", "客户反馈", "人工升级"],
  },
  {
    id: "activity-plan",
    index: "06",
    title: "活动方案与海报出品包",
    subtitle: "一份活动输入如何变成四类可交付结果",
    kind: "interactive",
    category: "内容生产",
    duration: "可浏览",
    summary: "输入活动信息，查看方案结构、海报方向和 PPTX 输出。",
    whatItIs: "输入活动目标和品牌物料，生成方案结构、海报方向和 PPTX 初稿的出品工具。",
    poster: "/tools-showcase/activity-plan-editorial-hero.webp",
    href: "/tools/activity-plan",
    embedSrc: "/tools/activity-plan",
    input: "活动目标、预算人数、品牌物料和交付格式。",
    experience: "工具生成方案结构、海报方向和成套输出。",
    outcome: "方案结构、海报方向和 PPTX 输出。最终内容由团队确认。",
    tags: ["活动方案", "品牌资产", "PPTX"],
  },
  {
    id: "xhs-matrix",
    index: "07",
    title: "内容矩阵工作流",
    subtitle: "从选题、候选稿到发布确认",
    kind: "interactive",
    category: "内容生产",
    duration: "可浏览",
    summary: "从选题到候选稿，再到审核和发布确认，保留人工入口。",
    whatItIs: "输入选题和素材，生成候选稿与质量检查，发布前留给人工确认的内容工作流。",
    poster: "/tools-showcase/xhs-matrix-editorial-hero.webp",
    href: "/tools/auto-red-book",
    embedSrc: "/tools/auto-red-book",
    input: "账号定位、素材、选题方向和平台约束。",
    experience: "流程生成候选稿并执行质量检查，发布前留给人工确认。",
    outcome: "候选稿、质量检查和发布确认。审核和发布由人决定。",
    tags: ["内容矩阵", "质量检查", "发布确认"],
  },
  {
    id: "research-workbench",
    index: "08",
    title: "业务验证工作台",
    subtitle: "把模糊想法拆成可验证的问题",
    kind: "interactive",
    category: "业务诊断",
    duration: "可操作",
    summary: "输入一个模糊问题，查看风险、验证路径和下一步。",
    whatItIs: "输入一个业务问题，输出风险、验证路径和下一步动作的研究工作台。",
    poster: "/projects/kemo/key-visual.png",
    href: "/tools/research",
    embedSrc: "/tools/research",
    input: "一个模糊需求、目标用户和当前假设。",
    experience: "工作台整理风险、验证路径和下一步动作。",
    outcome: "风险、验证路径和下一步。是否继续推进由业务负责人决定。",
    tags: ["业务诊断", "原型验证", "决策支持"],
  },
  {
    id: "antios",
    index: "09",
    title: "Antios 健康状态产品",
    subtitle: "一段完整的移动产品运行视频",
    kind: "video",
    category: "产品体验",
    duration: "01:27",
    summary: "看一段完整的 iOS 产品运行视频。",
    whatItIs: "把 Apple Watch 健康信号转成状态解释和提醒的移动产品。",
    media: "/antios.mp4",
    href: "/work/antios",
    input: "Apple Watch 健康数据和用户日常状态。",
    experience: "观看移动端如何把传感器信号变成可以理解的状态解释。",
    outcome: "从健康信号到状态解释和提醒的产品流程。",
    tags: ["iOS", "健康数据", "产品原型"],
  },
  {
    id: "lusie-print",
    index: "10",
    title: "Lusie 航模生成工作台",
    subtitle: "从概念到模型的原生产品界面",
    kind: "interactive",
    category: "产品体验",
    duration: "产品路由",
    summary: "查看任务状态、历史记录和下载路径；没有配置 Provider 的地方保留错误。",
    whatItIs: "提交一个 3D 生成任务，查看进度、历史和下载的产品工作台。",
    poster: "/print-loading-animation/print-loading-poster.jpg",
    href: "/lusie",
    embedSrc: "/lusie",
    input: "用户提交的 3D 航模生成任务。",
    experience: "展示任务状态、历史与下载路径；未配置的 Provider 显示实际错误状态。",
    outcome: "任务进度、历史、下载路径和实际错误状态。",
    tags: ["异步任务", "真实产品路由", "3D 生产"],
  },
];
