/** TV Shows (`/tv`) — series-focused rows. */
import { requests } from "../services/api";
import { BRAND_NAME } from "../config";
import type { MovieRowProps } from "../types/movie";
import { BrowsePage } from "../components/BrowsePage";

const ROWS: MovieRowProps[] = [
  { title: `${BRAND_NAME} Originals`, fetchUrl: requests.fetchOriginals, poster: true },
  { title: "Crime & Drama Series", fetchUrl: requests.fetchTvCrime, poster: true },
];

export function TVShowsPage() {
  return (
    <BrowsePage
      heroFetchUrl={requests.fetchTvShows}
      heroRowTitle="Trending TV Shows"
      heroRowPoster
      rows={ROWS}
    />
  );
}
