/**
 * Navbar "Download" control — installs Flixly to the home screen.
 *
 * One tap where the browser allows it: if Chrome has offered a
 * `beforeinstallprompt`, the button opens the native install dialog directly,
 * with no modal in between. Anywhere that never fires it — Safari on every
 * platform, Firefox — it falls back to `InstallAppModal` and the manual steps.
 *
 * Keeping both matters: the native dialog is the shortest possible path, and
 * iOS is a large share of the audience but will never have one.
 */
import { useCallback, useState, useSyncExternalStore } from "react";
import { canInstall, promptInstall, subscribeInstall } from "../utils/pwa";
import { InstallAppModal } from "./InstallAppModal";
import { DownloadIcon } from "./icons";

export function DownloadButton({ className = "" }: { className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // The prompt arrives asynchronously and can be consumed, so the label has to
  // track it rather than read it once.
  const installable = useSyncExternalStore(
    subscribeInstall,
    canInstall,
    () => false,
  );

  const onClick = useCallback(async () => {
    if (!installable) {
      setModalOpen(true);
      return;
    }

    setBusy(true);
    const outcome = await promptInstall();
    setBusy(false);

    // If the dialog never appeared, don't leave them with nothing.
    if (outcome === "unavailable") setModalOpen(true);
  }, [installable]);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-haspopup={installable ? undefined : "dialog"}
        title="Get the Flixly app"
        className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60 lg:px-1 ${className}`}
      >
        <DownloadIcon className="h-5 w-5" />
        <span className="hidden whitespace-nowrap lg:inline">
          {busy ? "Installing…" : "Download"}
        </span>
      </button>

      {modalOpen && <InstallAppModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
