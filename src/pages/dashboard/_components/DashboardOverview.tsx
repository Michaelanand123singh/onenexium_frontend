import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  FolderOpen,
  Plus,
  ArrowRight,
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

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(project.lastEditedAt), {
    addSuffix: true,
  });

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.04 }}
      onClick={() => navigate(`/project/${project._id}`)}
      className="w-full flex items-center gap-3 py-3 hover:bg-foreground/[0.02] transition-colors cursor-pointer group text-left px-1 rounded-lg"
    >
      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-foreground/60">
          {project.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">
          {project.name}
        </p>
      </div>

      <span className="text-xs text-muted-foreground hidden sm:block">
        {timeAgo}
      </span>

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

      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.button>
  );
}

function OverviewSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Skeleton className="h-8 w-48 mb-1" />
      <Skeleton className="h-4 w-64 mb-10" />
      <Skeleton className="h-4 w-24 mb-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full mb-2 rounded-lg" />
      ))}
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

  const firstName = user?.name?.split(" ")[0] || "there";
  const recentProjects = projects.slice(0, 8);

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <InviteNotifications />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/dashboard/create")}
          className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </motion.button>
      </motion.div>

      {/* Project list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Recent
          </p>
          {projects.length > 8 && (
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              All projects
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No projects yet</p>
            <p className="text-xs text-muted-foreground mb-5">
              Create your first project to get started
            </p>
            <button
              onClick={() => navigate("/dashboard/create")}
              className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {recentProjects.map((project, i) => (
              <ProjectRow
                key={project._id}
                project={project as Project}
                index={i}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
