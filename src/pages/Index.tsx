import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Navigate, Link } from "react-router-dom";
import { Authenticated } from "convex/react";
import {
  BarChart3,
  Store,
  Contact,
  Plus,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import StatsCounters from "./index/_components/stats-counters.tsx";
import FeaturesGrid from "./index/_components/features-grid.tsx";
import SocialProof from "./index/_components/social-proof.tsx";
import HowItWorks from "./index/_components/how-it-works-section.tsx";

// ── Interactive 3D Dot Grid ──
const GRID_GAP = 28;
const BASE_RADIUS = 0.8;
const GLOW_RADIUS = 200; // px radius around cursor that lights up dots

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

  // Track mouse relative to the page
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Track scroll
  useEffect(() => {
    const el = document.querySelector(".landing-scroll") ?? window;
    const handleScroll = () => {
      scrollRef.current =
        el instanceof Window ? el.scrollY : (el as HTMLElement).scrollTop;
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = () => document.documentElement.classList.contains("dark");

    const animate = (time: number) => {
      const t = time * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dark = isDark();

      // Mouse relative to canvas
      const mx = mouseRef.current.x - rect.left;
      const my = mouseRef.current.y - rect.top;
      const scroll = scrollRef.current;

      ctx.clearRect(0, 0, w, h);

      // 3D tilt based on scroll
      const maxTilt = 18;
      const scrollNorm = Math.min(scroll / 500, 1);
      const tiltX = scrollNorm * maxTilt;
      const radX = (tiltX * Math.PI) / 180;
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const perspective = 1000;
      const centerX = w / 2;
      const centerY = h / 2;

      // Grid dots
      const cols = Math.ceil(w / GRID_GAP) + 4;
      const rows = Math.ceil(h / GRID_GAP) + 4;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Local position centered on canvas
          const lx = (c - cols / 2) * GRID_GAP;
          const ly = (r - rows / 2) * GRID_GAP;

          // Rotate around X axis for 3D tilt
          const y3d = ly * cosX;
          const z3d = ly * sinX;

          // Perspective divide
          const d = perspective + z3d;
          if (d < 50) continue; // behind camera
          const scale = perspective / d;
          const sx = centerX + lx * scale;
          const sy = centerY + y3d * scale;

          // Skip if off-screen
          if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

          // Distance from mouse
          const dx = sx - mx;
          const dy = sy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / GLOW_RADIUS);

          // Subtle wave animation
          const wave = (Math.sin(t * 0.6 + c * 0.12 + r * 0.12) + 1) * 0.5;

          // Opacity: always visible at low alpha, brighter near cursor
          const baseAlpha = dark ? 0.3 + wave * 0.05 : 0.4 + wave * 0.06;
          const alpha = Math.min(1, baseAlpha + proximity * 0.55);

          // Dot radius: base size, subtle 3D lift near cursor
          const lift = proximity * proximity; // eased proximity for natural feel
          const dotR = (BASE_RADIUS + lift * 1.2) * Math.max(scale, 0.4);

          // Draw shadow beneath dot for 3D depth (only near cursor)
          if (proximity > 0.08) {
            const shadowOffset = lift * 3;
            const shadowAlpha = lift * 0.15;
            ctx.beginPath();
            ctx.arc(sx + shadowOffset * 0.5, sy + shadowOffset, dotR * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(0, 0, 0, ${shadowAlpha})`
              : `rgba(0, 0, 0, ${shadowAlpha * 0.7})`;
            ctx.fill();
          }

          // Draw glow halo near cursor
          if (proximity > 0.05) {
            const glowR = dotR + 2 * lift;
            ctx.beginPath();
            ctx.arc(sx, sy - lift * 2, glowR, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(255, 255, 255, ${proximity * 0.3})`
              : `rgba(0, 0, 0, ${proximity * 0.25})`;
            ctx.fill();
          }

          // Draw dot (shifts up slightly near cursor for lift effect)
          ctx.beginPath();
          ctx.arc(sx, sy - lift * 2, dotR, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Soft edge fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 50%, var(--background) 100%)",
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



export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"web" | "app">("web");

  return (
    <>
      {/* Redirect authenticated users to the New Project page */}
      <Authenticated>
        <Navigate to="/dashboard/create" replace />
      </Authenticated>

      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-background">
      {/* ── Dotted Grid Background ── */}
      <DottedGrid />

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center pt-32 pb-24 px-4 w-full max-w-[1440px] mx-auto relative z-10">
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium leading-[1.05] tracking-tight mb-12 text-balance">
            {"Bring your ideas".split("").map((char, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + i * 0.03, duration: 0.4, ease: "easeOut" }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <br />
            {"to life.".split("").map((char, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.55 + i * 0.03, duration: 0.4, ease: "easeOut" }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

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

        {/* ── Stats Counters ── */}
        <StatsCounters />

        {/* ── Features Grid ── */}
        <FeaturesGrid />

        {/* ── How It Works ── */}
        <HowItWorks />

        {/* ── Social Proof ── */}
        <SocialProof />

        {/* ── Final CTA ── */}
        <section className="w-full max-w-4xl mx-auto mt-20 mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-3xl border border-border bg-card p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Subtle radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,0,0,0.03), transparent)",
              }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-7 h-7" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4 text-balance">
                Ready to build something
                <br />
                extraordinary?
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Join thousands of creators shipping faster with AI. No credit
                card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold shadow-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border font-medium hover:bg-accent transition-all cursor-pointer"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
    </>
  );
}
