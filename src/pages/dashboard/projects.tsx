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
import { BRAND_GRADIENT } from "@/lib/brand.ts";

type Project = Doc<"projects">;

function getProjectGradient(index: number): string {
  const gradients = [
    "linear-gradient(135deg, #3D4EF0 0%, #23A0FF 100%)",
    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    "linear-gradient(135deg, #3D4EF0 0%, #06B6D4 100%)",
    "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
    "linear-gradient(135deg, #0EA5E9 0%, #3D4EF0 100%)",
    "linear-gradient(135deg, #4F46E5 0%, #23A0FF 100%)",
  ];
  return gradients[index % gradients.length];
}

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/15 transition-all cursor-pointer"
      onClick={handleOpen}
    >
      {/* Project preview area */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{ background: getProjectGradient(index) }}
      >
        <div className="absolute inset-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-16 h-2 ml-2 rounded-full bg-white/15" />
          </div>
          <div className="p-3 space-y-2">
            <div className="w-3/4 h-2 rounded-full bg-white/15" />
            <div className="w-1/2 h-2 rounded-full bg-white/10" />
            <div className="flex gap-2 mt-2">
              <div className="w-8 h-4 rounded bg-white/15" />
              <div className="w-8 h-4 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
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
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
                <div className="absolute right-0 top-8 z-50 w-40 bg-popover rounded-lg border border-border shadow-lg py-1">
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
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
            {project.visibility === "public" ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {project.visibility === "public" ? "Public" : "Private"}
          </div>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
              project.status === "active"
                ? "bg-emerald-500/10 text-emerald-600"
                : project.status === "generating"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted text-muted-foreground"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-6 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer hover:shadow-lg hover:shadow-[#3D4EF0]/20 transition-all shrink-0"
          style={{ background: BRAND_GRADIENT }}
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
          className="flex items-center gap-3 mb-6 flex-wrap"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {(["all", "active", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                  filter === f
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{ background: BRAND_GRADIENT }}
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
