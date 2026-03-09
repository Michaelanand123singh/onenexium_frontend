import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useState } from "react";
import OnboardingFlow from "./OnboardingFlow.tsx";

export default function OnboardingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.users.getCurrentUser, {});
  const [dismissed, setDismissed] = useState(false);

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  // Show onboarding if not completed and not dismissed
  if (user && !user.hasCompletedOnboarding && !dismissed) {
    return (
      <OnboardingFlow
        userName={user.name || ""}
        onComplete={() => setDismissed(true)}
      />
    );
  }

  // Show dashboard
  return <>{children}</>;
}
