export type WorkMetric = {
  label: string;
  value: string;
};

export type WorkItem = {
  slug: string;
  k: string;
  title: string;
  sub: string;
  summary: string;
  image?: string;
  href?: string;
  metrics: WorkMetric[];
  context: string;
  approach: string[];
  outcome: string[];
  nextHref?: string;
  nextLabel?: string;
};

export const deliveryCases: WorkItem[] = [
  {
    slug: "survey-decision-system",
    k: "01",
    title: "咨询行业问卷统计与智能决策系统",
    sub: "企业交付案例",
    summary: "把问卷回收、统计口径、增长洞察和报告生成收进一条可复用流程。",
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
    nextHref: "/contact",
    nextLabel: "聊类似流程",
  },
  {
    slug: "ecommerce-product-radar",
    k: "02",
    title: "电商爆品极速筛查雷达",
    sub: "企业交付案例",
    summary: "面向短视频选品，把人工刷内容压缩成可批量复核的候选池。",
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
    nextHref: "/tools/acquisition",
    nextLabel: "进入获客工具",
  },
  {
    slug: "commercial-poster-workshop",
    k: "03",
    title: "商用级电商自动化海报工坊",
    sub: "企业交付案例",
    summary: "围绕商品图、模特图和投放尺寸搭建素材生产流程，让日常测试有稳定来源。",
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
    nextHref: "/tools/acquisition",
    nextLabel: "看海报工具",
  },
];

export const productLabs: WorkItem[] = [
  {
    slug: "aila",
    k: "04",
    title: "AILA",
    sub: "企业工具矩阵",
    summary: "把获客、销售、验证、行政、客服、老板仪表盘和内容项目整理成可演示的企业工具矩阵。",
    metrics: [
      { label: "模块", value: "8 个工具" },
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
    nextHref: "/aila",
    nextLabel: "进入 AILA",
  },
  {
    slug: "antios",
    k: "05",
    title: "Antios",
    sub: "健康状态运行时",
    summary: "以 Apple Watch 生理参数为输入，探索个人健康状态的记录、解释和提醒方式。",
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
    sub: "课程与交付方法",
    summary: "把两天闭门课沉淀成认知、案例、工具和企业路线图四个连续环节。",
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
];

export const workItems = [...deliveryCases, ...productLabs];

export function getWorkItem(slug: string) {
  return workItems.find((item) => item.slug === slug);
}
