"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PiEnvelopeSimple, PiGithubLogo, PiMagnifyingGlass } from "react-icons/pi";
import { site } from "@/content/site";
import { CommandPalette, ShortcutHint } from "./CommandPalette";
import { NAV, NAV_GROUPS, sectionFromPath } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

/** Profile block: who this is and whether they're available. */
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      {site.photo ? (
        <Image
          src={site.photo}
          alt=""
          width={88}
          height={88}
          className={`shrink-0 rounded-full object-cover ${compact ? "size-9" : "size-11"}`}
        />
      ) : (
        <span
          aria-hidden
          className={`grid shrink-0 place-items-center rounded-full bg-ink font-display text-bg font-semibold ${
            compact ? "size-9 text-sm" : "size-11 text-base"
          }`}
        >
          {site.name.charAt(0)}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-display font-semibold leading-tight">{site.name}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-ink" />
          {site.status}
        </span>
      </span>
    </Link>
  );
}

const PILL_EASE = [0.23, 1, 0.32, 1] as const;

function NavList({ id, pathname, onNavigate }: { id: string; pathname: string; onNavigate?: () => void }) {
  const current = sectionFromPath(pathname);
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p id={`${id}-${group}`} className="px-3 pb-1.5 text-xs text-muted">
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
                    className={`relative flex items-center gap-2.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ease-out ${
                      active ? "font-medium text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {/* The pill slides to the new page's item, so the move reads as one place to another. */}
                    {active && (
                      <motion.span
                        layoutId={`${id}-pill`}
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-bg"
                        transition={{ duration: reduceMotion ? 0 : 0.2, ease: PILL_EASE }}
                      />
                    )}
                    <Icon aria-hidden className={`relative size-[1.125rem] shrink-0 ${active ? "text-accent" : ""}`} />
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
    <div className="flex flex-col gap-1 text-sm">
      {site.email ? (
        <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-muted hover:text-ink">
          <PiEnvelopeSimple aria-hidden className="size-4" />
          <span className="truncate">{site.email}</span>
        </a>
      ) : (
        <span className="text-xs text-muted">[Add your email]</span>
      )}
      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted hover:text-ink"
      >
        <PiGithubLogo aria-hidden className="size-4" />
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
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 overflow-y-auto bg-surface px-4 py-6 md:flex">
        <div className="px-1">
          <Brand />
        </div>
        <div className="flex flex-col gap-6">
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
        <div className="mt-auto flex flex-col gap-4 px-1 pt-5">
          <ContactLinks />
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 bg-surface md:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <Brand compact />
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
            <div className="flex flex-col gap-4 px-3 pt-2">
              <ContactLinks />
              <ThemeToggle />
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="w-full max-w-5xl px-5 py-10 md:px-12 md:py-16 lg:px-16">
        {children}
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
