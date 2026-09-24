/**
 * Adsterra Social Bar / In-Page Push loader.
 *
 * A floating, site-wide unit the network positions and renders itself — there's
 * no container to place, so this only injects the script. Mounted once from
 * `Layout`, it survives route changes along with the rest of the shell.
 *
 * Disabled until `SOCIAL_BAR_SRC` is set in `config/ads.ts`.
 */
import { useEffect } from "react";
import { SOCIAL_BAR_SRC } from "../config/ads";

export function SocialBar() {
  useEffect(() => {
    if (!SOCIAL_BAR_SRC) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = SOCIAL_BAR_SRC;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
