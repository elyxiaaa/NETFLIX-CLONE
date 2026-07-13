/**
 * The app's button system. One consistent shape/state vocabulary everywhere:
 * hover, focus-visible (gold ring), and a subtle press (active) scale.
 *
 * - `primary`   — gold CTA, black text (Play, confirm)
 * - `secondary` — translucent glass (More Info, cancel)
 * - `ghost`     — text-only, low emphasis
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-black hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/25",
  secondary:
    "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/20 hover:ring-white/40",
  ghost: "text-white/80 hover:bg-white/10 hover:text-white",
};

const SIZES: Record<Size, string> = {
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-all duration-200 ease-out-quint active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
