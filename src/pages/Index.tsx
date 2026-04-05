import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  BarChart3,
  Store,
  Contact,
  Plus,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Layers,
  Code,
  Zap,
} from "lucide-react";

const SUGGESTION_PILLS = [
  { icon: BarChart3, text: "Create an AI SaaS dashboard" },
  { icon: Store, text: "Build an e-commerce platform" },
  { icon: Contact, text: "Design a portfolio site", hideOnMobile: true },
];

const FEATURES = [
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
      "Export production-ready React, Vue, or plain HTML/CSS code with zero dependencies.",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBorder: "border-blue-100 dark:border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Instant Deploy",
    description:
      "Push your generated applications directly to Vercel, Netlify, or your custom infrastructure.",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBorder: "border-emerald-100 dark:border-emerald-500/20",
  },
];

const NAV_LINKS = ["Products", "Solutions", "Resources", "Pricing"];
const FOOTER_LINKS = ["Privacy", "Terms", "Twitter", "GitHub"];

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"web" | "app">("web");

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background antialiased">
      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center text-background font-bold text-xl shadow-lg">
              N
            </div>
            <span className="font-semibold text-lg tracking-tight">
              One Nexium
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hidden sm:block text-sm font-medium hover:text-foreground transition-colors"
            >
              Sign in
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-md hover:opacity-90 transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-4 w-full max-w-[1440px] mx-auto relative z-10">
        {/* Hero */}
        <section className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-16">
          {/* Suggestion pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {SUGGESTION_PILLS.map((pill) => (
              <button
                key={pill.text}
                onClick={() =>
                  setPrompt(pill.text.toLowerCase() + "...")
                }
                className={`px-4 py-1.5 rounded-full border border-border shadow-sm text-sm font-medium items-center gap-2 hover:bg-accent transition-all cursor-pointer ${
                  pill.hideOnMobile ? "hidden sm:flex" : "flex"
                }`}
              >
                <pill.icon className="w-4 h-4 text-primary" />
                {pill.text}
              </button>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium leading-[1.05] tracking-tight mb-12 text-balance"
          >
            What will you
            <br />
            build today?
          </motion.h1>

          {/* Prompt input box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-3xl relative"
          >
            <div className="rounded-3xl p-2 border border-border shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the app you want to build in detail..."
                className="w-full bg-transparent border-none outline-none resize-none px-6 pt-6 pb-20 text-lg min-h-[160px] placeholder:text-muted-foreground/50"
              />

              {/* Bottom toolbar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/50 backdrop-blur-xl rounded-2xl p-2 border border-border">
                <div className="flex items-center gap-2">
                  {/* Attach */}
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent hover:shadow-sm transition-all border border-transparent hover:border-border cursor-pointer">
                    <Plus className="w-[18px] h-[18px]" />
                  </button>

                  {/* Web / App toggle */}
                  <div className="flex items-center rounded-xl p-1 border border-border h-10">
                    <button
                      onClick={() => setActiveTab("web")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "web"
                          ? "bg-background shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      Web
                    </button>
                    <button
                      onClick={() => setActiveTab("app")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        activeTab === "app"
                          ? "bg-background shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      App
                    </button>
                  </div>

                  {/* AI model selector */}
                  <button className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-xl border border-border hover:bg-accent hover:shadow-sm transition-all text-xs font-medium cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Nexium AI v4
                    <ChevronDown className="w-[10px] h-[10px] ml-1 text-muted-foreground" />
                  </button>
                </div>

                {/* Generate */}
                <button
                  onClick={() =>
                    toast.info("Coming soon! Sign up for early access.")
                  }
                  className="h-10 px-6 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Generate
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Privacy note */}
            <div className="mt-4 flex justify-center items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span>Your prompts are private and secure</span>
            </div>
          </motion.div>
        </section>

        {/* ── Features ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-5xl mx-auto mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              Everything you need to ship faster
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.iconBg} ${feature.iconColor} border ${feature.iconBorder} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm mt-auto relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center text-background font-bold text-xs">
              N
            </div>
            <span className="font-medium text-sm">One Nexium</span>
            <span className="text-sm text-muted-foreground ml-4">
              {"©"} {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
