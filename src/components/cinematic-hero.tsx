import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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

// ── Wave layer definition ──
type WaveLayer = {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
  color: string;
  opacity: number;
  secondary: {
    amplitude: number;
    frequency: number;
    speed: number;
  };
};

const WAVE_LAYERS: WaveLayer[] = [
  {
    amplitude: 55,
    frequency: 0.0025,
    speed: 0.4,
    yOffset: 0.38,
    color: "99, 102, 241",   // indigo
    opacity: 0.08,
    secondary: { amplitude: 20, frequency: 0.005, speed: 0.6 },
  },
  {
    amplitude: 45,
    frequency: 0.003,
    speed: -0.3,
    yOffset: 0.45,
    color: "61, 78, 240",    // brand primary
    opacity: 0.1,
    secondary: { amplitude: 18, frequency: 0.006, speed: -0.5 },
  },
  {
    amplitude: 60,
    frequency: 0.002,
    speed: 0.25,
    yOffset: 0.52,
    color: "139, 92, 246",   // violet
    opacity: 0.07,
    secondary: { amplitude: 25, frequency: 0.004, speed: 0.45 },
  },
  {
    amplitude: 40,
    frequency: 0.0035,
    speed: -0.35,
    yOffset: 0.58,
    color: "35, 160, 255",   // brand secondary
    opacity: 0.09,
    secondary: { amplitude: 15, frequency: 0.007, speed: -0.55 },
  },
  {
    amplitude: 50,
    frequency: 0.0028,
    speed: 0.2,
    yOffset: 0.65,
    color: "14, 165, 233",   // sky
    opacity: 0.06,
    secondary: { amplitude: 22, frequency: 0.0045, speed: 0.35 },
  },
  {
    amplitude: 35,
    frequency: 0.004,
    speed: -0.22,
    yOffset: 0.72,
    color: "61, 78, 240",
    opacity: 0.05,
    secondary: { amplitude: 12, frequency: 0.008, speed: -0.4 },
  },
];

// ── Floating orb for depth ──
type Orb = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  phase: number;
  pulseSpeed: number;
};

function createOrbs(w: number, h: number): Orb[] {
  const configs = [
    { color: "61, 78, 240", size: 0.3 },
    { color: "139, 92, 246", size: 0.22 },
    { color: "35, 160, 255", size: 0.26 },
    { color: "99, 102, 241", size: 0.18 },
  ];
  return configs.map((c, i) => ({
    x: w * (0.2 + Math.random() * 0.6),
    y: h * (0.2 + Math.random() * 0.6),
    radius: Math.min(w, h) * c.size,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.2,
    color: c.color,
    phase: i * 1.5,
    pulseSpeed: 0.3 + Math.random() * 0.3,
  }));
}

// ── Canvas animation ──
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
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
    orbsRef.current = createOrbs(rect.width, rect.height);
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

      ctx.clearRect(0, 0, w, h);

      // Draw soft background orbs for ambient glow
      for (const orb of orbsRef.current) {
        orb.x += orb.vx + Math.sin(t * orb.pulseSpeed + orb.phase) * 0.3;
        orb.y += orb.vy + Math.cos(t * orb.pulseSpeed * 0.8 + orb.phase) * 0.2;

        // Wrap
        const pad = orb.radius * 1.5;
        if (orb.x < -pad) orb.x = w + pad;
        if (orb.x > w + pad) orb.x = -pad;
        if (orb.y < -pad) orb.y = h + pad;
        if (orb.y > h + pad) orb.y = -pad;

        const pulse = orb.radius * (1 + Math.sin(t * 0.4 + orb.phase) * 0.12);
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulse);
        grad.addColorStop(0, `rgba(${orb.color}, 0.15)`);
        grad.addColorStop(0.5, `rgba(${orb.color}, 0.05)`);
        grad.addColorStop(1, `rgba(${orb.color}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw wave layers from back to front
      for (const layer of WAVE_LAYERS) {
        const baseY = h * layer.yOffset;
        const step = 3;

        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += step) {
          const primary =
            Math.sin(x * layer.frequency + t * layer.speed) * layer.amplitude;
          const secondary =
            Math.sin(x * layer.secondary.frequency + t * layer.secondary.speed) *
            layer.secondary.amplitude;
          const tertiary =
            Math.cos(x * 0.001 + t * 0.15) * 15;

          const y = baseY + primary + secondary + tertiary;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        // Gradient fill from wave crest downward
        const fillGrad = ctx.createLinearGradient(0, baseY - layer.amplitude, 0, h);
        fillGrad.addColorStop(0, `rgba(${layer.color}, ${layer.opacity})`);
        fillGrad.addColorStop(0.4, `rgba(${layer.color}, ${layer.opacity * 0.5})`);
        fillGrad.addColorStop(1, `rgba(${layer.color}, 0)`);
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Thin glowing line at the wave crest
        ctx.beginPath();
        for (let x = 0; x <= w; x += step) {
          const primary =
            Math.sin(x * layer.frequency + t * layer.speed) * layer.amplitude;
          const secondary =
            Math.sin(x * layer.secondary.frequency + t * layer.secondary.speed) *
            layer.secondary.amplitude;
          const tertiary =
            Math.cos(x * 0.001 + t * 0.15) * 15;
          const y = baseY + primary + secondary + tertiary;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${layer.color}, ${layer.opacity * 2.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Subtle shimmer dots along the top wave
      const topLayer = WAVE_LAYERS[0];
      if (topLayer) {
        const baseY = h * topLayer.yOffset;
        for (let x = 0; x < w; x += 60) {
          const primary =
            Math.sin(x * topLayer.frequency + t * topLayer.speed) * topLayer.amplitude;
          const secondary =
            Math.sin(x * topLayer.secondary.frequency + t * topLayer.secondary.speed) *
            topLayer.secondary.amplitude;
          const y = baseY + primary + secondary;
          const shimmer = (Math.sin(t * 2 + x * 0.05) + 1) * 0.5;

          ctx.beginPath();
          ctx.arc(x, y, 2 + shimmer * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + shimmer * 0.2})`;
          ctx.fill();
        }
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
        setTyped(PROMPT_TEXT.slice(0, Math.floor(info.progress * PROMPT_TEXT.length)));
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
                backgroundImage: "linear-gradient(135deg, #3D4EF0, #8B5CF6)",
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
      <WaveCanvas />
      <PhaseOverlay />
    </div>
  );
}
