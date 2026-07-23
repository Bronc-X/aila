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
  title: "Toni | 企业 FDE 交付与项目作品集",
  description: "围绕企业真实业务，展示从数据管道、知识资产、工作流到可运行系统的 FDE 项目交付与作品案例。",
  keywords: ["Toni", "企业 FDE", "FDE 项目交付", "数据管道", "企业知识资产", "Agent 工程", "项目作品集"],
  openGraph: {
    title: "Toni | 企业 FDE 交付与项目作品集",
    description: "从业务现场、数据处理和系统约束出发，展示可检查的企业 FDE 交付过程与项目成果。",
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
      data-scroll-behavior="smooth"
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
