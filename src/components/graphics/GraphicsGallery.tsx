"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PiCaretLeft, PiCaretRight, PiX } from "react-icons/pi";
import type { Graphic } from "@/content/graphics";

/** The piece itself, or a drawn stand-in at its real 4:5 size until the file exists. */
function Poster({ graphic, sizes }: { graphic: Graphic; sizes: string }) {
  if (graphic.image) {
    return <Image src={graphic.image} alt={graphic.title} fill sizes={sizes} className="object-cover" />;
  }
  return (
    <span
      role="img"
      aria-label={`Placeholder: ${graphic.title}`}
      className="absolute inset-0 flex flex-col justify-end bg-surface p-5 text-muted"
    >
      <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{graphic.title}</span>
      <span className="mt-1 text-[0.8125rem]">{graphic.kind}, 1080 × 1350</span>
    </span>
  );
}

/**
 * Pubmats in a three-column grid with the middle column set lower, like a spread.
 * A piece opens in a viewer (native dialog) with previous / next and arrow keys.
 */
export function GraphicsGallery({ items }: { items: Graphic[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    else if (open === null && dialog.open) dialog.close();
  }, [open]);

  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length));
  const current = open === null ? null : items[open];

  return (
    <>
      <ul className="graphics-grid">
        {items.map((g, i) => (
          <li key={i} data-reveal>
            <button
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="View"
              aria-haspopup="dialog"
              className="group block w-full text-left"
            >
              <span className="relative block aspect-4/5 overflow-hidden rounded-3xl">
                <span className="graphic-media absolute inset-0 block">
                  <Poster graphic={g} sizes="(min-width: 1024px) 28vw, 50vw" />
                </span>
              </span>
              <span className="mt-3 block text-base">{g.title}</span>
              <span className="block text-sm text-muted">{g.kind}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? `${current.title}, ${current.kind}` : "Viewer"}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="viewer"
      >
        {current && (
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base">
                {current.title}
                <span className="ml-2 text-muted">{current.kind}</span>
              </p>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="btn pressable !p-3">
                <PiX aria-hidden className="size-5" />
              </button>
            </div>
            <div className="relative mx-auto aspect-4/5 min-h-0 max-w-full flex-1 overflow-hidden rounded-3xl">
              <Poster graphic={current} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous" className="btn pressable !p-3">
                <PiCaretLeft aria-hidden className="size-5" />
              </button>
              <span className="min-w-14 text-center text-sm text-muted">
                {(open ?? 0) + 1} of {items.length}
              </span>
              <button type="button" onClick={() => step(1)} aria-label="Next" className="btn pressable !p-3">
                <PiCaretRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
