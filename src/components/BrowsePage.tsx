/**
 * Shared browse layout used by every route (Home, TV Shows, Movies, New & Popular).
 *
 * Fetches `heroFetchUrl` once and uses it for BOTH the billboard hero (the first
 * result) and the lead row, then renders the remaining `rows` as independent
 * `MovieRow`s. Keeping this generic means each page is just a small config.
 */
import { Fragment } from "react";
import { useFetchMovies } from "../hooks/useFetchMovies";
import type { MovieRowProps } from "../types/movie";
import { IN_FEED_AFTER_ROW, NATIVE_BANNERS } from "../config/ads";
import { AdBanner } from "./AdBanner";
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
      {loading || !featured ? (
        <HeroSkeleton />
      ) : (
        <Hero key={featured.id} movie={featured} />
      )}

      {/* Rows rise into the hero's lower fade, cinema-style. */}
      <div className="relative z-10 -mt-10 space-y-3 pb-10 sm:-mt-16 md:-mt-24 md:space-y-5">
        {loading ? (
          <RowSkeleton poster={heroRowPoster} />
        ) : (
          <ScrollRow title={heroRowTitle} movies={data} poster={heroRowPoster} />
        )}

        {rows.map((row, i) => (
          <Fragment key={row.title}>
            <MovieRow {...row} />
            {/* In-feed unit: sits in the scroll path instead of below every
                row in the footer, where it was served but rarely seen. */}
            {i === IN_FEED_AFTER_ROW && (
              <AdBanner placement={NATIVE_BANNERS.inFeed} className="py-4" />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
}
