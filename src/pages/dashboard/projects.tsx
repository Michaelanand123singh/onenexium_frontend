import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Globe,
  Lock,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty.tsx";

type Project = Doc<"projects">;

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const removeProject = useMutation(api.projects.remove);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await removeProject({ projectId: project._id });
      toast.success("Project deleted");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleOpen = () => {
    navigate(`/project/${project._id}`);
  };

  const timeAgo = formatDistanceToNow(new Date(project.lastEditedAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group relative bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleOpen}
    >
      {/* Project preview area */}
      <div className="h-36 relative bg-foreground/[0.03] flex items-center justify-center">
        <div className="absolute inset-5 rounded-2xl border border-border bg-background/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
            <div className="w-2 h-2 rounded-full bg-foreground/10" />
            <div className="w-16 h-1.5 ml-2 rounded-full bg-foreground/[0.06]" />
          </div>
          <div className="p-3 space-y-2">
            <div className="w-3/4 h-1.5 rounded-full bg-foreground/[0.06]" />
            <div className="w-1/2 h-1.5 rounded-full bg-foreground/[0.04]" />
            <div className="flex gap-2 mt-3">
              <div className="w-10 h-4 rounded-lg bg-foreground/[0.06]" />
              <div className="w-10 h-4 rounded-lg bg-foreground/[0.04]" />
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Edited {timeAgo}
            </p>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-8 z-50 w-40 bg-popover rounded-xl border border-border shadow-lg py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/70 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium border border-border rounded-full px-2 py-0.5">
            {project.visibility === "public" ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {project.visibility === "public" ? "Public" : "Private"}
          </div>
          <span
            className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
              project.status === "active"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                : project.status === "generating"
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                  : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const projects = useQuery(api.projects.listByUser, {});
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

  if (projects === undefined) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-8 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </motion.div>

      {/* Search and filters */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8 flex-wrap"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/20 transition-colors shadow-sm"
            />
          </div>

          <div className="flex items-center rounded-xl p-1 border border-border h-10 shadow-sm">
            {(["all", "active", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
                  filter === f
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Project grid */}
      {filtered.length === 0 && projects.length > 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No matching projects</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filter
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to get started
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <button
              onClick={() => navigate("/dashboard/create")}
              className="h-10 px-5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
