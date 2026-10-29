"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { site } from "@/content/site";
import { CommandPalette, ShortcutHint } from "./CommandPalette";
import { NAV, sectionFromPath } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

function Brand() {
  return (
    <div>
      <Link href="/" className="text-lg font-semibold tracking-tight">
        {site.name}
      </Link>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted">
        <span aria-hidden className="inline-block size-1.5 rounded-full bg-ink" />
        {site.status}
      </p>
    </div>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const current = sectionFromPath(pathname);
  return (
    <ul className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.id === current;
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              data-section={item.id}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`relative flex items-center py-1.5 pl-4 transition-colors duration-150 ease-out hover:text-accent ${
                active ? "font-semibold text-accent" : "text-muted"
              }`}
            >
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-accent transition-transform duration-200 ease-out ${
                  active ? "scale-y-100" : "scale-y-0"
                }`}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
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
      <aside className="sticky top-0 hidden h-dvh flex-col gap-12 border-r border-line bg-surface px-6 py-8 md:flex">
        <Brand />
        <div className="flex flex-col gap-6">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setPaletteOpen(true)}
            className="pressable flex items-center gap-2 border border-line bg-bg px-3 py-2 text-sm text-muted hover:text-ink"
          >
            <PiMagnifyingGlass aria-hidden className="size-4" />
            <span className="mr-auto">Search</span>
            <ShortcutHint />
          </button>
          <nav aria-label="Main">
            <NavList pathname={pathname} />
          </nav>
        </div>
        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg md:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Brand />
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
          <nav id="mobile-nav" aria-label="Main" className="flex flex-col gap-6 border-t border-line px-5 py-5">
            <NavList pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <ThemeToggle />
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
