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
import { useState, useRef, useEffect, useCallback } from "react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { LOGO_URL, APP_NAME } from "@/lib/brand.ts";
import DashboardNavbar from "@/components/dashboard-navbar.tsx";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Templates", href: "/templates", icon: LayoutGrid },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Minimal dot grid background matching landing page
function SidebarDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = () => document.documentElement.classList.contains("dark");
    const gap = 24;

    const animate = (time: number) => {
      const t = time * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gap;
          const y = r * gap;
          const wave = (Math.sin(t * 0.4 + c * 0.15 + r * 0.15) + 1) * 0.5;
          const alpha = dark ? 0.08 + wave * 0.04 : 0.06 + wave * 0.03;
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-48 w-full rounded-3xl" />
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
        className="relative h-full border-r border-border bg-card flex flex-col shrink-0 overflow-hidden"
      >
        {/* Subtle dot grid on sidebar */}
        <SidebarDotGrid />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 px-4 h-16 border-b border-border shrink-0">
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
                className="text-[15px] font-semibold text-foreground tracking-tight truncate"
              >
                {APP_NAME}
              </motion.span>
            )}
          </button>
        </div>

        {/* New project button */}
        <div className="relative z-10 px-3 pt-4 pb-2">
          <button
            onClick={() => navigate("/dashboard/create")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Project</span>}
          </button>
        </div>

        {/* Nav items */}
        <nav className="relative z-10 flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground/[0.06] text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="relative z-10 border-t border-border p-3 space-y-2 shrink-0">
          {/* User profile */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
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

      {/* Main content area with top navbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
