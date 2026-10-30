import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { interests, stack } from "@/content/stack";

export const metadata: Metadata = { title: "Stack" };

/** Tools set as words at display size, grouped by what they're for; level only where the CV states one. */
export default function StackPage() {
  const count = stack.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <PageHeader title="Stack" lead="What I design and build with, from first frame to shipped code." count={count} />

      <div className="flex flex-col gap-24 md:gap-32">
        {stack.map((group) => (
          <section key={group.id} aria-labelledby={`stack-${group.id}`} className="reveal grid gap-6 lg:grid-cols-12 lg:gap-8">
            <h2 id={`stack-${group.id}`} className="section-title lg:col-span-3" data-split="chars">
              {group.label}
            </h2>
            <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3 lg:col-span-9">
              {group.items.map((item) => (
                <li key={item.name} data-reveal className="stack-item">
                  {item.name}
                  {item.level && <span className="stack-level">{item.level}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="stack-interests" className="reveal grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 id="stack-interests" className="section-title lg:col-span-3" data-split="chars">
            Interests
          </h2>
          <p data-reveal className="about-text lg:col-span-9">
            {interests.join(", ")}.
          </p>
        </section>
      </div>
    </>
  );
}
