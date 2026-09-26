/** Search results (`/search?q=…`) — a poster grid driven by the search field. */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DISCORD_URL } from "../config";
import { useSearch } from "../hooks/useSearch";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { MovieCard } from "../components/MovieCard";
import { SearchIcon, CloseIcon } from "../components/icons";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { data, loading } = useSearch(q);
  const hasQuery = q.trim().length > 0;

  useDocumentMeta({
    title: hasQuery ? `Results for “${q.trim()}”` : "Search",
    description: hasQuery
      ? `Movies and TV shows matching “${q.trim()}”${loading ? "" : ` — ${data.length} title${data.length === 1 ? "" : "s"} found`}.`
      : "Search thousands of movies and TV shows by title or genre and find your next watch.",
    noindex: hasQuery,
  });

  return (
    <div className="poster-page min-h-screen px-4 pb-16 pt-24 md:px-12 md:pt-28">
      {/* Phones drive search from here rather than the navbar: this is a real,
          always-present input the user taps directly, so the on-screen keyboard
          opens natively. (iOS Safari only raises the keyboard for a focus() call
          inside the user gesture, which the navbar's expand animation can't do.)
          Desktop keeps using the navbar box, so this is hidden from md up. */}
      <SearchField className="md:hidden" />

      {!hasQuery ? (
        <EmptyPrompt />
      ) : (
        <>
          <h1 className="flex items-center gap-2.5 text-lg text-white/70 md:text-xl">
            <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand-gold md:h-6" />
            {loading ? (
              "Searching…"
            ) : (
              <span>
                Results for <span className="font-semibold text-white">“{q}”</span>
              </span>
            )}
          </h1>

          {loading ? (
            <PosterGridSkeleton />
          ) : data.length > 0 ? (
            <div className="poster-grid gap-x-3 gap-y-6">
              {data.map((movie) => (
                <MovieCard key={movie.id} movie={movie} poster />
              ))}
            </div>
          ) : (
            <p className="text-white/60">
              No titles found for “{q}”. Try another title or genre — or{" "}
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-brand-gold underline-offset-4 hover:underline"
              >
                request it in our community
              </a>
              .
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * The page's own search field, kept in sync with `?q=`.
 *
 * `text-base` (16px) is deliberate — iOS Safari auto-zooms the whole page when
 * focusing an input under 16px, which is what makes small search fields feel
 * broken on phones.
 */
function SearchField({ className = "" }: { className?: string }) {
  const [params, setParams] = useSearchParams();
  const urlQ = params.get("q") ?? "";

  const [value, setValue] = useState(urlQ);
  const [seenQ, setSeenQ] = useState(urlQ);

  // Reflect back/forward and direct loads. Adjusting during render (rather than
  // in an effect) avoids a cascading re-render; comparing against the last URL
  // we saw means typing never gets clobbered — the URL holds the trimmed form
  // while the field may legitimately hold a trailing space.
  if (urlQ !== seenQ) {
    setSeenQ(urlQ);
    setValue(urlQ);
  }

  const update = (v: string) => {
    setValue(v);
    setParams(v.trim() ? { q: v.trim() } : {}, { replace: true });
  };

  return (
    <div className={`flex items-center gap-2.5 rounded-lg bg-white/[0.07] px-3.5 ring-1 ring-white/15 focus-within:ring-brand-gold/60 ${className}`}>
      <SearchIcon aria-hidden className="h-5 w-5 shrink-0 text-white/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => update(e.target.value)}
        placeholder="Search titles, genres"
        aria-label="Search titles and genres"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full min-w-0 bg-transparent py-3 text-base text-white placeholder-white/40 outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => update("")}
          className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:text-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div className="space-y-3">
        <SearchIcon className="mx-auto h-10 w-10 text-white/30" />
        <p className="text-lg font-medium text-white/80">Find your next watch</p>
        <p className="text-sm text-white/50">Search by title or genre.</p>
      </div>
    </div>
  );
}

function PosterGridSkeleton() {
  return (
    <div className="poster-grid gap-x-3 gap-y-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="shimmer aspect-[2/3] w-full rounded-xl bg-brand-gray"
        />
      ))}
    </div>
  );
}
