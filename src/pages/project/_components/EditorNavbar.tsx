import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  ArrowLeft,
  Globe,
  Lock,
  Pencil,
  Check,
  X,
  Share2,
  Rocket,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

export default function EditorNavbar({
  project,
}: {
  project: Doc<"projects">;
}) {
  const navigate = useNavigate();
  const renameProject = useMutation(api.projects.rename);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);

  const handleRename = async () => {
    if (!nameInput.trim()) {
      setNameInput(project.name);
      setIsRenaming(false);
      return;
    }
    try {
      await renameProject({
        projectId: project._id,
        name: nameInput.trim(),
      });
      setIsRenaming(false);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to rename project");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") {
      setNameInput(project.name);
      setIsRenaming(false);
    }
  };

  return (
    <header className="h-12 shrink-0 border-b border-[#0C0F18]/5 bg-white/80 backdrop-blur-xl flex items-center px-3 gap-2">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0C0F18]/30 hover:text-[#0C0F18]/70 hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer"
          title="Back to dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#0C0F18]/8 mx-1" />

        {/* Logo */}
        <img
          src="https://cdn.hercules.app/file_GpEbTAUqPZSaqCQvtLDKCwlF"
          alt="OneNexium"
          className="h-5 w-auto"
        />
      </div>

      {/* Center - Project name */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {isRenaming ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-[#0C0F18]/[0.03] border border-[#0C0F18]/10 rounded-md px-2.5 py-1 text-sm text-[#0C0F18]/80 outline-none focus:border-[#3D4EF0]/50 w-48"
              autoFocus
            />
            <button
              onClick={handleRename}
              className="w-6 h-6 rounded flex items-center justify-center text-green-600 hover:bg-[#0C0F18]/5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setNameInput(project.name);
                setIsRenaming(false);
              }}
              className="w-6 h-6 rounded flex items-center justify-center text-[#0C0F18]/30 hover:text-[#0C0F18]/60 hover:bg-[#0C0F18]/5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsRenaming(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer group"
          >
            <span className="text-sm font-medium text-[#0C0F18]/70 truncate max-w-[200px]">
              {project.name}
            </span>
            <Pencil className="w-3 h-3 text-[#0C0F18]/20 group-hover:text-[#0C0F18]/50 transition-colors" />
          </button>
        )}

        <div className="flex items-center gap-1 text-[10px] text-[#0C0F18]/25 font-medium">
          {project.visibility === "public" ? (
            <Globe className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => toast.info("Coming soon in a future milestone!")}
          className="h-7 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium text-[#0C0F18]/40 hover:text-[#0C0F18]/70 hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
        <button
          onClick={() => toast.info("Coming soon in a future milestone!")}
          className="h-7 px-3.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/20 cursor-pointer"
          style={{ background: BRAND_GRADIENT }}
        >
          <Rocket className="w-3.5 h-3.5" />
          Publish
        </button>
      </div>
    </header>
  );
}
