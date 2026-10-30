// Credly badges are added automatically (see src/lib/credly.ts and `credly` in site.ts).
// Add certificates here only when they aren't on Credly. `date` (YYYY-MM-DD) sorts them among the badges.
export type Certificate = {
  title: string;
  issuer: string;
  year: string;
  href: string;
  date?: string;
  /** Badge or certificate image, shown beside the title. */
  image?: string;
};

export const certificates: Certificate[] = [];

/** Hand-added certificates with real details; placeholders never reach the page. */
export const realCertificates = certificates.filter((c) => !c.title.startsWith("["));
