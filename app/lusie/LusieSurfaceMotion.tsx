"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";
import { gsap } from "gsap";

import styles from "./LusieSurfaceMotion.module.css";

gsap.registerPlugin(useGSAP);

type LusieSurfaceMotionProps = {
  children: ReactNode;
  variant: "workbench" | "showcase";
};

export default function LusieSurfaceMotion({ children, variant }: LusieSurfaceMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const surface = surfaceRef.current;
      const veil = veilRef.current;
      if (!surface || !veil) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        gsap.set(surface, { clearProps: "all" });
        gsap.set(veil, { autoAlpha: 0, clearProps: "transform" });
        return;
      }

      const timeline = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .set(veil, { autoAlpha: 1, scaleY: 1, transformOrigin: "top" })
        .fromTo(surface, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.12)
        .to(veil, { scaleY: 0, duration: 0.72, ease: "power4.inOut" }, 0);

      return () => timeline.kill();
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className={styles.root} data-lusie-motion-root data-variant={variant}>
      <div ref={surfaceRef} className={styles.surface}>
        {children}
      </div>
      <div ref={veilRef} className={styles.veil} aria-hidden="true" />
    </div>
  );
}
