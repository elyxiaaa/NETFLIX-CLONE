/**
 * Full-screen video player — the "Play" experience.
 *
 * Reads the `playing` movie from `ModalContext` and renders a Netflix-style
 * player: auto-hiding top bar (back + title) and bottom controls (scrubber,
 * play/pause, ±10s skip, volume, time, fullscreen), click-to-toggle, keyboard
 * shortcuts, and buffering/error states.
 *
 * There's no licensed catalog, so playback uses each title's optional
 * `video_url`, falling back to a shared sample clip. Swap in real streams later
 * by setting `video_url` per title — nothing else changes.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "../context/ModalContext";
import type { Movie } from "../types/movie";
import { Button } from "./Button";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  ArrowLeftIcon,
} from "./icons";

/**
 * Self-hosted, public-domain sample clip used when a title has no `video_url`.
 * WebM first (open codec — widest support, incl. headless Chromium), MP4 fallback
 * (Safari). Served from `public/`.
 */
const SAMPLE_SOURCES = [
  { src: "/sample.webm", type: "video/webm" },
  { src: "/sample.mp4", type: "video/mp4" },
];

const GOLD = "#e5b80b";
const TRACK = "rgba(255,255,255,0.3)";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function WatchPlayer() {
  const { playing, stopPlaying } = useModal();
  if (!playing) return null;
  return <Player key={playing.id} movie={playing} onClose={stopPlaying} />;
}

function Player({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [errored, setErrored] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reveal controls, then auto-hide after 3s while playing.
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false);
    }, 3000);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  const seekTo = useCallback((time: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(Math.max(0, time), v.duration);
  }, []);

  const skip = useCallback(
    (delta: number) => seekTo((videoRef.current?.currentTime ?? 0) + delta),
    [seekTo],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (!next && volume === 0) setVolume(0.5);
      return next;
    });
  }, [volume]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen().catch(() => {});
  }, []);

  // Body scroll lock while the player is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Attempt autoplay; fall back to muted if the browser blocks sound.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, []);

  // Keep the element in sync with volume/mute state.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
  }, [volume, muted]);

  // Track fullscreen changes (incl. the browser's Esc-to-exit).
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          skip(-10);
          break;
        case "ArrowRight":
          skip(10);
          break;
        case "ArrowUp":
          setMuted(false);
          setVolume((x) => Math.min(1, x + 0.1));
          break;
        case "ArrowDown":
          setVolume((x) => Math.max(0, x - 0.1));
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          if (!document.fullscreenElement) onClose();
          break;
      }
      revealControls();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, skip, toggleMute, toggleFullscreen, onClose, revealControls]);

  const progressPct = duration ? (current / duration) * 100 : 0;
  const level = muted ? 0 : volume;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-player bg-black ${controlsVisible ? "" : "cursor-none"}`}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      role="dialog"
      aria-label={`Playing ${movie.title}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-contain"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setErrored(true);
          setBuffering(false);
        }}
      >
        {movie.video_url ? (
          <source src={movie.video_url} />
        ) : (
          SAMPLE_SOURCES.map((s) => <source key={s.src} src={s.src} type={s.type} />)
        )}
      </video>

      {/* Buffering spinner */}
      {buffering && !errored && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-brand-gold" />
        </div>
      )}

      {/* Playback error */}
      {errored && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div className="max-w-sm space-y-3">
            <p className="text-lg font-semibold text-white">
              This title can&apos;t be played right now.
            </p>
            <p className="text-sm text-white/60">
              The video stream is unavailable. Wire a real source via each title&apos;s{" "}
              <code className="rounded bg-white/10 px-1">video_url</code>.
            </p>
            <Button variant="primary" onClick={onClose}>
              Back to browse
            </Button>
          </div>
        </div>
      )}

      {/* Center play/pause affordance when paused */}
      {!isPlaying && !buffering && !errored && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className={`absolute inset-0 grid place-items-center transition-opacity ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/30 backdrop-blur">
            <PlayIcon className="ml-1 h-9 w-9" />
          </span>
        </button>
      )}

      {/* Top bar */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 md:p-6 ${
          controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to browse"
          className="text-white transition hover:text-brand-gold"
        >
          <ArrowLeftIcon className="h-7 w-7" />
        </button>
        <h2 className="truncate text-lg font-semibold text-white drop-shadow">
          {movie.title}
        </h2>
      </div>

      {/* Bottom controls */}
      {!errored && (
        <div
          className={`absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-16 transition-opacity duration-300 md:px-6 ${
            controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Scrubber */}
          <div className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-right text-xs tabular-nums text-white/80">
              {formatTime(current)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="any"
              value={current}
              onChange={(e) => seekTo(Number(e.target.value))}
              aria-label="Seek"
              className="player-range h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${GOLD} ${progressPct}%, ${TRACK} ${progressPct}%)`,
              }}
            />
            <span className="w-12 shrink-0 text-xs tabular-nums text-white/60">
              {formatTime(duration)}
            </span>
          </div>

          {/* Button row */}
          <div className="flex items-center gap-4 text-white">
            <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="transition hover:text-brand-gold">
              {isPlaying ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}
            </button>
            <button type="button" onClick={() => skip(-10)} aria-label="Back 10 seconds" className="transition hover:text-brand-gold">
              <SkipBackIcon className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds" className="transition hover:text-brand-gold">
              <SkipForwardIcon className="h-6 w-6" />
            </button>

            <div className="group/vol flex items-center gap-2">
              <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="transition hover:text-brand-gold">
                {muted || volume === 0 ? <VolumeMuteIcon className="h-6 w-6" /> : <VolumeHighIcon className="h-6 w-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={level}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  setMuted(v === 0);
                }}
                aria-label="Volume"
                className="player-range hidden h-1.5 w-24 sm:block"
                style={{
                  background: `linear-gradient(to right, ${GOLD} ${level * 100}%, ${TRACK} ${level * 100}%)`,
                }}
              />
            </div>

            <span className="ml-2 hidden truncate text-sm font-medium text-white/80 md:block">
              {movie.title}
            </span>

            <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="ml-auto transition hover:text-brand-gold">
              {isFullscreen ? <FullscreenExitIcon className="h-6 w-6" /> : <FullscreenEnterIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
