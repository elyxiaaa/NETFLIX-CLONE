/**
 * My List (`/my-list`) — the titles the viewer has hearted, read straight from
 * the shared watchlist store. Renders a poster grid, or a friendly empty state
 * when nothing has been saved yet.
 */
import { Link } from "react-router-dom";
import { useWatchlistMovies } from "../hooks/useWatchlist";
import { MovieCard } from "../components/MovieCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { HeartIcon } from "../components/icons";

export function MyListPage() {
  const movies = useWatchlistMovies();

  useDocumentMeta({
    title: movies.length > 0 ? `My List (${movies.length})` : "My List",
    description:
      movies.length > 0
        ? `Your ${movies.length} saved title${movies.length === 1 ? "" : "s"}, ready whenever you are.`
        : "Save movies and shows you want to watch later — they'll wait for you here.",
    noindex: true,
  });

  return (
    <div className="poster-page min-h-screen px-4 pb-16 pt-24 md:px-12 md:pt-28">
      <h1 className="flex items-center gap-2.5 text-lg text-white md:text-xl">
        <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
        <span className="font-semibold">My List</span>
        {movies.length > 0 && (
          <span className="text-white/40">· {movies.length}</span>
        )}
      </h1>

      {movies.length > 0 ? (
        <div className="poster-grid gap-x-3 gap-y-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} poster />
          ))}
        </div>
      ) : (
        <div className="grid min-h-[50vh] place-items-center text-center">
          <div className="space-y-3">
            <HeartIcon className="mx-auto h-10 w-10 text-white/30" />
            <p className="text-lg font-medium text-white/80">Your list is empty</p>
            <p className="text-sm text-white/50">
              Tap the heart on any title to save it here.
            </p>
            <Link
              to="/"
              className="inline-block rounded-md bg-brand-gold px-5 py-2.5 font-semibold text-black transition hover:bg-brand-gold-hover"
            >
              Browse titles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
