"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "../portfolio-case.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PortfolioCaseMotionProps = {
  children: ReactNode;
  variant: "proposal" | "matrix";
};

export default function PortfolioCaseMotion({ children, variant }: PortfolioCaseMotionProps) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroParts = scope.querySelectorAll<HTMLElement>("[data-case-hero]");
      const revealTargets = scope.querySelectorAll<HTMLElement>("[data-case-reveal]");
      const parallaxTargets = scope.querySelectorAll<HTMLElement>("[data-case-parallax]");

      if (reducedMotion) {
        gsap.set([...heroParts, ...revealTargets, ...parallaxTargets], { clearProps: "all" });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(heroParts, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 })
        .fromTo(
          scope.querySelector(`.${styles.caseNumber}`),
          { autoAlpha: 0, x: 36 },
          { autoAlpha: 0.12, x: 0, duration: 0.85 },
          0.12
        );

      revealTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: target,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      parallaxTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: target,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => window.cancelAnimationFrame(refreshFrame);
    },
    { scope: scopeRef }
  );

  return (
    <div ref={scopeRef} className={styles.motionRoot} data-case-motion-root data-variant={variant}>
      {children}
    </div>
  );
}
