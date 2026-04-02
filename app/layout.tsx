import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { PresenterHub } from "@/components/slides/PresenterHub";
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
  title: "AI造浪营 · 智企实验室闭门会",
  description: "让AI真正走进企业的每一个环节 — 为企业主打造的AI赋能实战培训",
  keywords: ["AI培训", "企业AI", "数字化转型", "AI工具", "企业赋能"],
  openGraph: {
    title: "AI造浪营 · 智企实验室闭门会 S1",
    description: "两天闭门实战，从认知到工具，让AI真正走进企业的每一个业务环节",
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
      </body>
    </html>
  );
}

