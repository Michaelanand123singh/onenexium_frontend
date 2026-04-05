import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { motion } from "motion/react";
import { Sparkles, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import PromptInput from "../dashboard/_components/PromptInput.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

export default function CreateProjectPage() {
  const user = useQuery(api.users.getCurrentUser, {});

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <div className="max-w-2xl w-full space-y-6">
          <Skeleton className="h-10 w-80 mx-auto" />
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

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="w-full max-w-2xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/10 mb-5"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3D4EF0]" />
            </motion.div>
            <span className="text-xs font-medium text-[#3D4EF0]">
              Powered by AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-[40px] font-bold text-foreground leading-tight tracking-tight text-balance"
          >
            What can OneNexium build
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              for you?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-muted-foreground text-sm md:text-base max-w-md mx-auto"
          >
            Describe what you want to build and AI will create it for you
          </motion.p>
        </motion.div>

        {/* Prompt input */}
        <PromptInput userName={firstName} />

        {/* Trusted line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8 text-xs text-muted-foreground"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Trusted by 100k+ users</span>
        </motion.div>
      </div>
    </div>
  );
}
