import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Sparkles,
  ArrowUp,
  Loader2,
  Check,
  Globe,
  Lock,
} from "lucide-react";

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

const SUGGESTIONS = [
  { label: "Landing page", icon: "🌐" },
  { label: "SaaS App", icon: "🚀" },
  { label: "Personal website", icon: "👤" },
  { label: "E-commerce store", icon: "🛍️" },
  { label: "Dashboard", icon: "📊" },
  { label: "Blog", icon: "✍️" },
];

type GeneratingStep = {
  label: string;
  done: boolean;
};

export default function PromptInput({ userName }: { userName: string }) {
  const [prompt, setPrompt] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [steps, setSteps] = useState<GeneratingStep[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const createProject = useMutation(api.projects.create);

  const handleGenerate = async () => {
    if (!prompt.trim() || status === "generating") return;

    setStatus("generating");
    const generationSteps = [
      "Understanding your prompt...",
      "Designing the layout...",
      "Generating components...",
      "Finalizing your project...",
    ];

    setSteps(generationSteps.map((label) => ({ label, done: false })));

    // Simulate step-by-step generation
    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));
      setSteps((prev) =>
        prev.map((step, idx) => (idx <= i ? { ...step, done: true } : step))
      );
    }

    // Create the project
    try {
      const projectId = await createProject({
        name: prompt.trim().slice(0, 60),
        description: prompt.trim(),
        prompt: prompt.trim(),
        visibility,
      });
      setStatus("done");
      setTimeout(() => {
        navigate(`/project/${projectId}`);
      }, 1200);
    } catch (error) {
      setStatus("idle");
      setSteps([]);
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleSuggestionClick = (label: string) => {
    setPrompt(`Create a ${label.toLowerCase()} for my...`);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Input container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Glow effect behind the input */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-[0.08] blur-xl pointer-events-none"
          style={{ background: BRAND_GRADIENT }}
        />

        <div className="relative bg-white rounded-2xl border border-[#0C0F18]/8 shadow-sm shadow-[#3D4EF0]/5 overflow-hidden transition-all focus-within:border-[#3D4EF0]/25 focus-within:shadow-md focus-within:shadow-[#3D4EF0]/10">
          <div className="flex items-start gap-3 p-4">
            <div
              className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
              style={{ background: BRAND_GRADIENT }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask OneNexium to create a landing page for my...`}
              rows={2}
              disabled={status !== "idle"}
              className="flex-1 resize-none bg-transparent text-[#0C0F18] text-sm md:text-[15px] leading-relaxed placeholder:text-[#0C0F18]/25 outline-none disabled:opacity-50 min-h-[52px]"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            {/* Visibility toggle */}
            <button
              onClick={() =>
                setVisibility((v) => (v === "public" ? "private" : "public"))
              }
              disabled={status !== "idle"}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#0C0F18]/40 hover:text-[#0C0F18]/60 hover:bg-[#0C0F18]/[0.03] transition-colors cursor-pointer disabled:opacity-40"
            >
              {visibility === "public" ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              {visibility === "public" ? "Public" : "Private"}
            </button>

            {/* Send button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status !== "idle"}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-30 cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20"
              style={{ background: BRAND_GRADIENT }}
            >
              {status === "generating" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "done" ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Generation steps */}
      <AnimatePresence>
        {status === "generating" && steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2.5 text-sm"
              >
                {step.done ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <Loader2 className="w-5 h-5 text-[#3D4EF0] animate-spin" />
                )}
                <span
                  className={
                    step.done ? "text-[#0C0F18]/60" : "text-[#3D4EF0] font-medium"
                  }
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done message */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" />
              Project created successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion pills */}
      <AnimatePresence>
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5"
          >
            <span className="text-xs text-[#0C0F18]/25 mr-1">Try one</span>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                onClick={() => handleSuggestionClick(s.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C0F18]/[0.03] border border-[#0C0F18]/5 text-xs font-medium text-[#0C0F18]/50 hover:bg-[#3D4EF0]/5 hover:border-[#3D4EF0]/15 hover:text-[#3D4EF0] transition-all cursor-pointer"
              >
                <span>{s.icon}</span>
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
