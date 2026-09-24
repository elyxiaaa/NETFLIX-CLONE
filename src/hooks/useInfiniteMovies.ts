/**
 * Infinite-scroll list state. Loads page 1 on mount, then appends further pages
 * on demand via `loadMore()` (wire it to an IntersectionObserver sentinel).
 *
 * Reset by remounting the consumer with a `key` (e.g. keyed on the query), so
 * this hook never resets state inside an effect — only async fetches touch state.
 * Results are de-duped by id since TMDB pages can overlap.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Movie } from "../types/movie";
import type { MoviesPage } from "../services/movies";

export interface InfiniteMoviesState {
  items: Movie[];
  initialLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: boolean;
  loadMore: () => void;
}

export function useInfiniteMovies(
  fetchPage: (page: number) => Promise<MoviesPage>,
): InfiniteMoviesState {
  const [items, setItems] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Keep the latest fetcher without retriggering the mount effect. Synced in an
  // effect rather than during render: the ref is only ever read from effects and
  // async callbacks, so updating it after commit is both correct and the pattern
  // React documents. `useRef`'s initial value already covers the first render.
  const fetchRef = useRef(fetchPage);
  useEffect(() => {
    fetchRef.current = fetchPage;
  });
  // Guards against overlapping loads (observer can fire rapidly).
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    busy.current = true;
    fetchRef.current(1)
      .then((res) => {
        if (!active) return;
        setItems(res.results);
        setPage(res.page);
        setTotalPages(res.totalPages);
      })
      .catch(() => active && setError(true))
      .finally(() => {
        if (!active) return;
        setInitialLoading(false);
        busy.current = false;
      });
    return () => {
      active = false;
    };
  }, []);

  const hasMore = page > 0 && page < totalPages;

  const loadMore = useCallback(() => {
    if (busy.current || page === 0 || page >= totalPages) return;
    busy.current = true;
    setLoadingMore(true);
    fetchRef.current(page + 1)
      .then((res) => {
        setItems((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...res.results.filter((m) => !seen.has(m.id))];
        });
        setPage(res.page);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        /* keep what we have; a later scroll can retry */
      })
      .finally(() => {
        busy.current = false;
        setLoadingMore(false);
      });
  }, [page, totalPages]);

  return { items, initialLoading, loadingMore, hasMore, error, loadMore };
}
