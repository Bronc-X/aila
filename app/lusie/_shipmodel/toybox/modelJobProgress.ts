import type { ModelJobEvent } from "../types";

export type ModelTimelineItem = {
  id: string;
  tag: string;
  message: string;
  detail: string;
  state: "active" | "done" | "error" | "warn";
};

export type ModelFailureSummary = {
  title: string;
  action: string;
  detail: string;
};

export function summarizeModelFailure(reasons: string[] = []): ModelFailureSummary {
  const detail = reasons.filter(Boolean).join("\n");
  if (!detail) {
    return {
      title: "正在读取失败原因",
      action: "正在从本地 API 恢复这次生成记录，请稍等。",
      detail: ""
    };
  }
  const normalized = detail.toLowerCase();

  if (normalized.includes("tripo_api_key") || normalized.includes("tripo api key")) {
    return {
      title: "Tripo API Key 未配置",
      action: "先在本地 .env.local 填入 TRIPO_API_KEY，再重启 API 服务。",
      detail
    };
  }

  if (normalized.includes("tripo image upload") && (normalized.includes("timeout") || normalized.includes("connect timeout") || normalized.includes("und_err_connect_timeout"))) {
    return {
      title: "Tripo 上传连接超时",
      action: "先检查 WARP/VPN、DNS 或代理，再重试生成。",
      detail
    };
  }

  if (normalized.includes("tripo request failed before response") || normalized.includes("fetch failed") || normalized.includes("name resolution") || normalized.includes("enotfound")) {
    return {
      title: "Tripo 网络连接失败",
      action: "当前机器没有稳定连到 Tripo API，请先恢复网络后重试。",
      detail
    };
  }

  if (normalized.includes("tripo image upload failed")) {
    return {
      title: "Tripo 图片上传失败",
      action: "概念图没有成功上传到 Tripo，请重新生成概念图或稍后重试。",
      detail
    };
  }

  if (normalized.includes("tripo api error") || normalized.includes("tripo task") || normalized.includes("image_to_model")) {
    return {
      title: "Tripo 建模任务失败",
      action: "这是 Tripo 返回的建模错误，请按下方原始信息判断是否需要换图或重试。",
      detail
    };
  }

  if (normalized.includes("stl_") || normalized.includes("validate_stl")) {
    return {
      title: "STL 文件校验失败",
      action: "Tripo 返回了文件，但本地基础校验未通过，请重新生成或检查下载文件。",
      detail
    };
  }

  return {
    title: "模型生成失败",
    action: "请查看下方原始错误，再决定是重试、换图还是调整参数。",
    detail
  };
}

export function buildModelTimeline(events: ModelJobEvent[], busy: boolean): ModelTimelineItem[] {
  const base = events.length
    ? events
    : [{ type: "job.started" as const, jobId: "pending", title: "等待模型生成任务开始", at: new Date().toISOString() }];

  const timeline = base.slice(-8).map((event, index) => ({
    id: `${event.type}-${event.at}-${index}`,
    tag: eventTag(event),
    message: eventMessage(event),
    detail: eventDetail(event),
    state: eventState(event)
  }));

  if (busy && !events.some((event) => event.type === "tool.started")) {
    timeline.push({
      id: "waiting-first-tool",
      tag: "WAIT",
      message: "等待后端工具事件",
      detail: "连接已建立后会显示 Tripo 调用、STL 校验和产物写入。",
      state: "active"
    });
  }

  return timeline;
}

function eventTag(event: ModelJobEvent) {
  if (event.type === "artifact.created") return "ARTIFACT";
  if (event.type === "step.failed") return "ERROR";
  if (event.type === "job.started") return "JOB";
  if (event.type === "job.completed") return "DONE";
  if (event.type === "step.started") return "STEP";
  if (event.type === "artifact.patch") return "PATCH";
  return event.name.replace(/_/g, "-").toUpperCase();
}

function eventMessage(event: ModelJobEvent) {
  if (event.type === "job.started") return event.title;
  if (event.type === "step.started") return event.title;
  if (event.type === "tool.started") return toolStartedMessage(event.name);
  if (event.type === "tool.completed") return toolCompletedMessage(event.name, event.outputSummary);
  if (event.type === "artifact.created") return event.title ?? `${event.kind} 已创建`;
  if (event.type === "artifact.patch") return "产物已更新";
  if (event.type === "step.failed") return event.error;
  if (event.response?.run.status === "Ready") return "模型生成完成";
  if (event.response?.run.status === "Failed") return "模型生成失败";
  return "任务结束";
}

function eventDetail(event: ModelJobEvent) {
  if (event.type === "tool.started") return toolStartedDetail(event.name, event.inputSummary);
  if (event.type === "tool.completed") return toolCompletedDetail(event.name, event.outputSummary);
  if (event.type === "artifact.created") return `${event.kind} 产物已进入检查台。`;
  if (event.type === "artifact.patch") return "结构化产物补丁已应用。";
  if (event.type === "step.failed") return event.recoverable ? summarizeModelFailure([event.error]).action : "任务已停止。";
  if (event.type === "job.completed" && event.response?.run.status === "Ready") return "后端已保存可下载 STL。";
  if (event.type === "job.completed" && event.response?.run.status === "Failed") return "后端已保存失败原因，稍后进入失败页。";
  if (event.type === "job.completed") return "任务结束但没有返回模型。";
  return "事件来自后端生成链路。";
}

function eventState(event: ModelJobEvent): ModelTimelineItem["state"] {
  if (event.type === "step.failed") return "error";
  if (event.type === "tool.started" || event.type === "step.started" || event.type === "job.started") return "active";
  if (event.type === "job.completed" && event.response?.run.status === "Failed") return "error";
  if (event.type === "job.completed" && !event.response) return "warn";
  return "done";
}

function toolStartedMessage(name: string) {
  const label = toolLabel(name);
  if (name.includes("poll")) return `正在监听 ${label}`;
  if (name.includes("download")) return `正在接收 ${label}`;
  if (name.includes("validate")) return `正在校验 ${label}`;
  return `正在执行 ${label}`;
}

function toolCompletedMessage(name: string, outputSummary?: string) {
  const status = parseTripoStatus(outputSummary);
  if (status) return status.message;
  return `${toolLabel(name)} 已返回`;
}

function toolStartedDetail(name: string, inputSummary?: string) {
  if (name === "tripo_image_to_model") return inputSummary ? `已把概念图「${inputSummary}」交给 Tripo。` : "已开始调用 Tripo image-to-model。";
  if (name === "prepare_tripo_image") return inputSummary ? `正在准备概念图「${inputSummary}」的上传输入。` : "正在准备 Tripo 可读取的图像输入。";
  if (name === "tripo_create_model_task") return "正在创建 image-to-model 任务，等待 Tripo 返回任务 ID。";
  if (name === "tripo_poll_model_task") return inputSummary ? `正在轮询模型任务 ${inputSummary}。` : "正在轮询模型任务状态。";
  if (name === "tripo_create_stl_task") return inputSummary ? `正在把模型任务 ${inputSummary} 转换为 STL。` : "正在创建 STL 转换任务。";
  if (name === "tripo_poll_stl_task") return inputSummary ? `正在轮询 STL 转换任务 ${inputSummary}。` : "正在轮询 STL 转换状态。";
  if (name === "validate_stl") return inputSummary ? `正在检查 ${inputSummary} 是否可下载、非空且格式合理。` : "正在执行 STL 基础校验。";
  if (name.includes("download")) return inputSummary ?? "正在从外部生成服务接收资产。";
  return inputSummary ?? "等待返回。";
}

function toolCompletedDetail(name: string, outputSummary?: string) {
  const status = parseTripoStatus(outputSummary);
  if (status) return status.detail;
  if (!outputSummary) return "已返回。";
  if (name === "prepare_tripo_image") return outputSummary.includes("file_token") ? "图片已上传。" : "图片 URL 可用。";
  if (name === "tripo_create_model_task") return outputSummary.replace(/^Model task\s+/i, "任务 ");
  if (name === "tripo_create_stl_task") return outputSummary.replace(/^STL conversion task\s+/i, "任务 ");
  if (name === "tripo_image_to_model") return outputSummary;
  if (name === "tripo_download_model_asset") return `已保存 ${outputSummary}`;
  if (name === "tripo_download_stl") return `已保存 ${outputSummary}`;
  if (name === "validate_stl") return "校验通过。";
  return outputSummary;
}

function toolLabel(name: string) {
  const labels: Record<string, string> = {
    select_concept: "图像和打印参数",
    tripo_image_to_model: "Tripo 建模",
    prepare_tripo_image: "图像输入",
    tripo_create_model_task: "模型任务",
    tripo_poll_model_task: "模型任务状态",
    tripo_poll_model_task_status: "模型任务状态",
    tripo_download_model_asset: "GLB 源模型",
    tripo_create_stl_task: "STL 转换任务",
    tripo_poll_stl_task: "STL 转换状态",
    tripo_poll_stl_task_status: "STL 转换状态",
    tripo_download_stl: "STL 文件",
    validate_stl: "STL 文件"
  };
  return labels[name] ?? name.replace(/_/g, " ");
}

function parseTripoStatus(outputSummary?: string) {
  if (!outputSummary || !outputSummary.includes(":")) return null;
  const [taskId, rawStatus] = outputSummary.split(":").map((part) => part.trim());
  const status = rawStatus.toLowerCase();
  const isDone = ["success", "succeeded", "completed"].includes(status);
  const isFailed = ["failed", "cancelled", "canceled", "banned", "expired"].includes(status);
  if (isDone) {
    return {
      message: "Tripo 任务已完成",
      detail: `${taskId}: ${rawStatus}`
    };
  }
  if (isFailed) {
    return {
      message: "Tripo 返回失败状态",
      detail: `${taskId}: ${rawStatus}`
    };
  }
  return {
    message: "Tripo 仍在处理",
    detail: `${taskId}: ${rawStatus}`
  };
}
