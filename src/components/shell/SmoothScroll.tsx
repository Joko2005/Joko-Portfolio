"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Eases wheel and trackpad scrolling with momentum, on GSAP's clock so scroll animations stay in step.
 * Touch keeps the device's own scrolling, which already feels right; reduced motion keeps the browser's.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const instance = new Lenis({
      lerp: 0.1,
      anchors: true,
      allowNestedScroll: true,
      // Dialogs and the 3D scenes keep the wheel for themselves.
      prevent: (node) => Boolean(node.closest('[role="dialog"], canvas')),
      // The page is locked while the phone menu or the loader is up.
      virtualScroll: () => !root.classList.contains("menu-open") && !root.classList.contains("is-loading"),
    });
    lenis.current = instance;

    const raf = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // A new page starts at the top, without gliding there.
  useEffect(() => {
    if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
