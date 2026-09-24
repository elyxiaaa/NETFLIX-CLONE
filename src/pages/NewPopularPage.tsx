/** New & Popular (`/new`) — what's fresh and trending. */
import { requests } from "../services/api";
import { BRAND_NAME } from "../config";
import type { MovieRowProps } from "../types/movie";
import { BrowsePage } from "../components/BrowsePage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const ROWS: MovieRowProps[] = [
  { title: "New Releases", fetchUrl: requests.fetchNewReleases },
  { title: `Popular on ${BRAND_NAME}`, fetchUrl: requests.fetchPopular },
  { title: "Critically Acclaimed", fetchUrl: requests.fetchTopRated },
];

export function NewPopularPage() {
  useDocumentMeta({
    title: "New & Popular",
    description:
      "See what everyone is watching: the newest releases, the most popular titles right now, and this week's trending movies and shows.",
  });

  return (
    <BrowsePage
      heroFetchUrl={requests.fetchTrending}
      heroRowTitle="Trending Now"
      rows={ROWS}
    />
  );
}
