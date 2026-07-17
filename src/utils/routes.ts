/**
 * URL helpers for the dedicated title page.
 *
 * A title lives at `/watch/:mediaType/:id`. The `mediaType` segment lets the
 * page hit the right TMDB endpoint (`/movie` vs `/tv`); we default to `movie`
 * when a list payload didn't carry one.
 */
import type { Movie } from "../types/movie";

export type MediaType = "movie" | "tv";

/** Narrow a movie's optional `media_type` to a concrete segment. */
export function mediaTypeOf(movie: Pick<Movie, "media_type">): MediaType {
  return movie.media_type === "tv" ? "tv" : "movie";
}

/** Build the route to a title's page. */
export function watchPath(movie: Pick<Movie, "id" | "media_type">): string {
  return `/watch/${mediaTypeOf(movie)}/${movie.id}`;
}
