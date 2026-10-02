/**
 * Source picker under the player.
 *
 * Sits directly beneath the video because that's where someone looks the moment
 * playback fails — the prompt names the problem ("server not working?") rather
 * than just labelling the control, so it reads as a fix and not a setting.
 *
 * Unconfigured servers stay visible but inert, so the slot is obvious before
 * it's filled.
 */
import type { PlayerServer } from "../config/players";

interface ServerSwitcherProps {
  servers: PlayerServer[];
  activeId: string;
  onSelect: (server: PlayerServer) => void;
  className?: string;
}

export function ServerSwitcher({
  servers,
  activeId,
  onSelect,
  className = "",
}: ServerSwitcherProps) {
  return (
    <div className={`px-4 md:px-12 ${className}`}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        <p className="text-sm text-white/50">
          Server not working?{" "}
          <span className="text-white/70">Select servers here.</span>
        </p>

        <div role="group" aria-label="Playback server" className="flex gap-2">
          {servers.map((server) => {
            const active = server.id === activeId;
            return (
              <button
                key={server.id}
                type="button"
                onClick={() => onSelect(server)}
                disabled={!server.enabled}
                aria-pressed={active}
                title={server.enabled ? undefined : "Coming soon"}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  active
                    ? "bg-brand-gold text-black"
                    : "bg-white/10 text-white/80 ring-1 ring-white/15 hover:bg-white/20 hover:text-white"
                } disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30 disabled:ring-white/10 disabled:hover:bg-white/5`}
              >
                {server.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
