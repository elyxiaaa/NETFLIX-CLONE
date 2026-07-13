/**
 * The detail modal.
 *
 * Reads the currently-selected movie from `ModalContext` and renders a portaled,
 * accessible dialog: backdrop hero, synopsis, HD/rating/year tags, a watchlist
 * toggle, and a "More Like This" grid (from `getSimilar`) whose cards re-open the
 * modal on the chosen title.
 *
 * Accessibility: `role="dialog"` + `aria-modal`, ESC + click-scrim to close,
 * body-scroll lock, a Tab focus-trap, and focus restore to the opener on close.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../types/movie";
import { useModal } from "../context/ModalContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getSimilar } from "../services/movies";
import { buildImageUrl, gradientFromId } from "../utils/images";
import { genreNames, matchScore, getYear } from "../utils/genres";
import { PlayIcon, PlusIcon, CheckIcon, ThumbsUpIcon, CloseIcon, StarIcon } from "./icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function DetailModal() {
  const { selected, close, open } = useModal();

  // Scroll-lock + ESC live here so they track `selected` without a per-title remount.
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, close]);

  if (!selected) return null;

  return createPortal(
    // `key` remounts the content when switching titles: fresh similar list + reset scroll.
    <ModalContent key={selected.id} movie={selected} onClose={close} onSelect={open} />,
    document.body,
  );
}

function ModalContent({
  movie,
  onClose,
  onSelect,
}: {
  movie: Movie;
  onClose: () => void;
  onSelect: (m: Movie) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const { isInWatchlist, toggle } = useWatchlist();

  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const saved = isInWatchlist(movie.id);
  const backdrop =
    buildImageUrl(movie.backdrop_path, "w1280") ?? buildImageUrl(movie.poster_path, "w780");
  const genres = genreNames(movie.genre_ids);
  const year = getYear(movie.release_date);
  const match = matchScore(movie.vote_average, movie.id);
  const titleId = `modal-title-${movie.id}`;

  // Fetch "More Like This".
  useEffect(() => {
    let active = true;
    setLoadingSimilar(true);
    getSimilar(movie.id)
      .then((results) => active && setSimilar(results))
      .catch(() => active && setSimilar([]))
      .finally(() => active && setLoadingSimilar(false));
    return () => {
      active = false;
    };
  }, [movie.id]);

  // Focus management: remember opener, move focus in, restore on unmount.
  useEffect(() => {
    openerRef.current = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (openerRef.current instanceof HTMLElement && document.contains(openerRef.current)) {
        openerRef.current.focus();
      }
    };
  }, []);

  // Trap Tab within the dialog.
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-modal flex justify-center overflow-y-auto overscroll-contain bg-black/70 p-4 backdrop-blur-sm animate-fade-in sm:p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="relative my-4 h-fit w-full max-w-3xl overflow-hidden rounded-lg bg-brand-dark shadow-2xl shadow-black/80 outline-none animate-scale-in sm:my-8"
      >
        {/* Backdrop header */}
        <div className="relative aspect-video w-full">
          {backdrop ? (
            <img src={backdrop} alt="" className="h-full w-full object-cover object-center" />
          ) : (
            <div className="h-full w-full" style={{ backgroundImage: gradientFromId(movie.id) }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-brand-black/70 text-white transition hover:bg-brand-black"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="absolute bottom-0 left-0 space-y-4 p-6 md:p-8">
            <h2
              id={titleId}
              className="text-balance text-2xl font-black tracking-tight text-white drop-shadow-xl sm:text-4xl"
            >
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded bg-white px-6 py-2 font-semibold text-black transition hover:bg-white/80"
              >
                <PlayIcon className="h-5 w-5" />
                Play
              </button>
              <CircleButton
                label={saved ? "Remove from My List" : "Add to My List"}
                pressed={saved}
                onClick={() => toggle(movie)}
              >
                {saved ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
              </CircleButton>
              <CircleButton label="Rate this title">
                <ThumbsUpIcon className="h-5 w-5" />
              </CircleButton>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="font-semibold text-match">{match}% Match</span>
            {year && <span className="text-white/80">{year}</span>}
            <span className="rounded border border-white/40 px-1.5 text-xs leading-tight text-white/80">
              HD
            </span>
            {movie.vote_average > 0 && (
              <span className="inline-flex items-center gap-1 text-white/80">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-xs text-white/70">
              4K Ultra HD
            </span>
          </div>

          <p className="max-w-prose leading-relaxed text-white/90">{movie.overview}</p>

          {genres.length > 0 && (
            <p className="text-sm text-white/60">
              <span className="text-white/40">Genres: </span>
              {genres.join(", ")}
            </p>
          )}

          <section aria-label="More like this" className="pt-2">
            <h3 className="mb-4 text-lg font-semibold text-white">More Like This</h3>
            {loadingSimilar ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer aspect-video rounded-md bg-brand-gray" />
                ))}
              </div>
            ) : similar.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {similar.map((m) => (
                  <SimilarCard key={m.id} movie={m} onSelect={() => onSelect(m)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">No recommendations available.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/** A recommendation tile in the "More Like This" grid; re-opens the modal. */
function SimilarCard({ movie, onSelect }: { movie: Movie; onSelect: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = buildImageUrl(movie.backdrop_path ?? movie.poster_path, "w500");
  const showFallback = !url || imgFailed;
  const match = matchScore(movie.vote_average, movie.id);
  const year = getYear(movie.release_date);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group overflow-hidden rounded-md bg-brand-black text-left ring-1 ring-white/5 transition hover:ring-white/20"
    >
      <div className="relative aspect-video w-full">
        {showFallback ? (
          <span
            className="flex h-full w-full items-end p-2 text-xs font-semibold text-white/90"
            style={{ backgroundImage: gradientFromId(movie.id) }}
          >
            {movie.title}
          </span>
        ) : (
          <img
            src={url}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="space-y-1 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-match">{match}% Match</span>
          {year && <span className="text-xs text-white/50">{year}</span>}
        </div>
        <p className="line-clamp-1 text-sm font-medium text-white/90">{movie.title}</p>
      </div>
    </button>
  );
}

/** Outlined circular action button used in the modal header. */
function CircleButton({
  children,
  label,
  onClick,
  pressed,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/50 bg-brand-black/40 text-white transition hover:border-white hover:bg-brand-black/60"
    >
      {children}
    </button>
  );
}
