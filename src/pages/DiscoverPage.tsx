/**
 * Browse-by-category page (`/browse?type=…&genre=…&lang=…&title=…`).
 *
 * Driven entirely by query params so one page backs every entry in the navbar's
 * Browse mega-menu — a genre id, an original-language filter, or both. It builds
 * a TMDB `/discover` request and renders the results as a poster grid.
 *
 * (Live mode only returns real results here; the bundled mock data is keyed to
 * the fixed browse rows, so ad-hoc discover queries show the empty state.)
 */
import { useSearchParams } from "react-router-dom";
import { useFetchMovies } from "../hooks/useFetchMovies";
import { MovieCard } from "../components/MovieCard";

export function DiscoverPage() {
  const [params] = useSearchParams();

  const type = params.get("type") === "tv" ? "tv" : "movie";
  const genre = params.get("genre");
  const lang = params.get("lang");
  const title = params.get("title") ?? "Browse";

  // Build the discover query; a stable string keys the fetch/cache.
  const query = new URLSearchParams({ sort_by: "popularity.desc" });
  if (genre) query.set("with_genres", genre);
  if (lang) query.set("with_original_language", lang);
  const fetchUrl = `/discover/${type}?${query.toString()}`;

  const { data, loading, error } = useFetchMovies(fetchUrl);

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 md:px-12 md:pt-28">
      <h1 className="mb-6 flex items-center gap-2.5 text-lg text-white md:text-xl">
        <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
        <span className="font-semibold">{title}</span>
        <span className="text-white/40">· {type === "tv" ? "Series" : "Movies"}</span>
      </h1>

      {loading ? (
        <PosterGridSkeleton />
      ) : error ? (
        <p className="text-white/60">Couldn&apos;t load this category. {error}</p>
      ) : data.length > 0 ? (
        <div className="flex flex-wrap gap-x-3 gap-y-6">
          {data.map((movie) => (
            <MovieCard key={movie.id} movie={movie} poster />
          ))}
        </div>
      ) : (
        <p className="text-white/60">
          No titles found for this category. Try another from the Browse menu.
        </p>
      )}
    </div>
  );
}

function PosterGridSkeleton() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-6">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="shimmer aspect-[2/3] w-[158px] rounded-xl bg-brand-gray sm:w-[176px] md:w-[196px]"
        />
      ))}
    </div>
  );
}
