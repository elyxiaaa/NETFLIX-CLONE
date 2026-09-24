/**
 * Minimal site footer — brand, copyright, and the required TMDB attribution.
 */
import { BRAND_NAME } from "../config";
import { AdBanner } from "./AdBanner";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <AdBanner />
      <footer className="border-t border-white/10 px-4 py-10 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-white/70">
            © {year} {BRAND_NAME}
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-white/40">
            Metadata and artwork provided by TMDB. This product uses the TMDB
            API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </>
  );
}
