/**
 * Movie data access — the seam between the UI and the backend.
 *
 * Components and hooks import ONLY from here. Each function returns the same
 * `Promise<Movie[]>` whether it's serving mock data or hitting live TMDB, so
 * flipping `USE_MOCK` never ripples outward. See `api.ts` for the switch.
 */
import type { Movie, TMDBResponse } from "../types/movie";
import { tmdb, USE_MOCK } from "./api";
import { CATALOG, MOCK_ROWS } from "./mockData";
import { genreNames } from "../utils/genres";

/** Simulated network latency (ms) so skeleton loaders are visible in mock mode. */
const MOCK_LATENCY = 550;

function delayed<T>(value: T, ms = MOCK_LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Fetch one row of titles.
 * @param fetchUrl an endpoint path from `requests` (e.g. `requests.fetchTrending`).
 */
export async function getRow(fetchUrl: string): Promise<Movie[]> {
  if (USE_MOCK) {
    return delayed(MOCK_ROWS[fetchUrl] ?? []);
  }
  const { data } = await tmdb.get<TMDBResponse>(fetchUrl);
  return normalize(data.results);
}

/**
 * Fetch titles similar to a given one (powers the modal's "More Like This").
 * In mock mode we approximate TMDB's recommender with genre overlap.
 */
export async function getSimilar(id: number): Promise<Movie[]> {
  if (USE_MOCK) {
    const source = CATALOG.find((m) => m.id === id);
    const genres = new Set(source?.genre_ids ?? []);
    const byGenre = CATALOG.filter(
      (m) => m.id !== id && m.genre_ids.some((g) => genres.has(g)),
    );
    const fallback = CATALOG.filter((m) => m.id !== id);
    return delayed((byGenre.length ? byGenre : fallback).slice(0, 12));
  }
  const { data } = await tmdb.get<TMDBResponse>(`/movie/${id}/similar`);
  return normalize(data.results);
}

/**
 * Search titles by free text (powers the navbar search + `/search`).
 * Mock mode matches title or genre name; live mode calls TMDB `/search/multi`.
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (USE_MOCK) {
    const results = CATALOG.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q);
      const inGenre = genreNames(m.genre_ids).some((g) =>
        g.toLowerCase().includes(q),
      );
      return inTitle || inGenre;
    });
    return delayed(results, 300);
  }

  const { data } = await tmdb.get<TMDBResponse>("/search/multi", {
    params: { query, include_adult: false },
  });
  // Keep only real titles that have artwork to show.
  return normalize(data.results).filter((m) => m.poster_path || m.backdrop_path);
}

/**
 * A raw TMDB list item. TV payloads carry `name` / `first_air_date` where movie
 * payloads carry `title` / `release_date`; everything else may be absent.
 */
interface RawResult extends Partial<Movie> {
  id: number;
  name?: string;
  first_air_date?: string;
}

/** Coerce raw TMDB results (movie OR tv) into our normalized `Movie` shape. */
function normalize(results: RawResult[]): Movie[] {
  return results.map((r) => ({
    id: r.id,
    title: r.title ?? r.name ?? "Untitled",
    backdrop_path: r.backdrop_path ?? null,
    poster_path: r.poster_path ?? null,
    overview: r.overview ?? "",
    release_date: r.release_date ?? r.first_air_date ?? "",
    vote_average: r.vote_average ?? 0,
    genre_ids: r.genre_ids ?? [],
  }));
}
