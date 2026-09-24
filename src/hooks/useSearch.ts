/**
 * Debounced title search. Returns `{ data, loading }` for a query string and
 * cancels superseded requests (keystrokes) so results never arrive out of order.
 *
 * Results are stored tagged with the query that produced them, so `loading` is
 * derived by comparing that tag against the current query rather than being
 * flipped by a setState inside the effect.
 */
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { searchMovies } from "../services/movies";

export function useSearch(query: string, debounceMs = 250) {
  const q = query.trim();
  const [result, setResult] = useState<{ q: string; data: Movie[] } | null>(null);

  useEffect(() => {
    if (!q) return;

    let active = true;
    const timer = setTimeout(() => {
      searchMovies(q)
        .then((data) => active && setResult({ q, data }))
        .catch(() => active && setResult({ q, data: [] }));
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, debounceMs]);

  // An empty query shows nothing and never spins; otherwise a result tagged
  // with a different query is stale, so we're still loading.
  const fresh = result !== null && result.q === q;

  return {
    data: q && fresh ? result.data : [],
    loading: Boolean(q) && !fresh,
  };
}
