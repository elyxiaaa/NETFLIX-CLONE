/**
 * Sticky top navigation.
 *
 * Transparent (with a top scrim for legibility) over the hero, then transitions
 * to a solid, blurred `#141414` once the page scrolls — the signature streaming-app
 * navbar behavior, driven by `useScrolled`. The "My List" control jumps to the
 * watchlist row and shows a live count from `WatchlistContext`.
 */
import { useScrolled } from "../hooks/useScrolled";
import { useWatchlist } from "../context/WatchlistContext";
import { BRAND_NAME } from "../config";
import {
  BrandWordmark,
  SearchIcon,
  BellIcon,
  BookmarkIcon,
  ChevronDownIcon,
} from "./icons";

const NAV_LINKS = ["Home", "TV Shows", "Movies", "New & Popular"];

export function Navbar() {
  const scrolled = useScrolled(40);
  const { count } = useWatchlist();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-nav transition-colors duration-300 ${
        scrolled
          ? "bg-brand-dark/95 shadow-lg shadow-black/40 backdrop-blur"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-4 md:h-[68px] md:px-12">
        <div className="flex items-center gap-6 lg:gap-8">
          <a href="#top" aria-label={`${BRAND_NAME} home`} className="shrink-0">
            <BrandWordmark className="text-xl md:text-2xl" />
          </a>
          <ul className="hidden items-center gap-5 text-sm md:flex">
            {NAV_LINKS.map((link, i) => (
              <li key={link}>
                <a
                  href="#top"
                  className={
                    i === 0
                      ? "font-medium text-white"
                      : "text-white/70 transition-colors hover:text-white"
                  }
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            type="button"
            aria-label="Search"
            className="hidden text-white/90 transition-colors hover:text-white sm:block"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="hidden text-white/90 transition-colors hover:text-white sm:block"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <a
            href="#my-list"
            className="relative inline-flex items-center gap-2 rounded px-1 py-1 text-sm text-white/90 transition-colors hover:text-white"
          >
            <BookmarkIcon className="h-5 w-5" />
            <span className="hidden sm:inline">My List</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </a>

          <button
            type="button"
            aria-label="Account"
            className="flex items-center gap-1"
          >
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-brand-red to-orange-500 text-sm font-bold text-white"
            >
              {BRAND_NAME.charAt(0)}
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-white/80 sm:block" />
          </button>
        </div>
      </nav>
    </header>
  );
}
