/**
 * Per-route document metadata: `<title>`, description, canonical URL, and the
 * Open Graph / Twitter tags used for link previews and search results.
 *
 * `index.html` ships sensible site-wide defaults (for crawlers that don't run
 * JS); each page calls this hook to replace them with something specific, e.g.
 * "Dune: Part Two (2024) — Watch on Flixly" plus the film's synopsis and art.
 * Tags are updated in place (created if missing) and restored to the site
 * defaults when the page unmounts.
 */
import { useEffect } from "react";
import { BRAND_NAME } from "../config";

export const DEFAULT_TITLE = `${BRAND_NAME} — Watch Trending Movies & TV Shows Online`;
export const DEFAULT_DESCRIPTION = `Stream the latest movies and TV series on ${BRAND_NAME}. Browse what's trending, discover new releases and top-rated picks, and build your own watchlist.`;

/** Branded 1200×630 link-preview card (`public/og-image.png`), used when a page has no art of its own. */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");
export const DEFAULT_IMAGE = `${SITE_URL || window.location.origin}/og-image.png`;

export interface DocumentMeta {
  /** Page-specific title; the brand is appended. Omit for the site default. */
  title?: string;
  description?: string;
  /** Absolute image URL for link previews (poster/backdrop). Defaults to the Flixly card. */
  image?: string | null;
  /** Open Graph type — `website` by default, `video.movie` / `video.tv_show` for titles. */
  type?: string;
  /** Keep the page out of search indexes (search results, personal list, 404s). */
  noindex?: boolean;
}

/** Trim to a preview-friendly length on a word boundary. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`;
}

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function apply({ title, description, image, type, noindex }: DocumentMeta) {
  const fullTitle = title ? `${title} — ${BRAND_NAME}` : DEFAULT_TITLE;
  const desc = truncate(description || DEFAULT_DESCRIPTION);
  const url = window.location.origin + window.location.pathname + window.location.search;
  const img = image || DEFAULT_IMAGE;

  document.title = fullTitle;
  setMeta("name", "description", desc);
  setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
  setCanonical(url);

  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:type", type ?? "website");
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", img);
  // Size/type/alt describe the branded card; drop them for other art rather than lie.
  const isDefault = img === DEFAULT_IMAGE;
  const alt = isDefault ? `${BRAND_NAME} — Watch trending movies & TV shows` : fullTitle;
  setMeta("property", "og:image:type", isDefault ? "image/png" : null);
  setMeta("property", "og:image:width", isDefault ? "1200" : null);
  setMeta("property", "og:image:height", isDefault ? "630" : null);
  setMeta("property", "og:image:alt", alt);

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", img);
  setMeta("name", "twitter:image:alt", alt);
}

export function useDocumentMeta(meta: DocumentMeta) {
  const { title, description, image, type, noindex } = meta;

  useEffect(() => {
    apply({ title, description, image, type, noindex });
  }, [title, description, image, type, noindex]);

  // Restore the site defaults when the page goes away.
  useEffect(() => () => apply({}), []);
}
