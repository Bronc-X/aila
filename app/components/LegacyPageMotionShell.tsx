"use client";

import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./LegacyPageMotionShell.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type LegacyPageMotionShellProps = {
  children: ReactNode;
};

function isRevealTarget(element: HTMLElement) {
  if (element.closest("[data-case-motion-root]")) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.position !== "fixed" && element.offsetHeight >= 48;
}

export default function LegacyPageMotionShell({ children }: LegacyPageMotionShellProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const navigatingRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useGSAP(
    () => {
      const shell = shellRef.current;
      const pageRoot = shell?.firstElementChild;
      if (!(pageRoot instanceof HTMLElement)) return;

      navigatingRef.current = false;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealTargets = gsap.utils
        .toArray<HTMLElement>("main > section, main > article, main > div", pageRoot)
        .filter(isRevealTarget);

      if (reducedMotion) {
        gsap.set([pageRoot, ...revealTargets], { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        pageRoot,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        }
      );

      revealTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              end: "bottom 14%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      const observer = new MutationObserver(() => ScrollTrigger.refresh());
      observer.observe(pageRoot, { childList: true, subtree: true });
      return () => observer.disconnect();
    },
    { scope: shellRef, dependencies: [pathname], revertOnUpdate: true }
  );

  useEffect(() => {
    const currentShell = shellRef.current;
    if (!currentShell) return;
    const shellElement: HTMLDivElement = currentShell;

    function handleNavigation(event: globalThis.MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor = target instanceof Element ? target.closest("a") : null;
      if (!(anchor instanceof HTMLAnchorElement) || !shellElement.contains(anchor)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const destination = `${url.pathname}${url.search}${url.hash}`;
      const pageRoot = shellElement.firstElementChild;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!(pageRoot instanceof HTMLElement) || reducedMotion) {
        router.push(destination);
        return;
      }

      exitTimelineRef.current?.kill();
      exitTimelineRef.current = gsap.timeline({ onComplete: () => router.push(destination) }).to(pageRoot, {
        autoAlpha: 0,
        y: -14,
        duration: 0.34,
        ease: "power2.in",
      });
    }

    shellElement.addEventListener("click", handleNavigation, true);
    return () => {
      shellElement.removeEventListener("click", handleNavigation, true);
      exitTimelineRef.current?.kill();
    };
  }, [router]);

  return (
    <div ref={shellRef} className={styles.shell} data-legacy-motion-shell>
      {children}
    </div>
  );
}
