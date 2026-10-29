"use client";

import { useEffect } from "react";

// Longest stagger: intro offset + 3 steps + duration, with headroom.
const SETTLE_MS = 3400;

/** The Overview stagger plays once per page load; returning via client navigation skips it. */
export function EnterOnce() {
  useEffect(() => {
    const id = window.setTimeout(() => document.documentElement.classList.add("overview-entered"), SETTLE_MS);
    return () => clearTimeout(id);
  }, []);
  return null;
}
