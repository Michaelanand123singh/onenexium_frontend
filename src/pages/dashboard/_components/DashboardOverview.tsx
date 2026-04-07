import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  FolderOpen,
  Activity,
  Plus,
  ArrowRight,
  Zap,
  Layers,
  Code,
  Clock,
  Sparkles,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { formatDistanceToNow } from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import InviteNotifications from "./InviteNotifications.tsx";

type Project = Doc<"projects">;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Shared bento card wrapper */
function BentoCard({
  children,
  className = "",
  delay = 0,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${onClick ? "cursor-pointer hover:shadow-md hover:border-foreground/15 transition-all" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Welcome / hero card — top-left, spans 2 cols */
function WelcomeCard({ firstName }: { firstName: string }) {
  const navigate = useNavigate();

  return (
    <BentoCard className="col-span-full lg:col-span-2 row-span-1 p-6 sm:p-8" delay={0.05}>
      {/* Subtle decorative pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03]">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
            {getGreeting()}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {firstName.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.15 + i * 0.035,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Here{"'"}s what{"'"}s happening in your workspace
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard/create")}
          className="h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0 w-fit"
        >
          <Plus className="w-4 h-4" />
          New Project
        </motion.button>
      </div>
    </BentoCard>
  );
}

/** Stat pill card */
function StatCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  return (
    <BentoCard className="p-5" delay={delay}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/8 flex items-center justify-center">
          <Icon className="w-4 h-4 text-foreground/70" />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/40" />
      </div>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </BentoCard>
  );
}

/** Quick action card — vertical with icon */
function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  delay: number;
}) {
  const navigate = useNavigate();

  return (
    <BentoCard
      className="p-5 group"
      delay={delay}
      onClick={() => navigate(href)}
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-foreground/8 flex items-center justify-center">
          <Icon className="w-4 h-4 text-foreground/70" />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-sm font-semibold text-foreground mt-3">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </BentoCard>
  );
}

/** Recent project row */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(project.lastEditedAt), {
    addSuffix: true,
  });

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.05 }}
      onClick={() => navigate(`/project/${project._id}`)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.02] transition-colors cursor-pointer group text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-foreground/8 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-foreground/70">
          {project.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {project.name}
        </p>
        <p className="text-[11px] text-muted-foreground/70">{timeAgo}</p>
      </div>

      <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
          project.status === "active"
            ? "bg-foreground/5 text-foreground/60"
            : project.status === "generating"
              ? "bg-foreground/[0.03] text-foreground/40"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {project.status}
      </span>
    </motion.button>
  );
}

/** Recent projects card — spans 2 cols */
function RecentProjectsCard({ projects }: { projects: Project[] }) {
  const navigate = useNavigate();

  return (
    <BentoCard className="col-span-full lg:col-span-2" delay={0.25}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground/60" />
          <h3 className="text-sm font-semibold text-foreground">Recent Projects</h3>
        </div>
        {projects.length > 0 && (
          <button
            onClick={() => navigate("/dashboard/projects")}
            className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="px-5 pb-6 pt-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-foreground/8 flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-4 h-4 text-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground mb-0.5">No projects yet</p>
          <p className="text-xs text-muted-foreground mb-4">Create your first project</p>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="h-8 px-4 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Create
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {projects.slice(0, 5).map((project, i) => (
            <ProjectRow key={project._id} project={project} index={i} />
          ))}
        </div>
      )}
    </BentoCard>
  );
}

/** Activity / workspace info card */
function WorkspaceCard({
  totalProjects,
  lastActive,
}: {
  totalProjects: number;
  lastActive: string;
}) {
  return (
    <BentoCard className="p-5" delay={0.3}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-muted-foreground/60" />
        <h3 className="text-sm font-semibold text-foreground">Workspace</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Projects</span>
          <span className="text-xs font-semibold text-foreground">{totalProjects}</span>
        </div>
        <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, totalProjects * 10)}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="h-full bg-foreground/20 rounded-full"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
          <Clock className="w-3 h-3" />
          <span>Last active {lastActive}</span>
        </div>
      </div>
    </BentoCard>
  );
}

function OverviewSkeleton() {
  return (
    <div className="p-5 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Skeleton className="col-span-full lg:col-span-2 h-36 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="col-span-full lg:col-span-2 h-72 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const user = useQuery(api.users.getCurrentUser, {});
  const projects = useQuery(api.projects.listByUser, {});

  if (user === undefined || projects === undefined) {
    return <OverviewSkeleton />;
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const lastActive =
    projects.length > 0
      ? formatDistanceToNow(new Date(projects[0].lastEditedAt), {
          addSuffix: true,
        })
      : "No activity";

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-5 lg:p-8 max-w-6xl">
      {/* Invite notifications */}
      <InviteNotifications />

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Row 1: Welcome (2 col) */}
        <WelcomeCard firstName={firstName} />

        {/* Row 2: Stat cards */}
        <StatCard
          label="Total Projects"
          value={totalProjects}
          icon={FolderOpen}
          delay={0.1}
        />
        <StatCard
          label="Active"
          value={activeProjects}
          icon={Activity}
          delay={0.13}
        />

        {/* Row 2 continued: Quick actions */}
        <QuickActionCard
          icon={Zap}
          title="Build with AI"
          description="Describe what you need"
          href="/dashboard/create"
          delay={0.16}
        />

        {/* Row 3: Recent projects (2 col) + workspace card */}
        <RecentProjectsCard projects={projects as Project[]} />

        {/* Stacked column: quick actions + workspace */}
        <div className="flex flex-col gap-3">
          <QuickActionCard
            icon={Layers}
            title="Templates"
            description="Start from a template"
            href="/templates"
            delay={0.2}
          />
          <QuickActionCard
            icon={Code}
            title="All Projects"
            description="View & manage"
            href="/dashboard/projects"
            delay={0.22}
          />
          <WorkspaceCard
            totalProjects={totalProjects}
            lastActive={lastActive}
          />
        </div>
      </div>
    </div>
  );
}
