# Reelix

**Reelix** is a cinematic, production-quality streaming "Browse" experience built with
**React 19 + TypeScript + Tailwind CSS + Vite**. It ships with a rich mock dataset shaped
exactly like the TMDB API (using real artwork), so it looks authentic out of the box — and
swapping in the **live TMDB API** later is a one-flag change.

> The brand name lives in one place — `src/config.ts` (`BRAND_NAME`). Change it there and the
> wordmark, page title, hero tag, and "Originals" row all update.

## Features

- **Cinematic hero billboard** — full-bleed backdrop, layered gradients, synopsis, and
  Play / More Info actions.
- **Horizontally-scrollable rows** — hidden scrollbars, hover chevrons (desktop), swipe
  (touch), and titles that overlap between rows like the real thing.
- **Rich hover cards** — smooth `scale-105`, shadow lift, and a metadata reveal
  (Match %, HD, rating, genres) with quick actions.
- **Detail modal** — portaled and fully accessible (focus trap, `Esc` / click-scrim to
  close, body-scroll lock), with HD/4K tags and a live **"More Like This"** grid.
- **My List (watchlist)** — global state persisted to `localStorage`, with a live navbar
  badge and a teaching empty state.
- **Sticky navbar** — transparent over the hero, solid + blurred on scroll.
- **Skeleton loaders** — shimmer placeholders for the hero and rows while data loads.
- **Graceful image fallback** — any missing/broken artwork becomes a deterministic gradient
  card, so nothing ever looks broken.
- **Accessible & responsive** — WCAG-minded contrast, keyboard support, visible focus rings,
  full `prefers-reduced-motion` path, and layouts from 390 px to ultrawide.

## Tech stack

React 19 · TypeScript (strict) · Tailwind CSS 3 · Vite 8 · Axios

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## Using the live TMDB API

The app runs on bundled mock data by default. To use the real API:

1. Get a free v3 key at <https://www.themoviedb.org/settings/api>.
2. Copy `.env.example` → `.env` and fill it in:
   ```
   VITE_TMDB_KEY=your_key_here
   VITE_USE_MOCK=false
   ```
3. Restart the dev server.

Nothing else changes — the mock data mirrors TMDB's response shape, and the entire app
talks to the backend through two functions (`getRow`, `getSimilar`) that share one
signature across mock and live modes.

## Project structure

```
src/
├── components/
│   ├── Navbar.tsx           # sticky nav, transparent → blurred on scroll
│   ├── Hero.tsx             # billboard hero + HeroSkeleton.tsx
│   ├── MovieRow.tsx         # data-fetching row (loading / error / data)
│   ├── ScrollRow.tsx        # presentational scroller (shared by rows + My List)
│   ├── RowSkeleton.tsx      # shimmer row placeholder
│   ├── MovieCard.tsx        # hover-scale card + metadata + image fallback
│   ├── DetailModal.tsx      # accessible portal modal + "More Like This"
│   ├── Footer.tsx
│   └── icons.tsx            # inline SVG icon set + brand wordmark
├── context/
│   ├── WatchlistContext.tsx # My List state, persisted to localStorage
│   └── ModalContext.tsx     # currently-open movie
├── hooks/
│   ├── useFetchMovies.ts    # { data, loading, error } with cleanup
│   └── useScrolled.ts       # navbar background trigger
├── services/
│   ├── api.ts               # axios instance, endpoint map, USE_MOCK switch
│   ├── movies.ts            # getRow / getSimilar (mock ↔ live seam)
│   └── mockData.ts          # TMDB-shaped catalog with real image paths
├── types/movie.ts           # Movie, TMDBResponse, MovieRowProps, Genre
├── utils/
│   ├── images.ts            # buildImageUrl + gradient fallback
│   └── genres.ts            # genre map, Match %, year helpers
├── App.tsx                  # composes the page
└── main.tsx                 # providers + root render
```

See [`DESIGN.md`](./DESIGN.md) for the visual system and
[`PRODUCT.md`](./PRODUCT.md) for the product/design principles.

## Notes

Reelix is a portfolio demo and is **not a real service or affiliated with any streaming
provider**. It uses the TMDB API and image CDN but is not endorsed or certified by TMDB.
All artwork and titles belong to their respective owners.
