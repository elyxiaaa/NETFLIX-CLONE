/**
 * App shell — composes the browse experience:
 *   Navbar · Hero billboard · category rows · My List · detail modal · footer.
 *
 * The hero and the first "Trending Now" row share a single trending fetch. Every
 * other row fetches its own data through `MovieRow`. The `<DetailModal>` is
 * mounted once here and driven by `ModalContext`.
 */
import { requests } from "./services/api";
import { BRAND_NAME } from "./config";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { useWatchlist } from "./context/WatchlistContext";
import type { MovieRowProps } from "./types/movie";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HeroSkeleton } from "./components/HeroSkeleton";
import { MovieRow } from "./components/MovieRow";
import { ScrollRow } from "./components/ScrollRow";
import { RowSkeleton } from "./components/RowSkeleton";
import { DetailModal } from "./components/DetailModal";
import { Footer } from "./components/Footer";
import { BookmarkIcon } from "./components/icons";

/** Category rows rendered below the hero + trending + My List. */
const ROWS: MovieRowProps[] = [
  { title: `${BRAND_NAME} Originals`, fetchUrl: requests.fetchOriginals, poster: true },
  { title: "Blockbuster Action", fetchUrl: requests.fetchActionMovies },
  { title: "Sci-Fi & Fantasy", fetchUrl: requests.fetchSciFi },
  { title: "Critically Acclaimed", fetchUrl: requests.fetchTopRated },
  { title: "Crime & Thrillers", fetchUrl: requests.fetchCrime },
  { title: "Comedies", fetchUrl: requests.fetchComedyMovies, poster: true },
  { title: "Documentaries", fetchUrl: requests.fetchDocumentaries, poster: true },
];

function App() {
  const { data: trending, loading } = useFetchMovies(requests.fetchTrending);
  const { watchlist } = useWatchlist();
  const featured = trending[0];

  return (
    <div id="top" className="min-h-screen bg-brand-black">
      <Navbar />

      <main>
        {loading || !featured ? <HeroSkeleton /> : <Hero movie={featured} />}

        {/* Rows rise into the hero's lower fade, cinema-style. */}
        <div className="relative z-10 -mt-10 space-y-3 pb-10 sm:-mt-16 md:-mt-24 md:space-y-5">
          {loading ? (
            <RowSkeleton />
          ) : (
            <ScrollRow title="Trending Now" movies={trending} />
          )}

          <section id="my-list" className="scroll-mt-24">
            {watchlist.length > 0 ? (
              <ScrollRow title="My List" movies={watchlist} />
            ) : (
              <EmptyMyList />
            )}
          </section>

          {ROWS.map((row) => (
            <MovieRow key={row.fetchUrl} {...row} />
          ))}
        </div>
      </main>

      <Footer />
      <DetailModal />
    </div>
  );
}

/** Teaching empty state for an untouched watchlist. */
function EmptyMyList() {
  return (
    <div className="px-4 md:px-12">
      <h2 className="mb-2 text-lg font-semibold text-white/90 md:text-xl">My List</h2>
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-5 py-6 text-sm text-white/60">
        <BookmarkIcon className="h-5 w-5 shrink-0 text-white/40" />
        <p>
          Your list is empty. Hover any title and tap{" "}
          <span className="font-semibold text-white/80">＋</span> to save it here for later.
        </p>
      </div>
    </div>
  );
}

export default App;
