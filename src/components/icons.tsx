/**
 * Inline SVG icon set + the brand wordmark.
 *
 * Icons inherit color via `currentColor` and size via CSS (`className`), are
 * `aria-hidden` by default (label the interactive control instead), and forward
 * any SVG props. One tiny file keeps icon style consistent across the app.
 */
import type { SVGProps } from "react";
import { BRAND_NAME } from "../config";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function PlayIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M6 4.75c0-.98 1.08-1.57 1.9-1.04l11.2 7.25a1.24 1.24 0 0 1 0 2.08L7.9 20.29c-.82.53-1.9-.06-1.9-1.04V4.75Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.75h.01" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ThumbsUpIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M7 10v10H4V10h3Zm0 0 4.5-7a2 2 0 0 1 2 2v3h5.2a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 18.4 20H7" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5Z" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M6 4h12v16l-6-4-6 4V4Z" />
    </svg>
  );
}

// ---- Video player controls ----

export function PauseIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M7 4h3v16H7zM14 4h3v16h-3z" />
    </svg>
  );
}

export function VolumeHighIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export function VolumeMuteIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 9 4 6M21 9l-4 6" />
    </svg>
  );
}

export function FullscreenEnterIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

export function FullscreenExitIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
    </svg>
  );
}

export function SkipBackIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M11 6.3 4 12l7 5.7v-4.2l7 4.2V6.3l-7 4.2V6.3ZM3 6h1.6v12H3z" />
    </svg>
  );
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M13 6.3 20 12l-7 5.7v-4.2l-7 4.2V6.3l7 4.2V6.3ZM19.4 6H21v12h-1.6z" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...base(props)}
    >
      <path d="M12 20.5 4.2 12.9a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.6 0l1.2 1.2 1.2-1.2a4.7 4.7 0 0 1 6.6 0 4.7 4.7 0 0 1 0 6.7L12 20.5Z" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <path d="M12 3v13M8.5 6.5 12 3l3.5 3.5" />
      <path d="M7 11H5v9h14v-9h-2" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M12 2.5l1.6 4.4 4.4 1.6-4.4 1.6L12 14.5l-1.6-4.4L6 8.5l4.4-1.6L12 2.5Z" />
      <path d="M18.5 14l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4Z" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M12.5 2c.4 2.8-1.6 3.9-1.6 6a1.6 1.6 0 0 0 3.1.4C15 9.6 17 11.4 17 14a5 5 0 0 1-10 0c0-2 .9-3.2 1.7-4 0 1.2.6 2 1.5 2 .3-3.4 1.6-4.6 2.3-10Z" />
    </svg>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" {...base(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7.5 4v16M16.5 4v16M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21" />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base(props)}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

/**
 * Discord's mark. Solid-filled at a 24x24 viewBox like the rest of the set, so
 * it inherits `currentColor` and sizes from `className` the same way.
 */
export function DiscordIcon(props: IconProps) {
  return (
    <svg fill="currentColor" {...base(props)}>
      <path d="M19.3 5.34A16.7 16.7 0 0 0 15.16 4c-.18.32-.39.75-.53 1.09a15.5 15.5 0 0 0-4.65 0C9.83 4.75 9.62 4.32 9.44 4a16.7 16.7 0 0 0-4.15 1.34C2.67 9.25 1.96 13.06 2.31 16.82a16.8 16.8 0 0 0 5.1 2.58c.41-.56.78-1.16 1.09-1.79-.6-.22-1.17-.5-1.71-.82.14-.11.28-.22.42-.34a12 12 0 0 0 10.19 0l.41.34c-.54.32-1.11.6-1.71.82.32.63.68 1.23 1.1 1.79a16.75 16.75 0 0 0 5.1-2.58c.4-4.36-.72-8.13-3.01-11.48ZM8.85 14.53c-1 0-1.82-.92-1.82-2.04 0-1.13.8-2.05 1.82-2.05s1.84.92 1.82 2.05c0 1.12-.8 2.04-1.82 2.04Zm6.72 0c-1 0-1.82-.92-1.82-2.04 0-1.13.8-2.05 1.82-2.05s1.83.92 1.81 2.05c0 1.12-.79 2.04-1.81 2.04Z" />
    </svg>
  );
}

/**
 * Brand wordmark. Renders `BRAND_NAME` (from `config.ts`) as a heavy uppercase
 * logotype in the brand accent — accessible text, no external font, scales with
 * the parent font-size. Change the product name in one place: `config.ts`.
 */
export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block select-none font-display uppercase leading-none tracking-[0.04em] text-brand-gold ${className}`}
    >
      {BRAND_NAME}
    </span>
  );
}
