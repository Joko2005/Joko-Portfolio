import type { Metadata } from "next";
import { DeskPiece } from "@/components/playground/DeskPiece";
import { playground } from "@/content/playground";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <>
      <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">Playground</h1>
      <p className="mt-6 max-w-prose leading-relaxed text-muted">Small interactive things to play with.</p>

      <section aria-labelledby="desk" className="mt-10">
        <h2 id="desk" className="text-xl font-semibold">
          Design desk
        </h2>
        <p className="mt-2 max-w-prose leading-relaxed text-muted">The things I work with, and what came out of them.</p>
        <div className="mt-6">
          <DeskPiece />
        </div>
      </section>

      <section aria-labelledby="next" className="mt-28">
        <h2 id="next" className="text-xl font-semibold">
          Coming next
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {playground.map((item) => (
            <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-3xl bg-surface p-5">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
              <p className="text-sm text-muted">{item.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
