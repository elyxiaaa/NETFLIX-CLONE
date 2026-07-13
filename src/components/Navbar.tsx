/**
 * Sticky top navigation.
 *
 * Transparent (with a top scrim for legibility) over the hero, then transitions
 * to a solid, blurred `#141414` once the page scrolls — the signature streaming-app
 * navbar behavior, driven by `useScrolled`. Links route between pages via
 * `NavLink`, which marks the active route.
 */
import { NavLink } from "react-router-dom";
import { useScrolled } from "../hooks/useScrolled";
import { BRAND_NAME } from "../config";
import { BrandWordmark } from "./icons";
import { SearchBox } from "./SearchBox";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "TV Shows", to: "/tv" },
  { label: "Movies", to: "/movies" },
  { label: "New & Popular", to: "/new" },
];

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
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "font-medium text-white"
                      : "text-white/70 transition-colors hover:text-white"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0">
          <SearchBox />
        </div>
      </nav>
    </header>
  );
}
