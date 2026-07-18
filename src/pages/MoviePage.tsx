/**
 * Dedicated title page at `/watch/:mediaType/:id` — the replacement for the old
 * detail modal + full-screen player.
 *
 * Top: the streaming player (zxcstream embed) inline. Below it: the title's
 * details (poster, tagline, meta, genres, synopsis), a **Cast** row, and a
 * **You May Also Like** row. Cards here navigate to their own page.
 *
 * Rendering is progressive: when arrived via a card click, the clicked `Movie`
 * rides along in router state so the page paints instantly, then `getTitleDetails`
 * fills in tagline / runtime / cast. Deep links (no state) fetch everything.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import type { CastMember, TitleDetails } from "../services/movies";
import { getTitleDetails, getSimilar } from "../services/movies";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, getYear } from "../utils/genres";
import { watchPath, type MediaType } from "../utils/routes";
import { Badge } from "../components/Badge";
import { FavoriteButton } from "../components/FavoriteButton";
import {
  ArrowLeftIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../components/icons";

/** Format a runtime in minutes as `2h 53m` (or `48m` under an hour). */
function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * Build the zxcstream player URL for a title from its media type + TMDB id.
 * Themed with our brand gold (`E5B80B`) and autoplay on. Series have no
 * episode selector yet, so TV titles default to episode 1.
 */
function embedUrl(mediaType: MediaType, id: number): string {
  const params = "color=E5B80B&autoplay=true";
  const path =
    mediaType === "tv"
      ? `https://zxcstream.xyz/player/tv/${id}/1`
      : `https://zxcstream.xyz/player/movie/${id}`;
  return `${path}?${params}`;
}

export function MoviePage() {
  const { mediaType: rawType, id: rawId } = useParams();
  const location = useLocation();

  const mediaType: MediaType = rawType === "tv" ? "tv" : "movie";
  const id = Number(rawId);
  // The clicked card hands its Movie over via router state for an instant paint.
  const initialMovie = (location.state as { movie?: Movie } | null)?.movie ?? null;

  if (!Number.isFinite(id)) return <NotFound />;

  // Keyed on the title so each navigation mounts fresh state — no in-effect
  // resets needed (matches how the browse hero remounts per featured title).
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

  // Fetch the full details (tagline / runtime / cast) for this title.
  useEffect(() => {
    let active = true;
    getTitleDetails(mediaType, id)
      .then((d) => active && setDetails(d))
      .catch(() => active && setNotFound(true));
    return () => {
      active = false;
    };
  }, [mediaType, id]);

  // The best Movie we can show right now: fetched wins, clicked stands in.
  const movie = details?.movie ?? initialMovie;

  // Fetch "You May Also Like" once we have a title (for its genres/type).
  useEffect(() => {
    if (!movie) return;
    let active = true;
    getSimilar(movie)
      .then((r) => active && setSimilar(r))
      .catch(() => active && setSimilar([]));
    return () => {
      active = false;
    };
  }, [movie?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const genres = useMemo(
    () => (movie ? genreNames(movie.genre_ids) : []),
    [movie],
  );

  if (notFound) return <NotFound />;

  const year = movie ? getYear(movie.release_date) : "";
  const runtime = formatRuntime(details?.runtime ?? null);
  const poster = movie
    ? buildImageUrl(movie.poster_path, "w500") ??
      buildImageUrl(movie.backdrop_path, "w780")
    : null;

  return (
    // One wide, aligned column. Capped so a full 16:9 player stays visible
    // without overflowing tall (≈145vh = 82vh × 16/9) or getting huge on
    // ultra-wide displays (1600px) — everything below shares this width.
    <div className="mx-auto w-full max-w-[min(1600px,145vh)] px-4 pb-16 pt-24 md:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      {/* Player */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10">
        <iframe
          key={`${mediaType}-${id}`}
          src={embedUrl(mediaType, id)}
          title={movie ? `Playing ${movie.title}` : "Player"}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Details */}
      {movie ? (
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="w-32 shrink-0 sm:w-40 md:w-48">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="aspect-[2/3] w-full rounded-lg object-cover shadow-lg ring-1 ring-white/10"
              />
            ) : (
              <div
                className="aspect-[2/3] w-full rounded-lg"
                style={{ backgroundImage: gradientFromId(movie.id) }}
              />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-balance font-display text-4xl uppercase leading-[0.95] tracking-[0.01em] text-white sm:text-5xl md:text-6xl">
                {movie.title}
              </h1>
              {details?.tagline && (
                <p className="text-base italic text-white/50">{details.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/80">
              {year && <span>{year}</span>}
              {runtime && (
                <>
                  <span aria-hidden className="text-white/30">
                    ·
                  </span>
                  <span>{runtime}</span>
                </>
              )}
              {movie.vote_average > 0 && (
                <>
                  <span aria-hidden className="text-white/30">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <Badge key={g} tone="dark">
                    {g}
                  </Badge>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="max-w-prose leading-relaxed text-white/90">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 h-40 animate-pulse rounded-lg bg-brand-gray/40" />
      )}

      {details?.cast && details.cast.length > 0 && (
        <CastRow cast={details.cast} />
      )}

      {similar.length > 0 && <SimilarRow movies={similar} />}
    </div>
  );
}

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
    <h2 className="mb-4 flex items-center gap-2.5 text-lg font-semibold text-white/90 md:text-xl">
      <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
      {children}
    </h2>
  );
}

/** Horizontal scroller with edge chevrons, shared by the cast + similar rows. */
function Scroller({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
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
      {/* Chevrons live in the heading action slot; nothing here on touch. */}
      <ScrollControls onScroll={scrollByPage} />
    </div>
  );
}

/** The paired ‹ › controls; rendered inline next to a scroller's track. */
function ScrollControls({ onScroll }: { onScroll: (dir: 1 | -1) => void }) {
  return (
    <div className="hidden shrink-0 gap-1 md:flex">
      <button
        type="button"
        onClick={() => onScroll(-1)}
        aria-label="Scroll left"
        className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onScroll(1)}
        aria-label="Scroll right"
        className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:text-white"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

/** The Cast row: portrait, name, and character per billed performer. */
function CastRow({ cast }: { cast: CastMember[] }) {
  return (
    <section className="mt-12">
      <SectionHeading>Cast</SectionHeading>
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
                <p className="line-clamp-1 text-xs text-white/50">
                  {person.character}
                </p>
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
      <SectionHeading>You May Also Like</SectionHeading>
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
        <FavoriteButton
          movie={movie}
          className="absolute right-2 top-2 h-8 w-8"
        />
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
        <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">
          {movie.title}
        </p>
      </div>
    </div>
  );
}
