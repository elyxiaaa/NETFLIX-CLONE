/**
 * Fetch one row of movies, exposing native loading / error / data states.
 *
 * Re-runs when `fetchUrl` changes and guards against setting state after the
 * component unmounts or after a superseded request resolves (the `active` flag).
 */
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { getRow } from "../services/movies";

export interface FetchMoviesState {
  data: Movie[];
  loading: boolean;
  error: string | null;
}

export function useFetchMovies(fetchUrl: string): FetchMoviesState {
  const [state, setState] = useState<FetchMoviesState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ data: [], loading: true, error: null });

    getRow(fetchUrl)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setState({
          data: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load titles.",
        });
      });

    return () => {
      active = false;
    };
  }, [fetchUrl]);

  return state;
}
