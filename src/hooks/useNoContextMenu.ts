/**
 * Suppress the browser context menu across the app.
 *
 * Worth being clear about what this does and doesn't do: it stops the
 * right-click menu, which is where casual "Inspect" comes from. It does **not**
 * prevent DevTools — F12, Ctrl/Cmd+Shift+I, and the browser's own menu all
 * still work, and view-source is unaffected. Treat it as friction, never as
 * protection; anything the browser has been sent is readable by the visitor.
 *
 * Bound to `document` in the capture phase so it applies everywhere, including
 * inside the app's own overlays. Cross-origin iframes (the player) run in their
 * own document and are not affected — we can't reach into them.
 */
import { useEffect } from "react";

export function useNoContextMenu(): void {
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block, true);
    return () => document.removeEventListener("contextmenu", block, true);
  }, []);
}
