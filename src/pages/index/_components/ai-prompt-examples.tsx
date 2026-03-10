import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const PROMPTS = [
  "Build an Airbnb clone",
  "Create a gym management app",
  "Make a crypto portfolio tracker",
  "Create a YouTube analytics dashboard",
  "Build a food delivery app like DoorDash",
  "Design a project management tool",
  "Make an AI writing assistant",
  "Create a real estate listing website",
  "Build a social media scheduler",
  "Design an online learning platform",
  "Make a restaurant reservation system",
  "Create a freelancer marketplace",
];

export default function AIPromptExamples() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-cycle highlight when not hovering
  const [autoIndex, setAutoIndex] = useState(0);
  useEffect(() => {
    if (hoveredIndex !== null) return;
    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [hoveredIndex]);

  const activeIndex = hoveredIndex ?? autoIndex;

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: BRAND_GRADIENT, opacity: 0.2 }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0] mb-6">
          <Terminal className="w-3.5 h-3.5" />
          Prompt Ideas
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          AI Prompt{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            Examples
          </span>
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          Not sure what to build? Here are some ideas to get you started.
        </p>
      </motion.div>

      {/* Prompt grid */}
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PROMPTS.map((prompt, i) => (
          <motion.div
            key={prompt}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group relative rounded-xl border px-4 py-3 cursor-pointer transition-all duration-300 ${
              activeIndex === i
                ? "border-[#3D4EF0]/30 bg-[#3D4EF0]/5"
                : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/15"
            }`}
          >
            {/* Active indicator */}
            {activeIndex === i && (
              <motion.div
                layoutId="promptHighlight"
                className="absolute inset-0 rounded-xl border border-[#3D4EF0]/30 bg-[#3D4EF0]/5"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative flex items-center gap-3">
              {/* Prompt icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  activeIndex === i ? "bg-[#3D4EF0]/15" : "bg-foreground/5"
                }`}
              >
                <span className="text-sm">
                  {activeIndex === i ? "\u{2728}" : "\u{1F4AC}"}
                </span>
              </div>

              {/* Prompt text */}
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeIndex === i ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {`"${prompt}"`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Typing preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-2xl mx-auto mt-12"
      >
        <div
          className="rounded-xl border border-foreground/10 p-4"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-foreground/30 uppercase tracking-widest">Live Preview</span>
          </div>
          <div className="bg-background/50 rounded-lg px-4 py-3 font-mono text-sm text-foreground/70">
            <TypingPrompt text={PROMPTS[activeIndex]} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Animated typing display for the currently active prompt */
function TypingPrompt({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {`> ${displayed}`}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-4 bg-[#3D4EF0] ml-0.5 align-middle"
      />
    </span>
  );
}
