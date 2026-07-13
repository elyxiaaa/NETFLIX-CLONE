/** New & Popular (`/new`) — what's fresh and trending. */
import { requests } from "../services/api";
import { BRAND_NAME } from "../config";
import type { MovieRowProps } from "../types/movie";
import { BrowsePage } from "../components/BrowsePage";

const ROWS: MovieRowProps[] = [
  { title: "New Releases", fetchUrl: requests.fetchNewReleases },
  { title: `Popular on ${BRAND_NAME}`, fetchUrl: requests.fetchPopular },
  { title: "Critically Acclaimed", fetchUrl: requests.fetchTopRated },
];

export function NewPopularPage() {
  return (
    <BrowsePage
      heroFetchUrl={requests.fetchTrending}
      heroRowTitle="Trending Now"
      rows={ROWS}
    />
  );
}
