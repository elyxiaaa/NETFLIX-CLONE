/**
 * Browse-by-category page (`/browse?type=…&genre=…&lang=…&title=…`).
 *
 * Driven entirely by query params so one page backs every entry in the navbar's
 * Browse mega-menu — a genre id, an original-language filter, or both. It builds
 * a TMDB `/discover` request and renders the results as a poster grid that loads
 * more automatically as you reach the bottom (infinite scroll).
 *
 * (Live mode only returns real results here; the bundled mock data is keyed to
 * the fixed browse rows, so ad-hoc discover queries show the empty state.)
 */
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getPage } from "../services/movies";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { MovieCard } from "../components/MovieCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function DiscoverPage() {
  const [params] = useSearchParams();

  const type = params.get("type") === "tv" ? "tv" : "movie";
  const genre = params.get("genre");
  const lang = params.get("lang");
  const title = params.get("title") ?? "Browse";

  const query = new URLSearchParams({ sort_by: "popularity.desc" });
  if (genre) query.set("with_genres", genre);
  if (lang) query.set("with_original_language", lang);
  const fetchUrl = `/discover/${type}?${query.toString()}`;

  // Keyed on the query so a new category mounts a fresh infinite list.
  return <DiscoverGrid key={fetchUrl} fetchUrl={fetchUrl} title={title} type={type} />;
}

function DiscoverGrid({
  fetchUrl,
  title,
  type,
}: {
  fetchUrl: string;
  title: string;
  type: "movie" | "tv";
}) {
  const fetchPage = useCallback((page: number) => getPage(fetchUrl, page), [fetchUrl]);
  const kind = type === "tv" ? "TV Shows" : "Movies";
  useDocumentMeta({
    title: `${title} ${kind}`,
    description: `Browse the most popular ${title} ${kind.toLowerCase()} — sorted by what people are watching right now.`,
  });

  const { items, initialLoading, loadingMore, hasMore, error, loadMore } =
    useInfiniteMovies(fetchPage);

  // Load the next page when the sentinel nears the viewport.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 md:px-12 md:pt-28">
      <h1 className="mb-6 flex items-center gap-2.5 text-lg text-white md:text-xl">
        <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
        <span className="font-semibold">{title}</span>
        <span className="text-white/40">· {type === "tv" ? "Series" : "Movies"}</span>
      </h1>

      {initialLoading ? (
        <PosterGridSkeleton />
      ) : error && items.length === 0 ? (
        <p className="text-white/60">Couldn&apos;t load this category. Please try again.</p>
      ) : items.length > 0 ? (
        <>
          <div className="poster-grid gap-x-3 gap-y-6">
            {items.map((movie) => (
              <MovieCard key={movie.id} movie={movie} poster />
            ))}
          </div>

          {/* Sentinel + loading affordance for the next page */}
          <div ref={sentinel} className="h-10" aria-hidden />
          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-gold" />
            </div>
          )}
          {!hasMore && (
            <p className="py-8 text-center text-sm text-white/30">
              You&apos;ve reached the end.
            </p>
          )}
        </>
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
    <div className="poster-grid gap-x-3 gap-y-6">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="shimmer aspect-[2/3] w-full rounded-xl bg-brand-gray"
        />
      ))}
    </div>
  );
}
