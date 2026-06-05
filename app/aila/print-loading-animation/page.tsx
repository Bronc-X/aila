import Link from "next/link";
import { ArrowLeft, Boxes } from "lucide-react";
import styles from "./print-loading-animation.module.css";

const ASSET_BASE = "/print-loading-animation";

export default function PrintLoadingAnimationPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/aila" className={styles.backLink}>
          <ArrowLeft size={16} />
          返回 AILA
        </Link>
        <span>Image to 3D waiting state</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Boxes size={16} />
            AILA action probe
          </p>
          <h1>图生 3D 模型的等待过程。</h1>
          <p>
            这段循环视频已放进 AILA 的 Vercel 发布路径，用于长时间生成任务里的进度背景。素材使用 WebM 优先、H.264 MP4 兜底，并保留四边羽化。
          </p>
        </div>

        <div className={styles.waitState} aria-label="3D 打印等待动画预览">
          <div className={styles.videoFeather}>
            <video poster={`${ASSET_BASE}/print-loading-poster.jpg`} autoPlay muted loop playsInline>
              <source src={`${ASSET_BASE}/print-loading-loop.webm`} type="video/webm" />
              <source src={`${ASSET_BASE}/print-loading-loop.mp4`} type="video/mp4" />
            </video>
          </div>
          <div className={styles.hud}>
            <div className={styles.percent}>68%</div>
            <div className={styles.label}>Building printable geometry</div>
            <div className={styles.bar}>
              <i />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
