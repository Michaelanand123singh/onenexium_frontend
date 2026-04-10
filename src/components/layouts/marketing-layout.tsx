import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/site-header.tsx";
import SiteFooter from "@/components/site-footer.tsx";

/**
 * Layout for all public / marketing pages.
 * Provides the shared SiteHeader (navbar) and SiteFooter.
 * Individual page content is rendered via <Outlet />.
 */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
