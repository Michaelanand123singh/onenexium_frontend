import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Plus,
  ChevronDown,
  ArrowRight,
  Globe,
  Lock,
  ShieldCheck,
  BarChart3,
  Store,
  Contact,
  Loader2,
  Check,
} from "lucide-react";

const SUGGESTION_PILLS = [
  { icon: BarChart3, text: "Create an AI SaaS dashboard" },
  { icon: Store, text: "Build an e-commerce platform" },
  { icon: Contact, text: "Design a portfolio site" },
];

type GeneratingStep = {
  label: string;
  done: boolean;
};

export default function CreateProjectPage() {
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

    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
      );
      setSteps((prev) =>
        prev.map((step, idx) => (idx <= i ? { ...step, done: true } : step))
      );
    }

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

  const handleSuggestionClick = (text: string) => {
    setPrompt(text.toLowerCase() + "...");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 lg:p-10">
      <div className="w-full max-w-3xl">
        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {SUGGESTION_PILLS.map((pill) => (
            <button
              key={pill.text}
              onClick={() => handleSuggestionClick(pill.text)}
              disabled={status !== "idle"}
              className="px-4 py-1.5 rounded-full border border-border shadow-sm text-sm font-medium flex items-center gap-2 hover:bg-accent transition-all cursor-pointer disabled:opacity-40"
            >
              <pill.icon className="w-4 h-4 text-primary" />
              {pill.text}
            </button>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight text-center mb-12 text-balance"
        >
          {"What will you".split("").map((char, i) => (
            <motion.span
              key={`l1-${i}`}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.2 + i * 0.025,
                duration: 0.35,
                ease: "easeOut",
              }}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <br />
          {"build today?".split("").map((char, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.5 + i * 0.025,
                duration: 0.35,
                ease: "easeOut",
              }}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Prompt input box - matching landing page */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full relative"
        >
          <div className="rounded-3xl p-2 border border-border shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the app you want to build in detail..."
              disabled={status !== "idle"}
              className="w-full bg-transparent border-none outline-none resize-none px-6 pt-6 pb-20 text-lg min-h-[160px] placeholder:text-muted-foreground/50 disabled:opacity-50"
            />

            {/* Bottom toolbar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/50 backdrop-blur-xl rounded-2xl p-2 border border-border">
              <div className="flex items-center gap-2">
                {/* Attach */}
                <button
                  disabled={status !== "idle"}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-[18px] h-[18px]" />
                </button>

                {/* Visibility toggle */}
                <button
                  onClick={() =>
                    setVisibility((v) =>
                      v === "public" ? "private" : "public"
                    )
                  }
                  disabled={status !== "idle"}
                  className="flex items-center gap-2 px-3 h-10 rounded-xl border border-border hover:bg-accent hover:shadow-sm transition-all text-xs font-medium cursor-pointer disabled:opacity-40"
                >
                  {visibility === "public" ? (
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  {visibility === "public" ? "Public" : "Private"}
                  <ChevronDown className="w-[10px] h-[10px] ml-0.5 text-muted-foreground" />
                </button>

                {/* AI model badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-xl border border-border text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Nexium AI v4
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || status !== "idle"}
                className="h-10 px-6 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30"
              >
                {status === "generating" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating
                  </>
                ) : status === "done" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Done
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <div className="mt-4 flex justify-center items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>Your prompts are private and secure</span>
          </div>
        </motion.div>

        {/* Generation steps */}
        <AnimatePresence>
          {status === "generating" && steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-2.5 overflow-hidden max-w-md mx-auto"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  {step.done ? (
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <Loader2 className="w-6 h-6 text-primary animate-spin shrink-0" />
                  )}
                  <span
                    className={
                      step.done
                        ? "text-muted-foreground"
                        : "text-foreground font-medium"
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
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <Check className="w-4 h-4" />
                Project created successfully!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
