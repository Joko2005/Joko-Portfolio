"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

// Only for a mouse, and never under reduced motion: touch and keyboard users keep the system cursor.
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, [role='button'], [role='option'], label, summary, [data-cursor], [data-grab]";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";
const MAGNETIC = ".btn, [data-magnetic]";
const PULL = 0.3; // how far a magnetic control follows the cursor, as a share of the offset

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

type State = "idle" | "hover" | "label" | "text" | "hidden";

/**
 * Custom cursor: a dot in difference blend that grows over controls and inverts them,
 * or shows a word (data-cursor="View"). Magnetic controls lean toward it.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!enabled || !ring || !label) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const moveX = gsap.quickTo(ring, "x", { duration: 0.18, ease: "power3.out" });
    const moveY = gsap.quickTo(ring, "y", { duration: 0.18, ease: "power3.out" });
    let state: State = "hidden";
    let magnet: HTMLElement | null = null;
    let magnetX: gsap.QuickToFunc | null = null;
    let magnetY: gsap.QuickToFunc | null = null;
    let first = true;

    const setState = (next: State, text = "") => {
      if (next === state && label.textContent === text) return;
      state = next;
      ring.dataset.state = next;
      label.textContent = text;
    };

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { "--mx": "0px", "--my": "0px", duration: 0.5, ease: "power3.out", overwrite: true });
      magnet = null;
    };

    let lastX = -1;
    let lastY = -1;

    // Works out what is under the pointer; also run on scroll, when the page moves under a still mouse.
    const update = (x: number, y: number, hit: EventTarget | null) => {
      const target = hit instanceof Element ? hit : null;
      const field = target?.closest(TEXT_FIELD);
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      // The 3D desk marks a hovered object by setting the body cursor to pointer.
      const interactive = target?.closest(INTERACTIVE) || document.body.style.cursor === "pointer";

      if (field) setState("text");
      else if (labelled?.dataset.cursor) setState("label", labelled.dataset.cursor);
      else if (interactive) setState("hover");
      else setState("idle");

      // Magnetic pull toward the cursor while it is over the control.
      const m = target?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (m !== magnet) {
        releaseMagnet();
        if (m) {
          magnet = m;
          magnetX = gsap.quickTo(m, "--mx", { duration: 0.4, ease: "power3.out", unit: "px" });
          magnetY = gsap.quickTo(m, "--my", { duration: 0.4, ease: "power3.out", unit: "px" });
        }
      }
      if (magnet && magnetX && magnetY) {
        const r = magnet.getBoundingClientRect();
        magnetX((x - (r.left + r.width / 2)) * PULL);
        magnetY((y - (r.top + r.height / 2)) * PULL);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (first) {
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        first = false;
      }
      moveX(e.clientX);
      moveY(e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      update(e.clientX, e.clientY, e.target);
    };

    let scrollFrame = 0;
    const onScroll = () => {
      if (lastX < 0 || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        update(lastX, lastY, document.elementFromPoint(lastX, lastY));
      });
    };

    const onLeave = () => {
      setState("hidden");
      releaseMagnet();
    };
    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      cancelAnimationFrame(scrollFrame);
      releaseMagnet();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ringRef} aria-hidden data-state="hidden" className="cursor">
      <span className="cursor-dot" />
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
