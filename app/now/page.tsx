import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CheckCircle2, GitBranch, Mail, MessageCircle, Sparkles, Star } from "lucide-react";
import profile from "@/data/toni-now.json";
import MediaGallery from "./MediaGallery";
import styles from "./toni-now.module.css";

export const metadata: Metadata = {
  title: "Toni | 企业专家模型搭建与 AI 项目落地",
  description: "Toni 的自有项目、企业专家模型搭建、Agentic Coding 陪跑、交付案例与可信背书。",
};

export default function ToniNowPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>T</span>
          Toni
        </Link>
        <div className={styles.navLinks}>
          <a href="#updates">本周更新</a>
          <a href="#projects">项目</a>
          <a href="#contact">联系</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <Sparkles size={16} />
              Portfolio updated {profile.updatedAt}
            </p>
            <h1>{profile.headline}</h1>
            <div className={styles.actions}>
              <a href="#contact" className={styles.primaryButton}>
                私聊一个业务现场 <MessageCircle size={18} />
              </a>
              <a href="#projects" className={styles.secondaryButton}>
                看项目证据 <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <aside className={styles.signalPanel} aria-label="Toni profile summary">
            <div className={styles.avatarFrame}>
              <Image
                src="/wechat-qr-toni.png"
                alt="Toni WeChat QR code"
                width={650}
                height={650}
                priority
                unoptimized
              />
            </div>
            <div className={styles.proofGrid}>
              {profile.proofs.map((proof) => (
                <span key={proof}>{proof}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="updates">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <CalendarDays size={16} />
            Recent Work
          </p>
          <h2>本周进展</h2>
        </div>
        <div className={styles.updateRail}>
          {profile.weeklyUpdates.map((item) => (
            <article className={styles.updateCard} key={`${item.date}-${item.title}`}>
              <span>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="projects">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <GitBranch size={16} />
            Project Map
          </p>
          <h2>自有项目</h2>
        </div>
        <div className={styles.projectGrid}>
          {profile.projects.map((project) => (
            <article className={styles.projectCard} key={project.name}>
              <ProjectMedia project={project} />
              <small>{project.type}</small>
              <h3>{project.name}</h3>
              {project.stars ? (
                <div className={styles.starBadge} aria-label={`${project.name} GitHub stars`}>
                  <Star size={15} fill="currentColor" />
                  {project.stars} Stars
                </div>
              ) : null}
              <p>{project.summary}</p>
              <a className={styles.cardLink} href={project.href} target={project.href.startsWith("http") ? "_blank" : undefined} rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                打开 <ArrowUpRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <Sparkles size={16} />
            Client Cases
          </p>
          <h2>客户与陪跑案例</h2>
        </div>
        <div className={styles.caseGrid}>
          {profile.companionCases.map((item) => (
            <article className={styles.caseCard} key={item.title}>
              <MediaGallery title={item.title} label={item.label} images={item.images ?? [item.image]} />
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  打开站点 <ArrowUpRight size={14} />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.credentialBand}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>
            <CheckCircle2 size={16} />
            Credentials
          </p>
          <h2>认证</h2>
        </div>
        <div className={styles.credentialGrid}>
          {profile.credentials.map((credential) => (
            <article className={styles.credentialCard} key={credential.title}>
              <MediaGallery title={credential.title} label={credential.issuer} images={[credential.image]} />
              <div>
                <small>{credential.issuer} · {credential.date}</small>
                <h3>{credential.title}</h3>
                <p>{credential.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.band}>
        <div>
          <p className={styles.kicker}>
            <CheckCircle2 size={16} />
            Service
          </p>
          <h2>服务方式</h2>
        </div>
        <div className={styles.serviceGrid}>
          {profile.services.map((service) => (
            <article className={styles.serviceCard} key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.contact} id="contact">
        <div className={styles.contactCopy}>
          <p className={styles.kicker}>
            <Mail size={16} />
            Contact
          </p>
          <h2>Contact</h2>
          <div className={styles.linkGrid}>
            {profile.links.map((link) => (
              <a href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} key={link.label}>
                <small>{link.label}</small>
                <strong>{link.text}</strong>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.qrCard}>
          <Image src="/wechat-qr-toni.png" alt="Toni WeChat QR code" width={650} height={650} unoptimized />
        </div>
      </section>
    </main>
  );
}

type Project = (typeof profile.projects)[number];

function ProjectMedia({ project }: { project: Project }) {
  if (project.image?.endsWith(".mp4")) {
    return (
      <div className={styles.projectMedia}>
        <video src={project.image} autoPlay muted loop playsInline aria-label={project.imageLabel} />
      </div>
    );
  }

  if (project.image) {
    return <MediaGallery title={project.name} label={project.type} images={project.images ?? [project.image]} />;
  }

  return (
    <div className={`${styles.projectMedia} ${styles.projectPlaceholder}`}>
      <span>{project.name.slice(0, 2)}</span>
      <strong>{project.imageLabel}</strong>
    </div>
  );
}
