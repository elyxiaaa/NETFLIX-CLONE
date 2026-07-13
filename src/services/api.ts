/**
 * API service configuration.
 *
 * This is the ONE place that knows about the backend. The app ships with
 * `USE_MOCK = true`, which routes every request to the bundled mock data
 * (`mockData.ts`) via `movies.ts`. To go live against real TMDB:
 *
 *   1. Create a `.env` file:  VITE_TMDB_KEY=your_tmdb_v3_key
 *   2. Add:                   VITE_USE_MOCK=false
 *   3. Restart the dev server.
 *
 * No component, hook, or type changes are needed — the mock is shaped exactly
 * like TMDB responses, and `getRow` / `getSimilar` (in `movies.ts`) share one
 * signature across both modes.
 */
import axios from "axios";

/** TMDB v3 REST base. Overridable if you proxy the API. */
export const BASE_URL = "https://api.themoviedb.org/3";

/** v3 API key, read from the environment (empty in mock mode). */
const API_KEY = import.meta.env.VITE_TMDB_KEY ?? "";

/**
 * Whether to serve bundled mock data instead of calling TMDB.
 * Defaults to `true`; set `VITE_USE_MOCK="false"` (with a valid key) to go live.
 */
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() !== "false";

if (!USE_MOCK && !API_KEY && import.meta.env.DEV) {
  // Loud, actionable hint rather than a silent wall of failed requests.
  console.warn(
    "[api] USE_MOCK is false but VITE_TMDB_KEY is missing — live requests will 401.",
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
  fetchDocumentaries: "/discover/movie?with_genres=99",
  fetchSciFi: "/discover/movie?with_genres=878",
  fetchCrime: "/discover/movie?with_genres=80",
  fetchTopRated: "/movie/top_rated",
} as const;

/** Pre-configured axios instance. Every live request inherits the key + language. */
export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US" },
});
