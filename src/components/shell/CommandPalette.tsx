"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PiMagnifyingGlass } from "react-icons/pi";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { switchTheme } from "@/lib/themeTransition";
import { NAV, type SectionId } from "./nav";

type Group = "Pages" | "Projects" | "Links" | "Actions";

type Command = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  section?: SectionId;
  keywords?: string;
  run: () => void;
};

const GROUPS: Group[] = ["Pages", "Projects", "Links", "Actions"];

const noop = () => () => {};
function useIsMac() {
  return useSyncExternalStore(noop, () => /Mac|iPhone|iPad/.test(navigator.userAgent), () => false);
}

/** Keyboard hint for the palette shortcut, matched to the visitor's platform. */
export function ShortcutHint() {
  const mac = useIsMac();
  return (
    <kbd className="font-sans text-[0.8125rem] text-muted">
      {mac ? "⌘" : "Ctrl"} K
    </kbd>
  );
}

/**
 * Jump to any page, project, or link. Opens with ⌘K / Ctrl+K.
 * Used many times per visit, so it opens and closes instantly (no animation).
 */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const baseId = useId();

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      const [path, hash] = href.split("#");
      // Same page: a native hash change scrolls and lets the page mark its target.
      if (hash && window.location.pathname === path) window.location.hash = hash;
      else router.push(href);
    };
    const external = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");
    const isDark = resolvedTheme === "dark";
    const list: Command[] = [
      ...NAV.map((n) => ({ id: `page-${n.id}`, group: "Pages" as const, label: n.label, section: n.id, run: go(n.href) })),
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.summary,
        section: "projects" as const,
        keywords: p.stack.join(" "),
        run: go(`/projects#${p.slug}`),
      })),
      { id: "link-github", group: "Links", label: "GitHub", hint: "Opens in a new tab", keywords: "code repo", run: external(site.links.github) },
    ];
    if (site.links.linkedin) {
      list.push({ id: "link-linkedin", group: "Links", label: "LinkedIn", hint: "Opens in a new tab", run: external(site.links.linkedin) });
    }
    if (site.email) {
      list.push({
        id: "link-email",
        group: "Links",
        label: `Email ${site.name}`,
        hint: site.email,
        keywords: "contact mail",
        run: () => (window.location.href = `mailto:${site.email}`),
      });
    }
    list.push({
      id: "action-theme",
      group: "Actions",
      label: isDark ? "Switch to light mode" : "Switch to dark mode",
      keywords: "theme dark light appearance",
      // After the dialog has closed, so the arrow grows over the page and not over the palette.
      run: () => requestAnimationFrame(() => switchTheme(isDark ? "light" : "dark", setTheme)),
    });
    return list;
  }, [router, resolvedTheme, setTheme]);

  const q = query.trim().toLowerCase();
  const results = q
    ? commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase().includes(q))
    : commands;
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const activeCommand = results[activeIndex];

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Keep the native dialog in sync with state. showModal traps focus and restores it on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!activeCommand) return;
    document.getElementById(`${baseId}-${activeCommand.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeCommand, baseId]);

  function run(command: Command) {
    onOpenChange(false);
    command.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + delta + results.length) % results.length);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? 0 : results.length - 1);
    } else if (e.key === "Enter" && activeCommand) {
      e.preventDefault();
      run(activeCommand);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      onClose={() => {
        setQuery("");
        setActive(0);
        onOpenChange(false);
      }}
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
      className="mx-auto mt-[12vh] w-[min(36rem,calc(100%-2rem))] rounded-3xl bg-bg p-0 text-ink shadow-[0_24px_64px_-16px_rgb(0_0_0/0.35)] backdrop:bg-black/40 dark:backdrop:bg-black/70" // taste-skill-ignore: a modal floats, so it keeps its shadow
    >
      {/* Contents mount only while open: the theme label is unknown during server render. */}
      {open && (
        <>
        <div className="m-2 flex items-center gap-3 rounded-full bg-surface px-4">
          <PiMagnifyingGlass aria-hidden className="size-4 shrink-0 text-muted" />
          <input
            autoFocus
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${baseId}-list`}
            aria-activedescendant={activeCommand ? `${baseId}-${activeCommand.id}` : undefined}
            aria-autocomplete="list"
            placeholder="Search pages, projects and links"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="shrink-0 font-sans text-[0.8125rem] text-muted">Esc</kbd>
        </div>

        <div id={`${baseId}-list`} role="listbox" aria-label="Results" className="max-h-[min(40rem,calc(70vh-4rem))] overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a page or project name.
            </p>
          )}
          {GROUPS.map((group) => {
            const items = results.filter((c) => c.group === group);
            if (!items.length) return null;
            const headingId = `${baseId}-${group}`;
            return (
              <div key={group} role="group" aria-labelledby={headingId} className="pb-2">
                <div id={headingId} role="presentation" className="px-5 pb-1 pt-2 text-[0.8125rem] text-muted">
                  {group}
                </div>
                {items.map((c) => {
                  const selected = c === activeCommand;
                  return (
                    <div
                      key={c.id}
                      id={`${baseId}-${c.id}`}
                      role="option"
                      aria-selected={selected}
                      data-section={c.section}
                      onPointerMove={() => !selected && setActive(results.indexOf(c))}
                      onClick={() => run(c)}
                      className={`mx-2 flex cursor-pointer items-baseline justify-between gap-6 rounded-2xl px-3 py-2.5 ${
                        selected ? "bg-surface text-accent" : ""
                      }`}
                    >
                      <span className={selected ? "font-medium" : ""}>{c.label}</span>
                      {c.hint && <span className="min-w-0 truncate text-right text-sm text-muted">{c.hint}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        </>
      )}
    </dialog>
  );
}
