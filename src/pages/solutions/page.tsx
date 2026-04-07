import { motion } from "motion/react";
import {
  Zap,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const SOLUTIONS = [
  {
    icon: Zap,
    audience: "Startups",
    tagline: "From zero to launch in days, not months",
    description:
      "Validate ideas fast, iterate on user feedback, and ship MVPs without burning through your runway. Built-in auth, database, and hosting means one less vendor to manage.",
    benefits: [
      "Launch MVPs in hours",
      "No DevOps overhead",
      "Scale as you grow",
      "Built-in analytics",
    ],
    gradient: "from-foreground/[0.03] to-foreground/[0.01]",
    iconColor: "text-foreground",
  },
  {
    icon: Building2,
    audience: "Agencies",
    tagline: "Deliver more projects, faster",
    description:
      "Stop re-building the same scaffolding for every client. Use AI to generate pixel-perfect apps from briefs, then customize to perfection. Your clients get premium results, you keep healthy margins.",
    benefits: [
      "Faster client delivery",
      "Consistent quality",
      "White-label ready",
      "Template marketplace",
    ],
    gradient: "from-foreground/[0.03] to-foreground/[0.01]",
    iconColor: "text-foreground",
  },
  {
    icon: Users,
    audience: "Enterprise",
    tagline: "Internal tools that actually get built",
    description:
      "Empower every team to build the dashboards, portals, and workflows they need without waiting months in the dev queue. Enterprise-grade security, SSO, and role-based access built in.",
    benefits: [
      "SSO & RBAC included",
      "Audit logging",
      "Custom domains",
      "Priority support",
    ],
    gradient: "from-foreground/[0.03] to-foreground/[0.01]",
    iconColor: "text-foreground",
  },
  {
    icon: Briefcase,
    audience: "Freelancers",
    tagline: "Take on bigger clients with confidence",
    description:
      "Deliver professional-grade apps to your clients without the overhead of a full dev team. AI handles the heavy lifting so you can focus on design, strategy, and client relationships.",
    benefits: [
      "No team needed",
      "Professional output",
      "Repeat templates",
      "Client handoff tools",
    ],
    gradient: "from-foreground/[0.03] to-foreground/[0.01]",
    iconColor: "text-foreground",
  },
];

const METRICS = [
  { icon: Clock, value: "10x", label: "Faster development" },
  { icon: DollarSign, value: "80%", label: "Cost reduction" },
  { icon: Target, value: "99.9%", label: "Uptime guaranteed" },
  { icon: LineChart, value: "50k+", label: "Apps deployed" },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] text-balance mb-6">
              Built for how{" "}
              <span className="text-primary">you work</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you are a solo founder, a growing agency, or an enterprise
              team, One Nexium adapts to your workflow and scales with your
              ambition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="text-center p-6 rounded-2xl border border-border bg-card/50"
              >
                <m.icon className="w-5 h-5 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold tracking-tight mb-1">
                  {m.value}
                </div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto space-y-8">
          {SOLUTIONS.map((sol, i) => (
            <motion.div
              key={sol.audience}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className={`rounded-3xl border border-border bg-gradient-to-br ${sol.gradient} p-8 md:p-12`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center ${sol.iconColor}`}
                    >
                      <sol.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      For {sol.audience}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                    {sol.tagline}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">
                    {sol.description}
                  </p>
                </div>
                <div className="md:w-64 flex-shrink-0">
                  <ul className="space-y-3">
                    {sol.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-14 border border-border shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Find the right fit for your team
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start free and upgrade as you grow. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg hover:opacity-90 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-medium hover:bg-accent transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
