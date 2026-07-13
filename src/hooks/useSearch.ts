/**
 * Debounced title search. Returns `{ data, loading }` for a query string and
 * cancels superseded requests (keystrokes) so results never arrive out of order.
 */
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { searchMovies } from "../services/movies";

export function useSearch(query: string, debounceMs = 250) {
  const [state, setState] = useState<{ data: Movie[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ data: [], loading: false });
      return;
    }

    let active = true;
    setState((s) => ({ ...s, loading: true }));

    const timer = setTimeout(() => {
      searchMovies(q)
        .then((data) => active && setState({ data, loading: false }))
        .catch(() => active && setState({ data: [], loading: false }));
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, debounceMs]);

  return state;
}
