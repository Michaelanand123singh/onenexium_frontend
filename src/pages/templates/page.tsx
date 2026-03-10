import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ChevronDown, LayoutGrid, ArrowLeft } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import AnimatedBackground from "@/components/animated-background.tsx";
import TemplateGrid from "./_components/template-grid.tsx";
import { BRAND_GRADIENT, LOGO_URL } from "@/lib/brand.ts";
import { toast } from "sonner";

function TemplatesContent() {
  const user = useQuery(api.users.getCurrentUser, {});
  const navigate = useNavigate();

  const handleUseTemplate = (prompt: string) => {
    // Copy prompt and navigate to dashboard
    toast.success("Template prompt copied! Redirecting to dashboard...");
    // Small delay so toast shows before navigation
    setTimeout(() => {
      navigate("/dashboard", { state: { prompt } });
    }, 600);
  };

  if (user === undefined) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 border-b border-foreground/5 bg-background/60 backdrop-blur-xl px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 space-y-6">
          <Skeleton className="h-10 w-80 mx-auto" />
          <Skeleton className="h-12 w-96 mx-auto" />
          <div className="grid grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <AnimatedBackground />

      {/* Top navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="sticky top-0 z-50 border-b border-foreground/5 bg-background/60 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <motion.img
                src={LOGO_URL}
                alt="OneNexium"
                className="h-7 w-auto"
              />
              <span className="text-[15px] font-bold text-foreground tracking-tight">
                OneNexium
              </span>
            </button>

            {/* Nav links */}
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3 py-1.5 rounded-lg text-sm text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm text-foreground font-medium bg-foreground/5 cursor-default"
              >
                Templates
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-foreground/[0.03] transition-colors cursor-pointer">
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: BRAND_GRADIENT }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </motion.div>
              <span className="text-sm text-foreground font-medium hidden sm:block">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-foreground/40" />
            </button>
            <SignInButton
              signOutText="Sign Out"
              variant="ghost"
              size="sm"
              className="text-foreground/40 text-xs cursor-pointer"
            />
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="pt-12 pb-8 md:pt-16 md:pb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/10 mb-5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#3D4EF0]" />
            <span className="text-xs font-medium text-[#3D4EF0]">Templates Gallery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3"
          >
            Start with a{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
              template
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-foreground/40 max-w-md mx-auto"
          >
            Browse pre-built templates and remix them into your own project
          </motion.p>
        </motion.div>

        {/* Template grid */}
        <div className="pb-20">
          <TemplateGrid onUseTemplate={handleUseTemplate} />
        </div>
      </main>
    </div>
  );
}

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-5xl px-6 space-y-6">
            <Skeleton className="h-12 w-64 mx-auto" />
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/60 text-lg">Please sign in to browse templates</p>
          <SignInButton
            signInText="Sign In"
            className="text-white"
            style={{ background: BRAND_GRADIENT }}
          />
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-[#3D4EF0] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </button>
        </div>
      </Unauthenticated>
      <Authenticated>
        <TemplatesContent />
      </Authenticated>
    </>
  );
}
