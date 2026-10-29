import type { Project } from "@/content/projects";
import { ExternalLink, Placeholder } from "@/components/ui";

export function ProjectSummary({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article>
      <Placeholder label={project.media} />
      <Heading className="mt-5 text-xl font-semibold">{project.title}</Heading>
      <p className="mt-2 max-w-prose leading-relaxed text-muted">{project.summary}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
        <dt className="text-muted">Role</dt>
        <dd>{project.role}</dd>
        <dt className="text-muted">Result</dt>
        <dd>{project.result}</dd>
        {project.stack.length > 0 && (
          <>
            <dt className="text-muted">Built with</dt>
            <dd>{project.stack.join(", ")}</dd>
          </>
        )}
      </dl>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {project.links.map((l) => (
          <ExternalLink key={l.label} href={l.href}>
            {l.label}
          </ExternalLink>
        ))}
      </div>
    </article>
  );
}
