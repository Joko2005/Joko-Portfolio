import Link from "next/link";
import { HeroGlow } from "@/components/overview/HeroGlow";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { ExternalLink } from "@/components/ui";
import { highlightedProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function OverviewPage() {
  return (
    <>
      <HeroGlow className="-mx-5 -mt-10 border-b border-line px-5 pb-16 pt-16 md:-mx-12 md:-mt-16 md:px-12 md:pb-24 md:pt-24">
        <h1 className="font-display text-[clamp(5rem,18vw,11rem)] font-medium leading-[0.85]">{site.name}</h1>
        <p className="mt-8 max-w-xl text-balance text-2xl font-semibold leading-snug md:text-3xl">{site.statement}</p>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          {site.role}. {site.intro}
        </p>
      </HeroGlow>

      <section aria-labelledby="highlights" className="py-14 md:py-20">
        <h2 id="highlights" className="text-xl font-semibold">
          Highlighted work
        </h2>
        <ul className="mt-8 grid gap-14 md:grid-cols-2 md:gap-10">
          {highlightedProjects.map((project) => (
            <li key={project.slug}>
              <ProjectSummary project={project} />
            </li>
          ))}
        </ul>
        <Link href="/projects" className="link mt-12 inline-block">
          See all projects
        </Link>
      </section>

      <section aria-labelledby="contact" className="border-t border-line py-14 md:py-20">
        <h2 id="contact" className="text-xl font-semibold">
          Contact
        </h2>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">
          I&apos;m looking for an OJT placement in UI/UX design or design engineering. Email is the fastest way to
          reach me.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {site.email ? (
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          ) : (
            <span className="text-sm text-muted">[Add your email in src/content/site.ts]</span>
          )}
          <ExternalLink href={site.links.github}>GitHub</ExternalLink>
          {site.links.linkedin && <ExternalLink href={site.links.linkedin}>LinkedIn</ExternalLink>}
        </div>
      </section>
    </>
  );
}
