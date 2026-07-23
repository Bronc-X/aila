"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FdePageMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const heroItems = gsap.utils.toArray<HTMLElement>("[data-fde-hero]", root);
      const sections = gsap.utils.toArray<HTMLElement>("[data-fde-section]", root);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([...heroItems, ...sections], { clearProps: "all" });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(heroItems, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.74, stagger: 0.08 });

        sections.forEach((section) => {
          const heading = section.querySelector<HTMLElement>("[data-fde-heading]");
          const items = gsap.utils.toArray<HTMLElement>("[data-fde-item]", section);
          const targets = heading ? [heading, ...items] : items;
          if (targets.length === 0) return;

          gsap.fromTo(
            targets,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.055,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top bottom-=24px",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        const weekRail = root.querySelector<HTMLElement>("[data-fde-progress]");
        if (weekRail) {
          gsap.fromTo(
            weekRail,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: weekRail,
                start: "top bottom-=24px",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        window.cancelAnimationFrame(refreshFrame);
        media.revert();
      };
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return <div ref={rootRef}>{children}</div>;
}
