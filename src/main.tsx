import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ModalProvider } from "./context/ModalContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Watchlist state wraps everything; modal state drives the single DetailModal. */}
    <WatchlistProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </WatchlistProvider>
  </StrictMode>,
);
