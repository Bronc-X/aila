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
  if (element.matches("[data-legacy-motion-ignore]")) return false;
  const inlineStyle = element.getAttribute("style") ?? "";
  if (/(?:^|;)\s*(?:opacity|transform)\s*:/.test(inlineStyle)) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.position !== "fixed" && element.offsetHeight >= 48;
}

export default function LegacyPageMotionShell({ children }: LegacyPageMotionShellProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
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
      const registeredTargets = new WeakSet<HTMLElement>();
      const revealTweens = new Set<gsap.core.Tween>();
      const motionTimers = new Set<number>();
      let lowFrameMode = false;
      let frameCount = 0;
      let frameProbe = window.requestAnimationFrame(function countFrame() {
        frameCount += 1;
        frameProbe = window.requestAnimationFrame(countFrame);
      });
      const frameProbeTimer = window.setTimeout(() => {
        motionTimers.delete(frameProbeTimer);
        window.cancelAnimationFrame(frameProbe);
        lowFrameMode = frameCount < 8;
      }, 360);
      motionTimers.add(frameProbeTimer);

      if (reducedMotion) {
        gsap.set(pageRoot, { clearProps: "all" });
        return;
      }

      let entryTimer: number | null = null;
      const clearEntryTimer = () => {
        if (entryTimer === null) return;
        window.clearTimeout(entryTimer);
        motionTimers.delete(entryTimer);
        entryTimer = null;
      };
      const entryTween = gsap.fromTo(
        pageRoot,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.58,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          onComplete: clearEntryTimer,
        }
      );
      entryTimer = window.setTimeout(() => {
        if (entryTimer !== null) motionTimers.delete(entryTimer);
        entryTimer = null;
        entryTween.progress(1);
      }, 800);
      motionTimers.add(entryTimer);

      const registerRevealTargets = () => {
        const revealTargets = gsap.utils
          .toArray<HTMLElement>("main > section, main > article, main > div", pageRoot)
          .filter(isRevealTarget);

        revealTargets.forEach((target) => {
          if (registeredTargets.has(target)) return;
          registeredTargets.add(target);

          let settleTimer: number | null = null;
          const clearSettleTimer = () => {
            if (settleTimer === null) return;
            window.clearTimeout(settleTimer);
            motionTimers.delete(settleTimer);
            settleTimer = null;
          };
          const scheduleSettle = (progress: 0 | 1) => {
            clearSettleTimer();
            settleTimer = window.setTimeout(() => {
              if (settleTimer !== null) motionTimers.delete(settleTimer);
              settleTimer = null;
              tween.progress(progress);
            }, lowFrameMode ? 0 : 900);
            motionTimers.add(settleTimer);
          };
          const tween = gsap.fromTo(
            target,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
              onComplete: clearSettleTimer,
              onReverseComplete: clearSettleTimer,
              scrollTrigger: {
                trigger: target,
                start: "top 88%",
                end: "bottom 14%",
                toggleActions: "play none none reverse",
                onEnter: () => scheduleSettle(1),
                onLeaveBack: () => scheduleSettle(0),
              },
            }
          );
          revealTweens.add(tween);
        });
      };

      registerRevealTargets();

      let refreshFrame = 0;
      const observer = new MutationObserver(() => {
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          registerRevealTargets();
          ScrollTrigger.refresh();
        });
      });
      observer.observe(pageRoot, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(refreshFrame);
        window.cancelAnimationFrame(frameProbe);
        motionTimers.forEach((timer) => window.clearTimeout(timer));
        motionTimers.clear();
        revealTweens.forEach((tween) => tween.kill());
      };
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
      let didNavigate = false;
      const navigateOnce = () => {
        if (didNavigate) return;
        didNavigate = true;
        if (navigationTimerRef.current !== null) {
          window.clearTimeout(navigationTimerRef.current);
          navigationTimerRef.current = null;
        }
        router.push(destination);
      };
      const pageRoot = shellElement.firstElementChild;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!(pageRoot instanceof HTMLElement) || reducedMotion) {
        navigateOnce();
        return;
      }

      exitTimelineRef.current?.kill();
      exitTimelineRef.current = gsap.timeline({ onComplete: navigateOnce }).to(pageRoot, {
        autoAlpha: 0,
        y: -14,
        duration: 0.34,
        ease: "power2.in",
      });
      navigationTimerRef.current = window.setTimeout(() => {
        exitTimelineRef.current?.kill();
        exitTimelineRef.current = null;
        navigateOnce();
      }, 700);
    }

    shellElement.addEventListener("click", handleNavigation, true);
    return () => {
      shellElement.removeEventListener("click", handleNavigation, true);
      exitTimelineRef.current?.kill();
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
    };
  }, [router]);

  return (
    <div ref={shellRef} className={styles.shell} data-legacy-motion-shell>
      {children}
    </div>
  );
}
