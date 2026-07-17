/**
 * "My List" store — the titles a viewer has hearted, persisted to `localStorage`
 * and shared across every card via `useSyncExternalStore`.
 *
 * It holds the full (lightweight) `Movie` objects, not just ids, so the My List
 * page can render cards straight from the store with no refetch. Kept outside
 * React (module scope) so a heart toggled on one card instantly reflects on the
 * same title everywhere — no context provider or prop threading.
 */
import { useSyncExternalStore } from "react";
import type { Movie } from "../types/movie";

const KEY = "flixly:watchlist";
const EMPTY: Movie[] = [];

function load(): Movie[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? (raw as Movie[]) : [];
  } catch {
    return [];
  }
}

let movies = load();
const listeners = new Set<() => void>();

function emit(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(movies));
  } catch {
    /* storage full / unavailable — in-memory state still updates */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Add a title to My List, or remove it if already there (newest first). */
export function toggleWatchlist(movie: Movie): void {
  movies = movies.some((m) => m.id === movie.id)
    ? movies.filter((m) => m.id !== movie.id)
    : [movie, ...movies];
  emit();
}

/** Whether a title is in My List (re-renders the caller on change). */
export function useIsInWatchlist(id: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => movies.some((m) => m.id === id),
    () => false,
  );
}

/** The full My List, newest first. */
export function useWatchlistMovies(): Movie[] {
  return useSyncExternalStore(
    subscribe,
    () => movies,
    () => EMPTY,
  );
}
