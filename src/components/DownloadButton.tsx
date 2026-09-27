/**
 * Navbar "Download" control — opens the install-the-app modal.
 *
 * "Download" here means downloading *Flixly itself* to the home screen, which
 * is the only download the site actually offers. It's a live control rather
 * than the disabled tease it started as: a button that does something
 * shouldn't look unavailable, and a greyed control can't invite the tap it
 * needs.
 */
import { useState } from "react";
import { InstallAppModal } from "./InstallAppModal";
import { DownloadIcon } from "./icons";

export function DownloadButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Get the Flixly app"
        className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:px-1 ${className}`}
      >
        <DownloadIcon className="h-5 w-5" />
        <span className="hidden whitespace-nowrap lg:inline">Download</span>
      </button>

      {open && <InstallAppModal onClose={() => setOpen(false)} />}
    </>
  );
}
