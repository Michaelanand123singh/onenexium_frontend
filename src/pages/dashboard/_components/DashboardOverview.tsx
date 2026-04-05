import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  FolderOpen,
  Activity,
  Archive,
  Clock,
  Plus,
  LayoutGrid,
  ArrowRight,
  Zap,
  Layers,
  Code,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { formatDistanceToNow } from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { useRef, useEffect, useCallback } from "react";

type Project = Doc<"projects">;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Interactive dot grid matching landing page
function DashboardDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
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
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isDark = () => document.documentElement.classList.contains("dark");
    const gap = 28;
    const glowRadius = 160;

    const animate = (time: number) => {
      const t = time * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dark = isDark();
      const mx = mouseRef.current.x - rect.left;
      const my = mouseRef.current.y - rect.top;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gap;
          const y = r * gap;
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / glowRadius);
          const wave = (Math.sin(t * 0.5 + c * 0.12 + r * 0.12) + 1) * 0.5;
          const baseAlpha = dark ? 0.12 + wave * 0.04 : 0.1 + wave * 0.04;
          const alpha = Math.min(1, baseAlpha + proximity * 0.5);
          const dotR = 0.7 + proximity * proximity * 1.2;

          if (proximity > 0.05) {
            ctx.beginPath();
            ctx.arc(x, y, dotR + 1.5 * proximity, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(160, 140, 255, ${proximity * 0.25})`
              : `rgba(99, 102, 241, ${proximity * 0.2})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(x, y - proximity * proximity * 2, dotR, 0, Math.PI * 2);
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
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, transparent 50%, var(--background) 100%)",
        }}
      />
    </>
  );
}

function StatCard({
  label,
  value,
  displayValue,
  icon: Icon,
  iconBg,
  iconColor,
  iconBorder,
  delay,
}: {
  label: string;
  value?: number;
  displayValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  iconBorder: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className={`w-10 h-10 rounded-2xl ${iconBg} ${iconColor} border ${iconBorder} flex items-center justify-center mb-4`}
      >
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-2xl font-semibold text-foreground tracking-tight">
        {displayValue ?? value}
      </p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

function RecentProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const navigate = useNavigate();

  const timeAgo = formatDistanceToNow(new Date(project.lastEditedAt), {
    addSuffix: true,
  });

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
      onClick={() => navigate(`/project/${project._id}`)}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer group text-left"
    >
      <div className="w-10 h-10 rounded-2xl bg-foreground/[0.06] border border-border flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-foreground">
          {project.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {project.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          Edited {timeAgo}
        </p>
      </div>

      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 border ${
          project.status === "active"
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
            : project.status === "generating"
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
              : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {project.status}
      </span>

      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.button>
  );
}

function OverviewSkeleton() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-5 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}

export default function DashboardOverview() {
  const user = useQuery(api.users.getCurrentUser, {});
  const projects = useQuery(api.projects.listByUser, {});
  const navigate = useNavigate();

  if (user === undefined || projects === undefined) {
    return <OverviewSkeleton />;
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const archivedProjects = projects.filter(
    (p) => p.status === "archived"
  ).length;
  const recentProjects = projects.slice(0, 5);

  const lastActive =
    projects.length > 0
      ? formatDistanceToNow(new Date(projects[0].lastEditedAt), {
          addSuffix: true,
        })
      : "No activity";

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-full">
      {/* Dot grid background */}
      <DashboardDotGrid />

      <div className="relative z-10 p-6 lg:p-10 max-w-5xl">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl lg:text-4xl font-medium tracking-tight text-balance">
                {getGreeting()},{" "}
                {firstName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.2 + i * 0.04,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mt-2"
              >
                Here{"'"}s an overview of your workspace
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard/create")}
              className="h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Project
            </motion.button>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Projects"
            value={totalProjects}
            icon={FolderOpen}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            iconBorder="border-primary/20"
            delay={0.1}
          />
          <StatCard
            label="Active"
            value={activeProjects}
            icon={Activity}
            iconBg="bg-emerald-50 dark:bg-emerald-500/10"
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBorder="border-emerald-100 dark:border-emerald-500/20"
            delay={0.15}
          />
          <StatCard
            label="Archived"
            value={archivedProjects}
            icon={Archive}
            iconBg="bg-blue-50 dark:bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-400"
            iconBorder="border-blue-100 dark:border-blue-500/20"
            delay={0.2}
          />
          <StatCard
            label="Last Active"
            displayValue={lastActive}
            icon={Clock}
            iconBg="bg-amber-50 dark:bg-amber-500/10"
            iconColor="text-amber-600 dark:text-amber-400"
            iconBorder="border-amber-100 dark:border-amber-500/20"
            delay={0.25}
          />
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              icon: Zap,
              title: "Build with AI",
              desc: "Describe what you need",
              href: "/dashboard/create",
              iconBg: "bg-primary/10",
              iconColor: "text-primary",
              iconBorder: "border-primary/20",
            },
            {
              icon: Layers,
              title: "Browse Templates",
              desc: "Start from a template",
              href: "/templates",
              iconBg: "bg-blue-50 dark:bg-blue-500/10",
              iconColor: "text-blue-600 dark:text-blue-400",
              iconBorder: "border-blue-100 dark:border-blue-500/20",
            },
            {
              icon: Code,
              title: "All Projects",
              desc: "View and manage projects",
              href: "/dashboard/projects",
              iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
              iconColor: "text-emerald-600 dark:text-emerald-400",
              iconBorder: "border-emerald-100 dark:border-emerald-500/20",
            },
          ].map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              onClick={() => navigate(action.href)}
              className="bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left"
            >
              <div
                className={`w-10 h-10 rounded-2xl ${action.iconBg} ${action.iconColor} border ${action.iconBorder} flex items-center justify-center mb-4`}
              >
                <action.icon className="w-[18px] h-[18px]" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.desc}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Recent projects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent Projects
            </h2>
            {projects.length > 5 && (
              <button
                onClick={() => navigate("/dashboard/projects")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <div className="bg-card rounded-3xl border border-dashed border-border p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-5 h-5" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                No projects yet
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Create your first project to get started
              </p>
              <button
                onClick={() => navigate("/dashboard/create")}
                className="h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-3xl border border-border shadow-sm divide-y divide-border overflow-hidden">
              {recentProjects.map((project, i) => (
                <RecentProjectRow
                  key={project._id}
                  project={project}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity note */}
        {projects.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground mt-6 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Last project activity: {lastActive}
          </motion.p>
        )}
      </div>
    </div>
  );
}
