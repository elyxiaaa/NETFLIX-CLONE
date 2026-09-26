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
 * Deliberately ours rather than Adsterra's popunder script: that script fires
 * on a fixed click *counter*, not at random, and consumes the gesture it fires
 * on (measured — the click never reaches the page, so the visitor's tap does
 * nothing). Opening the tab from our own handler leaves the click intact.
 *
 * Firing is gated four ways, all checked in `maybeOpenSponsor`:
 *   1. `armAfterMs`  — nothing fires until the visit is this old
 *   2. `graceClicks` — the opening gestures of a visit never fire
 *   3. `probability` — past those, each qualifying click is a dice roll
 *   4. `cooldownMs`  — a hard floor between opens, however the dice land
 *
 * Note the *rate* is a direct-link rate, lower than the popunder unit's — see
 * `POPUNDER` below, which is the script-based product and runs alongside this.
 */
export const SPONSOR = {
  /** Direct-link URL from the Adsterra unit. `""` disables the pop entirely. */
  url: "https://www.effectivecpmnetwork.com/nyfb4ufr6z?key=75ffa84acaf66abd5c01c978533654e9",

  /**
   * Time on site before anything can fire, measured from the first page of the
   * visit and carried across reloads and route changes. The primary control:
   * a visitor browses uninterrupted for this long, then ads become eligible.
   */
  armAfterMs: 5 * 60 * 1000,

  /**
   * Qualifying clicks let through untouched at the start of each visit. Mostly
   * already spent by the time `armAfterMs` elapses; it matters for someone who
   * sits on one page (watching) and then starts clicking.
   */
  graceClicks: 3,

  /** Chance (0–1) that a qualifying click past the gates opens the tab. */
  probability: 0.25,

  /** Hard minimum between two opens. */
  cooldownMs: 15 * 60 * 1000,
} as const;

/**
 * Adsterra popunder — the script-based unit, re-enabled on a delay.
 *
 * Earned 2.8x more per impression than the native banner (37% of revenue from
 * 17% of impressions), which is why it's back. The cost is real and measured:
 * once this script is on the page it consumes the next click outright — the
 * event never reaches the app, so that tap does nothing.
 *
 * Injecting it `delayMs` into the visit instead of from `index.html` means the
 * tap it eats is never the visitor's first. Its own cookie cap (`pp_delay_`)
 * governs repeats after that; there is no client-side control over its rate.
 *
 * `src` = "" disables it.
 */
export const POPUNDER = {
  src: "https://pl30425488.profitableratecpmnetwork.com/0d/e2/3b/0de23b3ffe0ffd0534cdac5c6cb49811.js",
  delayMs: 5 * 60 * 1000,
} as const;

/**
 * Adsterra Social Bar / In-Page Push — a floating site-wide unit.
 *
 * Highest CPM of the formats that *don't* hijack the click, unlike the popunder
 * that used to sit in `index.html` (it swallowed the visitor's first tap
 * entirely). Paste the `src` from the unit's snippet to enable; `""` = off.
 */
export const SOCIAL_BAR_SRC = "";
