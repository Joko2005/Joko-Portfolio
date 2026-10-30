import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { ExperiencePreview } from "@/components/overview/ExperiencePreview";
import { Hero } from "@/components/overview/Hero";
import { PlayWords } from "@/components/overview/PlayWords";
import { WorkIndex } from "@/components/overview/WorkIndex";
import { SOCIALS } from "@/components/shell/socials";
import { site } from "@/content/site";
import { work } from "@/content/work";

const helloHref = site.email
  ? `mailto:${site.email}?subject=${encodeURIComponent("OJT placement")}`
  : site.links.github;

// The Experience preview lists the latest Credly badges; re-read them once a day.
export const revalidate = 86400;

export default function OverviewPage() {
  return (
    <div className="flex flex-col">
      <Hero name={site.name} role={site.role} intro={site.intro} />

      <section id="work" aria-labelledby="work-title" className="reveal scroll-mt-8 pt-16 md:pt-24">
        <div className="section-head">
          <h2 id="work-title" className="section-title" data-split="chars">
            Selected work
          </h2>
          <Link href="/projects" className="link">
            All projects
          </Link>
        </div>
        <div className="mt-6 md:mt-8">
          {/* The Playground has its own moment below. */}
          <WorkIndex items={work.filter((w) => w.id !== "playground")} />
        </div>
      </section>

      <ExperiencePreview />

      <PlayWords />

      <section aria-labelledby="contact-title" className="reveal pt-24 md:pt-32">
        <h2 id="contact-title" className="section-title" data-split="chars">
          Contact
        </h2>
        <div className="mt-6 md:mt-8">
          <a href={helloHref} className="contact-row contact-hello" data-cursor="Write" data-reveal>
            <span className="contact-value">Say hello</span>
            <span aria-hidden className="contact-arrow">
              <PiArrowUpRight />
            </span>
          </a>
          <p data-reveal className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base">
            {SOCIALS.map((x) => (
              <a
                key={x.id}
                href={x.href}
                {...(x.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="link"
              >
                {x.id === "email" && site.email ? site.email : x.label}
                {x.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
