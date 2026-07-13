/**
 * Site footer — placeholder link columns (streaming-style) plus an honest note
 * about the mock data + TMDB attribution. Non-functional links; this is a demo.
 */
import { BRAND_NAME } from "../config";

const LINK_COLUMNS: string[][] = [
  ["Audio Description", "Investor Relations", "Legal Notices"],
  ["Help Center", "Jobs", "Cookie Preferences"],
  ["Gift Cards", "Terms of Use", "Corporate Information"],
  ["Media Center", "Privacy", "Contact Us"],
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-4 py-12 text-sm text-white/50 md:px-12">
      <nav className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {LINK_COLUMNS.map((column, i) => (
          <ul key={i} className="space-y-3">
            {column.map((label) => (
              <li key={label}>
                <a href="#top" className="transition-colors hover:text-white/80 hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </nav>

      <p className="mt-8 text-xs leading-relaxed text-white/40">
        {BRAND_NAME} is a demo streaming UI for portfolio purposes — not a real
        service and not affiliated with any streaming provider. Titles are served
        from bundled mock data shaped like the TMDB API; set{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 text-white/60">VITE_TMDB_KEY</code>{" "}
        and{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 text-white/60">VITE_USE_MOCK=false</code>{" "}
        to go live. This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
