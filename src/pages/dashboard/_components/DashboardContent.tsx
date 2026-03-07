import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "@/components/ui/signin.tsx";
import { motion } from "motion/react";
import {
  Sparkles,
  Globe,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import PromptInput from "./PromptInput.tsx";
import ProjectGrid from "./ProjectGrid.tsx";
import { BRAND_GRADIENT, LOGO_URL } from "@/lib/brand.ts";

export default function DashboardContent() {
  const user = useQuery(api.users.getCurrentUser, {});
  const projects = useQuery(api.projects.listByUser, {});
  const navigate = useNavigate();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-[#0C0F18]/5 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 pt-24 space-y-6">
          <Skeleton className="h-10 w-96 mx-auto" />
          <Skeleton className="h-14 w-full" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b border-[#0C0F18]/5 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src={LOGO_URL}
                alt="OneNexium"
                className="h-7 w-auto"
              />
              <span className="text-[15px] font-bold text-[#0C0F18] tracking-tight">
                OneNexium
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* User menu */}
            <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: BRAND_GRADIENT }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-[#0C0F18] font-medium hidden sm:block">
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0C0F18]/40" />
            </button>
            <SignInButton
              signOutText="Sign Out"
              variant="ghost"
              size="sm"
              className="text-[#0C0F18]/40 text-xs cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6">
        {/* Prompt hero area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-16 pb-12 md:pt-24 md:pb-16"
        >
          {/* Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/10 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#3D4EF0]" />
              <span className="text-xs font-medium text-[#3D4EF0]">
                Powered by AI
              </span>
            </div>
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0C0F18] leading-tight tracking-tight text-balance">
              What can OneNexium build
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                for you?
              </span>
            </h1>
            <p className="mt-3 text-[#0C0F18]/40 text-sm md:text-base max-w-md mx-auto">
              Build stunning websites, SaaS apps, and more by chatting with AI
            </p>
          </div>

          {/* Prompt input */}
          <PromptInput userName={user?.name?.split(" ")[0] || "there"} />

          {/* Trusted line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-8 text-xs text-[#0C0F18]/30"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Trusted by 100k+ users</span>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-[#0C0F18]/5" />

        {/* Projects section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="py-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0C0F18]">
              Your Projects
            </h2>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/20"
              style={{ background: BRAND_GRADIENT }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>

          <ProjectGrid projects={projects ?? []} />
        </motion.div>
      </main>
    </div>
  );
}
