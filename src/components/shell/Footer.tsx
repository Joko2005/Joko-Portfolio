import Link from "next/link";
import { site } from "@/content/site";
import { NAV } from "./nav";
import { SOCIALS } from "./socials";

/** The close: inverted colours, a few link columns, and the name returning margin to margin. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="@container mx-3 mb-3 grid min-h-[80svh] grid-rows-[auto_1fr_auto] rounded-[2rem] bg-ink px-5 pb-5 pt-8 text-bg md:mx-4 md:mb-4 md:px-10 md:pt-10">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-base md:grid-cols-4">
        <div>
          <p className="font-medium">Pages</p>
          <ul className="mt-2 flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <Link href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium">Elsewhere</p>
          <ul className="mt-2 flex flex-col gap-1">
            {SOCIALS.filter((x) => x.external).map((x) => (
              <li key={x.id}>
                <a href={x.href} target="_blank" rel="noopener noreferrer">
                  {x.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium">Contact</p>
          <p className="mt-2">{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : "[Add your email]"}</p>
        </div>
        <div>
          <p className="font-medium">Colophon</p>
          <p className="mt-2 max-w-[28ch]">Designed and built by {site.name} with Next.js, three.js and GSAP. Set in Funnel.</p>
        </div>
      </div>
      <div aria-hidden />
      <div>
        <p aria-hidden className="footer-mark">
          {site.name.toUpperCase()}
        </p>
        <p className="mt-3 text-sm">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
