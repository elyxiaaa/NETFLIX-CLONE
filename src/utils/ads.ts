/**
 * Visit clock — how long the current visit has been going. The popunder uses
 * it to arm a fixed time into the visit rather than from each page mount.
 */

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
