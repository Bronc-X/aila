import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch as Github, Mail, MessageCircle } from "lucide-react";
import styles from "../site.module.css";

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

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
          <Link href="/contact">联系</Link>
        </div>
      </nav>

      <section className={styles.contactHero}>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>
            <MessageCircle size={16} />
            Contact Toni
          </p>
          <h1>把想法、业务现场和交付问题发给我。</h1>
          <p>
            微信是最快入口。也可以先用邮件发项目背景、现有流程、团队规模和你希望 AI 系统解决的具体问题。
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
