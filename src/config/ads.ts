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

/**
 * Host serving the native-banner `invoke.js`.
 *
 * Adsterra's anti-adblock domain, same as the popunder uses. The
 * old `pl31486079.profitableratecpmnetwork.com` is on the public filter lists,
 * which made this unit — 58% of revenue — invisible to adblocked visitors.
 *
 * Confirmed against the unit's own snippet: `AdBanner` emits exactly
 * `https://screwbedriddenheadline.com/<key>/invoke.js` with `data-cfasync`
 * false, into `#container-<key>` — the snippet's script/div order is reversed
 * on purpose, since mounting the container first means the widget can never
 * execute before its target exists.
 */
export const NATIVE_BANNER_HOST = "screwbedriddenheadline.com";

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
 * Adsterra popunder — the script-based unit, armed a short way into the visit.
 *
 * Earns ~2.8x the native banner per impression, so it stays. The cost is
 * measured and unavoidable: once this script is on the page it consumes the
 * next click outright. The event is never dispatched at all — not merely
 * `preventDefault`ed — so the app's own handlers don't run and the click
 * doesn't navigate.
 *
 * `delayMs` keeps a visitor's opening clicks clean: until it passes there is no
 * popunder on the page, so clicks reach the app normally. After that the
 * popunder arms and takes one click.
 *
 * Measured from the start of the visit, not from mount, so reloads and deep
 * links don't hand out a fresh countdown. Repeats after the first fire are
 * governed by the network's own `pp_delay_` cookie — no client-side control.
 *
 * `src` = "" disables it.
 */
export const POPUNDER = {
  /**
   * Adsterra's anti-adblock domain — same path and hash as the old
   * `pl30425488.profitableratecpmnetwork.com` URL, served from a host that
   * isn't on the public filter lists. Swap it here if the network rotates
   * domains; the script itself is unchanged.
   */
  src: "https://screwbedriddenheadline.com/0d/e2/3b/0de23b3ffe0ffd0534cdac5c6cb49811.js",
  delayMs: 15 * 1000,
} as const;

/**
 * Adsterra Social Bar / In-Page Push — a floating site-wide unit.
 *
 * Highest CPM of the formats that *don't* hijack the click, unlike the popunder
 * that used to sit in `index.html` (it swallowed the visitor's first tap
 * entirely). Paste the `src` from the unit's snippet to enable; `""` = off.
 */
export const SOCIAL_BAR_SRC = "";
