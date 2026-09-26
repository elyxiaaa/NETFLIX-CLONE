/**
 * The button look as a class string, shared by `Button` and by the cases that
 * must render an `<a>` — an external link can't be a `<button>` without losing
 * middle-click, "open in new tab" and the browser's own link affordances.
 *
 * Lives outside `Button.tsx` because a module that exports both components and
 * plain values breaks React Fast Refresh (`react-refresh/only-export-components`).
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-all duration-200 ease-out-quint active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gold text-black hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/25",
  secondary:
    "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/20 hover:ring-white/40",
  ghost: "text-white/80 hover:bg-white/10 hover:text-white",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;
}
