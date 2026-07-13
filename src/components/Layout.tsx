/**
 * Route layout — the persistent app shell around every page.
 *
 * Renders the navbar, the active page (`<Outlet/>`), the footer, and the single
 * `<DetailModal>` (so it works on any route). Resets scroll to top on navigation.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DetailModal } from "./DetailModal";
import { WatchPlayer } from "./WatchPlayer";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div id="top" className="min-h-screen bg-brand-black">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <DetailModal />
      <WatchPlayer />
    </div>
  );
}
