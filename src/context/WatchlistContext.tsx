/**
 * Watchlist ("My List") global state.
 *
 * A tiny Context over an array of `Movie`, mirrored to `localStorage` so a
 * user's list survives reloads. Any component can read or mutate the list via
 * the `useWatchlist()` hook — no prop drilling.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";

const STORAGE_KEY = "reelix:watchlist";

interface WatchlistContextValue {
  /** Saved titles, most-recently-added first. */
  watchlist: Movie[];
  /** Number of saved titles (for the navbar badge). */
  count: number;
  isInWatchlist: (id: number) => boolean;
  /** Add the movie if absent, remove it if already saved. */
  toggle: (movie: Movie) => void;
  remove: (id: number) => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

/** Read the persisted list once, tolerating unavailable/corrupt storage. */
function loadInitial(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Movie[]) : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>(loadInitial);

  // Persist on every change. Swallow storage errors (private mode / quota).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      /* non-fatal */
    }
  }, [watchlist]);

  const value = useMemo<WatchlistContextValue>(() => {
    const ids = new Set(watchlist.map((m) => m.id));
    return {
      watchlist,
      count: watchlist.length,
      isInWatchlist: (id) => ids.has(id),
      toggle: (movie) =>
        setWatchlist((prev) =>
          prev.some((m) => m.id === movie.id)
            ? prev.filter((m) => m.id !== movie.id)
            : [movie, ...prev],
        ),
      remove: (id) => setWatchlist((prev) => prev.filter((m) => m.id !== id)),
    };
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used within a <WatchlistProvider>");
  }
  return ctx;
}
