/// <reference types="vite/client" />

/**
 * Typed environment variables. Populate these in a `.env` (or `.env.local`) file
 * to switch from mock data to the live TMDB API. See `services/api.ts`.
 */
interface ImportMetaEnv {
  /** Your TMDB v3 API key. Required only when running against the live API. */
  readonly VITE_TMDB_KEY?: string;
  /** Set to `"false"` to hit the live TMDB API instead of the bundled mock data. */
  readonly VITE_USE_MOCK?: string;
  /**
   * Public origin of the deployed site, e.g. `https://flixly.example.com`. Used
   * to build absolute link-preview image URLs (og:image). Falls back to the
   * current origin at runtime, but the static index.html needs it set at build.
   */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
