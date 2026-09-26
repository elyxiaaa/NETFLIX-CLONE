/**
 * Adsterra popunder loader, injected `POPUNDER.delayMs` into the visit.
 *
 * It used to sit in `index.html`, which armed it at parse time — before the
 * visitor had done anything. That matters because this script consumes the next
 * click outright: the event is never dispatched, so the app's own handlers
 * don't run and the click doesn't navigate.
 *
 * Holding it back even briefly means the click it eats is never someone's
 * first, while keeping the higher-rate unit armed for nearly all of the visit.
 * See `POPUNDER` in `config/ads.ts` for the measured rationale.
 *
 * The delay is measured from the start of the visit, not from mount, so reloads
 * and deep links don't restart the countdown. Mounted once from `Layout`, it
 * survives route changes along with the rest of the shell.
 */
import { useEffect } from "react";
import { POPUNDER } from "../config/ads";
import { elapsedThisVisit } from "../utils/ads";

export function Popunder() {
  useEffect(() => {
    if (!POPUNDER.src) return;

    const alreadyLoaded = () =>
      document.querySelector(`script[src="${POPUNDER.src}"]`) !== null;

    // Guards against StrictMode's double-invoked effect in development.
    if (alreadyLoaded()) return;

    const wait = Math.max(0, POPUNDER.delayMs - elapsedThisVisit());
    const timer = setTimeout(() => {
      if (alreadyLoaded()) return;
      const script = document.createElement("script");
      script.async = true;
      script.src = POPUNDER.src;
      document.body.appendChild(script);
    }, wait);

    // Only the pending timer is cleaned up. Once the script is in, the network
    // owns it — removing the tag wouldn't unbind its listeners anyway.
    return () => clearTimeout(timer);
  }, []);

  return null;
}
