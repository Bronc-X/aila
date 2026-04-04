import { NextRequest, NextResponse } from "next/server";

// GPT-5.4 代理路由 - 流式输出
export async function POST(req: NextRequest) {
  try {
    const { messages, temperature, max_tokens } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages 参数无效" }, { status: 400 });
    }

    const apiBaseUrl = process.env.GPT_API_BASE_URL;
    const apiKey = process.env.GPT_API_KEY;
    const model = process.env.GPT_MODEL || "gpt-5.4";

    if (!apiBaseUrl || !apiKey) {
      // 开发模式下使用 mock 响应
      return NextResponse.json({
        choices: [{
          message: {
            content: generateMockResponse(messages),
          },
        }],
      });
    }

    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("GPT API Error:", errText);
      return NextResponse.json(
        { error: `AI服务异常 (${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// ============================================
// 开发模式 Mock 响应引擎（覆盖全部 6 大工具场景）
// ============================================
function generateMockResponse(messages: { role: string; content: string }[]): string {
  const systemMsg = messages.find(m => m.role === "system")?.content || "";
  const lastMessage = messages[messages.length - 1]?.content || "";
  const allText = systemMsg + " " + lastMessage;

  // 1. 获客中心 — 文案矩阵
  if (allText.includes("文案") || allText.includes("营销") || allText.includes("copywriting") || allText.includes("平台")) {
    return `## 📱 小红书版本

✨ 姐妹们！你们还在为效率发愁吗？
今天给大家安利一个宝藏好物，真的是闭眼入系列~

🔥 亲测三大理由：
1. 上手超简单，小白也能秒变高手
2. 效率直接翻5倍，再也不用加班了
3. 性价比炸裂，一顿饭钱的事儿

💡 我们公司用了3个月，老板笑得合不拢嘴
业绩提升了40%，团队都说回不去了

👉 评论区扣"1"我给你们发详细测评～

#效率神器 #职场必备 #好物安利 #AI工具

---

## 🎬 抖音版本

【3秒hook】还在用传统方法？你的竞争对手早就换赛道了 ⚡

【痛点切入】
每天重复机械工作8小时？
客户跟不过来，线索白白流失？
团队扩张成本越来越高？

【解决方案】
一个工具，搞定获客→跟进→成交全流程
已经有 3000+ 企业在用

【数据说话】
✅ 获客成本降低 60%
✅ 转化率提升 35%
✅ 人效提升 5 倍

【行动号召】
👇 点击主页链接，免费体验7天
名额有限，手慢无！

---

## 🛒 淘宝/1688 版本

【标题】2026新款 智能获客系统 企业级AI营销 全自动客户管理 厂家直供

【五大核心卖点】
▪ 全链路自动化：从线索获取到成交关单，AI全程驱动
▪ 多平台覆盖：小红书/抖音/公众号/独立站一键分发
▪ 智能内容生成：AI秒级生成专业营销文案与视觉素材
▪ 数据看板：实时追踪ROI、转化率、客单价等关键指标
▪ 售后保障：专属顾问1v1服务，7天无理由退款

【详情页文案】
你是否还在为以下问题困扰？
❌ 获客成本高？——AI精准投放，成本直降60%
❌ 内容跟不上？——AI每日产出100+原创内容
❌ 人手不够忙？——1人管理10个平台不是梦

---

## 🌐 独立站版本 (English)

**Headline:** Stop Losing Customers. Start Scaling with AI.

**Subheadline:** Join 3,000+ businesses that automated their entire marketing pipeline.

**Key Benefits:**
- 🚀 60% lower customer acquisition cost
- 📈 5x team productivity boost
- 🤖 AI-powered content generation across all channels
- 📊 Real-time analytics dashboard

**Social Proof:**
"We went from 500 to 5,000 leads per month in just 90 days." — CEO, TechVista Inc.

**CTA:** Start Your Free 7-Day Trial → No credit card required.`;
  }

  // 2. 销售助手 — 智能回访策略
  if (allText.includes("回访") || allText.includes("销售顾问") || allText.includes("跟进")) {
    const customerName = lastMessage.match(/客户名[：:]\s*(.+?)[\n\\]/)?.[1] || "张总";
    return `## 📋 ${customerName} 回访策略报告

### ⏰ 最佳回访时间
- **首选：周二/周四 上午 10:00-11:30**（决策层此时段注意力最集中）
- **次选：周三 下午 14:00-15:00**（午休后精力恢复，适合深度聊方案）
- ⚠️ 避免：周一上午（忙碎事）、周五下午（心态已放假）

### 💬 开场话术

> "${customerName}，您好！上次和您聊完之后，我一直在想您提到的那个[客户痛点]的问题。正好我们最近帮一家跟您情况很像的企业解决了类似的难题，效果出乎意料地好——所以第一时间想到跟您分享一下。"

### 🎯 话题切入点

1. **行业趋势引入**："最近[行业]的AI应用落地速度很快，您有关注吗？我看到[竞品公司]已经在用了。"
2. **痛点复盘**："上次您提到[具体问题]，回去之后我们技术团队做了个初步方案..."
3. **案例诱导**："我分享个案例——[行业]的[某公司]，规模和您差不多，用了3个月..."

### ⚠️ 预判异议及应对

| 可能异议 | 应对策略 |
|---------|---------|
| "现在不是好时机" | "完全理解。正因为如此，我们可以先做个免费诊断，帮您摸清楚目前的效率瓶颈在哪，随时都能用得上。" |
| "价格太高了" | "如果算ROI的话，客户平均3个月回本。我们也有灵活的按效果付费方案。" |
| "需要跟团队商量" | "当然，方便的话我准备一份材料给您，里面有案例和数据，方便您内部汇报。" |

### 📌 促成下一步
- 目标：锁定一次15分钟的线上演示
- 话术：*"这样吧，我给您看个5分钟的demo视频，您觉得有价值咱们再深聊，不浪费您时间。"*`;
  }

  // 3. 研发工坊 — 多角色头脑风暴
  if (allText.includes("头脑风暴") || allText.includes("多角色") || allText.includes("创新")) {
    return `# 🧠 多角色头脑风暴讨论纪要

## 讨论主题：如何用AI降低企业运营成本

---

### 👔 CEO 视角 — 战略层面

> "我最关心三件事：降本、增效、可持续。AI不是买个工具那么简单，它需要与我们的战略目标对齐。我建议从最痛的环节切入——现在客服和内容生产占了我们30%的人力成本，如果AI能把这两块拿下，一年省出来的钱至少500万。"

**挑战其他角色**：技术团队不要追求完美，先跑通一个场景证明ROI。

---

### 📋 产品经理 — 执行层面

> "我同意CEO的优先级排序。但我要补充：AI落地最大的坑不是技术，是流程适配。建议分三步走：
> 1. **第1月**：用AI接管80%的标准化客服问答（知识库+RAG）
> 2. **第2月**：AI辅助内容生成，人工审核把关（效率提5倍）
> 3. **第3月**：打通数据闭环，AI自动优化投放策略"

**对CEO的回应**：500万的预期偏乐观，建议按300万做保守估算。

---

### 💻 技术专家 — 可行性分析

> "从技术角度，客服场景用RAG（检索增强生成）是最成熟的方案，业界已有大量成功案例。我推荐用Dify搭建，部署周期2周。内容生成更复杂，需要定制Prompt模板和人工质量门控。
>
> ⚠️ 一个风险点：数据安全。推荐用私有化部署方案，避免敏感信息外传。"

**反对意见**：产品经理提的3个月时间线太紧，建议给4个月的缓冲。

---

### 📢 市场营销 — 增长角度

> "我的视角不一样——AI不只是省钱的工具，它可以帮我们弯道超车。现在行业里还没人做AI驱动的个性化营销，如果我们先做到，获客成本能比竞品低40%。这个先发优势价值远超省出来的人力成本。"

---

## 🏆 创意矩阵 — TOP 3 方案

| 排序 | 方案 | 预期ROI | 实施难度 | 周期 |
|-----|------|---------|---------|------|
| 1️⃣ | AI智能客服（RAG知识库） | 年省120万+ | ⭐⭐ 低 | 2周 |
| 2️⃣ | AI内容矩阵生成引擎 | 人效提升5x | ⭐⭐⭐ 中 | 6周 |
| 3️⃣ | AI个性化精准获客系统 | 获客降本40% | ⭐⭐⭐⭐ 较高 | 12周 |

## 📌 下一步行动建议
1. 本周内完成客服知识库的整理和RAG POC验证
2. 请技术团队出一份私有化部署方案评估
3. 市场团队同步研究竞品AI应用现状`;
  }

  // 3.5 研发工坊 - 快速原型验证
  if (allText.includes("原型") || allText.includes("SWOT") || allText.includes("MVP")) {
    return `## 🚀 快速原型验证报告

### 📊 多维评估评分

- **市场需求 (8/10)** 
  **理由**：B端企业普遍面临获客成本高、效率低的痛点，对能提升线索转化率的工具具有较强付费意愿。
- **技术可行性 (7/10)**
  **理由**：现有大模型基础能力（文本、逻辑推理）完全能支撑，难点在于各行业垂直语料的精调和工程化落地。
- **竞品差异化 (6/10)**
  **理由**：市面上已有类似产品，需在工具集成度或垂直行业深度上建立壁垒，否则容易陷入价格战。
- **商业模型 (9/10)**
  **理由**：SaaS订阅制 + 效果提成的高毛利模式极其成熟，只要证明ROI，客户生命周期极长。

### 🔄 SWOT 分析

- **优势 (Strengths)**
  - 团队具备深厚的AI及产业互联网背景
  - 核心模块复用率高，开发周期短
- **劣势 (Weaknesses)**
  - 早期缺乏标杆客户案例支撑
  - 销售团队尚未搭建，渠道依赖弱
- **机会 (Opportunities)**
  - 传统企业正在掀起全面拥抱AI的数字化浪潮
  - 大模型API成本急剧下降，利润空间扩充
- **威胁 (Threats)**
  - 字节等大厂可能随时以完全免费模式入局
  - 开源社区平替品层出不穷

### 🛠️ MVP (最小可行性产品) 功能清单

- [x] 多渠道线索接入模块 (微信/企微/表单)
- [x] AI自动打标与清洗引擎
- [x] 基于客户画像的智能话术提示词库
- [x] 数据统计看板 (包含转化率分析)
- [ ] 基础的团队账号权限隔离

**💡 总体建议：**
验证结论为"值得推进"。建议第一版不要做重构的CRM，而是作为插件接入现有的企微或飞书生态，主打"0门槛上手"和"立竿见影的效率提升"来快速获取前10个种子付费客户。`;
  }

  // 3.6 行政效率站 - 流程自动化诊断
  if (allText.includes("流程自动化") || allText.includes("诊断并推荐")) {
    return JSON.stringify([
      { "step": "客户下单", "time": "2min", "auto": "✅ 已自动化", "tool": "通过 Webhook 实时触发创建", "optimized": true },
      { "step": "订单审核", "time": "5min", "auto": "部分自动化", "tool": "AI 异常订单预警，正常订单秒过", "optimized": true },
      { "step": "财务确认", "time": "1h", "auto": "可自动化", "tool": "对接网银流水 API 自动匹配", "optimized": false },
      { "step": "任务分配", "time": "30min", "auto": "可自动化", "tool": "基于技能标签算法自动分单", "optimized": false },
      { "step": "进度汇报", "time": "20min", "auto": "✅ 已自动化", "tool": "系统定时推送企微播报", "optimized": true }
    ]);
  }

  // 4.1 运营驾驶舱大屏推演 (JSON 返回)
  if (allText.includes("商业数据分析师(BI)") || allText.includes("极严格 JSON")) {
    const industry = allText.match(/行业：【(.*?)】/)?.[1] || "教培行业";
    const targetFull = allText.match(/本月目标设定：营收【(.*?)】/)?.[1] || "200万";
    const priority = allText.match(/当期核心经营重心：【(.*?)】/)?.[1] || "获取新客";
    
    // 解析金额基数
    let parsedAmount = parseFloat(targetFull.replace(/[^\d.]/g, '')) || 200;
    const unit = targetFull.includes("千万") ? "千万" : "万";
    if (unit === "千万") parsedAmount *= 1000;

    return JSON.stringify({
      kpis: [
        { label: "本月预计营收", value: `¥${(parsedAmount * 1.05).toFixed(1)}万`, change: "+12.5%", trend: "up", detail: ["线上增量 42%", "线下存量 58%"] },
        { label: "重心指标达成", value: "超额完成", change: "+3.2pp", trend: "up", detail: [`推进进度：${priority}`] },
        { label: "新渠道转化率", value: "24.6%", change: "+5.1%", trend: "up", detail: ["自然留资 18%", "广告投放 32%"] },
        { label: "平均客单价", value: `¥${(parsedAmount * 0.05).toFixed(1)}万`, change: "-1.4%", trend: "down", detail: ["大客占比 24%", "中长尾单 76%"] }
      ],
      pipeline: [
        { stage: "官网访问", count: Math.floor(parsedAmount * 60), amount: "¥0" },
        { stage: "留资注册", count: Math.floor(parsedAmount * 15), amount: `¥${Math.floor(parsedAmount * 8)}万` },
        { stage: "初步接洽", count: Math.floor(parsedAmount * 4), amount: `¥${Math.floor(parsedAmount * 6)}万` },
        { stage: "方案提报", count: Math.floor(parsedAmount * 1.5), amount: `¥${Math.floor(parsedAmount * 3)}万` },
        { stage: "商务谈判", count: Math.floor(parsedAmount * 0.8), amount: `¥${Math.floor(parsedAmount * 1.5)}万` },
        { stage: "签约成交", count: Math.floor(parsedAmount * 0.3), amount: `¥${(parsedAmount * 1.05).toFixed(1)}万` }
      ],
      insights: [
        { type: "warning", title: "流量漏斗前端呈现行业流失", text: `分析显示，从「官网访问」到「留资」的阶段存在较大跳出，可能与${industry}当前的客户决策周期变长有关。`, detail: `建议操作：\n1. 重点检查基于“${priority}”重心布置的落地页\n2. 增加限时行业白皮书下载诱饵\n3. 优化 CTA 按钮链路` },
        { type: "insight", title: "高净值线索集中在晚间", text: "数据表明晚上 20:00-22:00 提交的表单转化率是白天的 1.8 倍。", detail: "建议操作：\n1. 将晚间竞价系数提高 30%\n2. 安排值班客服优先响应\n3. 推送短视频深度解决方案" },
        { type: "action", title: "沉睡客户激活有极大潜力", text: "历史库中有约 400 个「方案提报」后流失的机会提取。", detail: `建议操作：\n1. 发起【老客户召回专属】活动\n2. AI 智能一键生成跟进内容\n3. 将分配比例适当倾斜给核心销售` }
      ],
      deals: [
        { client: `上海某知名${industry}企业`, date: "今日 14:20", amount: `¥${Math.floor(parsedAmount * 0.15)}万`, status: "signed" },
        { client: `北京某头部${industry}平台`, date: "今日 11:30", amount: `¥${Math.floor(parsedAmount * 0.25)}万`, status: "approval" },
        { client: `深圳某出海${industry}品牌`, date: "昨日 18:45", amount: `¥${Math.floor(parsedAmount * 0.08)}万`, status: "signed" },
        { client: `杭州某${industry}初创团队`, date: "昨日 16:10", amount: `¥${Math.floor(parsedAmount * 0.05)}万`, status: "following" },
        { client: `广州某区域${industry}领头羊`, date: "两日前", amount: `¥${Math.floor(parsedAmount * 0.45)}万`, status: "signed" }
      ]
    });
  }

  // 4.2 运营驾驶舱 — AI 报告
  if (allText.includes("周报") || allText.includes("日报") || allText.includes("月报") || allText.includes("运营总监")) {
    const isDaily = allText.includes("日报");
    const isMonthly = allText.includes("月报");
    const type = isDaily ? "日报" : isMonthly ? "月报" : "周报";
    return `# 📊 AI 智能${type}

**报告周期**：${isDaily ? "2026年3月28日" : isMonthly ? "2026年3月" : "2026.03.22 - 03.28"}
**生成时间**：${new Date().toLocaleString("zh-CN")}
**报告人**：AI 运营助手

---

## 一、核心数据总览

| 指标 | ${isDaily ? "今日" : "本期"} | 环比变化 | 状态 |
|-----|------|---------|------|
| 成交额 | ¥${isDaily ? "186,500" : isMonthly ? "3,850,000" : "1,284,500"} | +${isDaily ? "12" : isMonthly ? "18.5" : "23.5"}% | 🟢 |
| 新增客户 | ${isDaily ? "6" : isMonthly ? "189" : "47"} | +${isDaily ? "2" : isMonthly ? "15" : "12.3"}% | 🟢 |
| 线索转化率 | 18.6% | +2.1pp | 🟢 |
| 客单价 | ¥${isDaily ? "31,083" : "27,330"} | -3.2% | 🟡 |
| 客户流失率 | 2.1% | -0.3pp | 🟢 |

## 二、${isDaily ? "今日" : "本期"}重点工作进展

${isDaily ? `### 上午
- ✅ 完成深圳XX科技 23万大单的合同签署
- ✅ 杭州YY贸易回款确认 ¥120,000
- 🔄 广州ZZ制造审批流程中（预计明日完成）

### 下午
- ✅ 新开发 6 条高质量线索（来源：LinkedIn+展会名片）
- ✅ 完成客户回访 8 通（5通有效推进）
- ⚠️ 北京BB服务对价格有异议，安排明天重点跟进` : `### 重大成交
- ✅ 深圳XX科技签约 ¥230,000（历时2个月跟进）
- ✅ 杭州YY贸易续约成功 ¥120,000

### 市场活动
- 参加 AI Expo 2026 展会，获取 86 条高意向线索
- 完成 Q2 营销物料更新（海报+短视频矩阵12套）

### 团队建设
- 新入职 2 名销售顾问，已完成 AI 工具培训`}

## 三、存在问题

| 问题 | 影响 | 建议措施 |
|-----|------|---------|
| 客单价环比下降 3.2% | 利润率承压 | 调整产品组合，推高价值套餐 |
| 部分团队成员 AI 工具使用率低 | 效率差距拉大 | 本周安排1次AI工具专项培训 |

## 四、下一步计划

1. 重点攻坚广州ZZ制造 ¥230,000 大单（决策人已对接）
2. ${isDaily ? "明日完成北京BB服务的方案调整" : "启动沉默客户激活计划（第一批100个）"}
3. 优化话术库，针对"价格异议"补充3套应对方案

---
*此报告由 AI 运营助手自动生成，数据截至报告时间，建议核对关键数据后使用。*`;
  }

  // 5. 行政效率站 — 合同生成
  if (allText.includes("合同") || allText.includes("法务") || allText.includes("条款")) {
    return `# 📜 销售合同（草稿）

**合同编号**：AI-SC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}

---

## 甲方（供方）

- **名称**：[_____] 科技有限公司
- **地址**：[_____]
- **法定代表人**：[_____]
- **联系方式**：[_____]

## 乙方（需方）

- **名称**：[_____]
- **地址**：[_____]
- **法定代表人**：[_____]
- **联系方式**：[_____]

---

## 第一条 合同标的

甲方向乙方提供 [_____] 产品/服务（以下简称"标的物"），具体规格和参数详见附件一《产品/服务清单》。

## 第二条 合同金额与支付

1. 合同总金额：人民币壹拾万元整（¥100,000.00）
2. 支付方式：
   - 签约后 7 个工作日内，乙方支付合同总额的 30% 作为预付款（¥30,000.00）
   - 验收合格后 15 个工作日内，支付剩余 70%（¥70,000.00）
3. 付款账户：以甲方书面提供的银行账户信息为准

## 第三条 合同期限

- 本合同有效期为 **壹年**，自 2026 年 [__] 月 [__] 日起至 2027 年 [__] 月 [__] 日止
- 如需续约，双方应在到期前 30 个自然日内协商确认

## 第四条 交付与验收

1. 甲方应在签约后 [__] 个工作日内完成交付
2. 乙方应在收到标的物后 7 个工作日内完成验收
3. 验收标准：参见附件二《验收标准》

## 第五条 双方权利义务

### 甲方义务
- 确保标的物符合约定的质量标准及技术规格
- 提供必要的技术支持和培训服务
- 在合同期内提供维护保障

### 乙方义务
- 按约定时间和方式支付合同款项
- 提供必要的配合和协助
- 保护甲方的商业秘密和知识产权

## 第六条 违约责任

1. 任何一方未按合同约定履行义务的，应承担违约责任
2. 逾期付款的，按应付未付金额每日 0.05% 支付违约金
3. 甲方逾期交付的，按合同总额每日 0.05% 向乙方支付违约金

## 第七条 保密条款

双方对因本合同而知悉的对方商业秘密及技术秘密负有保密义务，保密期限为合同终止后 2 年。

## 第八条 争议解决

本合同在履行过程中发生争议，双方应友好协商解决；协商不成的，提交甲方所在地有管辖权的人民法院诉讼解决。

## 第九条 其他

- 本合同一式两份，甲乙双方各执一份，具有同等法律效力
- 未尽事宜，双方可另行签订补充协议

---

**甲方（盖章）**：______________ &emsp; **乙方（盖章）**：______________

**授权代表签字**：______________ &emsp; **授权代表签字**：______________

**日期**：____年____月____日 &emsp;&emsp;&emsp; **日期**：____年____月____日

---
*⚠️ 此草稿由AI生成，仅供参考。正式使用前请法务人员审核确认。*`;
  }

  // 6. 客服智能体 — 智能客服对话
  if (allText.includes("客服") || allText.includes("FAQ") || allText.includes("智能客服")) {
    // 模拟客服对话
    if (lastMessage.includes("价格") || lastMessage.includes("多少钱") || lastMessage.includes("费用")) {
      return `我们的产品有三个版本可以选择 😊

📦 **基础版** — ¥5,000/月
  适合：20人以下团队
  包含：核心功能 + 基础报表 + 邮件支持

📦 **企业版** — ¥20,000/月
  适合：20-200人团队
  包含：全部功能 + 高级分析 + 专属顾问 + API接口

📦 **旗舰版** — 定制报价
  适合：200人以上 / 集团客户
  包含：私有化部署 + 定制开发 + 7×24技术支持

💡 所有版本都支持 **7天免费试用**，无需绑定信用卡～

您方便告诉我贵公司大概多少人使用吗？我帮您推荐最合适的方案 🤗`;
    }
    if (lastMessage.includes("试用") || lastMessage.includes("免费") || lastMessage.includes("体验")) {
      return `当然可以！我们提供 **7天全功能免费试用** 🎉

📌 开通方式很简单：
1. 点击官网右上角"免费试用"
2. 填写公司名称和联系方式
3. 系统会在5分钟内自动开通

✅ 试用期内可以体验所有企业版功能
✅ 不需要绑定信用卡
✅ 到期后不会自动扣费

如果您在试用过程中需要帮助，可以随时联系我，我会安排专属顾问1v1指导您上手～ 😊`;
    }
    return `感谢您的提问 😊

根据我了解的产品信息，这个问题的答案是：我们的AI解决方案可以帮助企业在获客、销售、运营等环节实现智能化升级。

🔑 核心能力包括：
• 智能客服——7×24小时自动响应，理解率95%+
• 数据分析——实时生成可视化报表
• 内容生成——多平台营销文案一键创作
• 流程自动化——合同、纪要、报告等秒级生成

如果您有更具体的场景需求，可以告诉我，我帮您匹配最合适的方案 👍

也可以直接联系我们的人工顾问：400-XXX-XXXX（工作日 9:00-18:00）`;
  }

  // 默认通用回复
  return `## AI 智能分析结果

感谢您的输入。以下是 AI 根据您提供的信息生成的分析：

### 📊 核心洞察

1. **当前状态评估**：基于您描述的业务场景，存在显著的效率提升空间。AI可以在内容生成、数据分析和客户沟通三个维度提供杠杆效应。

2. **量化预估**：
   - 内容产出效率：预计提升 5-8 倍
   - 客户响应速度：从平均 4 小时缩短至 3 分钟
   - 人力成本优化：预计节省 30-50%

3. **实施建议**：
   - **第一阶段（0-2周）**：部署AI客服知识库 + 内容生成模板
   - **第二阶段（2-6周）**：接入销售助手和运营数据看板
   - **第三阶段（6-12周）**：全链路AI工作流闭环优化

### ⚡ 快速行动项

- [ ] 整理现有FAQ和产品知识库文档
- [ ] 选择1个最痛的场景作为POC试点
- [ ] 安排核心团队的AI工具使用培训

---
*此分析由 AI 造浪营智能引擎生成（演示模式）*
*实际部署后将接入 GPT-5.4 提供更精准的定制化分析能力。*`;
}
