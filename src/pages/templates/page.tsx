import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import TemplateGrid from "./_components/template-grid.tsx";
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
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-medium tracking-tight text-balance">
          {"Start with a template".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.1 + i * 0.02,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mt-2"
        >
          Browse pre-built templates and remix them into your own project
        </motion.p>
      </motion.div>

      {/* Template grid */}
      <TemplateGrid onUseTemplate={handleUseTemplate} />
    </div>
  );
}
