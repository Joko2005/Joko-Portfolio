import Image from "next/image";
import Link from "next/link";
import { PiArrowUpRight, PiCube, PiEnvelopeSimple, PiGithubLogo, PiLinkedinLogo, PiPaintBrushBroad } from "react-icons/pi";
import { EnterOnce } from "@/components/overview/EnterOnce";
import { HeroGlow } from "@/components/overview/HeroGlow";
import { StackCard } from "@/components/overview/StackCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { SectionId } from "@/components/shell/nav";
import { Card, CardLink, Chip, SectionHeader } from "@/components/ui";
import { highlightedProjects } from "@/content/projects";
import { site } from "@/content/site";

const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

const explore: { href: string; section: SectionId; icon: React.ElementType; title: string; body: string }[] = [
  { href: "/graphics", section: "graphics", icon: PiPaintBrushBroad, title: "Graphics", body: "Pubmats and other graphic design work." },
  { href: "/playground", section: "playground", icon: PiCube, title: "Playground", body: "A 3D desk of my tools. Pick something up." },
];

/** Joko's photo; a labelled slot until site.photo is set. */
function Portrait() {
  if (site.photo) {
    return (
      <Image
        src={site.photo}
        alt={`Portrait of ${site.name}`}
        width={640}
        height={800}
        priority
        className="hidden aspect-4/5 w-full rounded-xl border border-line object-cover xl:block"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label="Placeholder: your photo"
      className="hidden aspect-4/5 w-full place-items-center rounded-xl border border-dashed border-line bg-surface p-4 text-center text-xs text-muted xl:grid"
    >
      Your photo (800 × 1000)
    </div>
  );
}

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <EnterOnce />

      <HeroGlow className="enter grid gap-8 rounded-2xl border border-line bg-card p-6 md:p-10 xl:grid-cols-[minmax(0,1fr)_15rem] xl:items-center">
        <div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1] tracking-[-0.03em]">
            Hi, I&apos;m {site.name}.
          </h1>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {site.roles.map((r) => (
              <Chip key={r} strong>
                {r}
              </Chip>
            ))}
          </div>
          <p className="mt-6 max-w-xl text-balance font-display text-xl font-medium leading-snug md:text-2xl">
            {site.statement}
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">{site.intro}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link href="/projects" className="btn btn-primary pressable">
              See my projects
            </Link>
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="btn pressable">
              <PiGithubLogo aria-hidden className="size-4" />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <Portrait />
      </HeroGlow>

      <section aria-labelledby="highlights" className="enter" style={step(1)}>
        <SectionHeader
          id="highlights"
          title="Highlighted work"
          description="Two projects I'm proudest of, and my part in each."
          action={{ label: "See all projects", href: "/projects" }}
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {highlightedProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack" className="enter" style={step(2)}>
        <SectionHeader id="stack" title="Stack" description="What I design and build with." />
        <StackCard />
      </section>

      <section aria-labelledby="explore" className="enter" style={step(3)}>
        <SectionHeader id="explore" title="More to see" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {explore.map(({ href, section, icon: Icon, title, body }) => (
            <li key={href}>
              <CardLink href={href} section={section} className="flex h-full items-start gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-ink group-hover:text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-semibold group-hover:text-accent">{title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{body}</span>
                </span>
                <PiArrowUpRight aria-hidden className="card-arrow size-4 shrink-0 text-muted group-hover:text-accent" />
              </CardLink>
            </li>
          ))}
        </ul>
      </section>

      <Card
        as="section"
        aria-labelledby="contact"
        style={step(4)}
        className="enter flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 id="contact" className="font-display text-xl font-semibold tracking-[-0.01em]">
            Looking for an OJT placement
          </h2>
          <p className="mt-1 max-w-lg text-pretty text-sm leading-relaxed text-muted">
            In UI/UX design or design engineering. Email is the fastest way to reach me.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {site.email ? (
            <a href={`mailto:${site.email}`} className="btn btn-primary pressable">
              <PiEnvelopeSimple aria-hidden className="size-4" />
              Email me
            </a>
          ) : (
            <span className="btn border-dashed text-muted">[Add your email in src/content/site.ts]</span>
          )}
          {site.links.linkedin && (
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn pressable">
              <PiLinkedinLogo aria-hidden className="size-4" />
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </Card>
    </div>
  );
}
