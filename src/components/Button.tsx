/**
 * The app's button system. One consistent shape/state vocabulary everywhere:
 * hover, focus-visible (gold ring), and a subtle press (active) scale.
 *
 * - `primary`   — gold CTA, black text (Play, confirm)
 * - `secondary` — translucent glass (More Info, cancel)
 * - `ghost`     — text-only, low emphasis
 *
 * The classes themselves live in `buttonStyles.ts` so links that need to look
 * like buttons can share them without this file exporting non-components.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
