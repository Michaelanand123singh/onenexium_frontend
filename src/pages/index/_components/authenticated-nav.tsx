import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.ts";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

export default function AuthenticatedNav() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-6 right-6 z-20 flex items-center gap-3"
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25"
        style={{ background: BRAND_GRADIENT }}
      >
        Go to Dashboard
      </button>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/15">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center text-white text-xs font-bold">
          {user?.profile?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <span className="text-sm text-[#0C0F18] font-medium">
          {user?.profile?.name || "User"}
        </span>
      </div>
    </motion.div>
  );
}
