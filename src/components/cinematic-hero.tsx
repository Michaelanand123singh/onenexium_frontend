import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

// ── Phase timing ──
const CYCLE = 18;
type Phase = "prompt" | "code" | "app";
type PhaseInfo = { phase: Phase; progress: number };

function getPhase(t: number): PhaseInfo {
  const raw = t % CYCLE;
  if (raw < 6) return { phase: "prompt", progress: raw / 6 };
  if (raw < 12) return { phase: "code", progress: (raw - 6) / 6 };
  return { phase: "app", progress: (raw - 12) / 6 };
}

function ease(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ── Palette ──
const COL_BLUE = new THREE.Color("#3D4EF0");
const COL_CYAN = new THREE.Color("#23A0FF");
const COL_VIOLET = new THREE.Color("#8B5CF6");
const COL_GREEN = new THREE.Color("#10B981");
const COL_TEAL = new THREE.Color("#14b8a6");
const COL_GOLD = new THREE.Color("#F59E0B");

const N = 500;

function buildTargets() {
  const rings = new Float32Array(N * 3);
  const streams = new Float32Array(N * 3);
  const dashboard = new Float32Array(N * 3);
  const delays = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    // RINGS: 5 concentric tilted orbits (atom-like)
    const ring = i % 5;
    const posInRing = Math.floor(i / 5);
    const angle = (posInRing / (N / 5)) * Math.PI * 2 + ring * 0.7;
    const radius = 2.2 + ring * 0.6;
    const tiltX = [0.3, -0.5, 0.8, -0.2, 0.6][ring];
    const tiltZ = [0.1, 0.4, -0.3, 0.5, -0.1][ring];

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    // Apply tilt rotation
    rings[i * 3] = x * Math.cos(tiltZ) - y * Math.sin(tiltZ) * Math.cos(tiltX);
    rings[i * 3 + 1] = x * Math.sin(tiltZ) + y * Math.cos(tiltZ) * Math.cos(tiltX);
    rings[i * 3 + 2] = y * Math.sin(tiltX);

    // STREAMS: vertical data waterfall columns
    const col = i % 16;
    const row = Math.floor(i / 16);
    streams[i * 3] = (col - 7.5) * 0.6;
    streams[i * 3 + 1] = 5 - (row % 32) * 0.35;
    streams[i * 3 + 2] = -0.5 + (Math.random() - 0.5) * 0.5;

    // DASHBOARD: isometric floating panels
    const section = i % 100;
    if (section < 12) {
      // Top bar
      dashboard[i * 3] = -3 + (section / 12) * 6;
      dashboard[i * 3 + 1] = 2.5;
      dashboard[i * 3 + 2] = 0;
    } else if (section < 28) {
      // Left sidebar
      const s = section - 12;
      dashboard[i * 3] = -2.8 + (Math.random() - 0.5) * 0.6;
      dashboard[i * 3 + 1] = 2.2 - (s / 16) * 4.8;
      dashboard[i * 3 + 2] = 0.1;
    } else if (section < 48) {
      // Main chart area (sine wave)
      const s = section - 28;
      const chartX = -1.5 + (s / 20) * 4.5;
      dashboard[i * 3] = chartX;
      dashboard[i * 3 + 1] = Math.sin(chartX * 1.5) * 0.6 + 0.5;
      dashboard[i * 3 + 2] = 0.2;
    } else if (section < 72) {
      // 3 stat cards
      const s = section - 48;
      const card = Math.floor(s / 8);
      const cardX = [-1, 0.8, 2.6][card % 3];
      dashboard[i * 3] = cardX + (Math.random() - 0.5) * 1.2;
      dashboard[i * 3 + 1] = -0.8 + (Math.random() - 0.5) * 0.8;
      dashboard[i * 3 + 2] = 0.15;
    } else {
      // Bottom table rows
      const s = section - 72;
      const rowNum = Math.floor(s / 7);
      dashboard[i * 3] = -1.5 + (s % 7) * 0.75;
      dashboard[i * 3 + 1] = -1.8 - rowNum * 0.45;
      dashboard[i * 3 + 2] = 0.1;
    }

    delays[i] = Math.sqrt(rings[i * 3] ** 2 + rings[i * 3 + 1] ** 2) * 0.035;
  }

  return { rings, streams, dashboard, delays };
}

// ── Morphing particle system ──
function MorphSystem() {
  const ref = useRef<THREE.Points>(null);
  const { rings, streams, dashboard, delays } = useMemo(buildTargets, []);

  const positions = useMemo(() => rings.slice(), [rings]);
  const colors = useMemo(() => {
    const c = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const col = i % 3 === 0 ? COL_BLUE : i % 3 === 1 ? COL_CYAN : COL_VIOLET;
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);
  const sizes = useMemo(() => {
    const s = new Float32Array(N);
    for (let i = 0; i < N; i++) s[i] = 0.06 + Math.random() * 0.04;
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const { phase, progress } = getPhase(t);
    const pa = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const ca = ref.current.geometry.attributes.color as THREE.BufferAttribute;
    const p = pa.array as Float32Array;
    const c = ca.array as Float32Array;

    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const d = delays[i];
      let tx: number, ty: number, tz: number;
      let tc: THREE.Color;
      let spd = 0.04;

      if (phase === "prompt") {
        // Orbiting rings — each ring spins at its own speed
        const ring = i % 5;
        const speeds = [0.3, -0.25, 0.4, -0.18, 0.35];
        const rot = t * speeds[ring];
        const bx = rings[ix], by = rings[ix + 1], bz = rings[ix + 2];
        // Rotate around Y
        tx = bx * Math.cos(rot) - bz * Math.sin(rot);
        ty = by + Math.sin(t * 0.5 + i * 0.012) * 0.08;
        tz = bx * Math.sin(rot) + bz * Math.cos(rot);

        const ringBlend = (Math.sin(t * 0.4 + ring * 1.3) + 1) * 0.5;
        tc = new THREE.Color().lerpColors(COL_BLUE, COL_VIOLET, ringBlend);

        // Pre-transition: pull into stream columns
        if (progress > 0.82) {
          const b = Math.max(0, ease((progress - 0.82) / 0.18) - d * 1.5);
          tx = THREE.MathUtils.lerp(tx, streams[ix], b);
          ty = THREE.MathUtils.lerp(ty, streams[ix + 1], b);
          tz = THREE.MathUtils.lerp(tz, streams[ix + 2], b);
          spd = 0.06;
        }
      } else if (phase === "code") {
        // Falling data streams with horizontal scan
        const fall = ((progress * 10 + d * 4 + i * 0.002) % 10) - 5;
        tx = streams[ix] + Math.sin(t * 3 + i * 0.05) * 0.03;
        ty = fall;
        tz = streams[ix + 2];

        // Horizontal scan line highlight
        const scanY = Math.sin(t * 1.5) * 4;
        const nearScan = Math.abs(ty - scanY) < 0.5;
        tc = nearScan
          ? COL_GOLD
          : (i % 3 === 0 ? COL_GREEN : i % 3 === 1 ? COL_TEAL : COL_CYAN);
        spd = 0.055;

        // Pre-transition: fly to dashboard
        if (progress > 0.82) {
          const b = Math.max(0, ease((progress - 0.82) / 0.18) - d * 1.5);
          tx = THREE.MathUtils.lerp(tx, dashboard[ix], b);
          ty = THREE.MathUtils.lerp(ty, dashboard[ix + 1], b);
          tz = THREE.MathUtils.lerp(tz, dashboard[ix + 2], b);
        }
      } else {
        // Floating dashboard with gentle sway
        tx = dashboard[ix] + Math.sin(t * 0.3 + i * 0.006) * 0.02;
        ty = dashboard[ix + 1] + Math.cos(t * 0.25 + i * 0.006) * 0.015;
        tz = dashboard[ix + 2];

        const section = i % 100;
        if (section < 12) tc = COL_VIOLET;
        else if (section < 28) tc = new THREE.Color().lerpColors(COL_BLUE, COL_CYAN, 0.5);
        else if (section < 48) tc = COL_CYAN;
        else if (section < 72) tc = COL_BLUE;
        else tc = new THREE.Color().lerpColors(COL_VIOLET, COL_BLUE, 0.6);
        spd = 0.04;

        // Dissolve back to rings
        if (progress > 0.78) {
          const b = Math.max(0, ease((progress - 0.78) / 0.22) - d * 1.0);
          const ring = i % 5;
          const speeds = [0.3, -0.25, 0.4, -0.18, 0.35];
          const rot = t * speeds[ring];
          const bx = rings[ix], bz = rings[ix + 2];
          const nx = bx * Math.cos(rot) - bz * Math.sin(rot);
          const nz = bx * Math.sin(rot) + bz * Math.cos(rot);
          tx = THREE.MathUtils.lerp(tx, nx, b);
          ty = THREE.MathUtils.lerp(ty, rings[ix + 1], b);
          tz = THREE.MathUtils.lerp(tz, nz, b);
        }
      }

      p[ix] = THREE.MathUtils.lerp(p[ix], tx, spd);
      p[ix + 1] = THREE.MathUtils.lerp(p[ix + 1], ty, spd);
      p[ix + 2] = THREE.MathUtils.lerp(p[ix + 2], tz, spd);

      c[ix] = THREE.MathUtils.lerp(c[ix], tc.r, 0.03);
      c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], tc.g, 0.03);
      c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], tc.b, 0.03);
    }

    pa.needsUpdate = true;
    ca.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Glowing core nucleus ──
function Nucleus() {
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { phase, progress } = getPhase(t);
    const pulse = 1 + Math.sin(t * 2) * 0.15;

    if (inner.current) {
      const s = phase === "code" ? 0.4 + progress * 0.25 : phase === "app" ? 0.2 : 0.3;
      inner.current.scale.setScalar(s * pulse);
      const mat = inner.current.material as THREE.MeshStandardMaterial;
      mat.emissive = phase === "code" ? COL_GREEN : COL_BLUE;
      mat.emissiveIntensity = phase === "code" ? 5 + progress * 3 : 3;
    }
    if (halo.current) {
      const s = phase === "code" ? 2.5 : phase === "app" ? 0.8 : 1.6;
      halo.current.scale.setScalar(s * (1 + Math.sin(t * 1.5) * 0.08));
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.color = phase === "code" ? COL_GREEN : COL_BLUE;
      mat.opacity = phase === "app" ? 0.02 : 0.05;
    }
  });

  return (
    <>
      <mesh ref={inner}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fff" emissive="#3D4EF0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#3D4EF0" transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Floating dust for depth ──
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 16;
      p[i * 3 + 2] = (Math.random() - 0.5) * 12 - 5;
    }
    return p;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.004;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.006) * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#3D4EF0" transparent opacity={0.12} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ── Scene ──
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 4, 5]} intensity={0.35} color="#3D4EF0" />
      <pointLight position={[-4, -3, 4]} intensity={0.2} color="#8B5CF6" />

      <MorphSystem />
      <Nucleus />
      <Dust />
    </>
  );
}

// ── CSS overlay panels ──
const PROMPT_TEXT = "Build me a SaaS dashboard with real-time analytics...";

const CODE_LINES = [
  { text: "export default function Dashboard() {", cls: "text-[#8B5CF6]" },
  { text: "  const data = useQuery(api.analytics);", cls: "text-[#3D4EF0]" },
  { text: "  const metrics = processData(data);", cls: "text-[#10B981]" },
  { text: "  return (", cls: "text-[#0C0F18]/40 dark:text-white/40" },
  { text: "    <Layout sidebar={<NavMenu />}>", cls: "text-[#23A0FF]" },
  { text: "      <MetricCards data={metrics} />", cls: "text-[#14b8a6]" },
  { text: "      <RevenueChart data={metrics} />", cls: "text-[#10B981]" },
  { text: "    </Layout>", cls: "text-[#0C0F18]/40 dark:text-white/40" },
  { text: "  );", cls: "text-[#0C0F18]/40 dark:text-white/40" },
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
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="bg-white/65 dark:bg-white/8 backdrop-blur-2xl border border-[#3D4EF0]/8 dark:border-[#3D4EF0]/15 rounded-2xl px-7 py-5 max-w-lg shadow-2xl shadow-[#3D4EF0]/10"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6059]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-auto text-[9px] text-[#0C0F18]/15 dark:text-white/15 font-mono tracking-widest">prompt</span>
            </div>
            <p className="text-[#0C0F18]/70 dark:text-white/70 font-mono text-sm leading-relaxed">
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
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, filter: "blur(10px)" }}
            transition={{ duration: 0.45 }}
            className="bg-white/65 dark:bg-white/8 backdrop-blur-2xl border border-[#10B981]/12 dark:border-[#10B981]/20 rounded-2xl px-6 py-4 max-w-md font-mono text-xs leading-[1.9] shadow-2xl shadow-[#10B981]/10"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#10B981]"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-[9px] text-[#10B981]/50 dark:text-[#10B981]/70 font-mono tracking-widest">generating</span>
            </div>
            {CODE_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.2 }}
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
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.96] }}
            transition={{ duration: 5.5, times: [0, 0.12, 0.78, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3D4EF0] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#3D4EF0]/25"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-6 h-5 rounded-md border-2 border-white/80 flex flex-col gap-0.5 p-0.5">
                <div className="w-full h-[2px] bg-white/60 rounded-full" />
                <div className="flex gap-0.5 flex-1">
                  <div className="w-1/3 bg-white/40 rounded-sm" />
                  <div className="flex-1 bg-white/25 rounded-sm" />
                </div>
              </div>
            </motion.div>
            <p
              className="text-xl font-bold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #3D4EF0, #8B5CF6)" }}
            >
              Your app is ready
            </p>
            <p className="text-[#0C0F18]/30 dark:text-white/30 text-xs font-mono tracking-wide">
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
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
      <PhaseOverlay />
    </div>
  );
}
