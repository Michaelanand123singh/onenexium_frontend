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
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { formatDistanceToNow } from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

type Project = Doc<"projects">;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  displayValue,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value?: number;
  displayValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          {displayValue ?? value}
        </p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
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

  const gradients = [
    "linear-gradient(135deg, #3D4EF0 0%, #23A0FF 100%)",
    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    "linear-gradient(135deg, #3D4EF0 0%, #06B6D4 100%)",
    "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
  ];

  const timeAgo = formatDistanceToNow(new Date(project.lastEditedAt), {
    addSuffix: true,
  });

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
      onClick={() => navigate(`/project/${project._id}`)}
      className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer group text-left"
    >
      {/* Color swatch */}
      <div
        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
        style={{ background: gradients[index % gradients.length] }}
      >
        <span className="text-white text-xs font-bold">
          {project.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">
          {project.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          Edited {timeAgo}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
          project.status === "active"
            ? "bg-emerald-500/10 text-emerald-600"
            : project.status === "generating"
              ? "bg-amber-500/10 text-amber-600"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {project.status}
      </span>

      {/* Arrow */}
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
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
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

  // Find the latest edited project timestamp
  const lastActive =
    projects.length > 0
      ? formatDistanceToNow(new Date(projects[0].lastEditedAt), {
          addSuffix: true,
        })
      : "No activity";

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              {getGreeting()},{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                {firstName}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Here{"'"}s an overview of your workspace
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-[#3D4EF0]/20 transition-all cursor-pointer shrink-0"
            style={{ background: BRAND_GRADIENT }}
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
          color="#3D4EF0"
          delay={0.1}
        />
        <StatCard
          label="Active"
          value={activeProjects}
          icon={Activity}
          color="#10B981"
          delay={0.15}
        />
        <StatCard
          label="Archived"
          value={archivedProjects}
          icon={Archive}
          color="#8B5CF6"
          delay={0.2}
        />
        <StatCard
          label="Last Active"
          displayValue={lastActive}
          icon={Clock}
          color="#F59E0B"
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
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#3D4EF0]/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#3D4EF0]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Build with AI
            </p>
            <p className="text-xs text-muted-foreground">
              Describe what you need
            </p>
          </div>
        </button>
        <button
          onClick={() => navigate("/templates")}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Browse Templates
            </p>
            <p className="text-xs text-muted-foreground">
              Start from a template
            </p>
          </div>
        </button>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              All Projects
            </p>
            <p className="text-xs text-muted-foreground">
              View and manage projects
            </p>
          </div>
        </button>
      </motion.div>

      {/* Recent projects */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            Recent Projects
          </h2>
          {projects.length > 5 && (
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="text-sm text-primary hover:underline cursor-pointer font-medium"
            >
              View all
            </button>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white"
              style={{ background: BRAND_GRADIENT }}
            >
              <FolderOpen className="w-7 h-7" />
            </div>
            <p className="text-foreground font-semibold mb-1">
              No projects yet
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to get started
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{ background: BRAND_GRADIENT }}
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
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
  );
}
