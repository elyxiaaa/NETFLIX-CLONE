/**
 * Optional sponsor monetization (Adsterra direct link).
 *
 * Opens the sponsor link at most **once per `COOLDOWN_MS`** (shared across
 * tabs and reloads), and only in direct response to a real user gesture (a
 * movie click, Play, or search). That keeps it from nagging: one background
 * tab, then silent until the cooldown passes — deliberately *not* Adsterra's
 * auto-popunder script, which fires on every click with no throttle.
 *
 * Must be called synchronously inside the click/tap handler, or the browser's
 * popup blocker will drop the window.
 */
const SPONSOR_URL =
  "https://www.effectivecpmnetwork.com/nyfb4ufr6z?key=75ffa84acaf66abd5c01c978533654e9";

/** How long to stay quiet after showing the sponsor tab. */
const COOLDOWN_MS = 30 * 60 * 1000;

/** localStorage key holding the epoch-ms timestamp of the last sponsor open. */
const LAST_SHOWN_KEY = "flx_sponsor_last_shown";

export function maybeOpenSponsor(): void {
  if (typeof window === "undefined") return;

  try {
    const last = Number(localStorage.getItem(LAST_SHOWN_KEY)) || 0;
    if (Date.now() - last < COOLDOWN_MS) return; // still cooling down
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // localStorage blocked (private mode / quota) — skip rather than risk
    // opening it repeatedly with no way to remember we already did.
    return;
  }

  // Popunder-style: open in a background tab and hand focus back so the user
  // stays on the page they were watching.
  const win = window.open(SPONSOR_URL, "_blank");
  if (win) {
    win.blur();
    window.focus();
  }
}
