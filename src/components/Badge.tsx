/**
 * Small status pill used on cards, the hero, and the detail modal.
 *
 * - `gold`    — solid gold, black text (headline status like NEW)
 * - `outline` — hairline outline (secondary status like TOP RATED)
 * - `dark`    — translucent dark chip (quality tags like 4K)
 */
import type { ReactNode } from "react";

type BadgeTone = "gold" | "outline" | "dark";

const TONES: Record<BadgeTone, string> = {
  gold: "bg-brand-gold text-black",
  outline: "border border-white/45 text-white/90",
  dark: "bg-black/70 text-white ring-1 ring-white/15 backdrop-blur-sm",
};

export function Badge({
  tone = "gold",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
