/**
 * Navbar search — an expanding input that drives the `/search` route.
 *
 * Clicking the icon opens the field; typing pushes the query into the URL
 * (`/search?q=…`, replacing history) so `SearchPage` reacts. Stays open and in
 * sync while on the search route; collapses on blur when empty elsewhere.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon, CloseIcon } from "./icons";

export function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const onSearchPage = location.pathname === "/search";

  const [open, setOpen] = useState(onSearchPage);
  const [value, setValue] = useState(onSearchPage ? params.get("q") ?? "" : "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reflect URL changes (back/forward, direct load) into the field.
  useEffect(() => {
    if (onSearchPage) {
      setOpen(true);
      setValue(params.get("q") ?? "");
    }
  }, [onSearchPage, params]);

  const update = (v: string) => {
    setValue(v);
    if (v.trim()) {
      navigate(`/search?q=${encodeURIComponent(v.trim())}`, { replace: true });
    } else if (onSearchPage) {
      navigate("/search", { replace: true });
    }
  };

  const openBox = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div
      className={`flex items-center gap-2 rounded transition-all duration-200 ${
        open ? "bg-black/50 px-2 ring-1 ring-white/25" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        onClick={() => (open ? inputRef.current?.focus() : openBox())}
        className="text-white/90 transition-colors hover:text-white"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => update(e.target.value)}
        onBlur={() => {
          if (!value.trim() && !onSearchPage) setOpen(false);
        }}
        placeholder="Titles, genres"
        aria-label="Search titles and genres"
        tabIndex={open ? 0 : -1}
        className={`bg-transparent py-1 text-sm text-white placeholder-white/40 outline-none transition-all duration-200 ${
          open ? "w-32 opacity-100 sm:w-52" : "w-0 opacity-0"
        }`}
      />

      {open && value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            update("");
            inputRef.current?.focus();
          }}
          className="text-white/60 transition-colors hover:text-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
