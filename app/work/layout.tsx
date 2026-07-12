import type { ReactNode } from "react";

import LegacyPageMotionShell from "../components/LegacyPageMotionShell";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <LegacyPageMotionShell>{children}</LegacyPageMotionShell>;
}
