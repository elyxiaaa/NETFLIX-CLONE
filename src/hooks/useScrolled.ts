/**
 * Returns `true` once the page has scrolled past `threshold` pixels.
 * Drives the navbar's transparent → solid/blurred transition.
 */
import { useEffect, useState } from "react";

export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll(); // sync on mount (e.g. restored scroll position)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
