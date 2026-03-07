import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import EditorNavbar from "./EditorNavbar.tsx";
import EditorChat from "./EditorChat.tsx";
import EditorPreview from "./EditorPreview.tsx";
import {
  ErrorState,
  ErrorStateHeader,
  ErrorStateMedia,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateContent,
} from "@/components/ui/error-state.tsx";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

export default function ProjectEditor({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const navigate = useNavigate();
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const project = useQuery(api.projects.getById, { projectId });

  // Loading
  if (project === undefined) {
    return (
      <div className="h-screen bg-[#0F1117] flex flex-col">
        <div className="h-12 border-b border-white/5 bg-[#0F1117] flex items-center px-4 gap-3">
          <Skeleton className="h-6 w-6 bg-white/5 rounded" />
          <Skeleton className="h-5 w-32 bg-white/5" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-7 w-20 bg-white/5 rounded-lg" />
            <Skeleton className="h-7 w-20 bg-white/5 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-1">
          <div className="w-[380px] border-r border-white/5 p-4 space-y-3">
            <Skeleton className="h-10 w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-20 w-3/4 bg-white/5 rounded-lg" />
            <Skeleton className="h-16 w-full bg-white/5 rounded-lg" />
          </div>
          <div className="flex-1 bg-[#0F1117] p-6">
            <Skeleton className="h-full w-full bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found (query threw or returned null)
  if (project === null) {
    return (
      <div className="h-screen bg-[#0F1117] flex items-center justify-center">
        <ErrorState>
          <ErrorStateHeader>
            <ErrorStateMedia variant="icon">
              <AlertTriangle />
            </ErrorStateMedia>
            <ErrorStateTitle className="text-white">
              Project not found
            </ErrorStateTitle>
            <ErrorStateDescription className="text-white/40">
              This project may have been deleted or you don't have access.
            </ErrorStateDescription>
          </ErrorStateHeader>
          <ErrorStateContent>
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3D4EF0, #23A0FF)",
              }}
            >
              Back to Dashboard
            </Button>
          </ErrorStateContent>
        </ErrorState>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F1117] flex flex-col overflow-hidden">
      <EditorNavbar
        project={project}
        chatCollapsed={chatCollapsed}
        onToggleChat={() => setChatCollapsed(!chatCollapsed)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat sidebar */}
        {!chatCollapsed && (
          <EditorChat projectId={projectId} projectName={project.name} />
        )}

        {/* Preview */}
        <EditorPreview project={project} />
      </div>
    </div>
  );
}
