/**
 * Sponsor monetization (Adsterra direct link, opened popunder-style).
 *
 * Opens the sponsor link at most **once per `SPONSOR.cooldownMs`** (shared
 * across tabs and reloads), in direct response to a user gesture.
 *
 * Note the cooldown can only ever suppress a *second* open: a visitor with no
 * stored timestamp has an elapsed time of ~56 years, so the first qualifying
 * click of a new browser always fires. That is intended here — the delayed and
 * probabilistic variants were tried and firing dropped too far.
 *
 * Must be called synchronously inside the click/tap handler, or the browser's
 * popup blocker will drop the window.
 */
import { SPONSOR } from "../config/ads";

/** localStorage key holding the epoch-ms timestamp of the last sponsor open. */
const LAST_SHOWN_KEY = "flx_sponsor_last_shown";

/** sessionStorage key holding when this visit started. */
const VISIT_START_KEY = "flx_visit_start";

/**
 * Fallback visit start: when this module was first evaluated. Only used if
 * sessionStorage is unavailable — without it a blocked-storage visitor would
 * read zero elapsed forever and the popunder would never arm.
 */
const bootedAt = Date.now();

/**
 * Stamp the start of this visit, once per tab.
 *
 * Kept in sessionStorage rather than a module variable so the clock survives
 * reloads and deep links within the same tab — otherwise every refresh would
 * hand the visitor another full delay before the popunder arms.
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

export function maybeOpenSponsor(): void {
  if (typeof window === "undefined" || !SPONSOR.url) return;

  try {
    const last = Number(localStorage.getItem(LAST_SHOWN_KEY)) || 0;
    if (Date.now() - last < SPONSOR.cooldownMs) return; // still cooling down
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
