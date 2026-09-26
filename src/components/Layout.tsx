/**
 * Route layout — the persistent app shell around every page.
 *
 * Renders the navbar, the active page (`<Outlet/>`), the community CTA and the
 * footer. Resets scroll to top on navigation, and suppresses the right-click
 * menu app-wide.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNoContextMenu } from "../hooks/useNoContextMenu";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { RequestCTA } from "./RequestCTA";
import { SocialBar } from "./SocialBar";
import { Popunder } from "./Popunder";

export function Layout() {
  const { pathname } = useLocation();

  useNoContextMenu();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div id="top" className="min-h-screen bg-brand-black">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <RequestCTA />
      <Footer />
      <SocialBar />
      <Popunder />
    </div>
  );
}
