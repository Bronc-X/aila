import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch as Github, Mail, MessageCircle, Star } from "lucide-react";
import styles from "../site.module.css";

export const dynamic = "force-dynamic";

type GitHubRepo = {
  full_name: string;
  html_url: string;
  stargazers_count: number;
  description: string | null;
};

const directLinks = [
  {
    label: "Email",
    value: "Broncin@163.com",
    href: "mailto:Broncin@163.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/Bronc-X",
    href: "https://github.com/Bronc-X",
    icon: Github,
  },
];

type QrChannel = {
  label: string;
  detail: string;
  src: string;
  alt: string;
};

const qrChannels: QrChannel[] = [
  {
    label: "微信",
    detail: "WeChat direct",
    src: "/wechat-qr.jpg",
    alt: "Toni WeChat QR code",
  },
  {
    label: "WhatsApp",
    detail: "WhatsApp direct",
    src: "/whatsapp-qr.png",
    alt: "Toni WhatsApp QR code",
  },
  {
    label: "Telegram",
    detail: "Telegram direct",
    src: "/telegram-qr.png",
    alt: "Toni Telegram QR code",
  },
];

async function getLotusRepo(): Promise<GitHubRepo | null> {
  try {
    const response = await fetch("https://api.github.com/repos/Bronc-X/Lotus", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "aila-contact-page",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const lotusRepo = await getLotusRepo();
  const lotusStars = lotusRepo?.stargazers_count.toLocaleString("en-US") ?? "实时获取中";

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/tools">工具</Link>
          <Link href="/about">关于</Link>
          <Link href="/contact">联系</Link>
        </div>
      </nav>

      <section className={styles.contactHero}>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>
            <MessageCircle size={16} />
            Contact Toni
          </p>
          <h1>把你的想法、现场和卡住的地方发给我。</h1>
          <p>
            微信最快。也可以先用邮件说清项目背景、现有流程、团队规模，以及你最想先解决的那件事。
          </p>
        </div>

        <aside className={styles.qrPanel} aria-label="Contact QR codes">
          <div className={styles.qrStack}>
            {qrChannels.map((channel) => (
              <div className={styles.qrTile} key={channel.label}>
                <div className={styles.qrFrame}>
                  <Image src={channel.src} alt={channel.alt} fill sizes="12rem" priority />
                </div>
                <strong>{channel.label}</strong>
                <span>{channel.detail}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.contactSection}>
        <a
          href={lotusRepo?.html_url ?? "https://github.com/Bronc-X/Lotus"}
          className={styles.openSourceCard}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Bronc-X Lotus on GitHub"
        >
          <span className={styles.openSourceBadge}>
            <Github size={16} />
            Open Source Project
          </span>
          <div>
            <small>Lotus</small>
            <strong>{lotusRepo?.full_name ?? "Bronc-X/Lotus"}</strong>
            <p>
              Lotus 是我维护的开源 AI Agent 规则项目：把工程协议写一次，部署到不同 IDE 与编码 Agent。
            </p>
          </div>
          <span className={styles.starCount}>
            <Star size={18} fill="currentColor" />
            {lotusStars} stars
          </span>
          <ArrowUpRight size={18} className={styles.openSourceArrow} />
        </a>

        <div className={styles.contactGrid}>
          {directLinks.map((item) => (
            <a key={item.label} href={item.href} className={styles.contactCard} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
              <item.icon size={22} />
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
