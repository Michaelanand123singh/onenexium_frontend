import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const suggestions = [
  "Build a personal portfolio website",
  "Create a restaurant website",
  "Build a startup landing page",
  "Create a blog platform",
];

const generationSteps = [
  "Analyzing your prompt...",
  "Designing layout structure...",
  "Generating components...",
  "Applying styles and animations...",
  "Building your website...",
];

type GenerationState = "idle" | "generating" | "complete";

export default function PromptHero() {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<GenerationState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a website.");
      return;
    }

    setState("generating");
    setCurrentStep(0);

    // Walk through generation steps
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setState("complete");
  };

  const handleReset = () => {
    setState("idle");
    setPrompt("");
    setCurrentStep(0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-[#3D4EF0]/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#23A0FF]/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3D4EF0]/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-[820px] mx-auto px-6 relative z-10 w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#3D4EF0]/10 text-[#3D4EF0] dark:text-[#23A0FF] px-4 py-1.5 rounded-full text-sm font-medium">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#3D4EF0] dark:bg-[#23A0FF] rounded-full"
            />
            Powered by AI
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-center text-balance"
        >
          Build a Website with{" "}
          <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
            One Prompt
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mt-5 text-center max-w-xl mx-auto leading-relaxed"
        >
          Describe your idea and OneNexium will generate a complete website
          instantly.
        </motion.p>

        {/* Prompt Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10"
        >
          <div className="relative">
            {/* Glow behind prompt box */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3D4EF0]/25 to-[#23A0FF]/25 rounded-[20px] blur-xl opacity-60" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#3D4EF0]/40 to-[#23A0FF]/40 rounded-[20px]" />

            {/* Prompt container */}
            <div className="relative bg-card rounded-[19px] p-1.5">
              <AnimatePresence mode="wait">
                {state === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Textarea area */}
                    <div className="relative">
                      <Sparkles className="absolute left-4 top-4 h-5 w-5 text-[#3D4EF0] dark:text-[#23A0FF]" />
                      <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate();
                          }
                        }}
                        placeholder="Create a modern SaaS landing page for a marketing automation platform"
                        rows={3}
                        className="w-full pl-12 pr-4 pt-4 pb-3 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base resize-none focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Bottom bar with generate button */}
                    <div className="flex items-center justify-between px-3 pb-2.5">
                      <span className="text-xs text-muted-foreground/50 pl-1">
                        Press Enter to generate
                      </span>
                      <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="group flex items-center gap-2 text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-[0_0_24px_rgba(61,78,240,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                      >
                        Generate Website
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {state === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-8"
                  >
                    {/* Current prompt */}
                    <div className="flex items-start gap-3 mb-6">
                      <Sparkles className="h-5 w-5 text-[#3D4EF0] dark:text-[#23A0FF] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {prompt}
                      </p>
                    </div>

                    {/* Generation steps */}
                    <div className="space-y-3">
                      {generationSteps.map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={
                            index <= currentStep
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                          }
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          {index < currentStep ? (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : index === currentStep ? (
                            <Loader2 className="w-5 h-5 text-[#3D4EF0] dark:text-[#23A0FF] animate-spin flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-border flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              index <= currentStep
                                ? "text-foreground"
                                : "text-muted-foreground/40"
                            }`}
                          >
                            {step}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${((currentStep + 1) / generationSteps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}

                {state === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 py-8"
                  >
                    {/* Success header */}
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center mx-auto mb-3"
                      >
                        <Check className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-semibold">
                        Your website is ready!
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generated from: {'"'}
                        {prompt.slice(0, 50)}
                        {prompt.length > 50 ? "..." : ""}
                        {'"'}
                      </p>
                    </div>

                    {/* Mini generated preview */}
                    <div className="bg-muted/50 rounded-xl border border-border overflow-hidden mb-5">
                      <div className="bg-muted px-3 py-2 flex items-center gap-2 border-b border-border">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            my-website.onenexium.app
                          </span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-2 w-14 bg-foreground/10 rounded" />
                          <div className="flex gap-2">
                            <div className="h-1.5 w-8 bg-foreground/10 rounded" />
                            <div className="h-1.5 w-8 bg-foreground/10 rounded" />
                            <div className="h-1.5 w-8 bg-foreground/10 rounded" />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 w-3/4 bg-foreground/20 rounded" />
                            <div className="h-2.5 w-1/2 bg-foreground/20 rounded" />
                            <div className="h-1.5 w-full bg-foreground/8 rounded mt-2" />
                            <div className="h-1.5 w-4/5 bg-foreground/8 rounded" />
                            <div className="h-5 w-20 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded mt-2" />
                          </div>
                          <div className="hidden sm:block w-28 h-20 bg-gradient-to-br from-[#3D4EF0]/10 to-[#23A0FF]/10 rounded-lg" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleReset}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Generate another
                      </button>
                      <button
                        onClick={() =>
                          toast.info(
                            "Website deployment is coming soon! This is a demo.",
                          )
                        }
                        className="group flex items-center gap-2 text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-[0_0_24px_rgba(61,78,240,0.5)] transition-all duration-300 cursor-pointer"
                      >
                        View Website
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Prompt Suggestions */}
        <AnimatePresence>
          {state === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <p className="text-center text-xs text-muted-foreground/60 mb-3">
                Try one of these ideas
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.08 }}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.15 },
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs font-medium text-muted-foreground bg-muted/60 hover:bg-muted hover:text-foreground border border-border/60 hover:border-[#3D4EF0]/30 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer hover:shadow-[0_0_12px_rgba(61,78,240,0.08)]"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trusted by line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-muted-foreground/40 uppercase tracking-widest font-medium">
            Trusted by 10,000+ builders worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}
