/**
 * Genre helpers.
 *
 * `GENRE_MAP` is TMDB's canonical genre-id → name table (from
 * `/genre/movie/list` and `/genre/tv/list`). Kept local so the mock data can use
 * real genre ids and the UI can render chips without an extra request.
 */

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  // TV-specific
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

/**
 * Resolve genre ids to display names, dropping unknown ids.
 * @param limit optional cap on how many names to return (chips get crowded).
 */
export function genreNames(ids: number[] = [], limit?: number): string[] {
  const names = ids.map((id) => GENRE_MAP[id]).filter(Boolean);
  return typeof limit === "number" ? names.slice(0, limit) : names;
}

/**
 * Streaming apps show a personalized "Match %". We don't have a recommender, so we
 * derive a stable, plausible-looking score (68–98%) from the rating + id. It's
 * deterministic per title so it doesn't flicker between renders.
 */
export function matchScore(voteAverage: number, id: number): number {
  const base = Math.round(voteAverage * 9); // 0–90
  const jitter = id % 9; // stable per-title 0–8
  return Math.min(98, Math.max(68, base + jitter));
}

/** Extract the 4-digit year from a TMDB `release_date` (`""` when absent). */
export function getYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : "";
}
