/**
 * Fetch one row of movies, exposing native loading / error / data states.
 *
 * Re-runs when `fetchUrl` changes and guards against setting state after the
 * component unmounts or after a superseded request resolves (the `active` flag).
 *
 * The result is stored tagged with the URL it came from, and `loading` is
 * derived by comparing that tag against the current `fetchUrl`. That way a URL
 * change reads as "loading" on the very same render, with no reset-to-loading
 * setState in the effect — which would cost an extra render pass per change.
 */
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { getRow } from "../services/movies";

export interface FetchMoviesState {
  data: Movie[];
  loading: boolean;
  error: string | null;
}

interface Result {
  url: string;
  data: Movie[];
  error: string | null;
}

export function useFetchMovies(fetchUrl: string): FetchMoviesState {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let active = true;

    getRow(fetchUrl)
      .then((data) => {
        if (active) setResult({ url: fetchUrl, data, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setResult({
          url: fetchUrl,
          data: [],
          error: err instanceof Error ? err.message : "Failed to load titles.",
        });
      });

    return () => {
      active = false;
    };
  }, [fetchUrl]);

  // Anything tagged with a different URL is stale — treat it as still loading.
  const fresh = result !== null && result.url === fetchUrl;

  return {
    data: fresh ? result.data : [],
    loading: !fresh,
    error: fresh ? result.error : null,
  };
}
