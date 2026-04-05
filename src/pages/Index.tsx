import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { LOGO_URL } from "@/lib/brand.ts";
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

// ── Interactive 3D Dot Grid ──
const GRID_GAP = 28;
const BASE_RADIUS = 1;
const GLOW_RADIUS = 180; // px radius around cursor that lights up dots

function DottedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const rafRef = useRef(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // Track mouse position relative to canvas
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect dark mode
    const isDark = () => document.documentElement.classList.contains("dark");

    const animate = (time: number) => {
      const t = time * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;
      const dark = isDark();

      ctx.clearRect(0, 0, w, h);

      // 3D perspective tilt based on scroll
      const maxTilt = 12; // degrees
      const scrollNorm = Math.min(scroll / 600, 1); // normalize 0-1
      const tiltX = scrollNorm * maxTilt;

      // Apply 3D perspective via canvas transforms
      const cx = w / 2;
      const cy = h / 2;
      const perspective = 1200;
      const radX = (tiltX * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);

      // Draw dots in grid with 3D projection
      const cols = Math.ceil(w / GRID_GAP) + 2;
      const rows = Math.ceil(h / GRID_GAP) + 2;
      const startX = -((cols * GRID_GAP) / 2);
      const startY = -((rows * GRID_GAP) / 2);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lx = startX + c * GRID_GAP;
          const ly = startY + r * GRID_GAP;

          // 3D rotation around X axis
          const cosX = Math.cos(radX);
          const sinX = Math.sin(radX);
          const y3d = ly * cosX;
          const z3d = ly * sinX;

          // Perspective projection
          const scale = perspective / (perspective + z3d);
          const px = lx * scale;
          const py = y3d * scale;

          // Screen position
          const screenX = cx + px;
          const screenY = cy + py;

          // Distance from mouse
          const dmx = screenX - mx;
          const dmy = screenY - my;
          const dist = Math.sqrt(dmx * dmx + dmy * dmy);

          // Proximity factor: 1 at cursor, 0 at GLOW_RADIUS+
          const proximity = Math.max(0, 1 - dist / GLOW_RADIUS);

          // Base opacity with subtle wave
          const wave = (Math.sin(t * 0.8 + c * 0.15 + r * 0.15) + 1) * 0.5;
          const baseAlpha = dark ? 0.12 + wave * 0.06 : 0.2 + wave * 0.08;

          // Boosted opacity near cursor
          const alpha = baseAlpha + proximity * (dark ? 0.7 : 0.6);

          // Dot size grows near cursor
          const dotR = (BASE_RADIUS + proximity * 2.2) * scale;

          // Color: base dots are foreground, highlighted dots get a slight primary tint
          if (proximity > 0.05) {
            // Glowing dot near cursor
            const glowAlpha = proximity * 0.35;
            ctx.beginPath();
            ctx.arc(cx + px, cy + py, dotR + 3 * proximity, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(180, 160, 255, ${glowAlpha})`
              : `rgba(99, 102, 241, ${glowAlpha})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(cx + px, cy + py, dotR, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0" style={{ perspective: "1200px" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {/* Radial vignette to fade edges cleanly */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 35%, var(--background) 100%)",
        }}
      />
    </div>
  );
}

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
      {/* ── Dotted Grid Background ── */}
      <DottedGrid />

      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="One Nexium" className="h-8 w-8 rounded-lg object-cover shadow-lg" />
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
            <img src={LOGO_URL} alt="One Nexium" className="h-6 w-6 rounded object-cover" />
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
