import { motion } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Globe,
  Lock,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty.tsx";

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

// Generate a deterministic gradient background for project cards
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white rounded-xl border border-[#0C0F18]/5 overflow-hidden hover:shadow-lg hover:shadow-[#3D4EF0]/5 hover:border-[#3D4EF0]/15 transition-all cursor-pointer"
      onClick={handleOpen}
    >
      {/* Project preview area */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{ background: getProjectGradient(index) }}
      >
        {/* Decorative mock elements */}
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
            <h3 className="text-sm font-semibold text-[#0C0F18] truncate">
              {project.name}
            </h3>
            <p className="text-xs text-[#0C0F18]/35 mt-0.5 truncate">
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
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#0C0F18]/25 hover:text-[#0C0F18]/60 hover:bg-[#0C0F18]/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
                <div className="absolute right-0 top-8 z-50 w-40 bg-white rounded-lg border border-[#0C0F18]/8 shadow-lg shadow-[#0C0F18]/5 py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#0C0F18]/70 hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#0C0F18]/5">
          <div className="flex items-center gap-1 text-[10px] text-[#0C0F18]/30 font-medium">
            {project.visibility === "public" ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {project.visibility === "public" ? "Public" : "Private"}
          </div>
          <div
            className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
            style={{ background: BRAND_GRADIENT }}
          >
            {project.status}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            Describe what you want to build above and we'll create it for you
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, i) => (
        <ProjectCard key={project._id} project={project} index={i} />
      ))}
    </div>
  );
}
