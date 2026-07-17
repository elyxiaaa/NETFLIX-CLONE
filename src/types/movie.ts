/**
 * Domain types for the app.
 *
 * These mirror the shape of the real TMDB (`themoviedb.org`) API responses on
 * purpose: the mock data in `services/mockData.ts` conforms to the exact same
 * interfaces, so swapping mock → live TMDB later requires **no** changes to any
 * component, hook, or type. See `services/api.ts`.
 */

/**
 * A single film or show. Fields match TMDB's `/movie` and `/discover` payloads.
 *
 * TMDB returns either `title` (movies) or `name` (TV). We normalize to `title`
 * and keep both `poster_path` / `backdrop_path` nullable, exactly as the API does.
 */
export interface Movie {
  /** TMDB id — stable primary key used for watchlist, similar lookups, React keys. */
  id: number;
  /** Display title. For TV payloads, map TMDB's `name` into this field. */
  title: string;
  /** Wide 16:9 art path (e.g. `/abc.jpg`). Resolve with `buildImageUrl`. May be null. */
  backdrop_path: string | null;
  /** Tall 2:3 poster path. Resolve with `buildImageUrl`. May be null. */
  poster_path: string | null;
  /** Synopsis. */
  overview: string;
  /** ISO date `YYYY-MM-DD`. Use `getYear()` for the display year. */
  release_date: string;
  /** Average rating 0–10. Drives the star rating and "Match %". */
  vote_average: number;
  /** TMDB genre ids. Resolve to names with `genreNames()`. */
  genre_ids: number[];
  /**
   * `"movie"` or `"tv"` — TMDB carries this on `/trending` payloads, and we
   * infer it elsewhere (movies have `title`, shows have `name`). It picks the
   * right `/movie` vs `/tv` endpoint for "More Like This" in live mode.
   */
  media_type?: "movie" | "tv";
  /**
   * Optional playback source for the video player. Not part of TMDB's core
   * payload — wire a real stream/trailer URL here per title; the player falls
   * back to a shared sample clip when it's absent.
   */
  video_url?: string | null;
  /**
   * Optional YouTube video id for the title's trailer, used as the hero's
   * ambient background. Not on TMDB's core list payloads — resolved on demand
   * via `getTrailerKey()` (the `/videos` endpoint) in live mode, or carried
   * here directly for mock data.
   */
  trailer_key?: string | null;
}

/**
 * TMDB list envelope. Every "row" endpoint (trending, discover, similar…)
 * returns results under this shape.
 */
export interface TMDBResponse {
  page?: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

/**
 * Props for a single horizontal `MovieRow`.
 * `fetchUrl` is an endpoint key/path handed to the service layer — the row never
 * knows or cares whether it resolves to mock data or a live TMDB request.
 */
export interface MovieRowProps {
  title: string;
  fetchUrl: string;
  /** Render as tall posters instead of wide backdrops. */
  poster?: boolean;
  /** Show ranked "TOP {n}" badges and cap the row at 10 (a "Top 10" row). */
  numbered?: boolean;
}

/** TMDB genre reference `{ id, name }`. */
export interface Genre {
  id: number;
  name: string;
}
