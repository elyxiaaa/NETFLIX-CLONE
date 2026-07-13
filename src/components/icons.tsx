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

/**
 * Brand wordmark. Renders `BRAND_NAME` (from `config.ts`) as a heavy uppercase
 * logotype in the brand red — accessible text, no external font, scales with the
 * parent font-size. Change the product name in one place: `config.ts`.
 */
export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block select-none font-black uppercase leading-none text-brand-red ${className}`}
      style={{ letterSpacing: "-0.03em" }}
    >
      {BRAND_NAME}
    </span>
  );
}
