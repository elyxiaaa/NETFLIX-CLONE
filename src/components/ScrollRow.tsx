/**
 * Presentational horizontal row: a heading + a hidden-scrollbar track of cards
 * with edge chevrons. Knows nothing about data fetching, so it's reused by both
 * `MovieRow` (fetched categories) and `BrowsePage`'s lead row (already-fetched data).
 *
 * Vertical padding on the track gives hover-scaled cards room so they aren't
 * clipped by the horizontal scroll container.
 */
import { useRef } from "react";
import type { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface ScrollRowProps {
  title: string;
  movies: Movie[];
  poster?: boolean;
}

export function ScrollRow({ title, movies, poster = false }: ScrollRowProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (movies.length === 0) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="group/row space-y-1">
      <h2 className="flex items-center gap-2.5 px-4 text-lg font-semibold text-white/90 md:px-12 md:text-xl">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
        {title}
      </h2>

      <div className="relative">
        <Arrow side="left" onClick={() => scrollByPage(-1)} />

        <ul
          ref={trackRef}
          className="hide-scrollbar flex gap-2.5 overflow-x-auto scroll-smooth px-4 py-7 md:px-12"
        >
          {movies.map((movie) => (
            <li key={movie.id} className="flex">
              <MovieCard movie={movie} poster={poster} />
            </li>
          ))}
        </ul>

        <Arrow side="right" onClick={() => scrollByPage(1)} />
      </div>
    </section>
  );
}

/** Edge scroll control. Hidden on touch (swipe instead); fades in on row hover. */
function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Scroll left" : "Scroll right"}
      tabIndex={-1}
      className={`absolute inset-y-7 z-30 hidden w-12 items-center justify-center text-white opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:flex ${
        isLeft
          ? "left-0 bg-gradient-to-r from-black/80 to-transparent"
          : "right-0 bg-gradient-to-l from-black/80 to-transparent"
      }`}
    >
      {isLeft ? (
        <ChevronLeftIcon className="h-8 w-8 transition-transform hover:scale-125" />
      ) : (
        <ChevronRightIcon className="h-8 w-8 transition-transform hover:scale-125" />
      )}
    </button>
  );
}
