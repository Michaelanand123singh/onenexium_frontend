import { motion } from "motion/react";
import {
  Sparkles,
  Code2,
  Rocket,
  Palette,
  Database,
  Shield,
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/site-header.tsx";
import SiteFooter from "@/components/site-footer.tsx";

const HERO_FEATURES = [
  "AI-powered builder",
  "Real-time collaboration",
  "One-click deploy",
  "Custom domains",
];

const PRODUCTS = [
  {
    icon: Sparkles,
    title: "AI App Builder",
    description:
      "Describe what you want in plain language and watch your app come to life. Our AI understands context, design patterns, and best practices to generate production-ready code instantly.",
    badge: "Core Product",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: Code2,
    title: "Code Editor",
    description:
      "Full-featured VS Code-style editor with syntax highlighting, autocomplete, and real-time error detection. Edit generated code directly or let the AI refine it for you.",
    badge: "Built-in",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    icon: Palette,
    title: "Design System",
    description:
      "Hundreds of pre-built, accessible components with full theme customization. Consistent branding across every page, automatically responsive on all devices.",
    badge: "200+ Components",
    badgeColor: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    icon: Database,
    title: "Backend & Database",
    description:
      "Managed reactive database with real-time sync, authentication, file storage, and serverless functions. No infrastructure to manage, ever.",
    badge: "Fully Managed",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description:
      "Publish your app to a global CDN with a single click. Custom domains, SSL certificates, and edge caching included at no extra cost.",
    badge: "One Click",
    badgeColor: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  },
  {
    icon: Shield,
    title: "Auth & Security",
    description:
      "Enterprise-grade authentication with Google, Microsoft, and email sign-in out of the box. Role-based access control for every endpoint.",
    badge: "Enterprise Ready",
    badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  },
];

const CAPABILITIES = [
  {
    icon: Globe,
    title: "Progressive Web Apps",
    desc: "Build installable apps that work offline with full PWA support.",
  },
  {
    icon: Cpu,
    title: "AI Gateway",
    desc: "Access GPT-5, Claude, and more through a single unified API.",
  },
  {
    icon: Database,
    title: "File Storage",
    desc: "Upload, store, and serve images, videos, and documents globally.",
  },
  {
    icon: Shield,
    title: "Push Notifications",
    desc: "Engage users with real-time push notifications on any device.",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              The Complete Platform
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] text-balance mb-6">
              Everything you need to build,{" "}
              <span className="text-primary">ship, and scale</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              From idea to production in minutes. One Nexium combines AI-powered
              development, managed infrastructure, and beautiful design into a
              single seamless platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {HERO_FEATURES.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {f}
                </span>
              ))}
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg hover:opacity-90 transition-all"
            >
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                className="group bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <product.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${product.badgeColor}`}
                  >
                    {product.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Capabilities */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              And so much more
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every tool you need to build modern web applications, all included
              in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="text-center p-6 rounded-2xl border border-border bg-card/50"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <cap.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{cap.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-14 border border-border shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Ready to start building?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of developers and teams shipping apps faster with One
            Nexium.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg hover:opacity-90 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
