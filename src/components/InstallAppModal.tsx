/**
 * "Get the Flixly app" modal — manual install instructions.
 *
 * There's no service worker, so Chrome never fires `beforeinstallprompt` and
 * there's no one-tap install to trigger. Installing is entirely a manual
 * browser action, and the steps differ per platform, so the job here is to tell
 * the visitor exactly which menu to open on the device they're holding rather
 * than listing every platform and making them find themselves.
 *
 * Already installed (`display-mode: standalone`) gets a confirmation instead of
 * instructions — the modal can still be reached from the navbar there.
 */
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { BRAND_NAME } from "../config";
import { CloseIcon, DownloadIcon, CheckIcon } from "./icons";

interface Platform {
  /** Heading above the steps, naming the device's own menu. */
  label: string;
  steps: string[];
}

/**
 * Pick instructions from the UA.
 *
 * UA sniffing is the wrong tool for features but the right one here: we're
 * naming a menu in the browser's own chrome, which is exactly a platform fact
 * and isn't feature-detectable. Worst case someone sees steps for a near
 * neighbour, so the fallback is deliberately generic.
 */
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return GENERIC;

  const ua = navigator.userAgent;
  // iPadOS 13+ reports as a Mac; the touch points give it away.
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && typeof document !== "undefined" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return {
      label: "On iPhone or iPad — use Safari",
      steps: [
        "Tap the Share button at the bottom of Safari",
        "Scroll down and tap “Add to Home Screen”",
        "Tap “Add” in the top right",
      ],
    };
  }

  if (/Android/i.test(ua)) {
    return {
      label: "On Android — use Chrome",
      steps: [
        "Tap the ⋮ menu in the top right of Chrome",
        "Tap “Add to Home screen” or “Install app”",
        "Confirm by tapping “Install”",
      ],
    };
  }

  return GENERIC;
}

const GENERIC: Platform = {
  label: "On desktop — use Chrome or Edge",
  steps: [
    "Open the ⋮ menu in the top right of the browser",
    "Choose “Cast, save and share” → “Install page as app”",
    "Confirm by clicking “Install”",
  ],
};

export function InstallAppModal({ onClose }: { onClose: () => void }) {
  const platform = useMemo(() => detectPlatform(), []);
  const installed = useMemo(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        // iOS home-screen apps don't report a display-mode.
        (navigator as Navigator & { standalone?: boolean }).standalone === true),
    [],
  );

  // Lock the page behind the modal and close on Escape — same as the drawer.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-modal grid place-items-center p-4">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm motion-safe:animate-fade-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-brand-dark shadow-2xl shadow-black/70 motion-safe:animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="px-6 pb-7 pt-8 sm:px-8">
          <span
            aria-hidden
            className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-gold/10 ring-1 ring-brand-gold/25"
          >
            <DownloadIcon className="h-6 w-6 text-brand-gold" />
          </span>

          <h2
            id="install-app-title"
            className="font-display text-3xl uppercase leading-none tracking-wide text-white"
          >
            Get the {BRAND_NAME} app
          </h2>

          {installed ? (
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/70">
              <CheckIcon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              You&apos;re already using the app. Launch {BRAND_NAME} from your home
              screen any time.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Add {BRAND_NAME} to your home screen — it opens full screen with
                no browser bar, and launches like any other app. Nothing to
                download from a store.
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                {platform.label}
              </p>

              <ol className="mt-3 space-y-3">
                {platform.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-white/80">
                    <span
                      aria-hidden
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white/70"
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
