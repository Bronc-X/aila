<div align="center">
  <img src="app/icon.svg" width="128" height="128" alt="AILA Logo" />
  <h1>AILA / Toni OS</h1>
  <p><strong>Enterprise-Grade AI Infrastructure & Immersive Presentation Engine</strong></p>
</div>

---

## ✦ Overview

**AILA (AI Camp 2026)** is the master orchestration platform designed for elite AI training and live demonstration. It breaks the boundaries of traditional Keynote/PPT presentations by wrapping an enterprise-grade AI tool suite inside an immersive, Silicon Valley-tier ultra-minimalist UI.

Built on Next.js 16 (App Router) and reacting seamlessly with Framer Motion, it connects in real-time with **Alibaba Cloud DashScope (Qwen-Plus & Wanx-v1)** to render real-world business scenarios within milliseconds—live on stage.

## ✦ Core Features

- **100% Immersive Slide Engine**: A highly tailored presentation engine built from scratch. Bypasses PowerPoint limitations entirely. Supports fullscreen mode, immersive scroll, keyboard hotkeys, and features a frictionless, auto-hiding "stealth dock" for zero-distraction stage mastery.
- **Enterprise Authenticator**: A fortified checkpoint gateway (`app/login`), ensuring absolute data security through an encrypted prototype initialization wall (Current Auth Code: `2026`).
- **Real-Time Live Coding Interface**: A custom-designed `24rem` massive countdown module built for high-stakes 45-minute live development sessions. No artificial keypads, completely stealth-triggered via hidden click states.
- **Acquisition Tool Array (Image Synthesis)**: Integrates directly with Alibaba's newest `Wanx-v1` AI architecture, generating quadruple, commercial-grade advertising matrices asynchronously with multi-task polling routines.
- **Dynamic Responsive DNA**: Absolute UI consistency from an iPhone screen up to an 8k theater projector. Employs meticulous typography, deep OLED-blacks (`#111111`), and luxury metadata optimization.

## ✦ Architecture Stack

- **Framework**: `Next.js 16.2` (React 19, Turbopack)
- **Styling**: `Tailwind CSS 3.4` (Minimalist YC/Stripe aesthetic)
- **Animation**: `Framer Motion` (Spring-based physics interactions)
- **Icons**: `Lucide React`
- **Model Engine**: Aliyun DashScope APIs (Qwen-Plus, Wanx-v1)
- **Deployment OS**: Vercel Serverless Edge

## ✦ Configuration & Deployment

1. Ensure environment variables are loaded (`.env.local`):
   ```env
   # 语言模型接口
   GPT_API_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
   GPT_API_KEY="sk-**************"
   GPT_MODEL="qwen-plus"
   
   # 万相生图接口
   IMAGE_API_BASE_URL="https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
   IMAGE_API_KEY="sk-**************"
   IMAGE_MODEL="wanx-v1"
   ```

2. Initialization:
   ```bash
   npm install
   npm run dev
   ```

3. **Cloud Production Deployment**:  
   Code is optimized for zero-config deployment on Vercel. Global DNS routed optimally via `cname-china.vercel-dns.com` for China-Mainland unthrottled access.

## ✦ Lusie / ShipModel Baseline

The ShipModel integration is mounted at `/lusie`:

- `/lusie` keeps the Toni entry page with two choices.
- `/lusie/showcase` runs the public Lusie showcase.
- `/lusie/ai` runs the AI model workspace.
- `/api/lusie/*` hosts the migrated generation API.

Before and after changing this surface, run:

```bash
npm run test:baseline
```

The baseline first verifies the STL download route serves same-origin `model/stl` bytes instead of redirecting to a remote Tripo URL, and that Supabase history sync keeps the STL source metadata needed by online downloads. It then builds Next.js, starts a production server on a temporary local port, and checks the Lusie routes plus the handshake and validation API guard.

The same command also protects the `/now` profile data and media map: it checks that the own-project list, companion-case list, credential image, WeChat entry, and every referenced local public asset stay intact.

Future Lusie 3D, STL, Tripo, run storage, download-page, or `/now` portfolio/media changes must run this baseline before and after the change. The protected golden behavior is: a Ready run's STL endpoint must not 302 out of the app, Supabase sync must not erase `_files.stlSourceUrl`, the browser preview must not silently replace a failed STL load with the parametric placeholder model, and the `/now` page must not silently lose project/media evidence.

---
*Developed with supreme aesthetic precision by Toni.*
