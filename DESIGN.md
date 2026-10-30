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
| Experience | `#6D28D9` violet | `#B69CFF` |
| Certificates | `#15803D` green | `#5EE38B` |
| Stack | `#BE123C` rose | `#FF7A93` |
| Writing | `#0F766E` teal | `#2DD4BF` |
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

- **Sidebar (desktop)**: the horizontal lockup on `bg` (the JC mark in `currentColor` beside "Joko Comia" in Funnel Display; `src/components/ui/Logo.tsx`), Search (⌘K / Ctrl K), nav grouped **Work** (Overview, Projects, Graphics), **Profile** (Experience, Stack, Certificates, Writing) and **Play** (Playground), and the Light / Dark switch at the bottom. Socials and the résumé live in the Overview hero and the footer, not here. Tone step off the page, no border.
- **Mobile**: a 3.875rem top bar (`--bar-h`) with the JC mark, search icon and Menu.
- **Browser icon**: `src/app/icon.svg`, the white mark on a black rounded tile, so it reads on light and dark tabs.
- **Content column**: fills the space beside the sidebar; its right inset matches the sidebar's left one, so the page has one pair of outer margins.
- **Overview, top to bottom**:
  1. **Hero** (pinned, two screens): who this is at the top (a square portrait, 80px on phones and 112px from md, in a `surface` frame so the dark backdrop doesn't dissolve into the page; role and location, plus the name on phones) and the Design / Build switch, the statement ("I design it." / "I build it.") with one sentence, then the action row: "See the work" (`btn-primary`), Résumé (`btn`), and LinkedIn / GitHub / Email as round icon buttons on `surface`, the arrow in the right half, JOKO at the bottom as the one big element, margin to margin in tall windows and capped at `42svh` in shorter ones. On phones JOKO sits under the top row.
  2. **Selected work**: big names as the index (active one in full ink, the rest muted), each with its kind beneath; a sticky 4:5 preview on the right. Phones: still, then name.
  3. **Experience** (`ExperiencePreview`): the three latest roles as bands (dates, organisation and role, kind), the competition placings in one sentence, certificates only once real ones exist, then links to Experience, Certificates and Stack. The Profile pages hold everything else.
  4. **About**: 28px paragraph with the portrait as a three-line drop capital, facts in a side column.
  5. **Play words**: "I DESIGN / I CODE / I BUILD" as three display rows fitted margin to margin (`25.5cqi`), every letter loose (see Play words).
  6. **Contact**: display-size rows on alternating bands, then "Say hello" with a round arrow.
  7. **Footer** (every page): inverted, link columns, colophon, JOKO fitted margin to margin.
- Sections are 160–190px apart on desktop; each opens with a heading.

## Components

Primitives live in `src/components/ui`, shell pieces in `src/components/shell`, Overview pieces in `src/components/overview`.

### Shape
One button shape: fully round, flat fill. Cards and bands 24px (`rounded-3xl`), the footer 32px, the drop cap 16px.

### Buttons (`btn`, `btn-primary`)
Round, flat. `btn` on `surface`, `btn-primary` on `ink`. Pair with `pressable`. Magnetic under the custom cursor.

### Sidebar nav
The active item is an `ink` pill with `bg` text (the switch's active fill) that slides between items. Inactive items are `muted`; on hover they turn `ink` and their icon takes that item's section hue.

### Pressable (`pressable`)
Scales to 0.97 on `:active`. Owns its transitions (transform 160ms, colours 150ms, `--ease-out`); don't add `transition-colors` beside it.

### Custom cursor (`Cursor`)
A 12px mid-grey dot that follows the mouse (GSAP `quickTo`, 0.18s). Over links and buttons it grows to 56px and inverts what's beneath; difference blending runs only in that state, because it re-composites the page. `data-cursor="Word"` shows a solid circle with that word (work rows: "View", Say hello: "Write"). Shrinks on press. Re-checks on scroll. `.btn` and `[data-magnetic]` lean 30% toward it via `translate`. Off for touch and reduced motion; the system cursor returns in text fields and while a dialog is open.

### Loader (`Intro`)
About 2s, once per session, skippable (click, key, Skip intro). JOKO rises in outline, a solid fill sweeps left to right while a counter runs 000→100 ("Designing" → "Building"), then the panel lifts away (`expo.inOut`) and fires `INTRO_DONE` for the hero. Waits for fonts, locks scroll, hides itself after 5s if script fails. Skipped under reduced motion; `?nointro` skips it for testing.

### Hero (`Hero`, `HeroObject`)
- The `h1` is the monument; its visually hidden line carries the role at body size.
- Letters rise through a mask after the loader (0.9s, 60ms stagger), other parts follow; settled in about 1.1s. Reduced motion: fade only.
- **Design / Build switch**: two pressed-state buttons on a pill; the active one fills with `ink`. Scrolling past half the pinned hero flips it too.
- **Arrow**: an extruded cursor shape in R3F. Blueprint edges drawn from its own corners; a glossy physical solid (Overview hue) fades in on Build. Lit by a generated `RoomEnvironment`; tilts toward the pointer, floats, grows on hover, spins on click. Starts after the intro and the hero's entrance, once the browser is idle. Renders on demand while on screen: every frame while changing, 30 a second for the float; geometry disposed on unmount; an SVG outline stands in while it loads.

### Work index (`WorkIndex`)
Names at 72px; hover or focus makes one active and swaps the sticky preview (opacity 200ms; inactive stills are `visibility: hidden`). A preview is the project's screenshot when `image` is set in `src/content/work.ts`, otherwise a drawn title card on its tone (ink, a section hue, or surface).

### Contact rows
Bands of `surface` / `card`, value at display size, left-aligned, lower part of the band. A linked row inverts to `ink` under the pointer; the round arrow turns 45°. Labels go to `aria-label`, not above the value.

### Play words (`PlayWords`)
The Overview's one place to play. Fine pointers grab and throw letters (GSAP Draggable + InertiaPlugin, bounded to the section, tilt and 1.08 scale while held); touch taps make a letter hop, so the section never traps scrolling. A moved letter takes its row's hue (Overview, Projects, Playground). **Scatter** throws all letters to random spots; **Put back** springs them home (`elastic.out(1, 0.6)`, random 25ms stagger) and clears the hue. The `h2` carries the sentence for screen readers; letters are `aria-hidden`. Reduced motion: drag without momentum, Scatter and Put back jump.

### Page header (`PageHeader`)
Inner pages open with the title at display size (`.page-title`, `clamp(3.5rem, 10vw, 9rem)`, letters rising in), the item count in muted display type at its top right (`aria-hidden`), and one lead line.

### Projects (`ProjectRow`)
One row per project, outcome first: kind and stack chips, the name at work-index size, summary, Role and Result, then the link (highlighted projects use `btn-primary`). The still sits right at 16:10, the work index's title card until a screenshot exists; it leans in on hover with the "View" cursor. Rows are 160px apart. `/projects#slug` marks its row in the section hue.

### Graphics (`GraphicsGallery`)
4:5 pieces in three columns, the middle one set 6rem lower like a spread (two even columns on phones). A piece opens a full-screen viewer (native `<dialog>` on `bg`): title, close, the piece fitted to the height, previous / next and arrow keys. It settles in (opacity and `scale(0.98)`, 220ms, `@starting-style`) and closes instantly; stepping does not animate.

### Résumé (`ResumeLink`)
One PDF, `public/joko-comia-resume.pdf` (one page, built from the CV in the developer résumé template), offered as a download (`download` attribute, saved as `Joko-Comia-Resume.pdf`) in the Overview hero's action row, the Experience header (`btn-primary`), the footer's Contact column and the palette's Actions. To update it, replace the file.

### Writing
`/writing` lists posts newest first: date in a three-column side column, the title at heading size (takes the section hue under the pointer), its summary beneath. With no posts, one surface band says the first posts are coming and links to LinkedIn; the header count hides at zero. A post (`/writing/[slug]`) opens with "All writing", a display title (`clamp(2.5rem, 6vw, 5rem)`, balanced), the date and "First posted on LinkedIn" when set, then the body at 18px / 1.6 within 65ch (`.post-body`). Posts are Markdown files in `src/content/posts` (see `_template.md`), rendered at build time with `marked`. Pictures live in `public/posts/<slug>/` and render as full-column figures (24px radius, lazy-loaded), with the Markdown title as a muted caption.

### Stack
Each group (Design, Front-end, Code and tools) has its heading in a three-column side column and its tools as words at heading size (`.stack-item`, `clamp(2rem, 4.5vw, 4rem)`), wrapping like a set of type; under a fine pointer each word lifts 0.08em, turns 2° and takes its own section hue (all eight hues, ordered so neighbours differ), 180–220ms ease-out, colour only under reduced motion; the CV's stated levels are one muted sentence beneath the group ("Advanced in Figma and Canva; basic in Illustrator and Photoshop."). Interests close the page as one statement paragraph. Tools marked `featured` in `src/content/stack.ts` make the Overview's one-line "Works with" summary, which links to the page.

### Experience
One band per role (`surface` / `card` alternating), newest first. On wide screens the dates take three of twelve columns; the role at heading size, then organisation (linked when it has a site), kind and location in muted, the outcome lines, and skill chips. Content lives in `src/content/experience.ts`.

### Certificates
Credly badges (public, accepted) come from Credly's public profile JSON for `site.credly`, fetched on the server and revalidated daily (`src/lib/credly.ts`), merged with any hand-added entries in `src/content/certificates.ts`, newest first. Bands like the contact rows: the badge image (64–80px) beside the title at heading size, issuer and year beneath, a round arrow at the right that turns 45° as the band inverts to `ink`; each links to the badge's public Credly page to verify it. The Overview's Experience section lists the three latest.

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
- **Text** (`Reveals`, GSAP SplitText): `data-split="chars"` headings rise letter by letter through their line masks (0.9s, 22ms stagger, once); `data-split="words"` paragraphs fill from 18% to full ink, scrubbed as they cross the view (reading pace). Screen readers get the whole text. Reduced motion: headings fade, paragraphs stay solid.
- **Play words** is the one spring outside the Playground, by request: it is play, and only runs when the visitor asks for it.
- **Feedback**: cursor states, magnetic buttons, press scale, active nav item fills with `ink` (colour 150ms), contact band inversion, work preview crossfade.
- **Theme change** (`switchTheme` in `src/lib/themeTransition.ts`): a view transition where the new theme grows in through the cursor arrow. The arrow launches whole from the pressed control, aimed at the page centre and righting a 28° turn, then floods the page (950ms, `--ease-in-out`, exponential scale). The palette's theme action uses it from the centre. Reduced motion: 200ms crossfade. No view transitions: instant.

## Theme

- Follows the system; the sidebar's Light / Dark switch overrides (`next-themes`, class on `<html>`). It is the hero switch at sidebar size on `bg`, with Phosphor sun and moon icons.
- Icons: Phosphor only (`react-icons/pi`), everywhere.
- Tailwind v4 dark mode: `@custom-variant dark (&:where(.dark, .dark *));`.

## Performance budget

LCP < 2.5s, INP < 200ms, CLS < 0.1. One font family. Three.js only in the hero arrow and the Playground, both loaded on demand and rendered only while visible. `next/image` for all images.

## Still needed (not inventable)

Project screenshots (`image` in `src/content/work.ts`), a portrait (`site.photo`), the email, project links, design tools, and the bracketed descriptions. The design inspector's picture floor (four or more real images) fails until they exist.
