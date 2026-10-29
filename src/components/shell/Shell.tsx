"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PiEnvelopeSimple, PiGithubLogo, PiMagnifyingGlass } from "react-icons/pi";
import { site } from "@/content/site";
import { CommandPalette, ShortcutHint } from "./CommandPalette";
import { Footer } from "./Footer";
import { Reveals } from "./Reveals";
import { NAV, NAV_GROUPS, sectionFromPath } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

/** The name as a small monument, sized to its card like the hero's JOKO, with the role beneath. */
function Brand() {
  return (
    <Link href="/" className="@container block rounded-3xl bg-bg px-5 pb-4 pt-5">
      <span className="sidebar-mark block">{site.name.toUpperCase()}</span>
      <span className="mt-3 block text-[0.8125rem] leading-snug text-muted">{site.role}</span>
    </Link>
  );
}

/** Compact name for the mobile bar. */
function BrandCompact() {
  return (
    <Link href="/" className="font-display text-2xl font-semibold leading-none tracking-[-0.05em]">
      {site.name.toUpperCase()}
    </Link>
  );
}

const PILL_EASE = [0.23, 1, 0.32, 1] as const;

function NavList({ id, pathname, onNavigate }: { id: string; pathname: string; onNavigate?: () => void }) {
  const current = sectionFromPath(pathname);
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-4">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p id={`${id}-${group}`} className="px-3 pb-1.5 text-[0.8125rem] text-muted">
            {group}
          </p>
          <ul aria-labelledby={`${id}-${group}`} className="flex flex-col gap-0.5">
            {NAV.filter((item) => item.group === group).map(({ id, label, href, icon: Icon }) => {
              const active = id === current;
              return (
                <li key={id}>
                  <Link
                    href={href}
                    data-section={id}
                    aria-current={active ? "page" : undefined}
                    onClick={onNavigate}
                    className={`nav-item pressable relative flex items-center gap-3 rounded-full px-4 py-2.5 text-[0.9375rem] font-medium ${
                      active ? "text-bg" : "text-muted"
                    }`}
                  >
                    {/* The ink pill (the hero switch's active fill) slides to the new page's item. */}
                    {active && (
                      <motion.span
                        layoutId={`${id}-pill`}
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ duration: reduceMotion ? 0 : 0.2, ease: PILL_EASE }}
                      />
                    )}
                    <Icon aria-hidden className="nav-icon relative size-[1.125rem] shrink-0" />
                    <span className="relative">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Ways to reach Joko, pinned to the bottom of the sidebar. */
function ContactLinks() {
  return (
    <div className="flex flex-col gap-0.5 text-sm">
      {site.email ? (
        <a href={`mailto:${site.email}`} className="nav-item flex items-center gap-3 rounded-full px-4 py-2 text-muted">
          <PiEnvelopeSimple aria-hidden className="size-4 shrink-0" />
          <span className="truncate">{site.email}</span>
        </a>
      ) : (
        <span className="px-4 py-2 text-[0.8125rem] text-muted">[Add your email]</span>
      )}
      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-item flex items-center gap-3 rounded-full px-4 py-2 text-muted"
      >
        <PiGithubLogo aria-hidden className="size-4 shrink-0" />
        GitHub
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const section = sectionFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div data-section={section} className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-bg focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh md:row-span-2 flex-col gap-6 overflow-y-auto bg-surface p-3 md:flex">
        <Brand />
        <div className="flex flex-col gap-5">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setPaletteOpen(true)}
            className="pressable flex items-center gap-2 rounded-full bg-bg px-4 py-2.5 text-sm text-muted hover:text-ink"
          >
            <PiMagnifyingGlass aria-hidden className="size-4" />
            <span className="mr-auto">Search</span>
            <ShortcutHint />
          </button>
          <nav aria-label="Main">
            <NavList id="nav" pathname={pathname} />
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-5">
          <ContactLinks />
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 bg-surface md:hidden">
        <div className="flex h-[var(--bar-h)] items-center justify-between px-5">
          <BrandCompact />
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Search"
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
              className="pressable -m-2 p-2"
            >
              <PiMagnifyingGlass aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
              className="pressable text-sm font-medium"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-nav" aria-label="Main" className="flex flex-col gap-6 px-3 pb-6 pt-2">
            <NavList id="mobile-nav-list" pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <div className="flex flex-col gap-3 pt-2">
              <ContactLinks />
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="w-full px-5 py-10 md:py-16 md:pl-12 md:pr-5 lg:pl-16">
        {children}
      </main>

      <div className="md:col-start-2">
        <Footer />
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Reveals />
    </div>
  );
}
