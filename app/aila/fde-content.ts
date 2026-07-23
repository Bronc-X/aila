export type FdeModule = {
  id: string;
  index: string;
  title: string;
  statement: string;
  deliverables: readonly string[];
  method?: string;
  featured?: boolean;
};

export const fdeModules: readonly FdeModule[] = [
  {
    id: "intelligent-qa",
    index: "01",
    title: "智能问答",
    statement: "统一对客口径下限，缩短新员工上手时间。",
    deliverables: ["企业知识库", "内部培训", "岗位问答", "来源与版本"],
  },
  {
    id: "intelligent-service",
    index: "02",
    title: "智能客服机器人",
    statement: "产品说明、询价报价、客户维系和售后进入可追踪流程。",
    deliverables: ["产品说明", "询价报价", "客户维系", "人工监控"],
    method: "MCP + OCR + Agent",
  },
  {
    id: "crm",
    index: "03",
    title: "CRM 客情追踪",
    statement: "完整记录曝光、跟进、报价、失单和复购。",
    deliverables: ["客户资源", "关键人", "下一动作", "转化与失单"],
  },
  {
    id: "bi-dashboard",
    index: "04",
    title: "BI 数据看板",
    statement: "先保证数据真实采入，再谈经营判断。",
    deliverables: ["异构接入", "清洗解析", "指标口径", "决策与预警"],
    method: "数据管道",
    featured: true,
  },
  {
    id: "tax-operations",
    index: "05",
    title: "税务流程优化与智能报税",
    statement: "在合法合规前提下，降低材料整理和申报准备成本。",
    deliverables: ["材料归集", "规则校验", "风险提示", "人工复核"],
  },
  {
    id: "intelligent-bidding",
    index: "06",
    title: "智能招投标",
    statement: "从全国标讯里筛出适合企业的机会，并管住交付风险。",
    deliverables: ["标项匹配", "文件拆解", "资料复用", "风险检查"],
  },
  {
    id: "competitive-intelligence",
    index: "07",
    title: "竞争格局与竞品分析",
    statement: "持续追踪价格、渠道、竞品动作和市场变化。",
    deliverables: ["竞品档案", "价格追踪", "渠道动态", "机会与风险"],
  },
  {
    id: "aigc",
    index: "08",
    title: "AIGC 推广与 IP 打造",
    statement: "围绕热点二创、审核和分发，稳定完成内容交付。",
    deliverables: ["选题池", "图文视频", "数字人", "多渠道分发"],
  },
  {
    id: "team-agent",
    index: "09",
    title: "团队 Agent 分发与生产",
    statement: "把 Agent、知识、工具和生产任务分发到具体岗位。",
    deliverables: ["Agent 目录", "任务编排", "生产队列", "审核发布"],
  },
  {
    id: "b2b2c-agent",
    index: "10",
    title: "高净值客户 B2B2C 智能体",
    statement: "沉淀专业知识，连接顾问服务、客户记录与业务工具。",
    deliverables: ["律师与保险", "移民留学", "咨询与地产", "顾问接管"],
    method: "BM25 + Rerank + Vector RAG",
  },
] as const;

export const operatingFoundation = [
  ["DATA", "数据底座", "采入 · 清洗 · 解析 · 口径 · 质量"],
  ["KNOWLEDGE", "知识底座", "来源 · 版本 · 权限 · 更新责任"],
  ["AGENT", "执行底座", "任务拆解 · 工具调用 · 状态 · 回退"],
  ["HARNESS", "约束底座", "边界 · 评测 · 人工复核 · 日志 · 审计"],
  ["BUSINESS", "业务底座", "岗位 · 流程 · 责任人 · KPI · 反馈"],
] as const;

export const presaleSteps = [
  {
    index: "01",
    title: "免费诊断",
    line: "线上 60 至 90 分钟",
    work: ["业务问题", "典型材料", "关键岗位", "可落地方向"],
  },
  {
    index: "02",
    title: "业务流解析",
    line: "进入真实流程",
    work: ["数据源", "系统断点", "人工判断", "验收指标"],
  },
  {
    index: "03",
    title: "报价组队",
    line: "范围写进文件",
    work: ["模块与交付物", "双方责任", "数据权限", "商业模式"],
  },
] as const;

export const diagnosisBoundary =
  "免费诊断不接生产系统；需要敏感资料时先签保密协议。";

export const deliveryWeeks = [
  {
    index: "W1",
    title: "接入与首版",
    work: "驻场 2 至 3 次，接资料、数据和系统，交付可操作首版。",
    output: "首版 / 数据清单 / 问题清单",
  },
  {
    index: "W2",
    title: "打磨与调试",
    work: "补异常路径，跑评测，校准权限、规则和人工复核。",
    output: "稳定版本 / 评测记录 / 培训记录",
  },
  {
    index: "W3",
    title: "跑通与交割",
    work: "用真实任务完成端到端验证，完成验收、文档和交接。",
    output: "验收报告 / 文档 / 交割清单",
  },
] as const;

export const acceptanceMetrics = [
  ["数据", "接入完成率、缺失率、更新延迟、口径一致率"],
  ["系统", "可用率、任务成功率、错误恢复时间、日志完整率"],
  ["Agent", "任务通过率、工具成功率、人工接管率、风险拦截率"],
  ["使用", "目标岗位启用率、流程完成率、培训通过率、返工率"],
  ["效率", "处理时长、查找时间、重复动作减少量"],
] as const;

export const commercialModels = [
  {
    index: "A",
    title: "源码一次性交付",
    fit: "有内部研发、需要私有化、希望长期掌握系统。",
    points: ["源码与部署材料", "接口与数据结构", "运维与异常手册", "交割培训"],
    after: "可接年度框架与月度支持；首轮付费抵扣方式写入报价单。",
  },
  {
    index: "B",
    title: "季度模块交付",
    fit: "需要多模块、持续驻场、持续推动使用。",
    points: ["约定模块与非业务 KPI", "季度交付节奏", "3 至 5 次附带功能", "培训与复盘"],
    after: "新增模块、主要系统或数据源进入变更单。",
  },
] as const;

export const enterpriseFlywheel = [
  "真实业务信号",
  "数据采入与清洗",
  "工作流与 Agent",
  "评测与人工复核",
  "生产使用",
  "结果与异常",
  "知识与组件沉淀",
] as const;

export const reuseFlywheel = [
  "客户项目",
  "脱敏问题模式",
  "连接器与数据模型",
  "Harness 与评测集",
  "可复用模块",
  "下一次交付",
] as const;

export const continuousService = [
  ["运行监控", "跟踪任务失败、数据延迟、人工接管和高风险动作。"],
  ["数据修正", "修复字段映射、指标口径、缺失值和异常来源。"],
  ["知识迭代", "更新来源、版本、权限、失效内容和责任人。"],
  ["评测回归", "模型、工具、知识或流程变化后重新跑真实任务。"],
  ["使用推动", "培训目标岗位，回收跳过步骤、返工和未采用原因。"],
] as const;

export const evidenceAssets = [
  {
    src: "/cases/ecommerce_dashboard_1775101771068.png",
    title: "BI 与经营中台",
    line: "数据来源、更新时间、指标口径和异常责任可追踪。",
  },
  {
    src: "/cases/service_knowledge_1775101783025.png",
    title: "智能客服与知识",
    line: "产品、报价、客户记录和人工接入进入同一条链路。",
  },
  {
    src: "/cases/industry_manufacturing_1775101754129.png",
    title: "工业现场与终端",
    line: "设备、人员、系统和现场数据进入统一处理流程。",
  },
  {
    src: "/cases/media_creator_1775101804245.png",
    title: "内容生产与分发",
    line: "热点、二创、审核、数字人和多渠道出品可连续运行。",
  },
] as const;

export const businessBoundaries = [
  ["范围", "以工作说明书和变更单为准"],
  ["数据", "企业保留原始数据与业务资料"],
  ["权限", "只申请完成任务所需的最小权限"],
  ["高风险", "税务、法律、健康、保险与付款保留人工复核"],
  ["验收", "只以数据、系统、Agent、使用与效率指标验收"],
  ["交割", "源码、文档、账号、权限与数据去向全部留痕"],
] as const;
