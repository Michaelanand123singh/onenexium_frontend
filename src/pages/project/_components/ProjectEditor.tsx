import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import EditorNavbar from "./EditorNavbar.tsx";
import EditorSidebar from "./EditorSidebar.tsx";
import EditorChat from "./EditorChat.tsx";
import EditorPreview from "./EditorPreview.tsx";
import SidebarPanel from "./panels/index.tsx";
import type { SidebarTab } from "./EditorSidebar.tsx";
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
import { AnimatePresence } from "motion/react";

export default function ProjectEditor({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SidebarTab | null>("chat");
  const project = useQuery(api.projects.getById, { projectId });

  // Loading
  if (project === undefined) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <div className="h-12 border-b border-[#0C0F18]/5 bg-white flex items-center px-4 gap-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-32" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-1">
          <div className="w-12 bg-[#F9FAFB] border-r border-[#0C0F18]/5" />
          <div className="w-[380px] border-r border-[#0C0F18]/5 p-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-20 w-3/4 rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <div className="flex-1 bg-[#F9FAFB] p-6">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found
  if (project === null) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <ErrorState>
          <ErrorStateHeader>
            <ErrorStateMedia variant="icon">
              <AlertTriangle />
            </ErrorStateMedia>
            <ErrorStateTitle>Project not found</ErrorStateTitle>
            <ErrorStateDescription className="text-[#0C0F18]/40">
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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <EditorNavbar project={project} />

      <div className="flex flex-1 overflow-hidden">
        {/* Icon sidebar */}
        <EditorSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Panel area */}
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <EditorChat
              key="chat"
              projectId={projectId}
              projectName={project.name}
            />
          )}
          {activeTab && activeTab !== "chat" && (
            <SidebarPanel key={activeTab} tab={activeTab} />
          )}
        </AnimatePresence>

        {/* Preview */}
        <EditorPreview project={project} />
      </div>
    </div>
  );
}
