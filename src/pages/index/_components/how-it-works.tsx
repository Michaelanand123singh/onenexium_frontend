import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Brain, Zap, Rocket } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const STEPS = [
  {
    number: "01",
    icon: Brain,
    emoji: "\u{1F9E0}",
    title: "Describe your idea",
    description: "Tell OneNexium what you want to build in plain English. No technical skills needed.",
    color: "#000000",
  },
  {
    number: "02",
    icon: Zap,
    emoji: "\u{26A1}",
    title: "OneNexium generates it",
    description: "Our AI builds your complete app or website — frontend, backend, database, and all.",
    color: "#000000",
  },
  {
    number: "03",
    icon: Rocket,
    emoji: "\u{1F680}",
    title: "Publish instantly",
    description: "Go live in seconds with a custom domain. Share it with the world immediately.",
    color: "#000000",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: BRAND_GRADIENT, opacity: 0.2 }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          How It{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            Works
          </span>
        </h2>
        <p className="text-foreground/50 text-lg">
          Three simple steps. Zero complexity.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-6 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" as const }}
            className="w-full h-full origin-left"
            style={{ background: BRAND_GRADIENT, opacity: 0.3 }}
          />
        </div>

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
            className="relative"
          >
            <div
              className="rounded-2xl border border-foreground/10 p-8 text-center h-full"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Animated icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}
              >
                <span className="text-3xl">{step.emoji}</span>
                {/* Pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `1px solid ${step.color}` }}
                />
              </motion.div>

              {/* Step number */}
              <div
                className="text-xs font-bold tracking-widest mb-3 bg-clip-text text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                STEP {step.number}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
