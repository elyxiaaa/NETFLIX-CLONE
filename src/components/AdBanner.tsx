/**
 * Adsterra native banner. The network script fills the container div by id,
 * so the script is injected after the div is in the DOM rather than placed in
 * index.html. Lives in the persistent footer, so it loads once per page load.
 */
import { useEffect, useRef } from "react";

const BANNER_KEY = "4b7d16d2094c6d475055f9ccfb2d813d";
const BANNER_SRC = `https://pl31486079.profitableratecpmnetwork.com/${BANNER_KEY}/invoke.js`;

export function AdBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = BANNER_SRC;
    wrap.appendChild(script);

    return () => {
      script.remove();
      const container = document.getElementById(`container-${BANNER_KEY}`);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto flex max-w-5xl justify-center px-4 py-6 md:px-12"
    >
      <div id={`container-${BANNER_KEY}`} />
    </div>
  );
}
