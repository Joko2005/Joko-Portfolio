# Joko Portfolio — instructions for Claude

Read `PRODUCT.md` first: it is the source of truth for audience, structure, and content.
`DESIGN.md` (once it exists) is the source of truth for the visual system. Until then, do not invent a visual direction.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, react-icons. Hosted on Vercel.
- Commands: `npm run dev`, `npm run build`, `npm run lint`.
- **Tailwind v4 is CSS-first.** All tokens live in `src/app/globals.css` (`:root` / `.dark` values, exposed through `@theme inline`). Dark mode is `@custom-variant dark`. There is no `tailwind.config.ts`; don't add one.
- Content lives in `src/content/*.ts`. Bracketed text like `[Your role]` and empty `href`s are placeholders to fill before launch.
- Theme: `next-themes` (class on `<html>`). Section hue: `data-section` → `--accent`; use `text-accent`/`bg-accent`, never raw hex.
- Components: `src/components/shell` (sidebar, mobile bar, theme toggle, intro, reveals), `src/components/overview`, `src/components/projects`, `src/components/graphics`, `src/components/ui` (PageHeader, ExternalLink, Chip).
- Writing: one Markdown file per post in `src/content/posts/<slug>.md` with front matter (title, date, summary, linkedin); copy `_template.md`. Files starting with `_` are ignored. Pictures go in `public/posts/<slug>/`.
- Text animation: add `data-split="chars"` (headings) or `data-split="words"` (paragraphs); `Reveals` does the rest.

## Skills (in `.claude/skills/`)

- `emil-design-eng` — every motion and interaction decision.
- `impeccable` — design work, critique, polish, design-system docs (PRODUCT.md / DESIGN.md). Local only; gitignored because of its binaries.
- Anthropic `frontend-design` — visual direction; avoid generated-looking defaults.

## Surfaces and how each behaves

| Surface | Mode | Rule |
|---|---|---|
| Sidebar shell, Overview | Operate | Fast, precise, familiar patterns. Brand shows in details, not effects. |
| Projects, Graphics | Read | Scannable; each item leads with what it is and the outcome; visuals tell the story. |
| Playground | Experience | The work leads; this is where play, 3D, and games live. |

Spend boldness in one place: the Playground plus one signature detail in the shell.

## Motion rules (from emil-design-eng)

- Frequent UI (sidebar, hovers, tabs): CSS transitions, 150–200ms, ease-out, no bounce.
- Easing tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`. Never `ease-in` on UI.
- Animate only `transform` and `opacity`. Never `transition: all`. Never enter from `scale(0)`.
- Buttons/pressables: `scale(0.97)` on `:active`.
- Hover effects inside `@media (hover: hover) and (pointer: fine)`.
- Springs (bounce 0.1–0.2) and spring-follow cursor: Playground only. Exception: the Overview's Play words section (visitor-triggered).
- One-time showpieces only: Overview first-load stagger (30–80ms steps) and the first-visit intro (<1s, skippable, once per session).
- No fade-up-on-scroll on every section.
- `prefers-reduced-motion`: keep opacity/color, remove movement; Playground shows a static poster.

## Libraries

- **Use:** CSS transitions; Three.js via React Three Fiber (+ drei) in the Playground and the hero arrow, loaded with `dynamic(..., { ssr: false })`. Add Motion (`motion/react`) only if a spring or layout transition truly needs it; it was removed to lighten every page.
- **Optional:** GSAP, only for a scroll-driven sequence Motion can't handle well.
- **Don't add:** AOS, AnimeJS.

## Content rules

- Never fabricate metrics, testimonials, clients, or awards.
- AVERA is a team thesis project — state Joko's role accurately.
- Highlighted projects (AVERA, CryoLipo) are link-out cards.

## Git

- Old design is tagged `v1-old-design`. Redesign work happens on the `redesign` branch; merge to `main` when ready.
