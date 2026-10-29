# Design

Source of truth for the visual system. Product truth lives in PRODUCT.md.

## Concept

The interface is black and white. Color appears only where the visitor interacts.
"Composed outside, creative inside": a quiet monochrome shell, color as the reward for interaction.

## Color

### Base (both themes)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Page background |
| `surface` | `#F3F3F3` | `#161616` | Sidebar, raised areas |
| `ink` | `#000000` | `#FFFFFF` | Text, icons, focus ring |
| `muted` | `#6E6E6E` | `#8E8E8E` | Secondary text |
| `line` | `#E2E2E2` | `#262626` | Dividers, borders |

### Section colors (interaction only)

Each sidebar section owns one hue. It appears only on hover, focus, press, and the active sidebar item. All values pass 4.5:1 text contrast on their theme's `bg`.

| Section | Light | Dark | Contrast (light / dark) |
|---|---|---|---|
| Overview | `#1D4ED8` blue | `#7B9CFF` | 6.7 / 8.0 |
| Projects | `#C2410C` orange | `#FF8A3D` | 5.2 / 9.0 |
| Graphics | `#0369A1` sky | `#4FC3F7` | 5.9 / 10.5 |
| Playground | `#A64B00` amber | `#FFB547` | 5.8 / 12.0 |

Rules:
- Expose the current section's hue as `--accent` on the page wrapper; components only use `--accent`.
- Color is never the only signal: active item also changes weight/position; focus also gets an outline.
- Touch devices see color through active and pressed states.
- Project and graphic-design visuals always render in full color. Never gray out the work.
- No other accent colors, gradients as decoration, or tinted near-blacks.

## Typography

- **Display: Humane** (variable). Hero name and Playground titles only. Never body, labels, or buttons. Verify license on the designer's Gumroad before shipping. Self-host with `next/font/local`.
- **Text/UI: Sora** (OFL, Google Fonts via `next/font/google`). Everything else.
- Hierarchy from size and weight, not extra families. Sentence case. Line length under 80 characters.
- Avoid: all-caps eyebrow labels, monospace labels, `01 / 02` numbering, `→` appended to links.

## Layout

- Desktop: fixed left sidebar (name, "Open for OJT" status, Overview / Projects / Graphics / Playground, theme toggle) + left-aligned content column.
- Mobile: sidebar becomes a top bar with a menu.
- Highlight items (AVERA, CryoLipo) are separated by spacing and lines, not boxed cards with shadows. Each shows: what it is, Joko's role, one result, link.

## Signature: hero glow

One soft blue/orange glow inside the Overview hero only, following the cursor.

- One absolutely positioned, pre-blurred radial-gradient element, moved with `transform` only (spring via Motion `useSpring`).
- Opacity about 0.35; fades in on enter (200ms ease-out), out on leave.
- Never behind body text; never on other pages.
- Off on touch (`(hover: hover) and (pointer: fine)` only) and under `prefers-reduced-motion`.
- Pointer listeners live on the hero element only, so nothing runs when the cursor is elsewhere.
- Never use `mix-blend-mode`, `backdrop-filter`, or a full-viewport repainting gradient.

## Motion

See CLAUDE.md motion rules (emil-design-eng). Hover color changes: `color`/`background-color` 150ms ease. Movement: `transform`/`opacity` only.

## Theme

- Follow system setting by default; toggle overrides. Use `next-themes` to avoid a flash on load.
- Tailwind v4: define dark mode with `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`.

## Performance budget

LCP < 2.5s, INP < 200ms, CLS < 0.1. Two font families max. Three.js only inside Playground, loaded on demand. `next/image` for all images; videos lazy with poster.
