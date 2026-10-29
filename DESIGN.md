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
| `card` | `#F7F7F7` | `#0E0E0E` | Card fill (one step off `bg`) |

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

- **One family, two cuts: Funnel** by NORD ID (SIL Open Font License, free for commercial use), loaded with `next/font/google`.
  - **Funnel Display**: headings only (hero name, page titles, section and card titles). Semibold, tracking -0.03em at large sizes, max 6rem.
  - **Funnel Sans**: everything else (body, labels, buttons, nav).
- Hierarchy from size and weight, not extra families. Sentence case. Line length under 80 characters.
- Avoid: all-caps eyebrow labels, monospace labels, `01 / 02` numbering, `→` appended to links.

## Layout

Pattern drawn from bryllim.com and satriabahari.my.id: a persistent sidebar beside one column of cards.

- **Sidebar (desktop)**, top to bottom: profile block (photo or initial, name, "Open for OJT"), Search (⌘K / Ctrl K), nav grouped as **Work** (Overview, Projects, Graphics) and **Play** (Playground), then a ruled footer with email, GitHub and the theme toggle. Group labels are small, muted, sentence case.
- **Mobile**: top bar with the compact profile, a search icon and Menu; the menu holds the same groups and footer.
- **Content column**: left-aligned, max 64rem, never centered. Sections stack with 3–3.5rem between them.
- **Section header**: Funnel Display title, optional one-line description, optional "See all …" link on the right. No numbering, no eyebrow.
- **Overview order**: intro card (name, role chips, statement, actions, portrait from 1280px up) → Highlighted work (2 project cards) → Stack (filterable chips) → More to see (Graphics, Playground) → contact card.

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

### Radii
Cards 16px (`rounded-2xl`), inner tiles and nav pills 12px (`rounded-xl`), buttons 10px, chips 8px (`rounded-lg`). Card media sits flush at the top and inherits the card's corners.

### Card (`Card`, `CardLink`)
`bg-card`, 1px `line` border, 16px radius, no shadow. `CardLink` makes the whole card the link and takes a `section`: its border, title and arrow turn that section's hue on hover/focus, so a card always previews where it leads. Press scales to 0.985.

### Project card (`ProjectCard`)
Screenshot first (16:10, `card-media`), then chips (the kind of work first and `strong`, then stack), title, one-line summary, Role / Result, and the link label with an arrow. Links out (GitHub, live store); without a URL it renders as a plain card with an `[Add link: …]` reminder.

### Chip (`Chip`)
8px radius, 1px border, `text-xs`. Default is muted; `strong` (ink text, stronger border) marks the leading chip in a set. Not interactive.

### Filter tabs (`StackCard`)
Pressable chips with a count. The active tab fills with `ink`. Changing the filter fades the chips in with a 20ms stagger.

### Buttons (`btn`, `btn-primary` utilities)
10px radius, `text-sm` medium. `btn` is outlined; `btn-primary` fills with `ink`. Both turn `--accent` on hover. Pair with `pressable`. One primary per card.

### Sidebar nav item
Icon and label. The active item sits on a `bg` pill with a `line` border, and its icon takes the section hue; the pill slides between items (Motion `layoutId`, 200ms `--ease-out`, instant under reduced motion).

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

### Project list item (`ProjectSummary`)
Used on the Projects page until it moves to cards: media, title, summary, Role / Result / Built with, links. Anchored by slug for jumps.

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

- **Overview first-load stagger** (the site's one entrance): intro card, highlighted work, stack, more to see, contact; 500ms `--ease-out`, 60ms steps, 8px rise.
- **Card hover** (fine pointers only): border to the section hue (150ms), arrow nudges 2px up-right (200ms), screenshot scales to 1.02 (400ms). Reduced motion keeps only the color. Waits for the first-visit intro, plays once per page load (`EnterOnce`), fades only under reduced motion.

## Theme

- Follow system setting by default; toggle overrides. Use `next-themes` to avoid a flash on load.
- Tailwind v4: define dark mode with `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`.

## Performance budget

LCP < 2.5s, INP < 200ms, CLS < 0.1. Two font families max. Three.js only inside Playground, loaded on demand. `next/image` for all images; videos lazy with poster.
