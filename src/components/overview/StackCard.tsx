"use client";

import { useState } from "react";
import { Card, Chip } from "@/components/ui";
import { stack } from "@/content/stack";

const ALL = "all";

/** Tools grouped by kind, with filter tabs that show each group's count. */
export function StackCard() {
  const [filter, setFilter] = useState(ALL);
  const total = stack.reduce((n, g) => n + g.items.length, 0);
  const items = filter === ALL ? stack.flatMap((g) => g.items) : (stack.find((g) => g.id === filter)?.items ?? []);
  const tabs = [{ id: ALL, label: "All", count: total }, ...stack.map((g) => ({ id: g.id, label: g.label, count: g.items.length }))];

  return (
    <Card className="p-5">
      <div role="group" aria-label="Filter tools" className="flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const active = t.id === filter;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(t.id)}
              className={`pressable inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                active ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span className={`tabular-nums ${active ? "opacity-70" : ""}`}>{t.count}</span>
            </button>
          );
        })}
      </div>
      <ul aria-live="polite" className="mt-4 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item}>
            <Chip strong className="px-3 py-1.5 text-sm">
              {item}
            </Chip>
          </li>
        ))}
      </ul>
    </Card>
  );
}
