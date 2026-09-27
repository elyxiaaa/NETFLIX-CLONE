/**
 * Install-to-home-screen plumbing.
 *
 * Chrome fires `beforeinstallprompt` when it considers the site installable,
 * and the event is the *only* way to open the native "Install app" dialog —
 * there's no API to summon it later. It also fires once, early, usually before
 * React has mounted, so it's captured at module load and stashed here for the
 * UI to use whenever the visitor is ready.
 *
 * Browsers that never fire it — Safari on every platform, Firefox — fall back
 * to the manual instructions in `InstallAppModal`.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

/** Capture the prompt and register the worker. Call once, before render. */
export function initPwa(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (event) => {
    // Without this Chrome may show its own mini-infobar, and the event can't
    // be replayed later — we want the install to happen on our button.
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });

  // Dev runs through Vite's module server; a worker caching documents there
  // fights HMR for no benefit, since installability only matters in production.
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failing costs us the native prompt, nothing else — the
        // modal still explains the manual route.
      });
    });
  }
}

/** Whether the native install dialog can be opened right now. */
export function canInstall(): boolean {
  return deferred !== null;
}

export function subscribeInstall(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Open Chrome's install dialog. Resolves once the visitor has chosen.
 *
 * The event is single-use: whatever they pick, it can't be prompted again, so
 * it's cleared either way and the UI falls back to manual instructions.
 */
export async function promptInstall(): Promise<
  "accepted" | "dismissed" | "unavailable"
> {
  if (!deferred) return "unavailable";

  const event = deferred;
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  } catch {
    return "unavailable";
  } finally {
    deferred = null;
    notify();
  }
}
