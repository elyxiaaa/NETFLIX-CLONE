/** Search results (`/search?q=…`) — a poster grid driven by the navbar search. */
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { MovieCard } from "../components/MovieCard";
import { SearchIcon } from "../components/icons";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { data, loading } = useSearch(q);
  const hasQuery = q.trim().length > 0;

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 md:px-12 md:pt-28">
      {!hasQuery ? (
        <EmptyPrompt />
      ) : (
        <>
          <h1 className="mb-6 flex items-center gap-2.5 text-lg text-white/70 md:text-xl">
            <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
            {loading ? (
              "Searching…"
            ) : (
              <span>
                Results for <span className="font-semibold text-white">“{q}”</span>
              </span>
            )}
          </h1>

          {loading ? (
            <PosterGridSkeleton />
          ) : data.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {data.map((movie) => (
                <MovieCard key={movie.id} movie={movie} poster />
              ))}
            </div>
          ) : (
            <p className="text-white/60">
              No titles found for “{q}”. Try another title or genre.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div className="space-y-3">
        <SearchIcon className="mx-auto h-10 w-10 text-white/30" />
        <p className="text-lg font-medium text-white/80">Find your next watch</p>
        <p className="text-sm text-white/50">Search by title or genre.</p>
      </div>
    </div>
  );
}

function PosterGridSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="shimmer aspect-[2/3] w-[140px] rounded-lg bg-brand-gray sm:w-[150px] md:w-[170px]"
        />
      ))}
    </div>
  );
}
