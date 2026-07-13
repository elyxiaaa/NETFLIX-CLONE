/**
 * API service configuration.
 *
 * This is the ONE place that knows about the backend. Requests route either to
 * the bundled mock data (`mockData.ts`) or to live TMDB, decided by `USE_MOCK`.
 * To go live against real TMDB, add EITHER credential to a `.env` file:
 *
 *   VITE_TMDB_TOKEN=your_v4_read_access_token   # preferred (Bearer auth)
 *   # …or…
 *   VITE_TMDB_KEY=your_v3_api_key               # legacy query-param auth
 *
 * That's it — with a credential present the app defaults to live mode. Set
 * `VITE_USE_MOCK=true` to force the bundled data even when a key exists (handy
 * for offline demos), or `VITE_USE_MOCK=false` to force live.
 *
 * No component, hook, or type changes are needed — the mock is shaped exactly
 * like TMDB responses, and `getRow` / `getSimilar` (in `movies.ts`) share one
 * signature across both modes.
 */
import axios from "axios";

/** TMDB v3 REST base. Overridable if you proxy the API. */
export const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Credentials, read from the environment. TMDB accepts two auth styles on the
 * v3 REST endpoints: a v4 "read access token" via `Authorization: Bearer` (the
 * modern, recommended one) or a v3 API key via an `?api_key=` query param.
 */
const READ_TOKEN = (import.meta.env.VITE_TMDB_TOKEN ?? "").trim();
const API_KEY = (import.meta.env.VITE_TMDB_KEY ?? "").trim();
const HAS_CREDENTIALS = Boolean(READ_TOKEN || API_KEY);

/**
 * Whether to serve bundled mock data instead of calling TMDB.
 *
 * `VITE_USE_MOCK` wins when set (`"true"` → mock, anything else → live). When it
 * is unset we auto-detect: live if a credential is present, mock otherwise —
 * so the app works out of the box and "just goes live" once you add a key.
 */
const MOCK_OVERRIDE = import.meta.env.VITE_USE_MOCK as string | undefined;
export const USE_MOCK =
  MOCK_OVERRIDE != null
    ? MOCK_OVERRIDE.toLowerCase() === "true"
    : !HAS_CREDENTIALS;

if (!USE_MOCK && !HAS_CREDENTIALS && import.meta.env.DEV) {
  // Loud, actionable hint rather than a silent wall of failed requests.
  console.warn(
    "[api] Live mode is on but no TMDB credential was found — set VITE_TMDB_TOKEN " +
      "(or VITE_TMDB_KEY) in your .env, or set VITE_USE_MOCK=true. Requests will 401.",
  );
}

/**
 * Endpoint map. Keys are semantic; values are TMDB request paths.
 * `MovieRow` receives one of these values as its `fetchUrl`, and `MOCK_ROWS`
 * (in `mockData.ts`) is keyed by these exact strings so the mock can resolve a
 * dataset with a direct lookup.
 */
export const requests = {
  fetchTrending: "/trending/all/week",
  fetchOriginals: "/discover/tv?with_networks=213",
  fetchActionMovies: "/discover/movie?with_genres=28",
  fetchComedyMovies: "/discover/movie?with_genres=35",
  fetchSciFi: "/discover/movie?with_genres=878",
  fetchCrime: "/discover/movie?with_genres=80",
  fetchTopRated: "/movie/top_rated",
  // TV Shows page
  fetchTvShows: "/discover/tv?sort_by=popularity.desc",
  fetchTvCrime: "/discover/tv?with_genres=80",
  // New & Popular page
  fetchNewReleases: "/movie/now_playing",
  fetchPopular: "/movie/popular",
} as const;

/**
 * Pre-configured axios instance. Every live request inherits `language` plus
 * whichever auth style is available: a Bearer token header when `VITE_TMDB_TOKEN`
 * is set, otherwise the v3 `api_key` query param. Prefer the token when both exist.
 */
export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    language: "en-US",
    ...(READ_TOKEN ? {} : { api_key: API_KEY }),
  },
  headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : {},
});
