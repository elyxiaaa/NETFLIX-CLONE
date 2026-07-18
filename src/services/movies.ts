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
 *
 * Live mode must hit `/movie/{id}/…` or `/tv/{id}/…` depending on the title's
 * type — a TV id sent to the movie endpoint 404s (and trending/originals rows
 * are full of TV). We use `media_type` when known and otherwise try movie first,
 * then fall back to tv.
 */
export async function getSimilar(movie: Movie): Promise<Movie[]> {
  const { id, media_type } = movie;

  if (USE_MOCK) {
    const genres = new Set(movie.genre_ids);
    const byGenre = CATALOG.filter(
      (m) => m.id !== id && m.genre_ids.some((g) => genres.has(g)),
    );
    const fallback = CATALOG.filter((m) => m.id !== id);
    return delayed((byGenre.length ? byGenre : fallback).slice(0, 12));
  }

  // "recommendations" is TMDB's tuned "More Like This"; richer than "/similar".
  const fetchFor = async (type: "movie" | "tv"): Promise<Movie[]> => {
    const { data } = await tmdb.get<TMDBResponse>(`/${type}/${id}/recommendations`);
    return normalize(data.results);
  };

  if (media_type) return fetchFor(media_type);

  // Type unknown — probe movie, then tv, swallowing the expected 404.
  try {
    const asMovie = await fetchFor("movie");
    if (asMovie.length) return asMovie;
  } catch {
    /* not a movie id — fall through to tv */
  }
  try {
    return await fetchFor("tv");
  } catch {
    return [];
  }
}

/** One billed performer, as shown in the movie page's Cast row. */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

/** A season a series offers (for the episode picker). Specials (0) excluded. */
export interface SeasonSummary {
  season_number: number;
  name: string;
  episode_count: number;
}

/** A single episode within a season. */
export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string;
}

/** A title's full detail payload — core `Movie` fields plus page-only extras. */
export interface TitleDetails {
  movie: Movie;
  /** Marketing tagline (e.g. "Defy the gods."). Empty when TMDB has none. */
  tagline: string;
  /** Total runtime in minutes, or `null` when unknown. */
  runtime: number | null;
  cast: CastMember[];
  /** YouTube trailer key for the hero preview, or `null`. */
  trailerKey: string | null;
  /** Series seasons (empty for movies). */
  seasons: SeasonSummary[];
}

/** Raw shape of TMDB's `/{movie|tv}/{id}?append_to_response=credits,videos`. */
interface RawDetails {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  genres?: { id: number; name: string }[];
  credits?: { cast?: CastMember[] };
  videos?: { results?: TMDBVideo[] };
  seasons?: { season_number: number; name: string; episode_count: number }[];
}

/**
 * Fetch everything the title page needs in one request: the full title plus its
 * tagline, runtime, cast, trailer, and (for series) seasons — via
 * `append_to_response=credits,videos`.
 *
 * Mock mode resolves the title from the bundled catalog (extras are empty);
 * live mode hits `/movie/{id}` or `/tv/{id}` per `mediaType`.
 */
export async function getTitleDetails(
  mediaType: "movie" | "tv",
  id: number,
): Promise<TitleDetails> {
  if (USE_MOCK) {
    const movie = CATALOG.find((m) => m.id === id);
    if (!movie) throw new Error(`Unknown title ${id}`);
    return {
      movie,
      tagline: "",
      runtime: null,
      cast: [],
      trailerKey: movie.trailer_key ?? null,
      seasons: [],
    };
  }

  const { data } = await tmdb.get<RawDetails>(`/${mediaType}/${id}`, {
    params: { append_to_response: "credits,videos" },
  });

  const movie: Movie = {
    id: data.id,
    title: data.title ?? data.name ?? "Untitled",
    backdrop_path: data.backdrop_path ?? null,
    poster_path: data.poster_path ?? null,
    overview: data.overview ?? "",
    release_date: data.release_date ?? data.first_air_date ?? "",
    vote_average: data.vote_average ?? 0,
    genre_ids: (data.genres ?? []).map((g) => g.id),
    media_type: mediaType,
  };

  return {
    movie,
    tagline: data.tagline ?? "",
    runtime: data.runtime ?? data.episode_run_time?.[0] ?? null,
    cast: (data.credits?.cast ?? []).filter((c) => c.name).slice(0, 20),
    trailerKey: pickTrailer(data.videos?.results ?? []),
    seasons: (data.seasons ?? [])
      .filter((s) => s.season_number >= 1 && s.episode_count > 0)
      .map((s) => ({
        season_number: s.season_number,
        name: s.name || `Season ${s.season_number}`,
        episode_count: s.episode_count,
      })),
  };
}

/** Fetch a series season's episodes (empty in mock mode — no episode data). */
export async function getSeasonEpisodes(
  tvId: number,
  seasonNumber: number,
): Promise<Episode[]> {
  if (USE_MOCK) return [];

  const { data } = await tmdb.get<{
    episodes?: {
      id: number;
      episode_number: number;
      name?: string;
      overview?: string;
      still_path?: string | null;
      runtime?: number | null;
      air_date?: string;
    }[];
  }>(`/tv/${tvId}/season/${seasonNumber}`);

  return (data.episodes ?? []).map((e) => ({
    id: e.id,
    episode_number: e.episode_number,
    name: e.name || `Episode ${e.episode_number}`,
    overview: e.overview ?? "",
    still_path: e.still_path ?? null,
    runtime: e.runtime ?? null,
    air_date: e.air_date ?? "",
  }));
}

/** One page of a list endpoint, for infinite scroll. */
export interface MoviesPage {
  results: Movie[];
  page: number;
  totalPages: number;
}

/**
 * Fetch one page of a list/discover endpoint. Appends `&page=N` to `fetchUrl`.
 * Mock mode returns the whole bundled row as a single page.
 */
export async function getPage(fetchUrl: string, page: number): Promise<MoviesPage> {
  if (USE_MOCK) {
    return {
      results: page === 1 ? MOCK_ROWS[fetchUrl] ?? [] : [],
      page: 1,
      totalPages: 1,
    };
  }
  const sep = fetchUrl.includes("?") ? "&" : "?";
  const { data } = await tmdb.get<TMDBResponse>(`${fetchUrl}${sep}page=${page}`);
  return {
    results: normalize(data.results ?? []),
    page: data.page ?? page,
    // TMDB caps discover paging at 500.
    totalPages: Math.min(data.total_pages ?? 1, 500),
  };
}

/** A single video entry from TMDB's `/{movie|tv}/{id}/videos` response. */
interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

/**
 * Rank a title's videos and return the best YouTube trailer's key, preferring
 * an official Trailer, then any Trailer, then a Teaser, then any YouTube clip.
 */
function pickTrailer(videos: TMDBVideo[]): string | null {
  const yt = videos.filter((v) => v.site === "YouTube" && v.key);
  const score = (v: TMDBVideo) =>
    (v.type === "Trailer" ? 2 : v.type === "Teaser" ? 1 : 0) +
    (v.official ? 0.5 : 0);
  const best = yt.sort((a, b) => score(b) - score(a))[0];
  return best?.key ?? null;
}

/**
 * Resolve a title's trailer to a YouTube video id (for the hero's ambient
 * background). Returns `null` when no trailer exists.
 *
 * Mock mode uses the title's own `trailer_key`. Live mode calls TMDB's
 * `/videos` endpoint, which — like recommendations — lives under `/movie/{id}`
 * or `/tv/{id}`; we use `media_type` when known and otherwise probe movie then
 * tv, swallowing the expected 404 (trending/originals rows mix films and shows).
 */
export async function getTrailerKey(movie: Movie): Promise<string | null> {
  const { id, media_type, trailer_key } = movie;

  if (USE_MOCK) return trailer_key ?? null;

  const fetchFor = async (type: "movie" | "tv"): Promise<string | null> => {
    const { data } = await tmdb.get<{ results: TMDBVideo[] }>(
      `/${type}/${id}/videos`,
    );
    return pickTrailer(data.results ?? []);
  };

  if (media_type) {
    try {
      return await fetchFor(media_type);
    } catch {
      return null;
    }
  }

  try {
    const asMovie = await fetchFor("movie");
    if (asMovie) return asMovie;
  } catch {
    /* not a movie id — fall through to tv */
  }
  try {
    return await fetchFor("tv");
  } catch {
    return null;
  }
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
  // `/search/multi` also returns people; keeping only titles with artwork drops
  // them (people carry `profile_path`, never a poster/backdrop) and any art-less title.
  return normalize(data.results).filter((m) => m.poster_path || m.backdrop_path);
}

/**
 * A raw TMDB list item. TV payloads carry `name` / `first_air_date` where movie
 * payloads carry `title` / `release_date`; `media_type` rides along on multi /
 * trending responses. Everything else may be absent.
 */
interface RawResult extends Omit<Partial<Movie>, "media_type"> {
  id: number;
  name?: string;
  first_air_date?: string;
  /** Raw string from TMDB (`"movie"` | `"tv"` | `"person"`); narrowed in `normalize`. */
  media_type?: string;
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
    // Trust TMDB's own tag; otherwise infer (movies have `title`, shows `name`).
    media_type: normalizeMediaType(r),
  }));
}

/** Resolve a raw result's media type, inferring from its fields when untagged. */
function normalizeMediaType(r: RawResult): Movie["media_type"] {
  if (r.media_type === "movie" || r.media_type === "tv") return r.media_type;
  if (r.media_type === "person") return undefined;
  if (r.title) return "movie";
  if (r.name) return "tv";
  return undefined;
}
