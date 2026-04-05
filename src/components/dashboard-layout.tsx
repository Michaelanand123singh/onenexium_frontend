import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutGrid,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { BRAND_GRADIENT, LOGO_URL, APP_NAME } from "@/lib/brand.ts";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Templates", href: "/templates", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const user = useQuery(api.users.getCurrentUser, {});
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (user === undefined) {
    return <SidebarSkeleton />;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative h-full border-r border-border bg-sidebar flex flex-col shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-border shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <img
              src={LOGO_URL}
              alt={APP_NAME}
              className="h-7 w-7 rounded-lg object-cover shrink-0"
            />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[15px] font-bold text-foreground tracking-tight truncate"
              >
                {APP_NAME}
              </motion.span>
            )}
          </button>
        </div>

        {/* New project button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/20 cursor-pointer"
            style={{ background: BRAND_GRADIENT }}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Project</span>}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href === "/dashboard" && location.pathname === "/dashboard/projects");
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom section - user + collapse */}
        <div className="border-t border-border p-3 space-y-2 shrink-0">
          {/* User profile */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: BRAND_GRADIENT }}
            >
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </div>

          {/* Sign out */}
          <SignInButton
            signOutText={collapsed ? "" : "Sign Out"}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {collapsed && <LogOut className="w-4 h-4" />}
          </SignInButton>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronsRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="w-4 h-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
