import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import ProjectEditor from "./_components/ProjectEditor.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function ProjectEditorPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    navigate("/dashboard");
    return null;
  }

  return (
    <>
      <AuthLoading>
        <div className="h-screen bg-[#0C0F18] flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md px-6">
            <Skeleton className="h-10 w-48 bg-white/5" />
            <Skeleton className="h-64 w-full bg-white/5" />
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="h-screen bg-[#0C0F18] flex flex-col items-center justify-center gap-4">
          <p className="text-white/50 text-sm">Sign in to access your project</p>
          <SignInButton
            signInText="Sign In"
            className="text-white"
            style={{ background: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}
          />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-white/30 hover:text-white/60 cursor-pointer"
          >
            Back to dashboard
          </button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <ProjectEditor projectId={projectId as Id<"projects">} />
      </Authenticated>
    </>
  );
}
