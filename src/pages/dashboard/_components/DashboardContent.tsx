import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { LayoutDashboard, Users, Clock, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

export default function DashboardContent() {
  const user = useQuery(api.users.getCurrentUser, {});
  const navigate = useNavigate();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="w-full max-w-5xl px-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Header */}
      <header className="border-b border-[#0C0F18]/5 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.hercules.app/file_GpEbTAUqPZSaqCQvtLDKCwlF"
              alt="OneNexium"
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-[#0C0F18] tracking-tight">
              OneNexium
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-[#0C0F18]/50 hover:text-[#0C0F18] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/15">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: BRAND_GRADIENT }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-[#0C0F18] font-medium">
                {user?.name || "User"}
              </span>
            </div>
            <SignInButton
              signOutText="Sign Out"
              variant="ghost"
              size="sm"
              className="text-[#0C0F18]/50 cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#0C0F18] mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-[#0C0F18]/50 mb-8">
            Here's what's happening with your account.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            {
              icon: LayoutDashboard,
              label: "Projects",
              value: "0",
              description: "Active projects",
            },
            {
              icon: Users,
              label: "Team Members",
              value: "1",
              description: "People in your workspace",
            },
            {
              icon: Clock,
              label: "Uptime",
              value: "99.9%",
              description: "Service reliability",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-white rounded-xl border border-[#0C0F18]/5 p-6 hover:shadow-md hover:shadow-[#3D4EF0]/5 transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-medium text-[#0C0F18]/60">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#0C0F18]">{stat.value}</p>
              <p className="text-xs text-[#0C0F18]/40 mt-1">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-[#0C0F18] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Create New Project",
                description:
                  "Start building something amazing with AI assistance",
              },
              {
                title: "Invite Team Members",
                description:
                  "Collaborate with your team in real-time",
              },
              {
                title: "Browse Templates",
                description:
                  "Kickstart your project with pre-built templates",
              },
              {
                title: "View Documentation",
                description:
                  "Learn how to get the most out of OneNexium",
              },
            ].map((action) => (
              <button
                key={action.title}
                onClick={() => toast.info("Coming soon in a future milestone!")}
                className="text-left bg-white rounded-xl border border-[#0C0F18]/5 p-5 hover:border-[#3D4EF0]/20 hover:shadow-md hover:shadow-[#3D4EF0]/5 transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-[#0C0F18] group-hover:text-[#3D4EF0] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-[#0C0F18]/40 mt-1">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
