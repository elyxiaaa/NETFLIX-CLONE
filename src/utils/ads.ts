/**
 * Sponsor monetization (Adsterra direct link, opened popunder-style).
 *
 * Fires only in direct response to a real user gesture — a movie click or Play —
 * and only once it clears four gates, in this order:
 *
 *   1. **Time on site.** Nothing fires until the visit is `armAfterMs` old, so
 *      a visitor always gets an uninterrupted run at the site first.
 *   2. **Grace clicks.** The opening gestures of a visit never fire.
 *   3. **Probability.** Then each qualifying click is a dice roll, so it isn't
 *      tied to a predictable gesture.
 *   4. **Cooldown.** A hard floor between opens regardless of the dice.
 *
 * All knobs live in `config/ads.ts`.
 *
 * Must be called synchronously inside the click/tap handler, or the browser's
 * popup blocker will drop the window.
 *
 * This pays per visit, not per impression — so the knobs set *volume*, not rate.
 */
import { SPONSOR } from "../config/ads";

/** localStorage key holding the epoch-ms timestamp of the last sponsor open. */
const LAST_SHOWN_KEY = "flx_sponsor_last_shown";

/** sessionStorage key counting qualifying gestures this visit. */
const CLICK_COUNT_KEY = "flx_sponsor_clicks";

/** sessionStorage key holding when this visit started. */
const VISIT_START_KEY = "flx_visit_start";

/**
 * Fallback visit start: when the module is first evaluated. Only used if
 * sessionStorage is unavailable — without it a blocked-storage visitor would
 * read an elapsed time of zero forever and never see an ad at all.
 */
const bootedAt = Date.now();

/**
 * Stamp the start of this visit, once per tab.
 *
 * Kept in sessionStorage rather than a module variable so the clock survives
 * reloads and deep links within the same tab — otherwise every refresh would
 * hand the visitor another full `armAfterMs` of quiet.
 *
 * Safe to call on every load; it's a no-op once the key is set.
 */
export function initVisitClock(): void {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(VISIT_START_KEY) === null) {
      sessionStorage.setItem(VISIT_START_KEY, String(Date.now()));
    }
  } catch {
    // Storage blocked — `elapsedThisVisit` falls back to `bootedAt`.
  }
}

/** How long this visit has been going, in ms. */
export function elapsedThisVisit(): number {
  try {
    const raw = sessionStorage.getItem(VISIT_START_KEY);
    if (raw !== null) return Date.now() - Number(raw);
  } catch {
    // fall through to the module-load fallback
  }
  return Date.now() - bootedAt;
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

  // Gate 1: the visit has to be old enough.
  if (elapsedThisVisit() < SPONSOR.armAfterMs) return;

  // Gate 2: the opening gestures of a visit are always free.
  if (countClick() <= SPONSOR.graceClicks) return;

  // Gate 3: dice roll. Checked before the cooldown is stamped, so losing the
  // roll costs nothing and the next qualifying click gets a fresh chance.
  if (Math.random() >= SPONSOR.probability) return;

  try {
    // Gate 4: hard floor between opens.
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
