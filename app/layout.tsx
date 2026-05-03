import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { PresenterHub } from "@/components/slides/PresenterHub";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Toni | 产品、流程与企业系统设计",
  description: "Toni 的个人官网：展示企业工具、工作流改造、系统原型和课程训练能力。",
  keywords: ["Toni", "产品设计", "企业系统", "系统设计", "工作流改造", "企业培训"],
  openGraph: {
    title: "Toni | 产品、流程与企业系统设计",
    description: "把产品判断和业务流程做成可演示、可训练、可交付的系统。",
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
        <PresenterHub />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

