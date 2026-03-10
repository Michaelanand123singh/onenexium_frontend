import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
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

function smooth(x: number): number {
  return x * x * (3 - 2 * x);
}

// ── Colors ──
const BLUE = new THREE.Color("#3D4EF0");
const CYAN = new THREE.Color("#23A0FF");
const VIOLET = new THREE.Color("#8B5CF6");
const GREEN = new THREE.Color("#10B981");
const AMBER = new THREE.Color("#F59E0B");

// ── Particle count ──
const N = 600;

// ── Generate shape targets ──
function generateShapes() {
  const wave = new Float32Array(N * 3);
  const helix = new Float32Array(N * 3);
  const grid = new Float32Array(N * 3);
  const stagger = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    // WAVE: flowing ocean-like surface
    const row = Math.floor(i / 30);
    const col = i % 30;
    const wx = (col - 14.5) * 0.42;
    const wy = (row - 10) * 0.42;
    wave[i * 3] = wx;
    wave[i * 3 + 1] = wy;
    wave[i * 3 + 2] = 0;

    // HELIX: double helix DNA strand
    const strand = i % 2;
    const idx = Math.floor(i / 2);
    const theta = (idx / (N / 2)) * Math.PI * 6;
    const hY = (idx / (N / 2)) * 10 - 5;
    const hR = 1.8;
    const offset = strand * Math.PI;
    helix[i * 3] = Math.cos(theta + offset) * hR;
    helix[i * 3 + 1] = hY;
    helix[i * 3 + 2] = Math.sin(theta + offset) * hR - 1;

    // GRID: 3D cube lattice
    const side = Math.ceil(Math.cbrt(N));
    const gi = i % side;
    const gj = Math.floor(i / side) % side;
    const gk = Math.floor(i / (side * side));
    const spacing = 0.55;
    grid[i * 3] = (gi - side / 2) * spacing;
    grid[i * 3 + 1] = (gj - side / 2) * spacing;
    grid[i * 3 + 2] = (gk - side / 2) * spacing - 1;

    // Stagger delay based on distance from center
    stagger[i] = Math.sqrt(wave[i * 3] ** 2 + wave[i * 3 + 1] ** 2) * 0.04;
  }

  return { wave, helix, grid, stagger };
}

// ── Main particle system ──
function MorphParticles() {
  const ref = useRef<THREE.Points>(null);
  const { wave, helix, grid, stagger } = useMemo(generateShapes, []);

  const positions = useMemo(() => wave.slice(), [wave]);
  const colors = useMemo(() => {
    const c = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      c[i * 3] = BLUE.r;
      c[i * 3 + 1] = BLUE.g;
      c[i * 3 + 2] = BLUE.b;
    }
    return c;
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
      const d = stagger[i];
      let tx: number, ty: number, tz: number;
      let col: THREE.Color;
      let speed = 0.04;

      if (phase === "prompt") {
        // Animated ocean wave
        const wx = wave[ix];
        const wy = wave[ix + 1];
        tx = wx;
        ty = wy;
        tz = Math.sin(wx * 1.2 + t * 0.8) * 0.4
           + Math.cos(wy * 0.9 + t * 0.6) * 0.3
           + Math.sin((wx + wy) * 0.7 + t * 1.1) * 0.2;

        const blend3 = (Math.sin(t * 0.3 + i * 0.01) + 1) * 0.5;
        col = new THREE.Color().lerpColors(BLUE, VIOLET, blend3);

        // Transition to helix in last 18%
        if (progress > 0.82) {
          const b = Math.max(0, smooth((progress - 0.82) / 0.18) - d * 1.2);
          const ht = t * 0.3;
          tx = THREE.MathUtils.lerp(tx, helix[ix] * Math.cos(ht) - helix[ix + 2] * Math.sin(ht), b);
          ty = THREE.MathUtils.lerp(ty, helix[ix + 1], b);
          tz = THREE.MathUtils.lerp(tz, helix[ix] * Math.sin(ht) + helix[ix + 2] * Math.cos(ht), b);
          speed = 0.06;
        }
      } else if (phase === "code") {
        // Spinning double helix
        const spin = t * 0.5;
        const rawX = helix[ix];
        const rawZ = helix[ix + 2];
        tx = rawX * Math.cos(spin) - rawZ * Math.sin(spin);
        ty = helix[ix + 1] + Math.sin(t * 2 + i * 0.02) * 0.08;
        tz = rawX * Math.sin(spin) + rawZ * Math.cos(spin);

        const strand = i % 2;
        col = strand === 0 ? GREEN : CYAN;
        speed = 0.05;

        // Transition to grid in last 18%
        if (progress > 0.82) {
          const b = Math.max(0, smooth((progress - 0.82) / 0.18) - d * 1.2);
          tx = THREE.MathUtils.lerp(tx, grid[ix], b);
          ty = THREE.MathUtils.lerp(ty, grid[ix + 1], b);
          tz = THREE.MathUtils.lerp(tz, grid[ix + 2], b);
        }
      } else {
        // Breathing cube lattice
        const breathe = 1 + Math.sin(t * 0.6) * 0.06;
        const rot = t * 0.15;
        const gx = grid[ix] * breathe;
        const gy = grid[ix + 1] * breathe;
        const gz = grid[ix + 2] * breathe;
        // Rotate around Y axis
        tx = gx * Math.cos(rot) - gz * Math.sin(rot);
        ty = gy;
        tz = gx * Math.sin(rot) + gz * Math.cos(rot);

        const dist = Math.sqrt(gx ** 2 + gy ** 2 + gz ** 2);
        col = new THREE.Color().lerpColors(BLUE, AMBER, Math.min(dist / 3, 1));
        speed = 0.04;

        // Dissolve back to wave in last 22%
        if (progress > 0.78) {
          const b = Math.max(0, smooth((progress - 0.78) / 0.22) - d * 1.0);
          const wx = wave[ix];
          const wy = wave[ix + 1];
          const wz = Math.sin(wx * 1.2 + t * 0.8) * 0.4 + Math.cos(wy * 0.9 + t * 0.6) * 0.3;
          tx = THREE.MathUtils.lerp(tx, wx, b);
          ty = THREE.MathUtils.lerp(ty, wy, b);
          tz = THREE.MathUtils.lerp(tz, wz, b);
        }
      }

      p[ix] = THREE.MathUtils.lerp(p[ix], tx, speed);
      p[ix + 1] = THREE.MathUtils.lerp(p[ix + 1], ty, speed);
      p[ix + 2] = THREE.MathUtils.lerp(p[ix + 2], tz, speed);

      c[ix] = THREE.MathUtils.lerp(c[ix], col.r, 0.025);
      c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], col.g, 0.025);
      c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], col.b, 0.025);
    }

    pa.needsUpdate = true;
    ca.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Connection lines between nearby particles ──
function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const MAX_LINES = 1200;
  const positions = useMemo(() => new Float32Array(MAX_LINES * 6), []);
  const lineColors = useMemo(() => new Float32Array(MAX_LINES * 6), []);

  useFrame(() => {
    if (!lineRef.current) return;
    const parent = lineRef.current.parent;
    if (!parent) return;

    // Find the points object to read positions
    let pointsObj: THREE.Points | null = null;
    parent.traverse((child) => {
      if (child instanceof THREE.Points) pointsObj = child;
    });
    if (!pointsObj) return;

    const pts = (pointsObj as THREE.Points).geometry.attributes.position as THREE.BufferAttribute;
    const pArr = pts.array as Float32Array;
    const threshold = 1.1;
    const threshSq = threshold * threshold;

    let lineIdx = 0;
    // Sample subset for performance
    const step = 4;
    for (let i = 0; i < N && lineIdx < MAX_LINES; i += step) {
      for (let j = i + step; j < N && lineIdx < MAX_LINES; j += step) {
        const dx = pArr[i * 3] - pArr[j * 3];
        const dy = pArr[i * 3 + 1] - pArr[j * 3 + 1];
        const dz = pArr[i * 3 + 2] - pArr[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < threshSq) {
          const alpha = 1 - Math.sqrt(distSq) / threshold;
          const li = lineIdx * 6;
          positions[li] = pArr[i * 3];
          positions[li + 1] = pArr[i * 3 + 1];
          positions[li + 2] = pArr[i * 3 + 2];
          positions[li + 3] = pArr[j * 3];
          positions[li + 4] = pArr[j * 3 + 1];
          positions[li + 5] = pArr[j * 3 + 2];

          const a = alpha * 0.3;
          lineColors[li] = a;
          lineColors[li + 1] = a;
          lineColors[li + 2] = a * 1.5;
          lineColors[li + 3] = a;
          lineColors[li + 4] = a;
          lineColors[li + 5] = a * 1.5;
          lineIdx++;
        }
      }
    }

    // Zero out unused
    for (let k = lineIdx * 6; k < MAX_LINES * 6; k++) {
      positions[k] = 0;
      lineColors[k] = 0;
    }

    const geo = lineRef.current.geometry;
    (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    geo.setDrawRange(0, lineIdx * 2);
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

// ── Soft ambient haze ──
function AmbientHaze() {
  const ref = useRef<THREE.Points>(null);
  const count = 150;
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    return p;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3D4EF0"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Scene ──
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} intensity={0.4} color="#3D4EF0" />
      <pointLight position={[-3, -2, 3]} intensity={0.25} color="#8B5CF6" />

      <MorphParticles />
      <ConnectionLines />
      <AmbientHaze />
    </>
  );
}

// ── CSS overlay ──
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
              <span className="text-[9px] text-[#10B981]/50 dark:text-[#10B981]/70 font-mono tracking-widest">generating</span>
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
        camera={{ position: [0, 0, 7], fov: 55 }}
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
