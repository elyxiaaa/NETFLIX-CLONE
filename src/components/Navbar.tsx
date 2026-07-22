/**
 * Sticky top navigation.
 *
 * Transparent (with a top scrim for legibility) over the hero, then transitions
 * to a solid, blurred `#141414` once the page scrolls — the signature streaming-app
 * navbar behavior, driven by `useScrolled`. Section routes are direct links; the
 * **Browse** trigger opens a full genre/category mega-menu.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useScrolled } from "../hooks/useScrolled";
import { BRAND_NAME } from "../config";
import {
  BrandWordmark,
  ChevronDownIcon,
  ChevronRightIcon,
  FlameIcon,
  FilmIcon,
  MonitorIcon,
  SearchIcon,
} from "./icons";
import { SearchBox } from "./SearchBox";

const NAV_LINKS = [
  { label: "Home", to: "/", end: true },
  { label: "Movies", to: "/movies" },
  { label: "Series", to: "/tv" },
  { label: "My List", to: "/my-list" },
];

/** A browse target: a genre id and/or an original-language filter. */
interface BrowseItem {
  label: string;
  type?: "movie" | "tv";
  genre?: number;
  lang?: string;
}

// Region/keyword-flavored picks (origin language + optional genre).
const TRENDING: BrowseItem[] = [
  { label: "K-Drama", type: "tv", lang: "ko" },
  { label: "K-Movie", type: "movie", lang: "ko" },
  { label: "Anime", type: "tv", genre: 16, lang: "ja" },
  { label: "Pinoy Movie", type: "movie", lang: "tl" },
  { label: "J-Drama", type: "tv", lang: "ja" },
  { label: "C-Drama", type: "tv", lang: "zh" },
  { label: "Thai Drama", type: "tv", lang: "th" },
  { label: "Telenovela", type: "tv", genre: 10766 },
];

// Row-major order so a 2-column grid reads down each column like the design.
const MOVIE_GENRES: BrowseItem[] = [
  { label: "Action", genre: 28 },
  { label: "Comedy", genre: 35 },
  { label: "Romance", genre: 10749 },
  { label: "Horror", genre: 27 },
  { label: "Drama", genre: 18 },
  { label: "Thriller", genre: 53 },
  { label: "Sci-Fi", genre: 878 },
  { label: "Animation", genre: 16 },
];

const TV_GENRES: BrowseItem[] = [
  { label: "Drama", genre: 18 },
  { label: "Action & Adventure", genre: 10759 },
  { label: "Comedy", genre: 35 },
  { label: "Crime", genre: 80 },
  { label: "Sci-Fi & Fantasy", genre: 10765 },
  { label: "Mystery", genre: 9648 },
  { label: "Animation", genre: 16 },
  { label: "Family", genre: 10751 },
];

/** Build a `/browse` link from a browse item + its default media type. */
function browseHref(item: BrowseItem, defaultType: "movie" | "tv"): string {
  const p = new URLSearchParams({ type: item.type ?? defaultType, title: item.label });
  if (item.genre != null) p.set("genre", String(item.genre));
  if (item.lang) p.set("lang", item.lang);
  return `/browse?${p.toString()}`;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "font-medium text-white"
    : "text-white/70 transition-colors hover:text-white";

export function Navbar() {
  const scrolled = useScrolled(40);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-nav transition-colors duration-300 ${
        scrolled
          ? "bg-brand-dark/95 shadow-lg shadow-black/40 backdrop-blur"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <nav className="flex h-16 items-center justify-between gap-3 px-4 md:h-[68px] md:px-12">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6 lg:gap-8">
          <NavLink to="/" aria-label={`${BRAND_NAME} home`} className="shrink-0">
            <BrandWordmark className="text-xl md:text-2xl" />
          </NavLink>

          <ul className="hide-scrollbar flex items-center gap-4 overflow-x-auto text-sm sm:gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="shrink-0">
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="shrink-0">
              <BrowseMenu />
            </li>
          </ul>
        </div>

        {/* Phones send you to /search, which has a real tappable field — the
            navbar's expand-on-tap box can't raise the iOS keyboard. Desktop
            keeps the inline expanding box. */}
        <NavLink
          to="/search"
          aria-label="Search"
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-white/90 transition-colors hover:text-white md:hidden"
        >
          <SearchIcon className="h-5 w-5" />
        </NavLink>
        <div className="hidden shrink-0 md:block">
          <SearchBox />
        </div>
      </nav>
    </header>
  );
}

/**
 * The "Browse" mega-menu: trending category pills plus Movie/TV genre columns.
 * Click-to-toggle (the panel is too tall to hover-bridge). Closes on outside
 * click, Escape, or picking a link. A scrim under the bar catches stray clicks.
 */
function BrowseMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 transition-colors ${
          open ? "text-white" : "text-white/70 hover:text-white"
        }`}
      >
        Browse
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180 text-brand-gold" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-dropdown bg-black/40 md:top-[68px]"
            aria-hidden
            onClick={close}
          />
          {/* Centering lives on the outer wrapper so the entrance animation can
              own `transform` without fighting the -translate-x-1/2. */}
          <div className="fixed left-1/2 top-[68px] z-dropdown w-[min(1080px,94vw)] -translate-x-1/2 md:top-[76px]">
            <div
              role="menu"
              // On phones the columns stack into one tall list — cap it to the
              // viewport and let it scroll, or the lower genres are unreachable.
              className="origin-top max-h-[calc(100dvh-84px)] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-brand-dark/95 shadow-2xl shadow-black/70 backdrop-blur-xl motion-safe:animate-menu-in"
            >
              {/* Cinematic gold hairline across the top edge */}
              <div
                aria-hidden
                className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent"
              />

              <div className="grid gap-x-10 gap-y-7 p-6 sm:grid-cols-2 lg:grid-cols-[1.05fr_1fr_1fr] md:p-8">
                <div className="motion-safe:animate-fade-up" style={{ animationDelay: "40ms" }}>
                  <ColHeader icon={<FlameIcon className="h-4 w-4" />}>Trending</ColHeader>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((item) => (
                      <NavLink
                        key={item.label}
                        to={browseHref(item, "tv")}
                        onClick={close}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-white/75 transition-all duration-200 hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-white"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="motion-safe:animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <ColHeader icon={<FilmIcon className="h-4 w-4" />}>Movie Genres</ColHeader>
                  <div className="flex flex-col gap-0.5">
                    {MOVIE_GENRES.map((item) => (
                      <GenreLink key={item.label} item={item} type="movie" onSelect={close} />
                    ))}
                  </div>
                </div>

                <div className="motion-safe:animate-fade-up" style={{ animationDelay: "160ms" }}>
                  <ColHeader icon={<MonitorIcon className="h-4 w-4" />}>Series Genres</ColHeader>
                  <div className="flex flex-col gap-0.5">
                    {TV_GENRES.map((item) => (
                      <GenreLink key={item.label} item={item} type="tv" onSelect={close} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 px-6 py-3.5 md:px-8">
                <NavLink
                  to="/movies"
                  onClick={close}
                  className="group/all inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-hover"
                >
                  Browse all titles
                  <ChevronRightIcon className="h-4 w-4 transition-transform duration-200 group-hover/all:translate-x-0.5" />
                </NavLink>
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] tracking-wide text-white/60">
                    ESC
                  </kbd>
                  to close
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** A menu column heading in the cinematic display face, with a gold icon. */
function ColHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center gap-2">
      <span className="text-brand-gold">{icon}</span>
      <h3 className="font-display text-lg uppercase leading-none tracking-wide text-white">
        {children}
      </h3>
    </div>
  );
}

/** A genre menu row: hover fills the row and slides a gold chevron in. */
function GenreLink({
  item,
  type,
  onSelect,
}: {
  item: BrowseItem;
  type: "movie" | "tv";
  onSelect: () => void;
}) {
  return (
    <NavLink
      to={browseHref(item, type)}
      onClick={onSelect}
      className="group/g flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-white/70 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
    >
      <span>{item.label}</span>
      <ChevronRightIcon
        className="h-3.5 w-3.5 -translate-x-1 text-brand-gold opacity-0 transition-all duration-200 group-hover/g:translate-x-0 group-hover/g:opacity-100"
      />
    </NavLink>
  );
}
