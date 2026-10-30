import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Writing: one Markdown file per post in src/content/posts, named <slug>.md.
 * Files starting with "_" (like _template.md) are ignored.
 *
 * Front matter, between two `---` lines at the top:
 *   title: The post's title
 *   date: 2026-10-30
 *   summary: One line for the list
 *   linkedin: https://www.linkedin.com/posts/... (optional, where it was first posted)
 */
export type Post = { slug: string; title: string; date: string; summary: string; linkedin?: string; body: string };

const DIR = path.join(process.cwd(), "src/content/posts");

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  for (const line of (match?.[1] ?? "").split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title || file,
    date: meta.date || "",
    summary: meta.summary || "",
    linkedin: meta.linkedin || undefined,
    body: match?.[2] ?? raw,
  };
}

/** Newest first. */
export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** The post's own Markdown, written by Joko, rendered to HTML at build time. */
export function renderPost(post: Post): string {
  return marked.parse(post.body, { async: false });
}

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
