import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { PresenterHub } from "@/components/slides/PresenterHub";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AlmaVerifiedBadge from "./components/AlmaVerifiedBadge";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toni | AI 工具陪跑与企业流程原型",
  description: "把业务卡点拆成可演示、可复核、可交给团队试用的 AI 工具、工作流和企业系统原型。",
  keywords: ["Toni", "AI 工具陪跑", "企业流程原型", "Agent 工作流", "企业培训"],
  openGraph: {
    title: "Toni | AI 工具陪跑与企业流程原型",
    description: "从真实业务现场出发，把问题做成可运行、可验证、可训练的系统。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AlmaVerifiedBadge className="alma-verified-corner" compact />
        <PresenterHub />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

