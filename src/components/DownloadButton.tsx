/**
 * Navbar "Download" control — visibly unavailable, and a prompt to join the
 * community when someone reaches for it.
 *
 * Deliberately **not** a `disabled` button. A real `disabled` control swallows
 * pointer events in most browsers, so it could never explain itself: no hover
 * on desktop, no tap on mobile. It's `aria-disabled` instead — announced as
 * unavailable, styled as unavailable, but still able to respond.
 *
 * Desktop reveals the note on hover or keyboard focus. Touch has no hover, so
 * a tap toggles it, and it closes on outside tap, Escape, or after a few
 * seconds. The note itself links to the community, so the prompt is one tap
 * from the thing it's asking for.
 */
import { useEffect, useRef, useState } from "react";
import { DISCORD_URL } from "../config";
import { DiscordIcon, DownloadIcon } from "./icons";

/** How long a tap-opened note stays up before dismissing itself. */
const AUTO_HIDE_MS = 4000;

export function DownloadButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dismiss a tap-opened note: outside tap, Escape, or timeout.
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const timer = setTimeout(() => setOpen(false), AUTO_HIDE_MS);

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={`group/dl relative ${className}`}>
      <button
        type="button"
        aria-disabled="true"
        aria-describedby="download-unavailable"
        // Opens, never toggles. A tap on a touch device fires the handler and
        // then the browser synthesises a second "ghost" mouse click a moment
        // later; a toggle would open and immediately close again. Setting it
        // true is idempotent, and there are three other ways to dismiss.
        onClick={() => setOpen(true)}
        className="inline-flex h-11 min-w-11 cursor-not-allowed items-center justify-center gap-2 text-sm text-white/40 transition-colors hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:px-1"
      >
        <DownloadIcon className="h-5 w-5" />
        <span className="hidden whitespace-nowrap lg:inline">Download</span>
      </button>

      {/* `group-hover`/`focus-within` drive the desktop reveal; `open` is the
          touch path. Hidden from the a11y tree only when fully hidden. */}
      <div
        id="download-unavailable"
        role="tooltip"
        className={`pointer-events-none absolute right-0 top-full z-dropdown w-60 pt-2 opacity-0 transition-opacity duration-150 ${
          open ? "pointer-events-auto opacity-100" : ""
        } md:group-hover/dl:pointer-events-auto md:group-hover/dl:opacity-100 md:group-focus-within/dl:pointer-events-auto md:group-focus-within/dl:opacity-100`}
      >
        <div className="rounded-lg bg-brand-dark px-3.5 py-3 text-left shadow-xl shadow-black/60 ring-1 ring-white/10">
          <p className="text-xs leading-relaxed text-white/70">
            Downloads are for community members.{" "}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 font-semibold text-brand-gold underline-offset-4 hover:underline"
            >
              <DiscordIcon aria-hidden className="h-3.5 w-3.5" />
              Join our community
            </a>{" "}
            to get download features.
          </p>
        </div>
      </div>
    </div>
  );
}
