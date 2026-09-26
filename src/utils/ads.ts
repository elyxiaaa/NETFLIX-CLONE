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
