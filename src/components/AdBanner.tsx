/**
 * Adsterra native banner. The network script fills a container div by id, so the
 * script is injected after that div is in the DOM rather than placed in
 * index.html.
 *
 * One instance per placement — see `config/ads.ts`. Two instances sharing a key
 * would collide on `#container-<key>`, so a key may only appear once per page.
 *
 * The widget ships its own runtime `<style>`; the `.ad-native` rules in
 * `index.css` re-skin its markup to match a backdrop `MovieCard`.
 */
import { useEffect, useRef } from "react";
import type { NativeBanner } from "../config/ads";

interface AdBannerProps {
  placement: NativeBanner;
  /** Extra classes on the wrapper — use for per-slot spacing. */
  className?: string;
}

export function AdBanner({ placement, className = "" }: AdBannerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { key, host } = placement;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !key) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://${host}/${key}/invoke.js`;
    wrap.appendChild(script);

    return () => {
      script.remove();
      const container = document.getElementById(`container-${key}`);
      if (container) container.innerHTML = "";
    };
  }, [key, host]);

  // An unconfigured slot renders nothing at all — no empty gap in the layout.
  if (!key) return null;

  return (
    <div ref={wrapRef} className={`ad-native px-4 md:px-12 ${className}`}>
      <div id={`container-${key}`} />
    </div>
  );
}
