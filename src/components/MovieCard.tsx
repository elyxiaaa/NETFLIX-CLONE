/**
 * A single title in a row.
 *
 * Two shapes: a tall `poster` card (2:3) or a wide backdrop card (16:9). Both
 * show the title + rating/year/type *below* the art (always visible, not on
 * hover) and carry a heart to toggle My List:
 *
 * - Poster cards can show a numbered **TOP {rank}** badge and a title overlay.
 * - Backdrop cards show a centered play button.
 *
 * The art is a full-bleed navigation button; the heart / play sit on top as
 * siblings (not nested) so they stay independently clickable. Missing/broken art
 * falls back to a deterministic gradient with the title.
 */
import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { getYear } from "../utils/genres";
import { watchPath } from "../utils/routes";
import { StarIcon } from "./icons";
import { FavoriteButton } from "./FavoriteButton";

interface MovieCardProps {
  movie: Movie;
  /** Render as a tall 2:3 poster instead of a wide 16:9 backdrop. */
  poster?: boolean;
  /** 1-based rank; when set on a poster card, shows a "TOP {rank}" badge. */
  rank?: number;
}

export function MovieCard({ movie, poster = false, rank }: MovieCardProps) {
  const navigate = useNavigate();
  // The movie rides along in router state so the title page paints without a refetch.
  const openTitle = () => navigate(watchPath(movie), { state: { movie } });
  const [imgFailed, setImgFailed] = useState(false);

  const path = poster ? movie.poster_path : movie.backdrop_path ?? movie.poster_path;
  const imageUrl = buildImageUrl(path, poster ? "w500" : "w780");
  const showFallback = !imageUrl || imgFailed;

  const year = getYear(movie.release_date);
  const kind = movie.media_type === "tv" ? "Series" : "Movie";

  const width = poster
    ? "w-[158px] sm:w-[176px] md:w-[196px]"
    : "w-[236px] sm:w-[264px] md:w-[300px]";
  const aspect = poster ? "aspect-[2/3]" : "aspect-video";

  // Meta line: "★ 7.1 · 2026 · Movie" — omit rating/year when absent.
  const meta: ReactNode[] = [];
  if (movie.vote_average > 0) {
    meta.push(
      <span key="r" className="inline-flex items-center gap-1">
        <StarIcon className="h-3.5 w-3.5 text-brand-gold" />
        {movie.vote_average.toFixed(1)}
      </span>,
    );
  }
  if (year) meta.push(<span key="y">{year}</span>);
  meta.push(<span key="k">{kind}</span>);

  return (
    <article className={`group shrink-0 ${width}`}>
      <div
        className={`relative ${aspect} overflow-hidden rounded-xl bg-brand-gray shadow-md ring-1 ring-white/5 transition duration-200 group-hover:shadow-2xl group-hover:shadow-black/60 group-hover:ring-2 group-hover:ring-brand-gold/70`}
      >
        <button
          type="button"
          onClick={openTitle}
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
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </button>

        {/* TOP {rank} badge (numbered poster rows only) */}
        {poster && rank != null && (
          <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col items-center rounded-md bg-gradient-to-br from-brand-gold to-amber-600 px-2 py-1 leading-none shadow-lg">
            <span className="text-[9px] font-bold uppercase tracking-wider text-black/80">
              Top
            </span>
            <span className="text-base font-black text-black">
              {String(rank).padStart(2, "0")}
            </span>
          </div>
        )}

        <FavoriteButton
          movie={movie}
          className="absolute right-2 top-2 z-10 h-8 w-8"
        />

        {/* Poster cards: stylized title over the art */}
        {poster && !showFallback && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 pt-10">
            <span className="line-clamp-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/95 drop-shadow">
              {movie.title}
            </span>
          </div>
        )}
      </div>

      {/* Always-visible info below the art */}
      <div className="mt-2.5 px-0.5">
        <p className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/60">
          {meta.map((node, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <span aria-hidden className="text-white/30">
                  ·
                </span>
              )}
              {node}
            </Fragment>
          ))}
        </div>
      </div>
    </article>
  );
}
