/**
 * Playback sources for `/watch`.
 *
 * One entry per server. Adding another is a single object here — nothing in
 * `MoviePage` or the switcher needs to change, and the viewer's choice is
 * remembered across titles.
 *
 * Each entry builds its own URLs rather than sharing a template, because
 * providers don't agree on path shape or query parameters. A server with
 * `enabled: false` still renders its button, greyed and inert, so the slot is
 * visible before it's configured.
 */

export interface PlayerServer {
  /** Stable key — persisted as the viewer's preference, so don't rename it. */
  id: string;
  /** Shown on the button. */
  label: string;
  /** `false` leaves the button visible but unselectable. */
  enabled: boolean;
  movieUrl: (tmdbId: number) => string;
  tvUrl: (tmdbId: number, season: number, episode: number) => string;
}

/** Theme the player with our brand gold and start playback automatically. */
const PLAYER_PARAMS = "color=E5B80B&autoplay=true";

const SERVER_1_BASE = "https://zxcstream.xyz/player";

export const PLAYER_SERVERS: PlayerServer[] = [
  {
    id: "s1",
    label: "Server 1",
    enabled: true,
    movieUrl: (tmdbId) => `${SERVER_1_BASE}/movie/${tmdbId}?${PLAYER_PARAMS}`,
    tvUrl: (tmdbId, season, episode) =>
      `${SERVER_1_BASE}/tv/${tmdbId}/${season}/${episode}?${PLAYER_PARAMS}`,
  },
  {
    // Not configured yet. Fill in the two builders and flip `enabled` to true —
    // that's the whole change. Most providers follow the same
    // `/movie/<tmdbId>` and `/tv/<tmdbId>/<season>/<episode>` shape as above,
    // but check the query string, since those differ more often than the path.
    id: "s2",
    label: "Server 2",
    enabled: false,
    movieUrl: () => "",
    tvUrl: () => "",
  },
];

/** localStorage key holding the viewer's preferred server id. */
export const PLAYER_SERVER_KEY = "flx_player_server";

/** First server that can actually play something. */
export function defaultServer(): PlayerServer {
  return PLAYER_SERVERS.find((s) => s.enabled) ?? PLAYER_SERVERS[0];
}

/**
 * The viewer's remembered server, falling back to the default.
 *
 * Also falls back when the stored id no longer exists or has since been
 * disabled, so removing a server can't strand anyone on a dead choice.
 */
export function storedServer(): PlayerServer {
  try {
    const id = localStorage.getItem(PLAYER_SERVER_KEY);
    const match = PLAYER_SERVERS.find((s) => s.id === id);
    if (match?.enabled) return match;
  } catch {
    // storage blocked — fall through to the default
  }
  return defaultServer();
}
