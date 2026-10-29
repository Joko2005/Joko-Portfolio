import type { Metadata } from "next";
import { Placeholder } from "@/components/ui";
import { playground } from "@/content/playground";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <>
      <h1 className="font-display text-[clamp(4.5rem,14vw,9rem)] font-medium leading-[0.85]">Playground</h1>
      <p className="mt-6 max-w-prose leading-relaxed text-muted">Small interactive things to play with.</p>

      <ul className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-8">
        {playground.map((item) => (
          <li key={item.title}>
            <Placeholder label={`${item.title} preview (1:1)`} ratio="1 / 1" />
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
            <p className="mt-3 text-sm">{item.status}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
