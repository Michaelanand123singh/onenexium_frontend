import { motion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Monitor, Smartphone, Layers, FileText } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const DEMO_PROMPT = "Make a coffee shop website";

const GENERATED_PAGES = [
  { name: "Home", active: true },
  { name: "Menu", active: false },
  { name: "About", active: false },
  { name: "Contact", active: false },
];

const UI_ELEMENTS = [
  { label: "Hero Banner", w: "100%", h: "80px", color: "#3D4EF0" },
  { label: "Nav Bar", w: "100%", h: "28px", color: "#23A0FF" },
  { label: "Menu Grid", w: "100%", h: "120px", color: "#6366f1" },
  { label: "Testimonials", w: "100%", h: "60px", color: "#3D4EF0" },
  { label: "Footer", w: "100%", h: "40px", color: "#23A0FF" },
];

type DemoPhase = "idle" | "typing" | "generating" | "done";

export default function DemoGenerator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [typedText, setTypedText] = useState("");
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");
  const [generationStep, setGenerationStep] = useState(0);

  const GENERATION_STEPS = [
    "Analyzing prompt...",
    "Designing layout...",
    "Generating pages...",
    "Adding components...",
    "Optimizing for mobile...",
    "Done!",
  ];

  // Auto-start typing when section comes into view
  useEffect(() => {
    if (isInView && phase === "idle") {
      setPhase("typing");
    }
  }, [isInView, phase]);

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedText.length < DEMO_PROMPT.length) {
      const timeout = setTimeout(() => {
        setTypedText(DEMO_PROMPT.slice(0, typedText.length + 1));
      }, 60);
      return () => clearTimeout(timeout);
    }
    // Done typing, start generating after a pause
    const timeout = setTimeout(() => setPhase("generating"), 600);
    return () => clearTimeout(timeout);
  }, [phase, typedText]);

  // Generation steps
  useEffect(() => {
    if (phase !== "generating") return;
    if (generationStep < GENERATION_STEPS.length - 1) {
      const timeout = setTimeout(() => {
        setGenerationStep((s) => s + 1);
      }, 700);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setPhase("done"), 500);
    return () => clearTimeout(timeout);
  }, [phase, generationStep, GENERATION_STEPS.length]);

  const handleReplay = () => {
    setPhase("idle");
    setTypedText("");
    setGenerationStep(0);
    setTimeout(() => setPhase("typing"), 300);
  };

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Instant Demo
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          Instant Demo{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            Generator
          </span>
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          Let visitors test without signup. Type a prompt and watch the magic happen.
        </p>
      </motion.div>

      {/* Demo area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        {/* Glassmorphism container */}
        <div
          className="rounded-2xl border border-foreground/10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Prompt input area */}
          <div className="p-6 border-b border-foreground/10">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <div className="bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground font-mono text-sm min-h-[48px] flex items-center">
                  {typedText}
                  {phase === "typing" && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-5 bg-[#3D4EF0] ml-0.5"
                    />
                  )}
                  {phase === "idle" && (
                    <span className="text-foreground/30">Type a prompt to generate...</span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReplay}
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer shrink-0"
                style={{ background: BRAND_GRADIENT }}
              >
                {phase === "done" ? "Try Again" : "Generate"}
              </motion.button>
            </div>

            {/* Generation steps */}
            {phase === "generating" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {GENERATION_STEPS.map((step, i) => (
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: i <= generationStep ? 1 : 0.3,
                      scale: i <= generationStep ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      i <= generationStep
                        ? "bg-[#3D4EF0]/10 text-[#3D4EF0]"
                        : "bg-foreground/5 text-foreground/30"
                    }`}
                  >
                    {i < generationStep ? "✓" : i === generationStep ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-3 h-3 border-2 border-[#3D4EF0] border-t-transparent rounded-full"
                      />
                    ) : "○"}
                    {step}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Preview area */}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar — pages */}
            <div className="md:w-48 border-b md:border-b-0 md:border-r border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Pages
              </p>
              <div className="flex md:flex-col gap-2">
                {GENERATED_PAGES.map((page) => (
                  <motion.div
                    key={page.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: phase === "done" ? 1 : 0.3, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      page.active
                        ? "bg-[#3D4EF0]/10 text-[#3D4EF0]"
                        : "text-foreground/50 hover:bg-foreground/5"
                    }`}
                  >
                    {page.name}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main preview */}
            <div className="flex-1 p-6">
              {/* View toggle */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-foreground/30">Preview</p>
                <div className="flex gap-1 bg-foreground/5 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView("desktop")}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      activeView === "desktop" ? "bg-[#3D4EF0] text-white" : "text-foreground/40"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView("mobile")}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      activeView === "mobile" ? "bg-[#3D4EF0] text-white" : "text-foreground/40"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Website preview mockup */}
              <motion.div
                animate={{ opacity: phase === "done" ? 1 : 0.15 }}
                transition={{ duration: 0.6 }}
                className={`border border-foreground/10 rounded-xl overflow-hidden bg-background/30 ${
                  activeView === "mobile" ? "max-w-[280px] mx-auto" : "w-full"
                }`}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-foreground/5 border-b border-foreground/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <div className="ml-2 flex-1 bg-foreground/5 rounded-md px-2 py-0.5 text-[10px] text-foreground/30">
                    coffeeshop.onenexium.app
                  </div>
                </div>

                {/* UI layout blocks */}
                <div className="p-3 space-y-2">
                  {UI_ELEMENTS.map((el, i) => (
                    <motion.div
                      key={el.label}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{
                        opacity: phase === "done" ? 1 : 0.1,
                        scaleX: phase === "done" ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.5, delay: phase === "done" ? i * 0.1 : 0 }}
                      className="rounded-lg flex items-center justify-center origin-left"
                      style={{
                        width: el.w,
                        height: el.h,
                        background: `${el.color}15`,
                        border: `1px solid ${el.color}25`,
                      }}
                    >
                      <span className="text-[10px] font-medium text-foreground/40 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {el.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
