import { site } from "@/content/site";
import type { Certificate } from "@/content/certificates";

/**
 * Joko's public Credly badges, read from Credly's public profile JSON (no key, nothing private).
 * Fetched on the server and cached for a day, so new badges appear on their own without a deploy.
 * If Credly is unreachable the site still renders: the list is just empty until the next refresh.
 */
type CredlyBadge = {
  id: string;
  issued_at_date: string;
  public: boolean;
  state: string;
  image_url: string;
  badge_template: { name: string; image_url: string };
  issuer: { entities: { primary: boolean; entity: { name: string } }[] };
};

type CredlyPage = { data: CredlyBadge[]; metadata: { next_page_url: string | null } };

export const CREDLY_REVALIDATE = 60 * 60 * 24;

export async function getCredlyBadges(): Promise<Certificate[]> {
  if (!site.credly) return [];
  const badges: CredlyBadge[] = [];
  let url: string | null = `https://www.credly.com/users/${site.credly}/badges.json`;
  try {
    // Credly pages at 48; follow next_page_url, with a cap in case the response ever loops.
    for (let page = 0; url && page < 10; page++) {
      const res = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: CREDLY_REVALIDATE } });
      if (!res.ok) break;
      const json = (await res.json()) as CredlyPage;
      badges.push(...json.data);
      url = json.metadata?.next_page_url ?? null;
    }
  } catch {
    return [];
  }
  return badges
    .filter((b) => b.public && b.state === "accepted")
    .map((b) => ({
      title: b.badge_template.name,
      issuer: b.issuer.entities.find((e) => e.primary)?.entity.name ?? "Credly",
      year: b.issued_at_date.slice(0, 4),
      date: b.issued_at_date,
      href: `https://www.credly.com/badges/${b.id}`,
      image: b.image_url || b.badge_template.image_url,
    }));
}

/** Credly badges and hand-added certificates together, newest first. */
export async function getAllCertificates(manual: Certificate[]): Promise<Certificate[]> {
  const credly = await getCredlyBadges();
  return [...credly, ...manual].sort((a, b) => (b.date ?? b.year).localeCompare(a.date ?? a.year));
}
