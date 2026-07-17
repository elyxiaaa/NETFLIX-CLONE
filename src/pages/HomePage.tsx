/** Home (`/`) — the full browse experience across every category. */
import { requests } from "../services/api";
import type { MovieRowProps } from "../types/movie";
import { BrowsePage } from "../components/BrowsePage";

const ROWS: MovieRowProps[] = [
  { title: "Top 10 Today", fetchUrl: requests.fetchPopular, poster: true, numbered: true },
  { title: "Blockbuster Action", fetchUrl: requests.fetchActionMovies },
  { title: "Sci-Fi & Fantasy", fetchUrl: requests.fetchSciFi },
  { title: "Critically Acclaimed", fetchUrl: requests.fetchTopRated },
  { title: "Crime & Thrillers", fetchUrl: requests.fetchCrime },
  { title: "Comedies", fetchUrl: requests.fetchComedyMovies, poster: true },
];

export function HomePage() {
  return (
    <BrowsePage
      heroFetchUrl={requests.fetchTrending}
      heroRowTitle="Trending Now"
      rows={ROWS}
    />
  );
}
