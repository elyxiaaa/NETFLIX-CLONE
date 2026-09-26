/**
 * Ad placement config — the single place to turn any unit on or off.
 *
 * **Set a `key` (or `src`) to `""` and that placement renders nothing.** No other
 * file needs touching, so any slot here can be reverted on its own.
 *
 * Create a *separate* Adsterra placement per position rather than reusing one
 * key. The dashboard reports per placement, so sharing a key means you can't
 * tell which position actually earns — and two units with the same key on one
 * page collide, since the widget mounts into `#container-<key>`.
 */

/** Host serving the native-banner `invoke.js` (from the Adsterra unit's snippet). */
export const NATIVE_BANNER_HOST = "pl31486079.profitableratecpmnetwork.com";

export interface NativeBanner {
  /** Adsterra placement key; `""` disables this slot. */
  key: string;
  /** Host for this unit's script — usually `NATIVE_BANNER_HOST`. */
  host: string;
}

/**
 * Native-banner slots.
 *
 * `inFeed` and `watch` currently share one key, which is safe *only* because
 * their routes are mutually exclusive — a browse page and `/watch` never render
 * at the same time. Give each its own key once you've made the units, both for
 * attribution and so this constraint stops mattering.
 */
export const NATIVE_BANNERS = {
  /** Browse pages, between the category rows. */
  inFeed: {
    key: "4b7d16d2094c6d475055f9ccfb2d813d",
    host: NATIVE_BANNER_HOST,
  } satisfies NativeBanner,

  /** `/watch`, directly under the player — the site's highest-dwell surface. */
  watch: {
    key: "4b7d16d2094c6d475055f9ccfb2d813d",
    host: NATIVE_BANNER_HOST,
  } satisfies NativeBanner,
} as const;

/**
 * Which row the in-feed banner follows on browse pages (0-based, counting the
 * lead row). 1 puts it after the second row — below the fold on first paint but
 * reached early while scrolling, which is where viewability actually is.
 */
export const IN_FEED_AFTER_ROW = 1;

/**
 * Sponsor pop — a self-controlled popunder built on the Adsterra direct link.
 *
 * Runs alongside the Adsterra popunder script in `index.html`. That one is the
 * higher-rate product but consumes the click it fires on; this one opens from
 * our own handler and leaves the click intact, so the two cover different
 * gestures.
 *
 * A single cooldown is the only gate. Time-delayed and probabilistic variants
 * were tried on 2026-09-25/26 and firing dropped too far to be worth it — the
 * revenue data over that window is in the commit history.
 */
export const SPONSOR = {
  /** Direct-link URL from the Adsterra unit. `""` disables the pop entirely. */
  url: "https://www.effectivecpmnetwork.com/nyfb4ufr6z?key=75ffa84acaf66abd5c01c978533654e9",

  /**
   * Minimum gap between two opens, per browser. Note this can only suppress a
   * *second* open: a visitor with no stored timestamp reads as ~56 years
   * elapsed, so the first qualifying click of a new browser always fires.
   */
  cooldownMs: 30 * 60 * 1000,
} as const;

/**
 * Adsterra Social Bar / In-Page Push — a floating site-wide unit.
 *
 * Highest CPM of the formats that *don't* hijack the click, unlike the popunder
 * that used to sit in `index.html` (it swallowed the visitor's first tap
 * entirely). Paste the `src` from the unit's snippet to enable; `""` = off.
 */
export const SOCIAL_BAR_SRC = "";
