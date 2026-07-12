import type { Metadata } from "next";

import ToniSpatialHero from "../components/ToniSpatialHero";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Toni Spatial Archive",
  description: "欢迎来到 Toni 的主页。",
};

export default function ToniSpatialArchivePage() {
  return (
    <main className={styles.home}>
      <ToniSpatialHero />
    </main>
  );
}
