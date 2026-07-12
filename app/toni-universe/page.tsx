import type { Metadata } from "next";

import ToniUniverseClient from "./ToniUniverseClient";

export const metadata: Metadata = {
  title: "FDE Delivery Galaxy | Toni",
  description: "A spatial operating map for Forward Deployed Engineering delivery, capabilities, and proof.",
};

export default function ToniUniversePage() {
  return <ToniUniverseClient />;
}
