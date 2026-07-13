/**
 * A single title in a row.
 *
 * - Wide (backdrop) by default, or tall `poster` mode.
 * - Hover / keyboard-focus scales it up, lifts it above neighbors, and reveals a
 *   metadata + quick-actions overlay (Play, add/remove from list, more info).
 * - If the artwork is missing or fails to load, falls back to a deterministic
 *   gradient with the title — so a broken image still reads as an intentional card.
 *
 * The overlay is a sibling of the full-bleed "open details" button (not nested),
 * so the whole card opens the modal while the quick-action buttons stay clickable.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, matchScore, getYear } from "../utils/genres";
import { useModal } from "../context/ModalContext";
import { useWatchlist } from "../context/WatchlistContext";
import {
  PlayIcon,
  PlusIcon,
  CheckIcon,
  InfoIcon,
  StarIcon,
} from "./icons";

interface MovieCardProps {
  movie: Movie;
  /** Render as a tall 2:3 poster instead of a wide 16:9 backdrop. */
  poster?: boolean;
}

export function MovieCard({ movie, poster = false }: MovieCardProps) {
  const { open } = useModal();
  const { isInWatchlist, toggle } = useWatchlist();
  const [imgFailed, setImgFailed] = useState(false);

  const saved = isInWatchlist(movie.id);
  const path = poster ? movie.poster_path : movie.backdrop_path ?? movie.poster_path;
  const imageUrl = buildImageUrl(path, poster ? "w500" : "w780");
  const showFallback = !imageUrl || imgFailed;

  const genres = genreNames(movie.genre_ids, 3);
  const match = matchScore(movie.vote_average, movie.id);
  const year = getYear(movie.release_date);

  const size = poster
    ? "aspect-[2/3] w-[140px] sm:w-[150px] md:w-[170px]"
    : "aspect-video w-[220px] sm:w-[240px] md:w-[280px]";

  return (
    <article
      className={`group relative shrink-0 ${size} rounded-md transition-[transform] duration-200 ease-out-quint hover:z-20 hover:scale-105 focus-within:z-20 focus-within:scale-105`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-md bg-brand-gray shadow-md transition-shadow duration-200 group-hover:shadow-2xl group-hover:shadow-black/60 ring-1 ring-white/5">
        {/* Full-card button opens the detail modal */}
        <button
          type="button"
          onClick={() => open(movie)}
          aria-label={`View details for ${movie.title}`}
          className="absolute inset-0 h-full w-full"
        >
          {showFallback ? (
            <span
              className="flex h-full w-full items-end p-3 text-left"
              style={{ backgroundImage: gradientFromId(movie.id) }}
            >
              <span className="line-clamp-3 text-sm font-semibold leading-tight text-white/90 drop-shadow">
                {movie.title}
              </span>
            </span>
          ) : (
            <img
              src={imageUrl}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </button>

        {/* Hover / focus overlay — metadata + quick actions. Non-interactive by
            default so clicks fall through to the button underneath. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="pointer-events-auto mb-2 flex items-center gap-1.5">
            <IconButton
              label={`Play ${movie.title}`}
              onClick={() => open(movie)}
              className="bg-white text-black hover:bg-white/80"
            >
              <PlayIcon className="ml-0.5 h-4 w-4" />
            </IconButton>
            <IconButton
              label={saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
              pressed={saved}
              onClick={() => toggle(movie)}
            >
              {saved ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            </IconButton>
            <IconButton
              label={`More info about ${movie.title}`}
              onClick={() => open(movie)}
              className="ml-auto"
            >
              <InfoIcon className="h-4 w-4" />
            </IconButton>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <span className="text-match">{match}% Match</span>
            <span className="rounded-sm border border-white/40 px-1 leading-tight text-white/80">HD</span>
            {movie.vote_average > 0 && (
              <span className="inline-flex items-center gap-0.5 text-white/80">
                <StarIcon className="h-3 w-3 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-1 text-sm font-semibold text-white">
            {movie.title}
            {year && <span className="ml-1.5 font-normal text-white/50">{year}</span>}
          </p>

          {genres.length > 0 && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-white/60">
              {genres.join(" • ")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Small circular action button used inside the hover overlay. */
function IconButton({
  children,
  label,
  onClick,
  className = "",
  pressed,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`grid h-8 w-8 place-items-center rounded-full border border-white/50 bg-black/40 text-white backdrop-blur transition hover:border-white hover:bg-black/60 ${className}`}
    >
      {children}
    </button>
  );
}
