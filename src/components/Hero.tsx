/**
 * The billboard hero — a single featured title with a full-bleed backdrop,
 * cinematic gradients, synopsis, and Play / More Info actions. Both actions open
 * the detail modal (there's no real player in this clone).
 */
import type { Movie } from "../types/movie";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, matchScore, getYear } from "../utils/genres";
import { useModal } from "../context/ModalContext";
import { BRAND_NAME } from "../config";
import { getCardBadge } from "../utils/badges";
import { PlayIcon, InfoIcon } from "./icons";
import { Button } from "./Button";
import { Badge } from "./Badge";

const TV_GENRES = new Set([10759, 10762, 10763, 10764, 10765, 10766, 10767, 10768]);

export function Hero({ movie }: { movie: Movie }) {
  const { open, play } = useModal();

  const backdrop =
    buildImageUrl(movie.backdrop_path, "original") ??
    buildImageUrl(movie.poster_path, "w780");
  const genres = genreNames(movie.genre_ids, 3);
  const year = getYear(movie.release_date);
  const match = matchScore(movie.vote_average, movie.id);
  const kind = movie.genre_ids.some((g) => TV_GENRES.has(g)) ? "Series" : "Film";
  const badge = getCardBadge(movie);

  return (
    <section className="relative h-[58vw] max-h-[82vh] min-h-[440px] w-full">
      {backdrop ? (
        <img
          src={backdrop}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: gradientFromId(movie.id) }}
        />
      )}

      {/* Cinematic scrims: darken left (for text) and bottom (blend into rows) */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/10 to-transparent" />

      <div className="absolute bottom-[14%] left-4 max-w-xl space-y-4 md:left-12 lg:max-w-2xl">
        <div className="flex flex-wrap items-center gap-2.5 text-sm font-medium tracking-wide text-white/80">
          <span className="text-xl font-black text-brand-gold">{BRAND_NAME.charAt(0)}</span>
          <span className="uppercase tracking-[0.3em]">{kind}</span>
          {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
        </div>

        <h1 className="text-balance font-display text-5xl uppercase leading-[0.92] tracking-[0.01em] text-white drop-shadow-2xl sm:text-6xl md:text-7xl">
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/90">
          <span className="font-semibold text-match">{match}% Match</span>
          {year && <span>{year}</span>}
          <Badge tone="dark">HD</Badge>
          <Badge tone="dark">4K</Badge>
          {genres.length > 0 && (
            <span className="text-white/70">{genres.join(" • ")}</span>
          )}
        </div>

        <p className="line-clamp-3 max-w-xl text-sm text-white/80 drop-shadow-lg md:text-lg">
          {movie.overview}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={() => play(movie)}>
            <PlayIcon className="h-5 w-5" />
            Play
          </Button>
          <Button variant="secondary" size="lg" onClick={() => open(movie)}>
            <InfoIcon className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
    </section>
  );
}
