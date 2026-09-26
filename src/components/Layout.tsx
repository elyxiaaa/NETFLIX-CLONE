/**
 * Route layout — the persistent app shell around every page.
 *
 * Renders the navbar, the active page (`<Outlet/>`), and the footer. Resets
 * scroll to top on navigation.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SocialBar } from "./SocialBar";
import { Popunder } from "./Popunder";

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
      <SocialBar />
      <Popunder />
    </div>
  );
}
