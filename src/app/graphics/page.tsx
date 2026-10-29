import type { Metadata } from "next";
import { Placeholder } from "@/components/ui";
import { graphics } from "@/content/graphics";

export const metadata: Metadata = { title: "Graphics" };

export default function GraphicsPage() {
  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Graphics</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-muted">Pubmats and other graphic design work.</p>

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6">
        {graphics.map((g, i) => (
          <li key={i}>
            <figure>
              <Placeholder label={`${g.kind} (1080 × 1350)`} ratio="4 / 5" />
              <figcaption className="mt-3 text-sm">
                {g.title}
                <span className="block text-muted">{g.kind}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
