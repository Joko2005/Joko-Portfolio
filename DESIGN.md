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

- Desktop: fixed left sidebar (name, "Open for OJT" status, Search, Overview / Projects / Graphics / Playground, theme toggle) + left-aligned content column (max 64rem, never centered).
- Mobile: sidebar becomes a top bar with a search icon and a menu.
- Dividers run the content width (`border-line`, 1px); no rule bleeds past the column.
- Highlight items (AVERA, CryoLipo) are separated by spacing and lines, not boxed cards with shadows. Each shows: what it is, Joko's role, one result, link.

## Signature: hero glow

One soft blue/orange glow inside the Overview hero only, following the cursor.

- One absolutely positioned, pre-blurred radial-gradient element, moved with `transform` only (spring via Motion `useSpring`).
- Opacity about 0.35; fades in on enter (200ms ease-out), out on leave.
- Never behind body text; never on other pages.
- Off on touch (`(hover: hover) and (pointer: fine)` only) and under `prefers-reduced-motion`.
- Pointer listeners live on the hero element only, so nothing runs when the cursor is elsewhere.
- Never use `mix-blend-mode`, `backdrop-filter`, or a full-viewport repainting gradient.

## Components

Primitives live in `src/components/ui`, shell pieces in `src/components/shell`. Each entry: what it is, when to use it, the rules it keeps.

### Pressable (`pressable` utility)
Any button-like control. Scales to 0.97 on `:active`. It owns its transitions (transform 160ms, color/background/border 150ms, `--ease-out`), so never add `transition-colors` beside it: the later declaration cancels the press.

### Text link (`link` utility, `ExternalLink`)
Underlined in `line`, turns `--accent` on hover. External links open in a new tab and say so to screen readers. An empty href renders a visible `[Add link: …]` reminder instead of a dead link.

### Chip
Square, 1px `line` border, `text-sm`, `px-3 py-1.5`. Pressed state fills with `--accent` and `bg` text. Used for selectable sets (the desk's object list). Toggle with `aria-pressed`.

### Command palette (`CommandPalette`)
Jump to any page, project, link or action. ⌘K / Ctrl K, the sidebar Search button, or the mobile search icon.
- Native `<dialog>` with `showModal` (focus trap, Esc, focus return). Combobox input + grouped listbox (Pages, Projects, Links, Actions).
- Opens and closes with no animation: it is used many times per visit.
- The active row takes its own section's hue (`data-section`), on `surface`.
- Empty state names the recovery. Project rows jump to `/projects#slug`, and the landing title is marked in `--accent` (`HashTarget`).

### Highlight item (`ProjectSummary`)
Media, title, one-line summary, Role / Result / Built with list, links. Separated by space and lines, never boxed or shadowed. Anchored by slug for jumps.

### Placeholder
Dashed `line` box on `surface` with the asset it stands for and its size. Temporary only; replace with `next/image`.

## Playground pieces

The one place for play, 3D and springs. Each piece sits inside the shell, never as a separate app.

### Design desk (`DeskPiece`, `DeskScene`)
Joko's tools as monochrome clay on a desk mat; each object opens real work (phone → AVERA, bag → CryoLipo, sketchbook → Graphics, laptop → projects, swatch fan → this palette, mug → coffee).
- Clay at rest (`#EFEFEF` light, `#6A6A6A` dark) on `surface`. Selected object takes Playground amber; hover tints 35% toward it. The fan opens into the four section hues. Nothing else is colored.
- Picking lifts the object on a spring (bounce ~0.15); the phone's signature and the laptop's code lines draw themselves in. Drag-to-orbit on fine pointers only, within limited angles.
- The chip list beside the canvas is the accessible control; the canvas is `aria-hidden`. The caption below is `aria-live`.
- The camera fits the desk to every canvas size (projected bounds, 94% fill). The canvas is height-capped on wide screens so chips and caption stay in the first viewport.
- `frameloop="demand"`, loaded with `dynamic(..., { ssr: false })`. Materials created in code are disposed on unmount.
- Reduced motion: no lift, spring, orbit or draw-in; state changes show instantly. No WebGL: a message, and the list still works.

## Motion

See CLAUDE.md motion rules (emil-design-eng). Hover color changes: `color`/`background-color` 150ms ease. Movement: `transform`/`opacity` only.

- **Overview first-load stagger** (the site's one entrance): name, statement, intro, highlights; 500ms `--ease-out`, 60ms steps, 8px rise. Waits for the first-visit intro, plays once per page load (`EnterOnce`), fades only under reduced motion.

## Theme

- Follow system setting by default; toggle overrides. Use `next-themes` to avoid a flash on load.
- Tailwind v4: define dark mode with `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`.

## Performance budget

LCP < 2.5s, INP < 200ms, CLS < 0.1. Two font families max. Three.js only inside Playground, loaded on demand. `next/image` for all images; videos lazy with poster.
