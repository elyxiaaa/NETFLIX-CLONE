/**
 * Minimal service worker — exists so Chrome treats the site as installable and
 * fires `beforeinstallprompt`, which is what powers the one-tap install dialog.
 *
 * Deliberately does almost nothing. **It never touches cross-origin requests**,
 * so the Adsterra scripts, TMDB artwork and the player iframe all go straight
 * to the network exactly as before. A service worker that cached or replayed
 * ad requests would corrupt impression counting and could serve stale creatives
 * — the single biggest way a PWA can break monetization.
 *
 * Same-origin navigations are network-first with a cached shell as the offline
 * fallback. Network-first matters: Vite emits hashed asset filenames, so a
 * stale cached index.html would reference bundles that no longer exist after a
 * deploy. Online visitors always get the fresh document; the cache is only
 * reached when the network fails.
 *
 * Everything else same-origin (hashed JS/CSS/fonts/images) is left alone —
 * those are immutable and the HTTP cache already handles them well.
 */
const CACHE = "flixly-shell-v1";
const SHELL = "/";

/**
 * Nothing is precached on install.
 *
 * `cache.add(SHELL)` here threw `InvalidAccessError: Entry already exists` in
 * Chrome, which rejected the install and left every worker version redundant —
 * so the registration never stuck and the install prompt never appeared.
 * Installability only needs a fetch handler, not a precache, and the handler
 * below fills the shell cache on the first successful navigation anyway.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  // The important line: anything not on our origin is none of our business.
  // Returning without calling respondWith leaves the request completely
  // untouched by the service worker.
  if (new URL(request.url).origin !== self.location.origin) return;

  // Only documents. Assets fall through to the browser's own caching.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(SHELL, copy));
        return response;
      })
      .catch(() => caches.match(SHELL).then((cached) => cached || Response.error())),
  );
});
