import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { interests, stack, type StackItem } from "@/content/stack";

/** "Advanced in Figma and Canva; basic in Illustrator and Photoshop." Only levels the CV states. */
function levelSentence(items: StackItem[]) {
  const and = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]);
  const parts = (["Advanced", "Basic"] as const)
    .map((level) => ({ level, names: items.filter((i) => i.level === level).map((i) => i.name) }))
    .filter((p) => p.names.length)
    .map((p, i) => `${i === 0 ? p.level : p.level.toLowerCase()} in ${and(p.names)}`);
  return parts.length ? `${parts.join("; ")}.` : "";
}

// Every section hue, ordered so neighbouring words light up differently.
const POPS = ["overview", "projects", "writing", "playground", "stack", "graphics", "certificates", "experience"];

export const metadata: Metadata = { title: "Stack" };

/** Tools set as words at display size, grouped by what they're for; levels, where the CV states them, in one line beneath. */
export default function StackPage() {
  const count = stack.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <PageHeader title="Stack" lead="What I design and build with, from first frame to shipped code." count={count} />

      <div className="flex flex-col gap-24 md:gap-32">
        {stack.map((group, g) => (
          <section key={group.id} aria-labelledby={`stack-${group.id}`} className="reveal grid gap-6 lg:grid-cols-12 lg:gap-8">
            <h2 id={`stack-${group.id}`} className="section-title lg:col-span-3" data-split="chars">
              {group.label}
            </h2>
            <div className="lg:col-span-9">
              <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                {group.items.map((item, i) => (
                  <li
                    key={item.name}
                    data-reveal
                    className="stack-item"
                    style={{ "--pop": `var(--c-${POPS[(g * 3 + i) % POPS.length]})` } as React.CSSProperties}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
              {levelSentence(group.items) && (
                <p data-reveal className="mt-6 text-lg text-muted">
                  {levelSentence(group.items)}
                </p>
              )}
            </div>
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
