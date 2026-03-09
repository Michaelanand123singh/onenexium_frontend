import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import DashboardContent from "./_components/DashboardContent.tsx";
import OnboardingGate from "./_components/OnboardingGate.tsx";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-4xl px-6 space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/60 text-lg">Please sign in to access the dashboard</p>
          <SignInButton
            signInText="Sign In"
            className="text-white"
            style={{ background: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}
          />
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#3D4EF0] hover:underline cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <OnboardingGate>
          <DashboardContent />
        </OnboardingGate>
      </Authenticated>
    </>
  );
}
