/**
 * Derive a card/hero status badge from a title.
 *
 * Priority: recent releases get "New"; otherwise highly-rated titles get
 * "Top Rated". Returns `null` when neither applies (most titles show no badge,
 * which keeps them meaningful rather than decorative).
 */
import type { Movie } from "../types/movie";
import { getYear } from "./genres";

type BadgeTone = "gold" | "outline";

export interface CardBadge {
  label: string;
  tone: BadgeTone;
}

/** Titles from this year or newer count as "New". */
const NEW_WINDOW_YEARS = 4;
const TOP_RATED_THRESHOLD = 8.5;

export function getCardBadge(movie: Movie): CardBadge | null {
  const year = Number(getYear(movie.release_date));
  const now = new Date().getFullYear();

  if (year && now - year <= NEW_WINDOW_YEARS) {
    return { label: "New", tone: "gold" };
  }
  if (movie.vote_average >= TOP_RATED_THRESHOLD) {
    return { label: "Top Rated", tone: "outline" };
  }
  return null;
}
