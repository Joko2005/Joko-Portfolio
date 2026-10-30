"use client";

import { useEffect } from "react";

type NavigationLike = EventTarget;

/**
 * Marks the project a /projects#slug link pointed at. `:target` alone misses client-side
 * navigations (pushState never updates it), and the page can mount before Next writes the
 * new URL, so the mark is set on mount, again on the next frames, and on every hash change.
 */
export function HashTarget() {
  useEffect(() => {
    const mark = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      document.querySelectorAll("[data-target]").forEach((el) => el.id !== id && el.removeAttribute("data-target"));
      if (id) document.getElementById(id)?.setAttribute("data-target", "");
    };
    mark();
    const frame = requestAnimationFrame(() => requestAnimationFrame(mark));
    const navigation = (window as unknown as { navigation?: NavigationLike }).navigation;
    window.addEventListener("hashchange", mark);
    navigation?.addEventListener("navigatesuccess", mark);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", mark);
      navigation?.removeEventListener("navigatesuccess", mark);
    };
  }, []);
  return null;
}
