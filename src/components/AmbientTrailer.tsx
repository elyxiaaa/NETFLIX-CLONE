/**
 * Ambient, chrome-less YouTube trailer used behind the hero billboards.
 *
 * Two things keep YouTube's own UI from ever showing through:
 *   - No `playlist=` param. The classic loop trick (`loop=1&playlist=<key>`)
 *     turns the embed into a playlist, which gives the mobile overlay its
 *     prev/next buttons. We loop ourselves instead: on "ended", seek back.
 *   - The iframe stays invisible until the player reports it is *playing*
 *     (via the IFrame API's postMessage channel). When autoplay is blocked —
 *     iOS Low Power Mode, data saver — the video never starts, so its big
 *     paused-state play overlay never appears; the backdrop simply stays.
 */
import { useEffect, useRef, useState } from "react";

const YT_ORIGIN = "https://www.youtube.com";
/** Skip the MPA green band + studio logos at the head of most trailers. */
const START_AT = 10;
/** How long the player must have been playing before we show it (ms). */
const REVEAL_DELAY = 4500;

// IFrame API player states.
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const CUED = 5;

function embedUrl(key: string, muted: boolean): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: muted ? "1" : "0",
    controls: "0",
    start: String(START_AT),
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
    origin: window.location.origin,
  });
  return `${YT_ORIGIN}/embed/${key}?${params.toString()}`;
}

export function AmbientTrailer({
  videoKey,
  muted,
  title,
  onPlayingChange,
}: {
  videoKey: string;
  muted: boolean;
  title: string;
  /** Fires when the trailer becomes visibly playing (or stops). */
  onPlayingChange?: (playing: boolean) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Tracked per src: a new src (title or mute change) remounts the player, and
  // it stays hidden again until that player reports it's playing.
  const src = embedUrl(videoKey, muted);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);
  const playing = playingSrc === src;

  useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  useEffect(() => {
    const setPlaying = (p: boolean) => setPlayingSrc(p ? src : null);
    const post = (msg: object) =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify(msg), YT_ORIGIN);
    const command = (func: string, args: unknown[] = []) =>
      post({ event: "command", func, args });

    // After autoplay starts, YouTube shows a pause glyph mid-frame for a few
    // seconds (~2s–4s in). Hold the reveal past it so it never shows over the
    // billboard; the backdrop covers the wait.
    let reveal: number | undefined;
    const hide = () => {
      window.clearTimeout(reveal);
      reveal = undefined;
      setPlaying(false);
    };
    const onState = (state: number) => {
      if (state === PLAYING) {
        if (reveal === undefined) reveal = window.setTimeout(() => setPlaying(true), REVEAL_DELAY);
      } else if (state === PAUSED || state === CUED) {
        hide();
      } else if (state === ENDED) {
        // Restarting can bring the glyph back; fade to the backdrop meanwhile.
        hide();
        command("seekTo", [START_AT, true]);
        command("playVideo");
      }
    };

    let heard = false;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      heard = true;
      if (data.event === "onStateChange" && typeof data.info === "number") {
        onState(data.info);
      } else if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        const state = (data.info as { playerState?: number }).playerState;
        if (typeof state === "number") onState(state);
      }
    };
    window.addEventListener("message", onMessage);

    // Subscribe to the player's events. It only answers once its API is up,
    // so keep knocking briefly until it does.
    let tries = 0;
    const knock = window.setInterval(() => {
      if (heard || ++tries > 40) return window.clearInterval(knock);
      post({ event: "listening", id: videoKey, channel: "widget" });
    }, 250);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(knock);
      window.clearTimeout(reveal);
    };
  }, [src, videoKey]);

  return (
    <iframe
      ref={frameRef}
      key={src}
      src={src}
      title={title}
      allow="autoplay; encrypted-media"
      aria-hidden="true"
      tabIndex={-1}
      className={`pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
