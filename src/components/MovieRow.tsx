/**
 * One category row. Owns its data via `useFetchMovies(fetchUrl)` and renders the
 * matching state — `RowSkeleton` while loading, an inline message on error, or a
 * `ScrollRow` of cards. Kept thin: all row visuals live in `ScrollRow`.
 */
import type { MovieRowProps } from "../types/movie";
import { useFetchMovies } from "../hooks/useFetchMovies";
import { ScrollRow } from "./ScrollRow";
import { RowSkeleton } from "./RowSkeleton";

export function MovieRow({ title, fetchUrl, poster = false, numbered = false }: MovieRowProps) {
  const { data, loading, error } = useFetchMovies(fetchUrl);

  if (loading) {
    return (
      <section aria-busy="true" aria-label={`${title} (loading)`}>
        <RowSkeleton poster={poster} />
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-12">
        <h2 className="mb-2 text-lg font-semibold text-white/90 md:text-xl">{title}</h2>
        <p className="rounded-md bg-brand-dark px-4 py-6 text-sm text-white/60">
          Couldn&apos;t load this row. {error}
        </p>
      </section>
    );
  }

  return <ScrollRow title={title} movies={data} poster={poster} numbered={numbered} />;
}
