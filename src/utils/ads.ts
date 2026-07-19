/**
 * Optional sponsor monetization (Adsterra direct link).
 *
 * Opens the sponsor link at most **once per browser session**, and only in
 * direct response to a real user gesture (a movie click or Play). That keeps
 * it from nagging: one background tab per session, then silent afterwards —
 * deliberately *not* Adsterra's auto-popunder script, which fires on every
 * click with no throttle.
 *
 * Must be called synchronously inside the click/tap handler, or the browser's
 * popup blocker will drop the window.
 */
const SPONSOR_URL =
  "https://www.effectivecpmnetwork.com/nyfb4ufr6z?key=75ffa84acaf66abd5c01c978533654e9";

/** sessionStorage flag — resets when the tab/session ends, not persisted. */
const SESSION_KEY = "flx_sponsor_shown";

export function maybeOpenSponsor(): void {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(SESSION_KEY)) return; // already shown this session
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sessionStorage blocked (private mode / quota) — skip rather than risk
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
