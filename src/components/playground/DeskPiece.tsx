"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { deskObjects, type DeskObjectId } from "@/content/playground";
import { useThemeClass } from "@/lib/useThemeClass";
import type { DeskPalette } from "./DeskScene";

const DeskScene = dynamic(() => import("./DeskScene"), {
  ssr: false,
  loading: () => <SceneMessage>Setting up the desk…</SceneMessage>,
});

function SceneMessage({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">{children}</div>;
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

/** Reads the current theme's tokens so the scene matches the page. */
function usePalette(): DeskPalette | null {
  const theme = useThemeClass();
  return useMemo(() => {
    if (!theme) return null;
    const css = getComputedStyle(document.documentElement);
    const v = (name: string) => css.getPropertyValue(name).trim();
    const dark = theme === "dark";
    return {
      dark,
      clay: dark ? "#6a6a6a" : "#efefef",
      mat: v("--surface"),
      screen: dark ? "#0a0a0a" : "#1a1a1a",
      line: dark ? "#4a4a4a" : "#5a5a5a",
      accent: v("--c-playground"),
      hues: [v("--c-overview"), v("--c-projects"), v("--c-graphics"), v("--c-playground")],
    };
  }, [theme]);
}

export function DeskPiece() {
  const [selected, setSelected] = useState<DeskObjectId | null>(null);
  const [hovered, setHovered] = useState<DeskObjectId | null>(null);
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(hover: hover) and (pointer: fine)");
  const webgl = useSyncExternalStore(
    () => () => {},
    hasWebGL,
    () => true,
  );
  const palette = usePalette();

  const current = deskObjects.find((o) => o.id === selected);
  const toggle = (id: DeskObjectId) => setSelected((s) => (s === id ? null : id));

  return (
    <div>
      {/* Tall enough to show the whole desk, while leaving a little of the object list in view. */}
      <div className="relative aspect-square w-full sm:aspect-auto sm:h-[clamp(30rem,calc(100svh-8rem),52rem)]">
        {!webgl ? (
          <SceneMessage>The 3D desk needs WebGL, which is turned off in this browser. The list below still works.</SceneMessage>
        ) : (
          palette && (
            // Decorative for assistive tech: the object list below is the accessible control.
            <div aria-hidden className="absolute inset-0">
            <DeskScene
              palette={palette}
              selected={selected}
              hovered={hovered}
              onSelect={toggle}
              onHover={setHovered}
              reducedMotion={reducedMotion}
              orbit={finePointer && !reducedMotion}
            />
            </div>
          )
        )}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
        <div>
          <h3 id="desk-objects" className="text-sm text-muted">
            On the desk
          </h3>
          <ul aria-labelledby="desk-objects" className="mt-3 flex flex-wrap gap-2">
            {deskObjects.map((o) => {
              const active = o.id === selected;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-controls="desk-caption"
                    onClick={() => toggle(o.id)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(o.id)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(o.id)}
                    onBlur={() => setHovered(null)}
                    className={`pressable rounded-full px-4 py-2 text-sm font-medium ${
                      active ? "bg-accent text-bg" : "bg-surface text-ink hover:text-accent"
                    }`}
                  >
                    {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div id="desk-caption" aria-live="polite" className="min-h-28">
          {current ? (
            <>
              <p className="text-xl font-semibold">{current.title}</p>
              <p className="mt-2 max-w-prose leading-relaxed text-muted">{current.body}</p>
              {current.link && (
                <Link href={current.link.href} className="link mt-3 inline-block">
                  {current.link.label}
                </Link>
              )}
            </>
          ) : (
            <p className="max-w-prose leading-relaxed text-muted">
              {finePointer ? "Click" : "Tap"} anything on the desk, or pick it from the list. Most of it is work I&apos;ve
              made.
              {finePointer && !reducedMotion && " Drag to look around."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
