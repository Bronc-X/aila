import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch as Github, Mail, MessageCircle, Moon, Star } from "lucide-react";
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
  src: string;
  alt: string;
};

const qrChannels: QrChannel[] = [
  {
    label: "微信",
    src: "/wechat-qr.jpg",
    alt: "Toni WeChat QR code",
  },
  {
    label: "WhatsApp",
    src: "/whatsapp-qr.png",
    alt: "Toni WhatsApp QR code",
  },
  {
    label: "Telegram",
    src: "/telegram-qr.png",
    alt: "Toni Telegram QR code",
  },
];

const principles = [
  ["先看现场", "从一张表、一段对话、一次交付卡顿开始，确认问题到底发生在哪个动作里。"],
  ["先做雏形", "能点、能试、能被追问的版本，往往比一份厚方案更快暴露真实答案。"],
  ["先让人用", "交付之后还要有人愿意打开、敢于判断，并能把结果带回日常工作。"],
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
          <Link href="/tools">工具</Link>
          <Link href="/aila">FDE</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <section className={styles.contactHero}>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>
            <Moon size={16} />
            Toni / AI workflow companion
          </p>
          <h1>把你卡住的业务现场发给我。</h1>
        </div>

        <aside className={styles.qrPanel} aria-label="Contact QR codes">
          <div className={styles.qrStack}>
            {qrChannels.map((channel) => (
              <div className={styles.qrTile} key={channel.label}>
                <div className={styles.qrFrame}>
                  <Image src={channel.src} alt={channel.alt} fill sizes="12rem" priority />
                </div>
                <strong>{channel.label}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>先把问题拆小，再把工具跑起来。</h2>
        </div>
        <div className={styles.grid}>
          {principles.map(([title, text]) => (
            <article className={styles.card} key={title}>
              <small>Principle</small>
              <MessageCircle size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
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
            <Image
              src="/brand/toni-lotus/lotus-runtime-wordmark-ink.svg"
              alt=""
              width={164}
              height={41}
              aria-hidden="true"
            />
          </span>
          <div>
            <small>Agent Operating Layer</small>
            <strong>{lotusRepo?.full_name ?? "Bronc-X/Lotus"}</strong>
            <p>把工程协议、质量门禁和协作规则沉淀成可复用的项目启动层。</p>
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
