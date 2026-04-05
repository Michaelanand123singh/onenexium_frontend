import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Layers,
  Code,
  Zap,
  Users,
  ShieldCheck,
  Sparkles,
  Globe,
  Palette,
  GitBranch,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your vision in plain English and watch as production-ready code materializes in seconds.",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBorder: "border-violet-100 dark:border-violet-500/20",
  },
  {
    icon: Layers,
    title: "Component Library",
    description:
      "Access hundreds of pre-built, accessible UI components customized to your brand instantly.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    iconBorder: "border-primary/20",
  },
  {
    icon: Code,
    title: "Clean Code Export",
    description:
      "Export production-ready React code with TypeScript, modern hooks, and zero unnecessary dependencies.",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBorder: "border-blue-100 dark:border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Deploy",
    description:
      "Push your generated applications to production with one click. Zero config, zero waiting.",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBorder: "border-amber-100 dark:border-amber-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite teammates to projects with role-based access. Build together in real time.",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBorder: "border-emerald-100 dark:border-emerald-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant infrastructure with end-to-end encryption and private project isolation.",
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBorder: "border-rose-100 dark:border-rose-500/20",
  },
  {
    icon: Palette,
    title: "Design System Sync",
    description:
      "Import your existing design tokens and brand guidelines. Every component adapts automatically.",
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    iconColor: "text-pink-600 dark:text-pink-400",
    iconBorder: "border-pink-100 dark:border-pink-500/20",
  },
  {
    icon: Globe,
    title: "Global Edge CDN",
    description:
      "Deploy to 200+ edge locations worldwide. Sub-50ms latency for every visitor, everywhere.",
    iconBg: "bg-cyan-50 dark:bg-cyan-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    iconBorder: "border-cyan-100 dark:border-cyan-500/20",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Built-in branching and version history. Roll back changes or compare any two versions instantly.",
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBorder: "border-orange-100 dark:border-orange-500/20",
  },
];

export default function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="w-full max-w-6xl mx-auto py-20 px-4">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance">
          Everything you need to ship faster
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-balance">
          From AI-powered code generation to enterprise-grade deployment,
          OneNexium covers the full development lifecycle.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease: "easeOut" }}
            className="group relative bg-card rounded-3xl p-7 border border-border shadow-sm hover:shadow-lg hover:border-border/80 transition-all duration-300"
          >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/[0.03] to-transparent" />

            <div className="relative z-10">
              <div
                className={`w-11 h-11 rounded-2xl ${feature.iconBg} ${feature.iconColor} border ${feature.iconBorder} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
