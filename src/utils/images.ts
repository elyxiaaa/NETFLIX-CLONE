/**
 * Image URL helpers.
 *
 * TMDB serves artwork from a CDN at `https://image.tmdb.org/t/p/{size}{path}`.
 * These paths load without an API key, so the mock data looks authentic out of
 * the box. `buildImageUrl` is the single place that knows the CDN shape — if you
 * later self-host or proxy images, change it here only.
 */

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/** TMDB size buckets we use. `original` is uncapped; the `wNNN` values cap width. */
export type ImageSize = "w300" | "w500" | "w780" | "w1280" | "original";

/**
 * Resolve a TMDB image path to a full CDN URL.
 * @returns the URL, or `null` when there is no path (caller shows a fallback).
 */
export function buildImageUrl(
  path: string | null | undefined,
  size: ImageSize = "w500",
): string | null {
  if (!path) return null;
  // Already an absolute URL (e.g. a custom mock entry) — pass through.
  if (/^https?:\/\//.test(path)) return path;
  return `${TMDB_IMAGE_BASE}/${size}/${path.replace(/^\//, "")}`;
}

/**
 * A deterministic, good-looking dark gradient derived from a movie id.
 * Used as the graceful fallback when a poster/backdrop is missing or 404s, so a
 * broken image still reads as an intentional, on-brand card rather than an error.
 */
export function gradientFromId(id: number): string {
  const hue = (id * 47) % 360;
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 45% 22%) 0%, hsl(${hue2} 55% 10%) 100%)`;
}
