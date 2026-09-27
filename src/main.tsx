import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Self-hosted fonts: Inter for UI/body, Bebas Neue for the display logotype/titles.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/bebas-neue/400.css";
import "./index.css";
import App from "./App.tsx";
import { initPwa } from "./utils/pwa";
import { initVisitClock } from "./utils/ads";

// Capture Chrome's install prompt before render — it fires early and can't be
// replayed — and register the service worker in production.
initPwa();

// Stamp the visit start before first paint; the popunder arms a minute in.
initVisitClock();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Router drives every page, including the dedicated title page. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
