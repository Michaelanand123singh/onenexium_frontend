import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import SettingsContent from "./_components/settings-content.tsx";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-2xl px-6 space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">
            Please sign in to access settings
          </p>
          <SignInButton signInText="Sign In" />
          <button
            onClick={() => navigate("/")}
            className="text-sm text-primary hover:underline cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <SettingsContent />
      </Authenticated>
    </>
  );
}
