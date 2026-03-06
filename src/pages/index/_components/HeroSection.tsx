import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Paperclip, Globe } from "lucide-react";
import { toast } from "sonner";

const FLOATING_EMOJIS = [
  { emoji: "\u26A1", delay: 0, x: "15%", y: "20%" },
  { emoji: "\uD83D\uDE80", delay: 0.3, x: "82%", y: "15%" },
  { emoji: "\u2728", delay: 0.6, x: "10%", y: "65%" },
  { emoji: "\uD83C\uDFAF", delay: 0.9, x: "88%", y: "55%" },
  { emoji: "\uD83C\uDFA8", delay: 1.2, x: "25%", y: "80%" },
  { emoji: "\uD83D\uDCA1", delay: 1.5, x: "75%", y: "78%" },
];

const suggestions = [
  "Landing page",
  "Personal website",
  "SaaS App",
];

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }
    toast.info("Website generation coming soon! This is a demo.");
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-14 overflow-hidden">
      {/* Floating emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -20, -20, 0],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute text-3xl md:text-4xl pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="max-w-[720px] mx-auto px-6 relative z-10 w-full">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-center text-balance"
        >
          What can OneNexium build for you?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base md:text-lg text-muted-foreground mt-4 text-center max-w-lg mx-auto leading-relaxed"
        >
          Build stunning SaaS, eCommerce, Internal Tools, Mobile apps with AI
        </motion.p>

        {/* Prompt input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10"
        >
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="relative">
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
                placeholder="Ask OneNexium to create a landing page for my..."
                rows={2}
                className="w-full px-5 pt-5 pb-2 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base resize-none focus:outline-none leading-relaxed"
              />
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 pb-4 pt-1">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => toast.info("File attach coming soon!")}
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Attach Image
                </button>
                <span className="text-xs text-muted-foreground/40 border border-border rounded px-1.5 py-0.5">
                  Public
                </span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-5 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Try one</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPrompt(`Create a ${s.toLowerCase()} for my...`);
                  textareaRef.current?.focus();
                }}
                className="text-xs font-medium text-foreground bg-muted hover:bg-accent border border-border px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trusted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-xs text-muted-foreground/50 mt-14 font-medium"
        >
          Trusted by 100k+ users
        </motion.p>
      </div>
    </section>
  );
}
