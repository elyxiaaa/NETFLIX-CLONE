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

const ZXCSTREAM_BASE = "https://zxcstream.cc/player";
const VIDLUX_BASE = "https://vidlux.xyz/embed";
const VIDLINK_BASE = "https://vidlink.pro";
const VIDSRC_PM_BASE = "https://vidsrc.pm/embed";
const VIDSRC_TO_BASE = "https://vidsrc.to/embed";

/*
 * Ids name the provider rather than the slot, so reordering the backups never
 * silently moves a viewer's saved choice onto a different provider. `s1`
 * (ZxcStream) and `s2` (vidsrc.to) predate this scheme and are already stored,
 * so they keep their old ids.
 */
export const PLAYER_SERVERS: PlayerServer[] = [
  {
    id: "s1",
    label: "Main Server",
    enabled: true,
    movieUrl: (tmdbId) => `${ZXCSTREAM_BASE}/movie/${tmdbId}?${PLAYER_PARAMS}`,
    tvUrl: (tmdbId, season, episode) =>
      `${ZXCSTREAM_BASE}/tv/${tmdbId}/${season}/${episode}?${PLAYER_PARAMS}`,
  },
  {
    id: "vidlux",
    label: "Backup Server 1",
    enabled: true,
    movieUrl: (tmdbId) => `${VIDLUX_BASE}/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) =>
      `${VIDLUX_BASE}/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "vidlink",
    label: "Backup Server 2",
    enabled: true,
    movieUrl: (tmdbId) => `${VIDLINK_BASE}/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) =>
      `${VIDLINK_BASE}/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "vidsrc-pm",
    label: "Backup Server 3",
    enabled: true,
    movieUrl: (tmdbId) => `${VIDSRC_PM_BASE}/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) =>
      `${VIDSRC_PM_BASE}/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: "s2",
    label: "Backup Server 4",
    enabled: true,
    movieUrl: (tmdbId) => `${VIDSRC_TO_BASE}/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) =>
      `${VIDSRC_TO_BASE}/tv/${tmdbId}/${season}/${episode}`,
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
