# Design

Source of truth for the visual system. Product truth lives in PRODUCT.md.

## Concept

**The name as a monument; a designer who builds what he designs.**
The page performs Joko's one-line claim: things arrive first as an outline (the design), then fill solid (the build). The loader draws JOKO in outline and fills it; the hero's 3D cursor arrow turns from its blueprint edges into a glossy solid as you scroll or flip the **Design / Build** switch.
The shell stays quiet and black-and-white; colour is the reward for interaction (the cursor, the switch, the work previews).

Direction dealt by design-taste-frontend: *The name as a monument* (seed 743643700), palette kept from the brand.

## Color

### Base (both themes)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#000000` | Page ground |
| `surface` | `#F3F3F3` | `#161616` | Sidebar, mobile bar, bands, pills |
| `card` | `#F7F7F7` | `#0E0E0E` | Second band tone, cards |
| `ink` | `#000000` | `#FFFFFF` | Text, primary fill, footer ground |
| `muted` | `#6E6E6E` | `#8E8E8E` | Secondary text, inactive work names |
| `line` | `#E2E2E2` | `#262626` | Link underlines only (no rules or outlines) |

### Section colors

| Section | Light | Dark |
|---|---|---|
| Overview | `#1D4ED8` blue | `#7B9CFF` |
| Projects | `#C2410C` orange | `#FF8A3D` |
| Graphics | `#0369A1` sky | `#4FC3F7` |
| Playground | `#A64B00` amber | `#FFB547` |

Rules:
- The current section's hue is `--accent`; components read `--accent`, never raw hex.
- Hues appear on interaction (active nav icon, hover, the desk) and as whole fields in the work previews. The hero arrow's solid is the Overview hue.
- Surfaces are separated by a tone step, never a line or a shadow. Only the command palette (a real modal) has a shadow.
- No gradients, glass, or tinted near-blacks.

## Typography

- **One family, two cuts: Funnel** by NORD ID (SIL Open Font License, free for commercial use), loaded with `next/font/google`.
  - **Funnel Display**: the monument (hero JOKO, footer JOKO, loader), headings, work names, contact rows. Semibold; tracking -0.05em at monument size, -0.02 to -0.04em for headings.
  - **Funnel Sans**: body, labels, buttons, nav.
- Scale (about six steps): 13–14px small, 16px body, 18px lead, 28px about text, 36px section titles and statements, 72px display rows, and the monument fitted to its container (`40.5cqi`).
- Sentence case. Nothing under 13px. No eyebrows, monospace labels, `01 / 02` numbering, or `→` appended to links.

## Layout

- **Sidebar (desktop)**: profile block (photo or initial, name, "Open for OJT"), Search (⌘K / Ctrl K), nav grouped **Work** (Overview, Projects, Graphics) and **Play** (Playground), contact links and theme toggle at the bottom. Tone step off the page, no border.
- **Mobile**: a 3.875rem top bar (`--bar-h`) with the compact profile, search icon and Menu.
- **Content column**: fills the space beside the sidebar; its right inset matches the sidebar's left one, so the page has one pair of outer margins.
- **Overview, top to bottom**:
  1. **Hero** (pinned, two screens): role line and Design / Build switch at the top, the statement ("I design it." / "I build it.") with one sentence and "See the work", the arrow in the right half, JOKO margin to margin at the bottom. On phones JOKO sits under the top row.
  2. **Selected work**: big names as the index (active one in full ink, the rest muted), each with its kind beneath; a sticky 4:5 preview on the right. Phones: still, then name.
  3. **About**: 28px paragraph with the portrait as a three-line drop capital, facts in a side column.
  4. **Contact**: display-size rows on alternating bands, then "Say hello" with a round arrow.
  5. **Footer** (every page): inverted, link columns, colophon, JOKO fitted margin to margin.
- Sections are 160–190px apart on desktop; each opens with a heading.

## Components

Primitives live in `src/components/ui`, shell pieces in `src/components/shell`, Overview pieces in `src/components/overview`.

### Shape
One button shape: fully round, flat fill. Cards and bands 24px (`rounded-3xl`), the footer 32px, the drop cap 16px.

### Buttons (`btn`, `btn-primary`)
Round, flat. `btn` on `surface`, `btn-primary` on `ink`. Pair with `pressable`. Magnetic under the custom cursor.

### Pressable (`pressable`)
Scales to 0.97 on `:active`. Owns its transitions (transform 160ms, colours 150ms, `--ease-out`); don't add `transition-colors` beside it.

### Custom cursor (`Cursor`)
A 12px dot in difference blend that follows the mouse (GSAP `quickTo`, 0.18s). Over links and buttons it grows to 56px and inverts what's beneath. `data-cursor="Word"` shows a solid circle with that word (work rows: "View", Say hello: "Write"). Shrinks on press. Re-checks on scroll. `.btn` and `[data-magnetic]` lean 30% toward it via `translate`. Off for touch and reduced motion; the system cursor returns in text fields and while a dialog is open.

### Loader (`Intro`)
About 2.6s, once per session, skippable (click, key, Skip intro). JOKO rises in outline, a solid fill sweeps left to right while a counter runs 000→100 ("Designing" → "Building"), then the panel lifts away (`expo.inOut`) and fires `INTRO_DONE` for the hero. Waits for fonts, locks scroll, hides itself after 5s if script fails. Skipped under reduced motion; `?nointro` skips it for testing.

### Hero (`Hero`, `HeroObject`)
- The `h1` is the monument; its visually hidden line carries the role at body size.
- Letters rise through a mask after the loader (0.9s, 60ms stagger), other parts follow; settled in about 1.1s. Reduced motion: fade only.
- **Design / Build switch**: two pressed-state buttons on a pill; the active one fills with `ink`. Scrolling past half the pinned hero flips it too.
- **Arrow**: an extruded cursor shape in R3F. Blueprint edges drawn from its own corners; a glossy physical solid (Overview hue) fades in on Build. Lit by a generated `RoomEnvironment`; tilts toward the pointer, floats, grows on hover, spins on click. Renders only while on screen; geometry disposed on unmount; an SVG outline stands in while it loads.

### Work index (`WorkIndex`)
Names at 72px; hover or focus makes one active and swaps the sticky preview (opacity 200ms; inactive stills are `visibility: hidden`). A preview is the project's screenshot when `image` is set in `src/content/work.ts`, otherwise a drawn title card on its tone (ink, a section hue, or surface).

### Contact rows
Bands of `surface` / `card`, value at display size, left-aligned, lower part of the band. A linked row inverts to `ink` under the pointer; the round arrow turns 45°. Labels go to `aria-label`, not above the value.

### Command palette (`CommandPalette`)
Native `<dialog>` with combobox and grouped listbox (Pages, Projects, Links, Actions). Opens instantly (no animation). Round, the only shadow on the site. Project rows jump to `/projects#slug`, marked by `HashTarget`.

### Text link (`link`)
Underlined in `line`, `--accent` on hover. External links say "(opens in a new tab)" to screen readers; an empty href shows an `[Add link: …]` reminder.

### Chip (`Chip`)
Round, filled: `surface` with ink text, or `strong` (ink fill) for the leading chip.

## Playground pieces

### Design desk (`DeskPiece`, `DeskScene`)
Joko's tools as monochrome clay; each object opens real work. The selected object takes Playground amber; the swatch fan opens into the four section hues. Filled round chips are the accessible control; the canvas is `aria-hidden`. Springs, draw-ins and orbit only for fine pointers without reduced motion. `frameloop="demand"`, loaded with `dynamic(..., { ssr: false })`, materials disposed on unmount.

## Motion

Emil-design-eng rules (CLAUDE.md) hold: transform and opacity, `--ease-out`, hover gated to fine pointers, reduced motion keeps opacity and colour only.

- **Signature**: the pinned hero, design → build.
- **Loader**: the one long showpiece (see Loader).
- **Section entrances** (`Reveals`, GSAP ScrollTrigger): in each `.reveal` section the heading, then every `[data-reveal]` part, rise 24px and fade, 70ms apart, once at 80% of the viewport. Hidden only by the tween, so content stays if script fails.
- **Feedback**: cursor states, magnetic buttons, press scale, nav pill slide (Motion `layoutId`, 200ms), contact band inversion, work preview crossfade.

## Theme

- Follows the system; the toggle overrides (`next-themes`, class on `<html>`).
- Tailwind v4 dark mode: `@custom-variant dark (&:where(.dark, .dark *));`.

## Performance budget

LCP < 2.5s, INP < 200ms, CLS < 0.1. One font family. Three.js only in the hero arrow and the Playground, both loaded on demand and rendered only while visible. `next/image` for all images.

## Still needed (not inventable)

Project screenshots (`image` in `src/content/work.ts`), a portrait (`site.photo`), the email, project links, design tools, and the bracketed descriptions. The design inspector's picture floor (four or more real images) fails until they exist.
