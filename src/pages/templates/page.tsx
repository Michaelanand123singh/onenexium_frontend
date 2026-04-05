import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import TemplateGrid from "./_components/template-grid.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";
import { toast } from "sonner";

export default function TemplatesPage() {
  const navigate = useNavigate();

  const handleUseTemplate = (prompt: string) => {
    toast.success("Template prompt copied! Redirecting...");
    setTimeout(() => {
      navigate("/dashboard/create", { state: { prompt } });
    }, 600);
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D4EF0]/5 border border-[#3D4EF0]/10 mb-5"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#3D4EF0]" />
          <span className="text-xs font-medium text-[#3D4EF0]">
            Templates Gallery
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground tracking-tight mb-2"
        >
          Start with a{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            template
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground max-w-md mx-auto text-sm"
        >
          Browse pre-built templates and remix them into your own project
        </motion.p>
      </motion.div>

      {/* Template grid */}
      <TemplateGrid onUseTemplate={handleUseTemplate} />
    </div>
  );
}
