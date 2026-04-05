import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

// ── Phase system ──
const CYCLE = 18;
type Phase = "prompt" | "code" | "app";
type PhaseInfo = { phase: Phase; progress: number };

function getPhase(t: number): PhaseInfo {
  const raw = t % CYCLE;
  if (raw < 6) return { phase: "prompt", progress: raw / 6 };
  if (raw < 12) return { phase: "code", progress: (raw - 6) / 6 };
  return { phase: "app", progress: (raw - 12) / 6 };
}

// ── Aurora Canvas ──
type AuroraBlob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
};

function createBlobs(w: number, h: number): AuroraBlob[] {
  const colors = [
    "rgba(61, 78, 240, 0.35)",
    "rgba(35, 160, 255, 0.30)",
    "rgba(139, 92, 246, 0.28)",
    "rgba(99, 102, 241, 0.32)",
    "rgba(14, 165, 233, 0.25)",
    "rgba(61, 78, 240, 0.20)",
    "rgba(139, 92, 246, 0.22)",
  ];

  return colors.map((color, i) => ({
    x: w * (0.15 + Math.random() * 0.7),
    y: h * (0.2 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.min(w, h) * (0.25 + Math.random() * 0.3),
    color,
    phase: i * 0.9,
    speed: 0.3 + Math.random() * 0.5,
  }));
}

function createStars(w: number, h: number): Star[] {
  return Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 1.8 + 0.3,
    twinkleSpeed: 0.5 + Math.random() * 2,
    twinklePhase: Math.random() * Math.PI * 2,
    brightness: 0.3 + Math.random() * 0.7,
  }));
}

function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<AuroraBlob[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    blobsRef.current = createBlobs(rect.width, rect.height);
    starsRef.current = createStars(rect.width, rect.height);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (time: number) => {
      const t = time * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Clear with a very dark background
      ctx.clearRect(0, 0, w, h);

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle =
          (Math.sin(t * star.twinkleSpeed + star.twinklePhase) + 1) * 0.5;
        const alpha = star.brightness * (0.3 + twinkle * 0.7);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.fill();
      }

      // Update and draw aurora blobs
      for (const blob of blobsRef.current) {
        // Organic motion
        blob.x += blob.vx + Math.sin(t * blob.speed + blob.phase) * 0.6;
        blob.y += blob.vy + Math.cos(t * blob.speed * 0.7 + blob.phase) * 0.4;

        // Wrap around edges with padding
        const pad = blob.radius;
        if (blob.x < -pad) blob.x = w + pad;
        if (blob.x > w + pad) blob.x = -pad;
        if (blob.y < -pad) blob.y = h + pad;
        if (blob.y > h + pad) blob.y = -pad;

        // Pulsing radius
        const pulse =
          blob.radius * (1 + Math.sin(t * 0.5 + blob.phase) * 0.15);

        // Draw soft radial gradient blob
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          pulse
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, "0.12)"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Layered aurora streaks
      const streakCount = 5;
      for (let s = 0; s < streakCount; s++) {
        ctx.beginPath();
        const baseY = h * (0.3 + s * 0.12);
        const amplitude = 40 + s * 15;
        const freq = 0.003 + s * 0.001;
        const timeOffset = t * (0.3 + s * 0.08);

        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 4) {
          const y =
            baseY +
            Math.sin(x * freq + timeOffset) * amplitude +
            Math.cos(x * freq * 1.5 + timeOffset * 0.7) * (amplitude * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const streakGradient = ctx.createLinearGradient(0, baseY - amplitude, 0, baseY + amplitude * 2);
        const hue = [240, 220, 260, 200, 250][s] ?? 240;
        streakGradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
        streakGradient.addColorStop(0.3, `hsla(${hue}, 80%, 55%, 0.06)`);
        streakGradient.addColorStop(0.6, `hsla(${hue}, 75%, 50%, 0.03)`);
        streakGradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
        ctx.fillStyle = streakGradient;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}

// ── Phase Overlay ──
const PROMPT_TEXT = "Build me a SaaS dashboard with real-time analytics...";

const CODE_LINES = [
  { text: "export default function Dashboard() {", cls: "text-[#8B5CF6]" },
  { text: "  const data = useQuery(api.analytics);", cls: "text-[#3D4EF0]" },
  { text: "  const metrics = processData(data);", cls: "text-[#10B981]" },
  { text: "  return (", cls: "text-foreground/40" },
  { text: "    <Layout sidebar={<NavMenu />}>", cls: "text-[#23A0FF]" },
  { text: "      <MetricCards data={metrics} />", cls: "text-[#14b8a6]" },
  { text: "      <RevenueChart data={metrics} />", cls: "text-[#10B981]" },
  { text: "    </Layout>", cls: "text-foreground/40" },
  { text: "  );", cls: "text-foreground/40" },
  { text: "}", cls: "text-[#8B5CF6]" },
];

function PhaseOverlay() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [typed, setTyped] = useState("");
  const mountRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - mountRef.current) / 1000;
      const info = getPhase(elapsed);
      setPhase(info.phase);
      if (info.phase === "prompt") {
        setTyped(
          PROMPT_TEXT.slice(0, Math.floor(info.progress * PROMPT_TEXT.length))
        );
      }
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 dark:bg-white/8 backdrop-blur-2xl border border-[#3D4EF0]/8 dark:border-[#3D4EF0]/15 rounded-2xl px-7 py-5 max-w-lg shadow-2xl shadow-[#3D4EF0]/8"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6059]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-auto text-[9px] text-foreground/15 font-mono tracking-widest">
                prompt
              </span>
            </div>
            <p className="text-foreground/70 font-mono text-sm leading-relaxed">
              <span className="text-[#3D4EF0] font-semibold">{">"} </span>
              {typed}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-[6px] h-[16px] bg-[#3D4EF0] ml-0.5 -mb-[3px] rounded-sm"
              />
            </p>
          </motion.div>
        )}

        {phase === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 0.45 }}
            className="bg-white/70 dark:bg-white/8 backdrop-blur-2xl border border-[#10B981]/12 dark:border-[#10B981]/20 rounded-2xl px-6 py-4 max-w-md font-mono text-xs leading-[1.9] shadow-2xl shadow-[#10B981]/8"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#10B981]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-[9px] text-[#10B981]/50 dark:text-[#10B981]/70 font-mono tracking-widest">
                generating
              </span>
            </div>
            {CODE_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.25 }}
                className={line.cls}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        )}

        {phase === "app" && (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.95] }}
            transition={{ duration: 5.5, times: [0, 0.12, 0.78, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D4EF0] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#3D4EF0]/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-6 h-6 rounded-lg bg-white/90"
                animate={{ scale: [0.85, 1, 0.85] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <p
              className="text-xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #3D4EF0, #8B5CF6)",
              }}
            >
              Your app is ready
            </p>
            <p className="text-foreground/30 text-xs font-mono tracking-wide">
              deployed successfully
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Export ──
export default function CinematicHero() {
  return (
    <div className="absolute inset-0 z-0">
      <AuroraCanvas />
      <PhaseOverlay />
    </div>
  );
}
