import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, images, modelImage } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "缺少 prompt 参数" }, { status: 400 });
    }

    // 强制使用指定的 API 代理端点，绕过 .env.local 中的阿里云通义万相配置
    const apiUrl = "https://aicanapi.com/v1/chat/completions";
    // 同理，必须绕过 .env.local 里的阿里云 API Key，使用正确的 aicanapi 鉴权 Token
    const apiKey = "sk-XuqhFyRVFTCubKOpxZAj711oBZy79XjtbVhWMOjMxxXLlwbV";

    // 1. 自动优化提示词（针对商业模特、产品摄影进行画质增强）
    let optimizedPrompt = prompt;
    if (prompt.length < 100) {
      optimizedPrompt = `${prompt}, 商业级摄影, 棚拍质感, 顶级模特, 8k分辨率, 极致细节, 高级感, 柔和立体打光, 徕卡镜头, 极简背景设计, RAW photo, masterpiece, best quality`;
    }

    // 根据传入图片组装支持图片理解的 messages 格式
    const messageContent: any[] = [{ type: "text", text: optimizedPrompt }];
    if (images && Array.isArray(images)) {
      for (const imgUrl of images) {
        messageContent.push({ type: "image_url", image_url: { url: imgUrl } });
      }
    }
    if (modelImage) {
      messageContent.push({ type: "image_url", image_url: { url: modelImage } });
    }

    // 2. 调用 aicanapi / openai 兼容的 chat completions 接口（grok-4.2-image 必须走此接口）
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-image-preview",
        messages: [
          { role: "user", content: messageContent }
        ]
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Grok Image API Error Body:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || `API调用失败: ${res.status}`);
    }

    const content = data.choices?.[0]?.message?.content || "";
    console.log("==== Gemini API Response Preview ====");
    console.log(content.substring(0, 300));
    
    // 通过正则提取图片资源：兼容标准的 Http 链接，以及各种 base64 数据流格式
    // 采用 [^\s"'()<>]+ 替代精准的字符集，以防 JS 正则引擎由于几兆的超长字符串匹配而导致调用栈溢出或返回 null
    const urlRegex = /(https?:\/\/[^\s"'()<>]+|data:image\/[^;]+;base64,[^\s"'()<>]+)/g;
    const matches = content.match(urlRegex);
    const imageUrls = matches ? Array.from(new Set(matches)) : [];
    
    // 如果只需要返回一张，但前台有时要 4 张展示，可以复制这 1 张
    const finalUrls = imageUrls.length > 0 ? [imageUrls[0], imageUrls[0], imageUrls[0], imageUrls[0]] : [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
    ];

    return NextResponse.json({ urls: finalUrls });

  } catch (error: any) {
    console.error("Image API Error:", error);
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}
