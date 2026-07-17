/**
 * The circular heart control shown on cards. Reads/toggles the shared
 * `useWatchlist` store, so its filled/empty state stays in sync everywhere the
 * same title appears. Stops click propagation so it never triggers the card's
 * navigation.
 */
import type { Movie } from "../types/movie";
import { toggleWatchlist, useIsInWatchlist } from "../hooks/useWatchlist";
import { HeartIcon } from "./icons";

export function FavoriteButton({
  movie,
  className = "",
}: {
  movie: Movie;
  className?: string;
}) {
  const active = useIsInWatchlist(movie.id);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`
      }
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleWatchlist(movie);
      }}
      className={`grid place-items-center rounded-full bg-black/50 backdrop-blur transition hover:bg-black/70 ${
        active ? "text-brand-gold" : "text-white"
      } ${className}`}
    >
      <HeartIcon filled={active} className="h-4 w-4" />
    </button>
  );
}
