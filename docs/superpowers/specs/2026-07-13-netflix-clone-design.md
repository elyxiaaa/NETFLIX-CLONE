# Netflix Clone — Design Spec

**Date:** 2026-07-13
**Status:** Approved

## Goal
A visually stunning, production-quality Netflix clone (Browse page) in Vite + React 19 +
TypeScript + Tailwind 3.4, structured so a real TMDB API can be plugged in later with a
one-line change.

## Key decisions
- **Data:** Rich local mock dataset shaped **exactly** like TMDB responses
  (`{ results: Movie[] }`), using **real TMDB image-CDN URLs** for real titles so it looks
  authentic with zero API key. A `USE_MOCK` flag in the service layer routes to mock or
  live; component/hook code is identical either way.
- **Going live later:** set `VITE_TMDB_KEY` in `.env`, flip `USE_MOCK` → `false`. Nothing
  else changes.
- **Watchlist:** React Context, persisted to `localStorage` (survives reload).
- **Routing:** none — single Browse page.
- **New dependency:** `axios`.

## Theme
Pure black `#000000`, dark `#141414`, Netflix red `#E50914`. Tailwind theme extended with
`netflix-red`/`netflix-black`/`netflix-dark`, a `shimmer` keyframe, and a `.hide-scrollbar`
utility. Cinematic dark mode throughout.

## Types (`types/movie.ts`)
- `Movie`: `id, title, backdrop_path, poster_path, overview, release_date, vote_average, genre_ids`
- `TMDBResponse`: `{ results: Movie[] }`
- `MovieRowProps`: `{ title: string; fetchUrl: string }`
- `Genre`: `{ id: number; name: string }`

## Service layer (`services/`)
- `api.ts` — axios instance (`baseURL`, `params.api_key` from `import.meta.env`),
  `endpoints` map (trending, netflixOriginals, action, comedy, documentaries, horror,
  romance, topRated), `USE_MOCK` constant.
- `movies.ts` — `getRow(fetchUrl): Promise<Movie[]>`, `getSimilar(id): Promise<Movie[]>`.
  Identical signatures for mock and live.
- `mockData.ts` — TMDB-shaped dataset with real image paths.

## Hooks
- `useFetchMovies(fetchUrl)` → `{ data, loading, error }` with async cleanup.
- `useScrolled(threshold)` → boolean for navbar background swap.

## Components
- **Navbar** — sticky; transparent over hero, blurred `#141414` after scroll; logo, nav
  links, watchlist count, avatar.
- **Hero** — full-bleed backdrop + left/bottom black gradients; title, truncated overview,
  Play + More Info buttons. `HeroSkeleton` shimmer while loading.
- **MovieRow** — horizontal scroller, hidden scrollbar, hover chevron arrows. `RowSkeleton`
  shimmer while loading. Props = `MovieRowProps`.
- **MovieCard** — hover `scale-105` + shadow + metadata reveal (Match %, HD, rating,
  genres); Play / add-to-watchlist / info buttons; graceful gradient fallback if image fails.
- **DetailModal** — portaled overlay, backdrop blur, ESC / click-out close, body-scroll
  lock; big backdrop, overview, year, HD/rating tags, watchlist toggle, "More Like This" grid.

## Loading & errors
Skeleton shimmer for hero and rows while fetching; per-row error message; image `onError`
fallback to gradient + title.

## Out of scope (YAGNI)
Auth, real video playback, search, multiple routes/profiles, SSR.
