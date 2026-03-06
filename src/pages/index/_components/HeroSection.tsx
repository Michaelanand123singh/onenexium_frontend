import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

const FLOATING_EMOJIS = [
  { emoji: "\u26A1", delay: 0, x: "12%", y: "18%" },
  { emoji: "\uD83D\uDE80", delay: 0.4, x: "85%", y: "12%" },
  { emoji: "\u2728", delay: 0.8, x: "8%", y: "68%" },
  { emoji: "\uD83C\uDFAF", delay: 1.2, x: "90%", y: "52%" },
  { emoji: "\uD83C\uDFA8", delay: 1.6, x: "22%", y: "82%" },
  { emoji: "\uD83D\uDCA1", delay: 2.0, x: "78%", y: "80%" },
];

const suggestions = ["Landing page", "Personal website", "SaaS App"];

// Animated word-by-word headline
function AnimatedHeadline() {
  const words = ["What", "can", "OneNexium", "build", "for", "you?"];
  return (
    <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] text-center text-balance">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: 0.1 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.3em]"
        >
          {word === "OneNexium" ? (
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              {word}
            </span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </h1>
  );
}

// Animated particles behind the prompt
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#3D4EF0]/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 60, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1 + Math.random(), 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Typing placeholder effect
  const placeholders = [
    "Ask OneNexium to create a landing page for my...",
    "Build a SaaS dashboard for tracking analytics...",
    "Create an eCommerce store for handmade goods...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (prompt || isFocused) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [prompt, isFocused, placeholders.length]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }
    toast.info("Website generation coming soon! This is a demo.");
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Animated gradient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-[#3D4EF0]/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#23A0FF]/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#3D4EF0]/5 rounded-full blur-[100px]"
        />
      </div>

      <FloatingParticles />

      {/* Floating emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.3, 1, 1, 0.3],
            y: [0, -30, -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 5,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="absolute text-3xl md:text-4xl pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="max-w-[720px] mx-auto px-6 relative z-10 w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-7"
        >
          <div className="inline-flex items-center gap-2 bg-[#3D4EF0]/10 text-[#3D4EF0] dark:text-[#23A0FF] px-4 py-1.5 rounded-full text-sm font-medium">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#3D4EF0] dark:bg-[#23A0FF] rounded-full"
            />
            Powered by AI
          </div>
        </motion.div>

        {/* Main headline with word-by-word animation */}
        <AnimatedHeadline />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-base md:text-lg text-muted-foreground mt-5 text-center max-w-lg mx-auto leading-relaxed"
        >
          Build stunning SaaS, eCommerce, Internal Tools, Mobile apps with AI
        </motion.p>

        {/* Prompt input with glow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="mt-10"
        >
          <div className="relative">
            {/* Animated glow ring */}
            <motion.div
              animate={{
                opacity: isFocused ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
                scale: isFocused ? [1, 1.02, 1] : 1,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 bg-gradient-to-r from-[#3D4EF0]/30 to-[#23A0FF]/30 rounded-[22px] blur-xl"
            />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#3D4EF0]/40 to-[#23A0FF]/40 rounded-[22px]" />

            <div className="relative bg-card rounded-[21px] overflow-hidden">
              <div className="relative">
                <Sparkles className="absolute left-4 top-5 h-5 w-5 text-[#3D4EF0] dark:text-[#23A0FF]" />
                <AnimatePresence mode="wait">
                  <motion.div key={placeholderIndex}>
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      placeholder={placeholders[placeholderIndex]}
                      rows={2}
                      className="w-full pl-12 pr-5 pt-5 pb-2 bg-transparent text-foreground placeholder:text-muted-foreground/50 text-base resize-none focus:outline-none leading-relaxed"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between px-4 pb-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/40">
                    Press Enter to generate
                  </span>
                </div>
                <motion.button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 24px rgba(61,78,240,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Generate
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground mr-1">Try one</span>
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
                whileHover={{
                  y: -2,
                  borderColor: "rgba(61,78,240,0.4)",
                  boxShadow: "0 0 14px rgba(61,78,240,0.1)",
                }}
                onClick={() => {
                  setPrompt(`Create a ${s.toLowerCase()} for my...`);
                  textareaRef.current?.focus();
                }}
                className="text-xs font-medium text-foreground bg-muted hover:bg-accent border border-border px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Trusted by */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center text-xs text-muted-foreground/40 mt-16 font-medium uppercase tracking-widest"
        >
          Trusted by 100k+ users
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-5 h-8 border-2 border-muted-foreground/20 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-[#3D4EF0] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
