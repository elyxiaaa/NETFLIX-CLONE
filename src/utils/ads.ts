/**
 * Sponsor monetization (Adsterra direct link, opened popunder-style).
 *
 * Fires only in direct response to a real user gesture — a movie click or Play —
 * and only once it clears three gates, in this order:
 *
 *   1. **Grace clicks.** The first `SPONSOR.graceClicks` qualifying gestures of
 *      a visit never fire, so nobody meets an ad before they've used the site.
 *   2. **Probability.** Past the grace, each qualifying click is a dice roll, so
 *      it isn't tied to a predictable gesture.
 *   3. **Cooldown.** A hard floor between opens regardless of the dice.
 *
 * All four knobs live in `config/ads.ts`.
 *
 * Must be called synchronously inside the click/tap handler, or the browser's
 * popup blocker will drop the window.
 *
 * This pays per visit, not per impression — so the knobs set *volume*, not rate.
 * Repeat opens within one session convert progressively worse, and each one
 * costs session length (and with it the banner impressions that *are* sold
 * per-mille), so turning them all the way up earns less than it looks like.
 */
import { SPONSOR } from "../config/ads";

/** localStorage key holding the epoch-ms timestamp of the last sponsor open. */
const LAST_SHOWN_KEY = "flx_sponsor_last_shown";

/** sessionStorage key counting qualifying gestures this visit. */
const CLICK_COUNT_KEY = "flx_sponsor_clicks";

/**
 * Give a first-time visitor one quiet cooldown window.
 *
 * Without this, the cooldown gate is a no-op on a brand-new visit: with no
 * stored timestamp the elapsed check passes trivially. It can only ever
 * suppress a *second* open, never the first.
 *
 * Seeds only when no timestamp exists, i.e. once per browser — someone who
 * returns has already decided to come back, so they monetize normally. Safe to
 * call on every load; it's a no-op once the key is set.
 */
export function initSponsorCooldown(): void {
  if (typeof window === "undefined" || !SPONSOR.seedOnFirstVisit) return;

  try {
    if (localStorage.getItem(LAST_SHOWN_KEY) === null) {
      localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
    }
  } catch {
    // Storage blocked — nothing to seed. `maybeOpenSponsor` bails out in the
    // same situation, so the pair stays consistent.
  }
}

/** Count this gesture and report how many have happened this visit. */
function countClick(): number {
  try {
    const next = (Number(sessionStorage.getItem(CLICK_COUNT_KEY)) || 0) + 1;
    sessionStorage.setItem(CLICK_COUNT_KEY, String(next));
    return next;
  } catch {
    // Storage blocked — treat as still within grace rather than firing blind.
    return 0;
  }
}

export function maybeOpenSponsor(): void {
  if (typeof window === "undefined" || !SPONSOR.url) return;

  // Gate 1: the opening gestures of a visit are always free.
  if (countClick() <= SPONSOR.graceClicks) return;

  // Gate 2: dice roll. Checked before the cooldown is stamped, so losing the
  // roll costs nothing and the next qualifying click gets a fresh chance.
  if (Math.random() >= SPONSOR.probability) return;

  try {
    // Gate 3: hard floor between opens.
    const last = Number(localStorage.getItem(LAST_SHOWN_KEY)) || 0;
    if (Date.now() - last < SPONSOR.cooldownMs) return;
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // localStorage blocked (private mode / quota) — skip rather than risk
    // opening it repeatedly with no way to remember we already did.
    return;
  }

  // Popunder-style: open in a background tab and hand focus back so the visitor
  // stays on the page they were watching. Mobile browsers ignore both calls and
  // foreground the new tab regardless — there is no background tab to hand to.
  const win = window.open(SPONSOR.url, "_blank");
  if (win) {
    win.blur();
    window.focus();
  }
}
