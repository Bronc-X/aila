const fetch = require('node-fetch');

(async () => {
    const apiUrl = process.env.IMAGE_API_BASE_URL || "https://aicanapi.com/v1/images/generations";
    const apiKey = process.env.IMAGE_API_KEY;
    if (!apiKey) {
      throw new Error("IMAGE_API_KEY is required");
    }

    const prompt = "A cute dog, 商业级摄影, 棚拍质感, 顶级模特, 8k分辨率, 极致细节, 高级感, 柔和立体打光, 徕卡镜头, 极简背景设计, RAW photo, masterpiece, best quality";

    // 2. 调用 aicanapi / openai 兼容的同步出图接口
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-4.2-image",
        prompt: prompt,
        n: 1, // grok API usually only supports 1 image per request
        size: "1024x1024"
      })
    });

    console.log(res.status);
    console.log(await res.text());
})();
