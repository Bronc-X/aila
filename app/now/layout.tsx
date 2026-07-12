import type { ReactNode } from "react";

import LegacyPageMotionShell from "../components/LegacyPageMotionShell";

export default function NowLayout({ children }: { children: ReactNode }) {
  return <LegacyPageMotionShell>{children}</LegacyPageMotionShell>;
}
