/** Movies (`/movies`) — film-focused rows. */
import { requests } from "../services/api";
import type { MovieRowProps } from "../types/movie";
import { BrowsePage } from "../components/BrowsePage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const ROWS: MovieRowProps[] = [
  { title: "Sci-Fi & Fantasy", fetchUrl: requests.fetchSciFi },
  { title: "Critically Acclaimed", fetchUrl: requests.fetchTopRated },
  { title: "Crime & Thrillers", fetchUrl: requests.fetchCrime },
  { title: "Comedies", fetchUrl: requests.fetchComedyMovies, poster: true },
];

export function MoviesPage() {
  useDocumentMeta({
    title: "Movies",
    description:
      "Watch blockbuster action, sci-fi and fantasy epics, crime thrillers, comedies and critically acclaimed films — all in one place.",
  });

  return (
    <BrowsePage
      heroFetchUrl={requests.fetchActionMovies}
      heroRowTitle="Blockbuster Action"
      rows={ROWS}
    />
  );
}
