import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export const workflowKeys = ["crossborder", "immigration"] as const;

export type WorkflowKey = (typeof workflowKeys)[number];
export type WorkflowRunStatus =
  | "idle"
  | "running"
  | "waiting_review"
  | "completed"
  | "error"
  | "cancelled"
  | "retrying";
export type WorkflowStepStatus =
  | "pending"
  | "running"
  | "waiting"
  | "completed"
  | "error"
  | "cancelled"
  | "retrying";

type WorkflowEventType = "info" | "success" | "warning" | "error";

type WorkflowEvent = {
  id: number;
  time: string;
  title: string;
  detail: string;
  type: WorkflowEventType;
  stepIndex: number;
};

type WorkflowStep = {
  id: string;
  name: string;
  actor: string;
  description: string;
  input: unknown;
  output: unknown;
  review?: boolean;
  failurePoint?: boolean;
  status: WorkflowStepStatus;
  progress: number;
  startedAt: string | null;
  finishedAt: string | null;
  actualDuration: number;
  runtimeLogs: Array<{ time: string; message: string; type: WorkflowEventType }>;
  error: string | null;
  attempts: number;
};

type FinalResult = {
  title: string;
  facts: Array<[string, string]>;
  document: string;
};

export type WorkflowRun = {
  runId: string;
  workflowKey: WorkflowKey;
  status: WorkflowRunStatus;
  statusNote: string;
  steps: WorkflowStep[];
  activeIndex: number;
  events: WorkflowEvent[];
  artifacts: string[];
  artifactCount: number;
  finalResult: FinalResult | null;
  startedAt: string;
  stoppedAt: string | null;
  injectFailure: boolean;
  failureConsumed: boolean;
};

type CrossborderFixture = {
  customer: string;
  contact: string;
  email: string;
  requestedProduct: string;
  quantity: number;
  destination: string;
  tradeTerm: string;
  deliveryWindow: string;
  certification: string;
};

type ImmigrationFixture = {
  leadId: string;
  contact: string;
  destination: string;
  familyMembers: number;
  source: string;
  consent: boolean;
  materials: string[];
};

const runtimeRoot = join(process.cwd(), ".codex-runtime", "workflow-runs");

const crossborderFixture: CrossborderFixture = {
  customer: "Northstar Outdoor GmbH",
  contact: "Lena Fischer",
  email: "lena@northstar-outdoor.example",
  requestedProduct: "NS-48 Portable Power Station",
  quantity: 240,
  destination: "Hamburg, Germany",
  tradeTerm: "FOB Shenzhen",
  deliveryWindow: "September 2026",
  certification: "CE / UN38.3",
};

const immigrationFixture: ImmigrationFixture = {
  leadId: "LEAD-IM-260802-014",
  contact: "王女士",
  destination: "加拿大",
  familyMembers: 3,
  source: "企业微信咨询",
  consent: true,
  materials: ["护照信息页", "学历证明", "工作经历摘要"],
};

function now() {
  return new Date().toISOString();
}

function isWorkflowKey(value: string): value is WorkflowKey {
  return workflowKeys.includes(value as WorkflowKey);
}

function assertRunId(runId: string) {
  if (!/^RUN-[A-Z0-9-]+$/.test(runId)) {
    throw new Error("Invalid workflow run id");
  }
}

function runDirectory(runId: string) {
  assertRunId(runId);
  return join(runtimeRoot, runId);
}

function runPath(runId: string) {
  return join(runDirectory(runId), "run.json");
}

function isReadOnlyFilesystemError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? error.code : null;
  return code === "EROFS";
}

async function saveRun(run: WorkflowRun) {
  try {
    await mkdir(runDirectory(run.runId), { recursive: true });
    await writeFile(runPath(run.runId), `${JSON.stringify(run, null, 2)}\n`, "utf8");
  } catch (error) {
    if (process.env.VERCEL === "1" || isReadOnlyFilesystemError(error)) return;
    throw error;
  }
}

async function writeArtifact(run: WorkflowRun, name: string, data: unknown) {
  try {
    await mkdir(runDirectory(run.runId), { recursive: true });
    await writeFile(join(runDirectory(run.runId), name), `${JSON.stringify(data, null, 2)}\n`, "utf8");
  } catch (error) {
    if (process.env.VERCEL === "1" || isReadOnlyFilesystemError(error)) return;
    throw error;
  }
}

function addEvent(
  run: WorkflowRun,
  title: string,
  detail: string,
  type: WorkflowEventType,
  stepIndex: number
) {
  const time = now();
  const event: WorkflowEvent = {
    id: run.events.length + 1,
    time,
    title,
    detail,
    type,
    stepIndex,
  };

  run.events.push(event);

  if (stepIndex >= 0 && run.steps[stepIndex]) {
    run.steps[stepIndex].runtimeLogs.push({
      time,
      message: `${title}${detail ? ` · ${detail}` : ""}`,
      type,
    });
  }
}

function completeStep(run: WorkflowRun, index: number, output: unknown) {
  const step = run.steps[index];
  const finishedAt = now();
  step.status = "completed";
  step.progress = 100;
  step.finishedAt = finishedAt;
  step.actualDuration = Math.max(1, Date.parse(finishedAt) - Date.parse(step.startedAt ?? finishedAt));
  step.output = output;
  addEvent(run, "节点执行完成", `${step.name} / ${step.actualDuration} ms`, "success", index);
}

function buildCrossborderSteps(): WorkflowStep[] {
  return [
    {
      id: "mail-intake",
      name: "接收并归档询盘",
      actor: "connector.mailbox",
      description: "读取脱敏询盘样例并创建运行输入快照。",
      input: { source: "sanitized-inquiry.json" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "requirement-extract",
      name: "提取采购需求",
      actor: "workflow.requirements",
      description: "从询盘字段生成结构化采购需求与缺失项列表。",
      input: { fields: ["产品", "数量", "目的地", "条款", "认证"] },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "catalog-match",
      name: "匹配产品与认证",
      actor: "connector.catalog",
      description: "读取本地产品目录，验证规格、认证和可报价状态。",
      input: { catalog: "local-catalog-v1" },
      output: {},
      failurePoint: true,
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "quote-draft",
      name: "生成报价草案",
      actor: "workflow.pricing",
      description: "按已核验产品、数量与物流条件计算报价并生成草案。",
      input: { currency: "USD", discountPolicy: "tiered-v1" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "sales-review",
      name: "销售负责人审批",
      actor: "human.sales-owner",
      description: "报价金额、折扣和交期需由销售负责人确认。",
      input: { checkpoint: "commercial-terms" },
      output: { approver: "Braven / Enterprise BD" },
      review: true,
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "crm-draft",
      name: "写入 CRM 草案",
      actor: "connector.crm",
      description: "将已审批的询盘和报价写入本地 CRM 草案记录。",
      input: { target: "local-crm-draft" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
  ];
}

function buildImmigrationSteps(): WorkflowStep[] {
  return [
    {
      id: "lead-intake",
      name: "接收咨询线索",
      actor: "connector.wecom",
      description: "读取脱敏企业微信线索并归档输入材料。",
      input: { source: "sanitized-lead.json" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "consent-check",
      name: "核验授权状态",
      actor: "workflow.compliance",
      description: "确认信息采集与后续评估已具备授权条件。",
      input: { policy: "consent-v1" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "eligibility-draft",
      name: "生成预评估草案",
      actor: "workflow.assessment",
      description: "根据目标地、家庭结构和材料完整度生成顾问预评估草案。",
      input: { ruleSet: "immigration-intake-v1" },
      output: {},
      failurePoint: true,
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "advisor-review",
      name: "顾问审批预评估",
      actor: "human.senior-advisor",
      description: "顾问确认事实、缺失材料与可对外表达边界。",
      input: { checkpoint: "advisor-assessment" },
      output: { approver: "Senior Immigration Advisor" },
      review: true,
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
    {
      id: "case-draft",
      name: "生成建案草案",
      actor: "connector.case-management",
      description: "将已审批预评估写入本地建案草稿，保留材料缺口。",
      input: { target: "local-case-draft" },
      output: {},
      status: "pending",
      progress: 0,
      startedAt: null,
      finishedAt: null,
      actualDuration: 0,
      runtimeLogs: [],
      error: null,
      attempts: 0,
    },
  ];
}

function initialResult(key: WorkflowKey): FinalResult {
  if (key === "crossborder") {
    return {
      title: "海外客户报价包已生成",
      facts: [
        ["报价编号", "QT-LOCAL-260802-018"],
        ["客户", crossborderFixture.customer],
        ["报价总额", "USD 29,840"],
        ["贸易条款", crossborderFixture.tradeTerm],
        ["报价有效期", "14 天"],
        ["CRM Owner", "Braven / Enterprise BD"],
      ],
      document: "",
    };
  }

  return {
    title: "线索预评估与建案草案已生成",
    facts: [
      ["线索编号", immigrationFixture.leadId],
      ["客户", immigrationFixture.contact],
      ["目的地", immigrationFixture.destination],
      ["状态", "待顾问确认后建案"],
      ["材料完整度", "3 / 5"],
      ["负责人", "Senior Immigration Advisor"],
    ],
    document: "",
  };
}

export async function createWorkflowRun(
  workflowKey: WorkflowKey,
  injectFailure = false
): Promise<WorkflowRun> {
  const runId = `RUN-${new Date().toISOString().replace(/\D/g, "").slice(4, 14)}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const run: WorkflowRun = {
    runId,
    workflowKey,
    status: "running",
    statusNote: "服务端运行实例已创建",
    steps: workflowKey === "crossborder" ? buildCrossborderSteps() : buildImmigrationSteps(),
    activeIndex: -1,
    events: [],
    artifacts: [],
    artifactCount: 0,
    finalResult: null,
    startedAt: now(),
    stoppedAt: null,
    injectFailure,
    failureConsumed: false,
  };

  addEvent(run, "服务端运行实例已创建", `${run.runId} / ${workflowKey}`, "info", -1);
  await saveRun(run);
  return run;
}

export async function loadWorkflowRun(runId: string) {
  const content = await readFile(runPath(runId), "utf8");
  const run: unknown = JSON.parse(content);
  if (!isWorkflowRun(run, runId)) {
    throw new Error("Invalid workflow run");
  }
  return run;
}

function isWorkflowRun(value: unknown, expectedRunId?: string): value is WorkflowRun {
  if (!value || typeof value !== "object") return false;

  const run = value as Partial<WorkflowRun>;
  if (
    typeof run.runId !== "string" ||
    (expectedRunId && run.runId !== expectedRunId) ||
    typeof run.workflowKey !== "string" ||
    !isWorkflowKey(run.workflowKey) ||
    !["idle", "running", "waiting_review", "completed", "error", "cancelled", "retrying"].includes(run.status ?? "") ||
    typeof run.statusNote !== "string" ||
    !Array.isArray(run.steps) ||
    !Array.isArray(run.events) ||
    !Array.isArray(run.artifacts) ||
    typeof run.artifactCount !== "number" ||
    typeof run.startedAt !== "string" ||
    (run.stoppedAt !== null && typeof run.stoppedAt !== "string") ||
    typeof run.injectFailure !== "boolean" ||
    typeof run.failureConsumed !== "boolean"
  ) {
    return false;
  }

  return run.steps.every((step) => {
    if (!step || typeof step !== "object") return false;
    const candidate = step as Partial<WorkflowStep>;
    return (
      typeof candidate.id === "string" &&
      ["pending", "running", "waiting", "completed", "error", "cancelled", "retrying"].includes(candidate.status ?? "")
    );
  });
}

async function resolveWorkflowRun(runId: string, previousRun?: unknown) {
  if (previousRun !== undefined) {
    if (!isWorkflowRun(previousRun, runId)) {
      throw new Error("Invalid previous workflow run");
    }
    return previousRun;
  }

  return loadWorkflowRun(runId);
}

async function runCrossborderStep(run: WorkflowRun, index: number) {
  const step = run.steps[index];

  switch (step.id) {
    case "mail-intake": {
      await writeArtifact(run, "01-inquiry-input.json", crossborderFixture);
      return {
        intakeId: "INQ-LOCAL-260802-018",
        customer: crossborderFixture.customer,
        source: "sanitized-inquiry.json",
      };
    }
    case "requirement-extract": {
      const requirements = {
        product: crossborderFixture.requestedProduct,
        quantity: crossborderFixture.quantity,
        destination: crossborderFixture.destination,
        tradeTerm: crossborderFixture.tradeTerm,
        deliveryWindow: crossborderFixture.deliveryWindow,
        requiredCertification: crossborderFixture.certification,
        missingFields: [],
      };
      await writeArtifact(run, "02-requirements.json", requirements);
      return requirements;
    }
    case "catalog-match": {
      if (run.injectFailure && !run.failureConsumed) {
        run.failureConsumed = true;
        throw new Error("本地认证目录读取失败：CERT_INDEX_TIMEOUT");
      }

      const catalogMatch = {
        sku: "NS-48-EU",
        product: crossborderFixture.requestedProduct,
        availableQuantity: 540,
        certifications: ["CE", "UN38.3"],
        quoteReady: true,
      };
      await writeArtifact(run, "03-catalog-match.json", catalogMatch);
      return catalogMatch;
    }
    case "quote-draft": {
      const unitPrice = 107.2;
      const goodsAmount = unitPrice * crossborderFixture.quantity;
      const freight = 2600;
      const compliancePack = 1500;
      const discount = 4.5;
      const quotedTotal = Math.round((goodsAmount + freight + compliancePack) * (1 - discount / 100));
      const quote = {
        quoteId: "QT-LOCAL-260802-018",
        customer: crossborderFixture.customer,
        currency: "USD",
        unitPrice,
        quantity: crossborderFixture.quantity,
        goodsAmount,
        freight,
        compliancePack,
        discount,
        total: quotedTotal,
        tradeTerm: crossborderFixture.tradeTerm,
        validDays: 14,
      };
      await writeArtifact(run, "04-quote-draft.json", quote);
      return quote;
    }
    case "crm-draft": {
      const crmDraft = {
        opportunityId: "CRM-LOCAL-260802-442",
        customer: crossborderFixture.customer,
        contact: crossborderFixture.contact,
        stage: "Proposal drafted",
        owner: "Braven / Enterprise BD",
        nextAction: "Confirm commercial terms and send approved quotation",
      };
      await writeArtifact(run, "05-crm-draft.json", crmDraft);
      run.artifacts = ["报价草案", "客户邮件草案", "CRM 草案记录"];
      run.artifactCount = run.artifacts.length;
      run.finalResult = {
        ...initialResult("crossborder"),
        document: [
          `SUBJECT: Quotation for ${crossborderFixture.requestedProduct}`,
          "",
          `Dear ${crossborderFixture.contact},`,
          "",
          `Based on the approved requirements, the local execution record has generated a draft quotation for ${crossborderFixture.quantity} units.`,
          `Total: USD 29,840 / ${crossborderFixture.tradeTerm} / Valid for 14 days.`,
          "",
          "This is a local reproducible run using sanitized input. No external mailbox, ERP, CRM, or email sending has been connected.",
        ].join("\n"),
      };
      return crmDraft;
    }
    default:
      return step.output;
  }
}

async function runImmigrationStep(run: WorkflowRun, index: number) {
  const step = run.steps[index];

  switch (step.id) {
    case "lead-intake": {
      await writeArtifact(run, "01-lead-input.json", immigrationFixture);
      return {
        leadId: immigrationFixture.leadId,
        source: immigrationFixture.source,
        materials: immigrationFixture.materials,
      };
    }
    case "consent-check": {
      const consent = {
        consentConfirmed: immigrationFixture.consent,
        approvedForAssessment: immigrationFixture.consent,
        policy: "consent-v1",
      };
      await writeArtifact(run, "02-consent-check.json", consent);
      return consent;
    }
    case "eligibility-draft": {
      if (run.injectFailure && !run.failureConsumed) {
        run.failureConsumed = true;
        throw new Error("本地政策规则集读取失败：RULESET_TIMEOUT");
      }

      const assessment = {
        leadId: immigrationFixture.leadId,
        destination: immigrationFixture.destination,
        familyMembers: immigrationFixture.familyMembers,
        materialCompleteness: "3 / 5",
        missingMaterials: ["语言成绩", "近三年个税或工资证明"],
        advisorAction: "确认职业路径与资金证明范围",
      };
      await writeArtifact(run, "03-assessment-draft.json", assessment);
      return assessment;
    }
    case "case-draft": {
      const caseDraft = {
        caseDraftId: "CASE-LOCAL-260802-091",
        leadId: immigrationFixture.leadId,
        stage: "Advisor approved / pending client document collection",
        owner: "Senior Immigration Advisor",
        missingMaterials: ["语言成绩", "近三年个税或工资证明"],
      };
      await writeArtifact(run, "04-case-draft.json", caseDraft);
      run.artifacts = ["预评估草案", "材料缺口清单", "建案草案"];
      run.artifactCount = run.artifacts.length;
      run.finalResult = {
        ...initialResult("immigration"),
        document: [
          `线索：${immigrationFixture.leadId} / ${immigrationFixture.contact}`,
          "",
          `目的地：${immigrationFixture.destination}`,
          "预评估状态：已由顾问确认，等待补齐材料后建案。",
          "材料缺口：语言成绩；近三年个税或工资证明。",
          "",
          "此记录来自本地可复现执行和脱敏输入，不包含客户系统写入或对外发送。",
        ].join("\n"),
      };
      return caseDraft;
    }
    default:
      return step.output;
  }
}

async function executeStep(run: WorkflowRun, index: number) {
  const step = run.steps[index];
  const output =
    run.workflowKey === "crossborder"
      ? await runCrossborderStep(run, index)
      : await runImmigrationStep(run, index);
  completeStep(run, index, output);
}

export async function advanceWorkflowRun(runId: string, previousRun?: unknown) {
  const run = await resolveWorkflowRun(runId, previousRun);

  if (!["running", "retrying"].includes(run.status)) {
    return run;
  }

  const index = run.steps.findIndex((step) => step.status === "pending");
  if (index < 0) {
    run.status = "completed";
    run.statusNote = "所有服务端节点已完成";
    run.stoppedAt = now();
    addEvent(run, "工作流完成", run.artifacts.join(" + "), "success", run.steps.length - 1);
    await saveRun(run);
    return run;
  }

  const step = run.steps[index];
  run.activeIndex = index;
  step.status = run.status === "retrying" ? "retrying" : "running";
  step.progress = 0;
  step.startedAt = now();
  step.finishedAt = null;
  step.actualDuration = 0;
  step.error = null;
  step.attempts += 1;
  addEvent(run, "节点开始执行", `${step.name} / ${step.actor}`, "info", index);

  if (step.review) {
    step.status = "waiting";
    step.progress = 100;
    run.status = "waiting_review";
    run.statusNote = "关键业务动作等待人工确认";
    addEvent(run, "流程进入人工审批", step.description, "warning", index);
    await saveRun(run);
    return run;
  }

  try {
    await executeStep(run, index);
    run.status = "running";
    run.statusNote = "服务端已提交下一节点";
  } catch (error) {
    const finishedAt = now();
    step.status = "error";
    step.progress = 0;
    step.finishedAt = finishedAt;
    step.actualDuration = Math.max(1, Date.parse(finishedAt) - Date.parse(step.startedAt ?? finishedAt));
    step.error = error instanceof Error ? error.message : "未知执行错误";
    run.status = "error";
    run.statusNote = "节点失败，可从当前节点重试";
    run.stoppedAt = finishedAt;
    addEvent(run, "节点执行失败", step.error, "error", index);
  }

  await saveRun(run);
  return run;
}

export async function applyWorkflowAction(
  runId: string,
  action: "approve" | "reject" | "cancel" | "retry",
  previousRun?: unknown
) {
  const run = await resolveWorkflowRun(runId, previousRun);
  const activeStep = run.steps[run.activeIndex];

  if (action === "cancel" && ["running", "waiting_review", "retrying"].includes(run.status)) {
    if (activeStep && !["completed", "error"].includes(activeStep.status)) {
      activeStep.status = "cancelled";
      activeStep.finishedAt = now();
      activeStep.actualDuration = Math.max(
        1,
        Date.parse(activeStep.finishedAt) - Date.parse(activeStep.startedAt ?? activeStep.finishedAt)
      );
    }
    run.status = "cancelled";
    run.statusNote = "运行已由操作员终止";
    run.stoppedAt = now();
    addEvent(run, "工作流已取消", activeStep ? `停止于：${activeStep.name}` : "尚未进入节点", "error", run.activeIndex);
  }

  if (action === "approve" && run.status === "waiting_review" && activeStep) {
    completeStep(run, run.activeIndex, activeStep.output);
    run.status = "running";
    run.statusNote = "人工审批已通过，继续执行";
    addEvent(run, "人工审批通过", String((activeStep.output as { approver?: string }).approver ?? "APPROVED"), "success", run.activeIndex);
  }

  if (action === "reject" && run.status === "waiting_review" && activeStep) {
    activeStep.status = "error";
    activeStep.error = "人工审批退回：请修订商业条件或风险说明后重新提交";
    activeStep.finishedAt = now();
    activeStep.actualDuration = Math.max(
      1,
      Date.parse(activeStep.finishedAt) - Date.parse(activeStep.startedAt ?? activeStep.finishedAt)
    );
    run.status = "error";
    run.statusNote = "审批退回，可重试当前节点";
    run.stoppedAt = now();
    addEvent(run, "人工审批退回", "等待修订后重新提交", "error", run.activeIndex);
  }

  if (action === "retry" && run.status === "error") {
    const failedIndex = run.steps.findIndex((step) => step.status === "error");
    if (failedIndex >= 0) {
      const failedStep = run.steps[failedIndex];
      failedStep.status = "pending";
      failedStep.progress = 0;
      failedStep.startedAt = null;
      failedStep.finishedAt = null;
      failedStep.actualDuration = 0;
      failedStep.error = null;
      run.activeIndex = failedIndex;
      run.status = "retrying";
      run.statusNote = "从失败节点恢复服务端执行";
      run.stoppedAt = null;
      addEvent(run, "节点准备重试", failedStep.name, "warning", failedIndex);
    }
  }

  await saveRun(run);
  return run;
}

export function parseWorkflowKey(value: unknown): WorkflowKey | null {
  return typeof value === "string" && isWorkflowKey(value) ? value : null;
}
