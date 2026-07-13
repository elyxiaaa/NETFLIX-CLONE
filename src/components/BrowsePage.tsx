/**
 * Shared browse layout used by every route (Home, TV Shows, Movies, New & Popular).
 *
 * Fetches `heroFetchUrl` once and uses it for BOTH the billboard hero (the first
 * result) and the lead row, then renders the remaining `rows` as independent
 * `MovieRow`s. Keeping this generic means each page is just a small config.
 */
import { useFetchMovies } from "../hooks/useFetchMovies";
import type { MovieRowProps } from "../types/movie";
import { Hero } from "./Hero";
import { HeroSkeleton } from "./HeroSkeleton";
import { MovieRow } from "./MovieRow";
import { ScrollRow } from "./ScrollRow";
import { RowSkeleton } from "./RowSkeleton";

interface BrowsePageProps {
  /** Endpoint powering the hero + the lead row. */
  heroFetchUrl: string;
  /** Heading for the lead row (shares the hero's data). */
  heroRowTitle: string;
  /** Render the lead row as tall posters. */
  heroRowPoster?: boolean;
  /** Additional category rows below the lead row. */
  rows: MovieRowProps[];
}

export function BrowsePage({
  heroFetchUrl,
  heroRowTitle,
  heroRowPoster = false,
  rows,
}: BrowsePageProps) {
  const { data, loading } = useFetchMovies(heroFetchUrl);
  const featured = data[0];

  return (
    <>
      {loading || !featured ? <HeroSkeleton /> : <Hero movie={featured} />}

      {/* Rows rise into the hero's lower fade, cinema-style. */}
      <div className="relative z-10 -mt-10 space-y-3 pb-10 sm:-mt-16 md:-mt-24 md:space-y-5">
        {loading ? (
          <RowSkeleton poster={heroRowPoster} />
        ) : (
          <ScrollRow title={heroRowTitle} movies={data} poster={heroRowPoster} />
        )}

        {rows.map((row) => (
          <MovieRow key={row.title} {...row} />
        ))}
      </div>
    </>
  );
}
