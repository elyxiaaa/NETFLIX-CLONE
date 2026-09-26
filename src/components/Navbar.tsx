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
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { useScrolled } from "../hooks/useScrolled";
import { BRAND_NAME, DISCORD_URL } from "../config";
import {
  BrandWordmark,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  DiscordIcon,
  FlameIcon,
  FilmIcon,
  MenuIcon,
  MonitorIcon,
  SearchIcon,
} from "./icons";
import { SearchBox } from "./SearchBox";
import { maybeOpenSponsor } from "../utils/ads";

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
          <NavLink
            to="/"
            aria-label={`${BRAND_NAME} home`}
            onClick={maybeOpenSponsor}
            className="shrink-0"
          >
            <BrandWordmark className="text-xl md:text-2xl" />
          </NavLink>

          {/* Phones get these inside the burger drawer instead. */}
          <ul className="hidden items-center gap-5 text-sm md:flex">
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Reads as a utility link, same weight as the nav items — not a CTA.
              Below lg it collapses to the bare mark; phones find it in the drawer. */}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Join our community on Discord"
            className="group/dc hidden h-11 min-w-11 md:inline-flex items-center justify-center gap-2 text-sm text-white/70 transition-colors hover:text-white lg:px-1"
          >
            <DiscordIcon className="h-5 w-5 transition-colors group-hover/dc:text-brand-gold" />
            <span className="hidden whitespace-nowrap lg:inline">Join Our Community</span>
          </a>
          <span aria-hidden className="mx-2 hidden h-4 w-px bg-white/15 md:block" />

          {/* Phones send you to /search, which has a real tappable field — the
              navbar's expand-on-tap box can't raise the iOS keyboard. Desktop
              keeps the inline expanding box. */}
          <NavLink
            to="/search"
            aria-label="Search"
            onClick={maybeOpenSponsor}
            className="grid h-11 w-11 place-items-center text-white/90 transition-colors hover:text-white md:hidden"
          >
            <SearchIcon className="h-5 w-5" />
          </NavLink>
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <MobileMenu />
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

/**
 * Phone navigation: a burger in the bar's right corner that opens a right-edge
 * drawer with the section links, the Browse categories and the Discord link.
 *
 * Portaled to `<body>` because the scrolled header's `backdrop-blur` makes it
 * the containing block for fixed children, which would clip the drawer to the
 * bar. Closes on route change, Escape, or a tap on the scrim; locks page scroll
 * while open.
 */
function MobileMenu() {
  // Remember *which* location the drawer was opened on; navigating anywhere
  // else (a link in it, back/forward) closes it without an extra effect.
  const { key } = useLocation();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === key;
  const setOpen = (next: boolean) => setOpenedAt(next ? key : null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-mr-2 grid h-11 w-11 place-items-center text-white/90 transition-colors hover:text-white md:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-modal md:hidden">
            <div
              aria-hidden
              onClick={close}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm motion-safe:animate-fade-in"
            />
            <nav
              id="mobile-menu"
              aria-label="Main"
              className="absolute inset-y-0 right-0 flex w-[min(340px,86vw)] flex-col border-l border-white/10 bg-brand-dark shadow-2xl shadow-black/70 motion-safe:animate-drawer-in"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 pl-5 pr-2">
                <BrandWordmark className="text-xl" />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center text-white/80 transition-colors hover:text-white"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
                <ul className="py-3">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.end}
                        onClick={close}
                        className={({ isActive }) =>
                          `flex items-center gap-3 py-2.5 font-display text-2xl uppercase tracking-wide transition-colors ${
                            isActive ? "text-white" : "text-white/60 hover:text-white"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              aria-hidden
                              className={`h-5 w-1 rounded-full ${isActive ? "bg-brand-gold" : "bg-transparent"}`}
                            />
                            {link.label}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="space-y-6 border-t border-white/5 pt-5">
                  <div>
                    <ColHeader icon={<FlameIcon className="h-4 w-4" />}>Trending</ColHeader>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((item) => (
                        <NavLink
                          key={item.label}
                          to={browseHref(item, "tv")}
                          onClick={close}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-white/75 transition-colors hover:border-brand-gold/50 hover:text-white"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <DrawerGenres
                    icon={<FilmIcon className="h-4 w-4" />}
                    title="Movie Genres"
                    items={MOVIE_GENRES}
                    type="movie"
                    onSelect={close}
                  />
                  <DrawerGenres
                    icon={<MonitorIcon className="h-4 w-4" />}
                    title="Series Genres"
                    items={TV_GENRES}
                    type="tv"
                    onSelect={close}
                  />
                </div>
              </div>

              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="flex shrink-0 items-center gap-3 border-t border-white/5 px-5 py-4 text-sm text-white/70 transition-colors hover:text-white"
              >
                <DiscordIcon className="h-5 w-5 text-brand-gold" />
                Join Our Community
                <ChevronRightIcon className="ml-auto h-4 w-4 text-white/40" />
              </a>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}

/** A two-column genre list for the phone drawer. */
function DrawerGenres({
  icon,
  title,
  items,
  type,
  onSelect,
}: {
  icon: ReactNode;
  title: string;
  items: BrowseItem[];
  type: "movie" | "tv";
  onSelect: () => void;
}) {
  return (
    <div>
      <ColHeader icon={icon}>{title}</ColHeader>
      <div className="grid grid-cols-2 gap-x-3">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={browseHref(item, type)}
            onClick={onSelect}
            className="truncate py-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            {item.label}
          </NavLink>
        ))}
      </div>
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
