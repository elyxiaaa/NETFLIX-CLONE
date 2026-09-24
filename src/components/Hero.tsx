/**
 * The billboard hero — a single featured title with a full-bleed backdrop that
 * dissolves into the title's YouTube trailer (autoplaying, muted, looping),
 * plus cinematic gradients, synopsis, and Play / More Info actions.
 *
 * The trailer key is resolved from TMDB per title (`getTrailerKey`); until it's
 * ready — or if the title has no trailer — the static backdrop stands in.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, matchScore, getYear } from "../utils/genres";
import { watchPath } from "../utils/routes";
import { maybeOpenSponsor } from "../utils/ads";
import { getTrailerKey } from "../services/movies";
import { BRAND_NAME } from "../config";
import { getCardBadge } from "../utils/badges";
import { PlayIcon, InfoIcon, VolumeHighIcon, VolumeMuteIcon } from "./icons";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { AmbientTrailer } from "./AmbientTrailer";

const TV_GENRES = new Set([10759, 10762, 10763, 10764, 10765, 10766, 10767, 10768]);

export function Hero({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  const openTitle = () => {
    maybeOpenSponsor();
    navigate(watchPath(movie), { state: { movie } });
  };

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerReady, setTrailerReady] = useState(false);
  const [muted, setMuted] = useState(true);

  const backdrop =
    buildImageUrl(movie.backdrop_path, "original") ??
    buildImageUrl(movie.poster_path, "w780");
  const genres = genreNames(movie.genre_ids, 3);
  const year = getYear(movie.release_date);
  const match = matchScore(movie.vote_average, movie.id);
  const kind = movie.genre_ids.some((g) => TV_GENRES.has(g)) ? "Series" : "Film";
  const badge = getCardBadge(movie);

  // Resolve the trailer for this title. The hero is keyed on the featured id
  // (see BrowsePage), so this mounts fresh per title — no manual reset needed.
  useEffect(() => {
    let cancelled = false;
    getTrailerKey(movie)
      .then((key) => {
        if (!cancelled) setTrailerKey(key);
      })
      .catch(() => {
        /* no trailer — the backdrop stands in */
      });
    return () => {
      cancelled = true;
    };
  }, [movie]);

  return (
    <section className="relative h-[58vw] max-h-[82vh] min-h-[440px] w-full overflow-hidden">
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

      {/* Ambient trailer: cover-fills the hero, fades in once it's actually playing. */}
      {trailerKey && (
        <AmbientTrailer
          videoKey={trailerKey}
          muted={muted}
          title={`${movie.title} trailer`}
          // Latch on: the mute toggle shouldn't flicker away while a mute
          // change reloads the player.
          onPlayingChange={(p) => p && setTrailerReady(true)}
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
          <Button variant="primary" size="lg" onClick={openTitle}>
            <PlayIcon className="h-5 w-5" />
            Play
          </Button>
          <Button variant="secondary" size="lg" onClick={openTitle}>
            <InfoIcon className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>

      {/* Mute toggle — only while the trailer is actually playing. */}
      {trailerKey && trailerReady && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute trailer" : "Mute trailer"}
          className="absolute bottom-[14%] right-4 grid h-11 w-11 place-items-center rounded-full border border-white/40 text-white transition hover:border-white hover:bg-white/10 md:right-12"
        >
          {muted ? (
            <VolumeMuteIcon className="h-5 w-5" />
          ) : (
            <VolumeHighIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </section>
  );
}
