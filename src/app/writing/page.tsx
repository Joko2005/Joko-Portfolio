import type { Metadata } from "next";
import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { PageHeader } from "@/components/ui";
import { site } from "@/content/site";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Writing" };

/** Posts newest first: the date in a side column, the title at heading size, its one line beneath. */
export default function WritingPage() {
  const posts = getPosts();
  return (
    <>
      <PageHeader title="Writing" lead="Notes on designing and building, first shared on LinkedIn." count={posts.length || undefined} />

      {posts.length ? (
        <ol className="reveal flex flex-col gap-14">
          {posts.map((p) => (
            <li key={p.slug} data-reveal className="grid gap-2 lg:grid-cols-12 lg:gap-8">
              <p className="text-base text-muted lg:col-span-3">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
              </p>
              <div className="lg:col-span-9">
                <h2 className="exp-role">
                  <Link href={`/writing/${p.slug}`} className="post-title">
                    {p.title}
                  </Link>
                </h2>
                {p.summary && <p className="mt-3 max-w-[60ch] text-lg leading-snug">{p.summary}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="reveal rounded-3xl bg-surface p-6 md:p-10">
          <p data-reveal className="about-text">
            The first posts are on their way. Until then, everything I share is on LinkedIn.
          </p>
          {site.links.linkedin && (
            <a
              data-reveal
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary pressable mt-8"
            >
              Follow on LinkedIn
              <PiArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </>
  );
}
