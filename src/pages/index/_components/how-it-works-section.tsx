import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MessageSquare, Cpu, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe your idea",
    description:
      "Write a plain-English prompt describing what you want to build. Be as detailed or as brief as you like.",
    iconBg: "bg-foreground/5 dark:bg-foreground/10",
    iconColor: "text-foreground dark:text-foreground",
    iconBorder: "border-foreground/10 dark:border-foreground/15",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI generates your app",
    description:
      "Our AI engine analyzes your prompt and generates production-ready code, components, and infrastructure.",
    iconBg: "bg-foreground/5 dark:bg-foreground/10",
    iconColor: "text-foreground dark:text-foreground",
    iconBorder: "border-foreground/10 dark:border-foreground/15",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Deploy in one click",
    description:
      "Review the generated output, make any tweaks, and deploy to production with a single click.",
    iconBg: "bg-foreground/5 dark:bg-foreground/10",
    iconColor: "text-foreground dark:text-foreground",
    iconBorder: "border-foreground/10 dark:border-foreground/15",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="w-full max-w-5xl mx-auto py-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance">
          From idea to production in minutes
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-balance">
          Three simple steps to turn your vision into a working application.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-[52px] left-[16.5%] right-[16.5%] h-px bg-border" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Step number ring */}
            <div className="relative mb-6">
              <div
                className={`w-[72px] h-[72px] rounded-3xl ${step.iconBg} ${step.iconColor} border ${step.iconBorder} flex items-center justify-center relative z-10`}
              >
                <step.icon className="w-7 h-7" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center z-20 shadow-sm">
                {step.number}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 sm:p-14 text-center"
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3 text-balance">
            Ready to build something incredible?
          </h2>
          <p className="text-background/60 mb-8 max-w-md mx-auto text-balance">
            Join 12,000+ developers who are shipping faster with AI-powered
            app generation. Start for free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="h-12 px-8 rounded-2xl bg-background text-foreground text-sm font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="h-12 px-8 rounded-2xl border border-background/20 text-background/80 text-sm font-medium hover:bg-background/10 transition-all inline-flex items-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
