import { PiArrowUpRight } from "react-icons/pi";
import type { Project } from "@/content/projects";
import { Card, CardLink, Chip } from "@/components/ui";

/** Project as a card: screenshot first, then what it is, Joko's role, one result, and where it lives. */
export function ProjectCard({ project }: { project: Project }) {
  const link = project.links[0];

  const body = (
    <>
      {/* TODO: swap for next/image once the screenshot exists. */}
      <div
        role="img"
        aria-label={`Placeholder: ${project.media}`}
        className="flex aspect-16/10 items-center justify-center border-b border-line bg-surface p-4 text-center text-xs text-muted"
      >
        {project.media}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5">
          <Chip strong>{project.kind}</Chip>
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-[-0.01em]">{project.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">Role</dt>
          <dd>{project.role}</dd>
          <dt className="text-muted">Result</dt>
          <dd>{project.result}</dd>
        </dl>
        {link && (
          <p className="mt-5 flex items-center gap-1 text-sm font-medium group-hover:text-accent">
            {link.href ? link.label : `[Add link: ${link.label}]`}
            {link.href && <PiArrowUpRight aria-hidden className="card-arrow size-4" />}
          </p>
        )}
      </div>
    </>
  );

  return link?.href ? (
    <CardLink href={link.href} external section="projects" className="h-full overflow-hidden">
      {body}
    </CardLink>
  ) : (
    <Card as="article" data-section="projects" className="h-full overflow-hidden">
      {body}
    </Card>
  );
}
