import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useLocation } from "react-router-dom";
import { Search, Bell, PanelLeft } from "lucide-react";
import { APP_NAME } from "@/lib/brand.ts";

/** Map pathname to readable page title */
function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    create: "New Project",
    templates: "Templates",
    settings: "Settings",
  };

  return titles[last] ?? APP_NAME;
}

type DashboardNavbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
};

export default function DashboardNavbar({
  collapsed,
  onToggleSidebar,
}: DashboardNavbarProps) {
  const user = useQuery(api.users.getCurrentUser, {});
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 sticky top-0 z-40 w-full">
      {/* Left: Sidebar toggle + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="w-[18px] h-[18px]" />
        </button>

        <div className="w-px h-6 bg-border" />

        <h1 className="text-base font-semibold tracking-tight text-foreground truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search, notifications, avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* User avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <span className="text-sm font-medium text-foreground truncate max-w-[120px] hidden sm:block">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
