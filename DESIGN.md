# Design

Visual system for the Reelix streaming UI. Cinematic dark mode; the artwork is the hero, chrome recedes.

## Theme

Single dark theme (no light mode — this is a theater). Pure-black canvas, one warm-black
elevation surface, a single saturated red reserved for primary action and brand.

## Color

| Token            | Value       | Role                                             |
| ---------------- | ----------- | ------------------------------------------------ |
| `brand-black`  | `#000000`   | Page canvas, hero base, modal backdrop           |
| `brand-dark`   | `#141414`   | Elevated surface: navbar-on-scroll, modal, cards |
| `brand-gray`   | `#2a2a2a`   | Skeletons, hairlines, inactive control fills     |
| `brand-red`    | `#E50914`   | Primary CTA, brand logo, active/selected state   |
| `brand-red-hover` | `#f6121d` | Red hover                                         |
| ink              | `#ffffff`   | Primary text                                      |
| ink-muted        | `rgba(255,255,255,0.7)` | Secondary text (≥4.5:1 on black)     |
| success-green    | `#46d369`   | "Match %" score (the accent green)                |

Red is an accent, never a surface fill beyond buttons. Muted text never drops below 0.7 alpha
on the black canvas.

## Typography

One family, system sans (a proprietary brand font would add bytes; a tuned system stack reads the same and
ships zero bytes):
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

- Hero title: bold, `clamp(2rem, 5vw, 4rem)`, `tracking-tight`, `text-wrap: balance`.
- Row headers: `~1.25rem`, semibold.
- Body/overview: `0.95–1.05rem`, `leading-relaxed`, capped ~60ch in the modal.
- Metadata (match %, year, genres): `0.8rem`, medium.

## Spacing & Radius

- Page gutter: `px-4 md:px-12`. Rows sit flush to this gutter and bleed right.
- Row vertical rhythm: `space-y-2` header→track, generous `mt` between rows.
- Radius: cards `rounded` (4px) — Streaming box art is nearly square. Buttons `rounded`; pills/tags
  `rounded-full`. Modal `rounded-lg` (8px). **No card radius above 12px.**

## Components

Every interactive element ships default / hover / focus-visible / active states.

- **Navbar** — fixed; transparent over hero → `brand-dark/95` + `backdrop-blur` past ~40px scroll.
- **Hero** — full-bleed backdrop, left→right black gradient + bottom fade; title, 2–3 line
  clamped overview, Play (white) + More Info (translucent white) buttons.
- **MovieRow** — horizontal scroll-snap track, `.hide-scrollbar`, edge chevron buttons on hover.
- **MovieCard** — backdrop thumbnail; on hover `scale-105` + shadow + metadata reveal
  (match %, HD, rating, genres, Play/＋/ⓘ). Image `onError` → deterministic gradient + title.
- **DetailModal** — portal + fixed overlay, `brand-dark` sheet, backdrop-blur scrim, big
  backdrop with fade, HD/rating/year tags, watchlist toggle, "More Like This" grid.
- **Skeletons** — `HeroSkeleton`, `RowSkeleton`: `brand-gray` blocks with a `shimmer` sweep.

## Motion

- Durations 150–250ms; ease-out (`cubic-bezier(0.22,1,0.36,1)`), no bounce.
- Card hover scale, modal scale-in + scrim fade, row scroll `scroll-behavior: smooth`.
- `shimmer` keyframe: 1.6s linear translateX sweep for skeletons.
- Full `prefers-reduced-motion: reduce` alternative: opacity-only, no transform/slide.

## Z-index scale

`dropdown 10 · sticky/navbar 40 · modal-backdrop 50 · modal 60 · toast 70`. No arbitrary 9999.

## Accessibility

AA contrast enforced; keyboard-complete modal (focus trap, ESC, focus restore); visible
`:focus-visible` rings in `brand-red`; images carry alt text; motion respects reduced-motion.
