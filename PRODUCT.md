# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** OJT (on-the-job training) supervisors and hiring managers deciding whether to take Joko on for a UI/UX design or design-engineering placement. Limited time: they skim the overview, open one or two highlighted projects, and decide whether to reach out.
- **Secondary:** peers and general visitors who come for the Playground.

## Product Purpose

Personal portfolio for Joko (GitHub: Joko2005). Its job right now is to win an OJT placement.

Success: within about 30 seconds a reviewer understands that Joko is a designer who builds, opens a highlighted project, and knows how to contact him.

## Positioning

UI/UX designer / design engineer: creates striking visual design, reads code, and cares about code structure. One-line message: **a designer who builds what he designs.**

Personality: composed and minimalist on the outside, playful and creative on the inside.

## Operating Context

- Structured as a dashboard with a persistent sidebar. Sections: **Overview** (default landing; includes short about + contact), **Projects**, **Graphics** (pubmats and other graphic design), **Playground**.
- Everything Joko has made is shown somewhere (projects, graphic design, certificates), but the Overview highlights a curated few.
- Visitors arrive on desktop and phone; sidebar navigation is used repeatedly in one visit.
- Deployed on Vercel, linked to the GitHub repo.

## Capabilities and Constraints

- **Highlighted projects: AVERA and CryoLipo.** Shown as highlight cards that link out (AVERA → GitHub; CryoLipo → live Shopify store). No in-site case study for these for now.
- **Other projects:** ResQLine, Statera, plus graphic design work and certificates.
- **Project media:** screenshots and video only; no embedded interactive demos.
- **Playground:** interactive pieces for visitors — 3D and/or small games (neal.fun-like). 3D appears only here.
- **First visit:** one intro moment under 1 second, skippable, shown on first visit only. No other loading screens.
- **Launch:** Joko wants to launch everything together, as soon as possible, to use for OJT applications.
- **Undecided:** visual direction (palette, type, signature detail); written descriptions for each project; which certificates to show; exact AVERA and CryoLipo URLs.

## Brand Commitments

- Name: Joko. Repo: Joko-Portfolio.
- References Joko chose: bryllim.com, neal.fun, jesperlandberg.com, satriabahari.my.id/en.
- Portfolio principles Joko set: prioritized content, clean design, strategic project selection, transformation-driven, shows focus, tries to explain, leads with outcomes, visuals as a story.

## Evidence on Hand

- **AVERA:** Android app for handwritten signature verification (Siamese neural networks with explainable AI); team thesis at LSPU, in progress since April 2026. Joko: UI/UX designer and front-end developer (admin and analyst flows in Figma, the React Native interface).
- **CryoLipo:** the freelance client Shopify storefront from the CV (Sep 2026–present): Joko designed it in Figma and builds it as reusable Liquid theme sections with a development partner.
- **ResQLine:** AI disaster classifier and live dispatcher map, built at the Batang Techno Hackathon (April 2026, Top 12 of 48+ universities); Joko was web developer and UI/UX designer.
- **WorkHive:** team coursework project, a WinForms project management app (tasks, progress, team communication); Joko designed and built interfaces.
- **Statera:** team coursework project; Joko designed and built interfaces. Description not yet written.
- **CV (source of truth for facts):** freelance Shopify storefront (Sep 2026–present), LSPU BS Computer Science in Intelligent Systems (expected 2027), Figma workshop talks, design team leader, class president, SIKAPtala 2026 design competition (5th of 106 schools).
- **Graphics/pubmats and certificates:** not yet collected.
- **No testimonials or client quotes on hand.** The only results to state are the ones in the CV. Do not fabricate any.

## Product Principles

1. Lead with outcomes and clarity — a reviewer should never have to hunt for what Joko did.
2. Curate the front, keep the rest available — highlight a few, show everything elsewhere.
3. Composed shell, creative core — navigation and reading stay restrained; play is concentrated in the Playground.
4. The site itself is the proof of "designer who builds" — its craft must hold up to inspection.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion`: Playground falls back to a static poster with fades; other motion becomes gentler, not removed.
- Hover effects only on hover-capable pointers; everything works on touch.
- Full keyboard navigation with visible focus.
