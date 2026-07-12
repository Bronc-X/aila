import type { Metadata } from "next";

import ToniUniverseClient from "./toni-universe/ToniUniverseClient";

export const metadata: Metadata = {
  title: "Toni | Enterprise FDE Delivery Galaxy",
  description: "发来业务现场，先判断哪里值得动。",
};

export default function Home() {
  return <ToniUniverseClient homeMode />;
}
