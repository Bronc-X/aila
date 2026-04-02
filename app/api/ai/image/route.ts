import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "缺少 prompt 参数" }, { status: 400 });
    }

    const apiUrl = process.env.IMAGE_API_BASE_URL || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
    const apiKey = process.env.IMAGE_API_KEY;

    if (!apiKey) {
      // 开发模式无密钥时，返回 Mock 占位图
      return NextResponse.json({
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
      });
    }

    // 1. 提交异步任务
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-DashScope-Async": "enable" // 万相生图强制走异步接口
      },
      body: JSON.stringify({
        model: process.env.IMAGE_MODEL || "wanx-v1",
        input: { prompt },
        parameters: { 
          style: "<auto>", 
          size: "1024*1024", 
          n: 1 
        }
      })
    });

    const data = await res.json();
    if (!res.ok || !data.output?.task_id) {
      throw new Error(data.message || `API调用失败: ${res.status}`);
    }

    const taskId = data.output.task_id;

    // 2. 轮询任务状态 (最大等待约 30 秒)
    for (let i = 0; i < 15; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pollRes = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const pollData = await pollRes.json();

      if (pollData.output?.task_status === "SUCCEEDED") {
        const imageUrl = pollData.output.results[0]?.url;
        return NextResponse.json({ url: imageUrl });
      }

      if (pollData.output?.task_status === "FAILED") {
        throw new Error(pollData.output.message || "阿里云万相任务执行失败");
      }
    }

    throw new Error("生成超时，请稍后再试");
  } catch (error: any) {
    console.error("Image API Error:", error);
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}
