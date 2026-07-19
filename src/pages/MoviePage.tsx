/**
 * Dedicated title page at `/watch/:mediaType/:id` — the replacement for the old
 * detail modal + full-screen player.
 *
 * Top: the streaming player (zxcstream embed) inline. Below it: the title's
 * details (poster, tagline, meta, genres, synopsis), a **Cast** row, and a
 * **You May Also Like** row. Cards here navigate to their own page.
 *
 * Rendering is progressive: when arrived via a card click, the clicked `Movie`
 * rides along in router state so the hero paints instantly, then `getTitleDetails`
 * fills in tagline / runtime / cast / trailer / seasons. Deep links fetch all.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import type {
  CastMember,
  Episode,
  SeasonSummary,
  TitleDetails,
} from "../services/movies";
import { getTitleDetails, getSimilar, getSeasonEpisodes } from "../services/movies";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, getYear } from "../utils/genres";
import { watchPath, type MediaType } from "../utils/routes";
import { maybeOpenSponsor } from "../utils/ads";
import { FavoriteButton } from "../components/FavoriteButton";
import { toggleWatchlist, useIsInWatchlist } from "../hooks/useWatchlist";
import {
  ArrowLeftIcon,
  StarIcon,
  PlayIcon,
  PlusIcon,
  CheckIcon,
  ShareIcon,
  SparklesIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
} from "../components/icons";

const EMBED_BASE = "https://zxcstream.xyz/player";
// Theme the player with our brand gold and start playback automatically.
const PLAYER_PARAMS = "color=E5B80B&autoplay=true";
const movieEmbed = (id: number) => `${EMBED_BASE}/movie/${id}?${PLAYER_PARAMS}`;
const tvEmbed = (id: number, season: number, episode: number) =>
  `${EMBED_BASE}/tv/${id}/${season}/${episode}?${PLAYER_PARAMS}`;

/**
 * Ambient YouTube trailer embed (autoplay, looped, no chrome).
 *
 * `start` jumps past the trailer's intro — the MPA green "approved for
 * appropriate audiences" band and studio logos run in the first ~10s — so the
 * hero opens on actual footage instead of the rating card.
 */
function trailerEmbedUrl(key: string, muted: boolean): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: muted ? "1" : "0",
    controls: "0",
    loop: "1",
    playlist: key,
    start: "10",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
  });
  return `https://www.youtube.com/embed/${key}?${params.toString()}`;
}

/** Fullscreen-capable element/document, incl. the WebKit-prefixed variants. */
type FsElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

/**
 * The streaming iframe plus a reliable fullscreen control overlaid on it.
 *
 * A cross-origin iframe can't trigger fullscreen from its *own* button on
 * mobile — iOS Safari has no Fullscreen API for iframes at all, so the player's
 * button silently fails there. Our overlay button instead:
 *   1. requests native fullscreen on the wrapper (works on Android/desktop), and
 *   2. falls back to a CSS full-viewport expand (fixed inset-0 + scroll lock)
 *      when the API is unavailable — the iOS path — so mobile still fills the screen.
 */
function PlayerFrame({ src, title }: { src: string; title: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cssFull, setCssFull] = useState(false);
  const [nativeFull, setNativeFull] = useState(false);
  const isFull = cssFull || nativeFull;

  // Keep our toggle in sync when the user exits native fullscreen via ESC or a
  // system gesture.
  useEffect(() => {
    const doc = document as FsDocument;
    const onChange = () =>
      setNativeFull(
        Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement),
      );
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // In the CSS (iOS) fallback: lock page scroll and let ESC exit.
  useEffect(() => {
    if (!cssFull) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCssFull(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [cssFull]);

  const enterFullscreen = async () => {
    const el = wrapRef.current as FsElement | null;
    if (!el) return;
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(el);
        return;
      } catch {
        /* fall through to the CSS fallback */
      }
    }
    setCssFull(true); // iOS Safari: no iframe fullscreen — emulate it.
  };

  const exitFullscreen = async () => {
    const doc = document as FsDocument;
    if (nativeFull) {
      const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen;
      try {
        await exit?.call(doc);
      } catch {
        /* ignore */
      }
    }
    setCssFull(false);
  };

  return (
    <div
      ref={wrapRef}
      className={isFull ? "fixed inset-0 z-[100] bg-black" : "absolute inset-0 bg-black"}
    >
      <iframe
        key={src}
        src={src}
        title={title}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <button
        type="button"
        onClick={isFull ? exitFullscreen : enterFullscreen}
        aria-label={isFull ? "Exit fullscreen" : "Enter fullscreen"}
        // Overlaid directly on top of the embedded player's own fullscreen
        // control (bottom-right) so users see a single, reliable button.
        className="absolute bottom-10 right-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80 active:scale-95"
      >
        {isFull ? (
          <FullscreenExitIcon className="h-5 w-5" />
        ) : (
          <FullscreenEnterIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

/** Format a runtime in minutes as `2h 53m` (or `48m` under an hour). */
function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** A faint "·" separator between inline meta items (rating · year · runtime). */
function Dot() {
  return (
    <span aria-hidden className="text-white/30">
      ·
    </span>
  );
}

export function MoviePage() {
  const { mediaType: rawType, id: rawId } = useParams();
  const location = useLocation();

  const mediaType: MediaType = rawType === "tv" ? "tv" : "movie";
  const id = Number(rawId);
  const initialMovie = (location.state as { movie?: Movie } | null)?.movie ?? null;

  if (!Number.isFinite(id)) return <NotFound />;

  // Keyed on the title so each navigation mounts fresh state.
  return (
    <TitleView
      key={`${mediaType}-${id}`}
      mediaType={mediaType}
      id={id}
      initialMovie={initialMovie}
    />
  );
}

function TitleView({
  mediaType,
  id,
  initialMovie,
}: {
  mediaType: MediaType;
  id: number;
  initialMovie: Movie | null;
}) {
  const navigate = useNavigate();

  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState({ season: 1, episode: 1 });
  const similarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    getTitleDetails(mediaType, id)
      .then((d) => alive && setDetails(d))
      .catch(() => alive && setNotFound(true));
    return () => {
      alive = false;
    };
  }, [mediaType, id]);

  const movie = details?.movie ?? initialMovie;

  useEffect(() => {
    if (!movie) return;
    let alive = true;
    getSimilar(movie)
      .then((r) => alive && setSimilar(r))
      .catch(() => alive && setSimilar([]));
    return () => {
      alive = false;
    };
  }, [movie?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const genres = useMemo(() => (movie ? genreNames(movie.genre_ids) : []), [movie]);

  const startPlay = useCallback(() => {
    maybeOpenSponsor();
    setPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const playEpisode = useCallback((season: number, episode: number) => {
    maybeOpenSponsor();
    setActive({ season, episode });
    setPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToSimilar = useCallback(() => {
    similarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (notFound) return <NotFound />;
  if (!movie) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-gold" />
      </div>
    );
  }

  const isTV = mediaType === "tv";
  const streamUrl = isTV ? tvEmbed(id, active.season, active.episode) : movieEmbed(id);

  return (
    <div className="pb-16">
      <TitleHero
        movie={movie}
        details={details}
        genres={genres}
        playing={playing}
        streamUrl={streamUrl}
        onPlay={startPlay}
        onBack={() => navigate(-1)}
        onSimilars={scrollToSimilar}
      />

      <div className="px-4 md:px-12">
        {isTV && details && details.seasons.length > 0 && (
          <EpisodesSection
            tvId={id}
            seasons={details.seasons}
            active={active}
            onPlay={playEpisode}
          />
        )}

        {details?.cast && details.cast.length > 0 && <CastRow cast={details.cast} />}

        {similar.length > 0 && (
          <div ref={similarRef}>
            <SimilarRow movies={similar} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Hero -- */

function TitleHero({
  movie,
  details,
  genres,
  playing,
  streamUrl,
  onPlay,
  onBack,
  onSimilars,
}: {
  movie: Movie;
  details: TitleDetails | null;
  genres: string[];
  playing: boolean;
  streamUrl: string;
  onPlay: () => void;
  onBack: () => void;
  onSimilars: () => void;
}) {
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const inList = useIsInWatchlist(movie.id);

  const trailerKey = details?.trailerKey ?? null;
  const backdrop =
    buildImageUrl(movie.backdrop_path, "original") ??
    buildImageUrl(movie.poster_path, "w780");
  const year = getYear(movie.release_date);
  const runtime = formatRuntime(details?.runtime ?? null);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* the viewer cancelled the share sheet */
    }
  };

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-brand-black">
      {/* Background: full stream while playing, else backdrop + ambient trailer */}
      {playing ? (
        <PlayerFrame src={streamUrl} title={`Playing ${movie.title}`} />
      ) : (
        <>
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
          {trailerKey && (
            <iframe
              key={`${movie.id}-${muted}`}
              src={trailerEmbedUrl(trailerKey, muted)}
              title={`${movie.title} trailer`}
              aria-hidden
              tabIndex={-1}
              allow="autoplay; encrypted-media"
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/10 to-transparent" />
        </>
      )}

      {/* Top controls */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="absolute left-4 top-[80px] z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/70 md:left-8"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      {!playing && trailerKey && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute trailer" : "Mute trailer"}
          className="absolute right-4 top-[80px] z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/70 md:right-8"
        >
          {muted ? (
            <VolumeMuteIcon className="h-5 w-5" />
          ) : (
            <VolumeHighIcon className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Center play */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Play ${movie.title}`}
            className="pointer-events-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur transition duration-200 hover:scale-110 hover:bg-white/25"
          >
            <PlayIcon className="ml-1 h-9 w-9" />
          </button>
        </div>
      )}

      {/* Overlay details */}
      {!playing && (
        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 md:px-12">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-balance font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-white drop-shadow-xl sm:text-6xl md:text-7xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
              {movie.vote_average > 0 && (
                <span className="inline-flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-brand-gold" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {year && (
                <>
                  <Dot />
                  <span>{year}</span>
                </>
              )}
              {runtime && (
                <>
                  <Dot />
                  <span>{runtime}</span>
                </>
              )}
              {genres.length > 0 && (
                <>
                  <Dot />
                  <span className="text-white/70">{genres.slice(0, 3).join(" · ")}</span>
                </>
              )}
            </div>

            {movie.overview && (
              <p className="line-clamp-3 max-w-xl text-sm text-white/80 md:text-base">
                {movie.overview}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => toggleWatchlist(movie)}
                aria-pressed={inList}
                aria-label={inList ? "Remove from My List" : "Add to My List"}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
              >
                {inList ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
              >
                <ShareIcon className="h-4 w-4" />
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                type="button"
                onClick={onSimilars}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
              >
                <SparklesIcon className="h-4 w-4" />
                Similars
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- Episodes -- */

function EpisodesSection({
  tvId,
  seasons,
  active,
  onPlay,
}: {
  tvId: number;
  seasons: SeasonSummary[];
  active: { season: number; episode: number };
  onPlay: (season: number, episode: number) => void;
}) {
  const [season, setSeason] = useState(seasons[0].season_number);

  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SectionHeading>Episodes</SectionHeading>
        {seasons.length > 1 && (
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            aria-label="Select season"
            className="rounded-lg border border-white/15 bg-brand-dark px-4 py-2 text-sm font-medium text-white outline-none transition hover:border-white/30 focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {seasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <SeasonEpisodes
        key={`${tvId}-${season}`}
        tvId={tvId}
        season={season}
        active={active}
        onPlay={onPlay}
      />
    </section>
  );
}

function SeasonEpisodes({
  tvId,
  season,
  active,
  onPlay,
}: {
  tvId: number;
  season: number;
  active: { season: number; episode: number };
  onPlay: (season: number, episode: number) => void;
}) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getSeasonEpisodes(tvId, season)
      .then((eps) => alive && setEpisodes(eps))
      .catch(() => alive && setEpisodes([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [tvId, season]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shimmer h-28 rounded-xl bg-brand-gray/40" />
        ))}
      </div>
    );
  }

  if (episodes.length === 0) {
    return <p className="text-white/50">No episodes available for this season.</p>;
  }

  return (
    <ul className="space-y-2">
      {episodes.map((ep) => (
        <EpisodeRow
          key={ep.id}
          ep={ep}
          isActive={active.season === season && active.episode === ep.episode_number}
          onPlay={() => onPlay(season, ep.episode_number)}
        />
      ))}
    </ul>
  );
}

function EpisodeRow({
  ep,
  isActive,
  onPlay,
}: {
  ep: Episode;
  isActive: boolean;
  onPlay: () => void;
}) {
  const still = buildImageUrl(ep.still_path, "w300");
  const runtime = formatRuntime(ep.runtime);

  return (
    <li>
      <button
        type="button"
        onClick={onPlay}
        className={`group flex w-full gap-4 rounded-xl p-2 text-left transition ${
          isActive ? "bg-white/[0.06] ring-1 ring-brand-gold/40" : "hover:bg-white/[0.04]"
        }`}
      >
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-brand-gray sm:w-48">
          {still ? (
            <img
              src={still}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full" style={{ backgroundImage: gradientFromId(ep.id) }} />
          )}
          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black">
              <PlayIcon className="ml-0.5 h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-white">
              <span className="text-white/40">{ep.episode_number}.</span> {ep.name}
            </h3>
            {runtime && (
              <span className="shrink-0 text-xs text-white/40">{runtime}</span>
            )}
          </div>
          {ep.overview && (
            <p className="mt-1 line-clamp-2 text-sm text-white/60">{ep.overview}</p>
          )}
        </div>
      </button>
    </li>
  );
}

/* --------------------------------------------------------------- Shared -- */

/** Shown when the route id is invalid or the title fails to load. */
function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div className="space-y-4">
        <p className="text-lg font-semibold text-white">Title not found.</p>
        <Link
          to="/"
          className="inline-block rounded-md bg-brand-gold px-5 py-2.5 font-semibold text-black transition hover:bg-brand-gold-hover"
        >
          Back to browse
        </Link>
      </div>
    </div>
  );
}

/** Section heading with the brand accent bar (matches the browse rows). */
function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white/90 md:text-xl">
      <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
      {children}
    </h2>
  );
}

/** Horizontal scroller with edge chevrons, shared by the cast + similar rows. */
function Scroller({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  return (
    <div className="flex items-center gap-2">
      <ul
        ref={trackRef}
        aria-label={ariaLabel}
        className="hide-scrollbar flex flex-1 gap-3 overflow-x-auto scroll-smooth pb-1"
      >
        {children}
      </ul>
      <div className="hidden shrink-0 gap-1 md:flex">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Scroll left"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Scroll right"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/** The Cast row: portrait, name, and character per billed performer. */
function CastRow({ cast }: { cast: CastMember[] }) {
  return (
    <section className="mt-12">
      <div className="mb-4">
        <SectionHeading>Cast</SectionHeading>
      </div>
      <Scroller ariaLabel="Cast">
        {cast.map((person) => {
          const photo = buildImageUrl(person.profile_path, "w300");
          return (
            <li key={person.id} className="w-28 shrink-0 sm:w-32">
              {photo ? (
                <img
                  src={photo}
                  alt={person.name}
                  loading="lazy"
                  className="aspect-[2/3] w-full rounded-lg object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="grid aspect-[2/3] w-full place-items-center rounded-lg bg-brand-gray text-2xl font-semibold text-white/50">
                  {person.name.charAt(0)}
                </div>
              )}
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-white">
                {person.name}
              </p>
              {person.character && (
                <p className="line-clamp-1 text-xs text-white/50">{person.character}</p>
              )}
            </li>
          );
        })}
      </Scroller>
    </section>
  );
}

/** The "You May Also Like" row of landscape recommendation cards. */
function SimilarRow({ movies }: { movies: Movie[] }) {
  return (
    <section className="mt-12">
      <div className="mb-4">
        <SectionHeading>You May Also Like</SectionHeading>
      </div>
      <Scroller ariaLabel="You may also like">
        {movies.map((m) => (
          <li key={m.id} className="w-64 shrink-0 sm:w-72">
            <SimilarCard movie={m} />
          </li>
        ))}
      </Scroller>
    </section>
  );
}

/** A single recommendation card: art, favorite toggle, rating · year · type. */
function SimilarCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);

  const art = buildImageUrl(movie.backdrop_path ?? movie.poster_path, "w500");
  const showFallback = !art || imgFailed;
  const year = getYear(movie.release_date);
  const kind = movie.media_type === "tv" ? "Series" : "Movie";

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg ring-1 ring-white/5 transition group-hover:ring-brand-gold/60">
        <button
          type="button"
          onClick={() => navigate(watchPath(movie), { state: { movie } })}
          aria-label={`Open ${movie.title}`}
          className="block aspect-video w-full"
        >
          {showFallback ? (
            <span
              className="flex h-full w-full items-end p-3 text-left text-sm font-semibold text-white/90"
              style={{ backgroundImage: gradientFromId(movie.id) }}
            >
              {movie.title}
            </span>
          ) : (
            <img
              src={art}
              alt={movie.title}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
        </button>
        <FavoriteButton movie={movie} className="absolute right-2 top-2 h-8 w-8" />
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2 text-xs text-white/60">
          {movie.vote_average > 0 && (
            <span className="inline-flex items-center gap-1">
              <StarIcon className="h-3.5 w-3.5 text-brand-gold" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
          {year && <span>{year}</span>}
          <span aria-hidden className="text-white/30">
            ·
          </span>
          <span>{kind}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">{movie.title}</p>
      </div>
    </div>
  );
}
