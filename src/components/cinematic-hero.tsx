import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

// ── Phase system ──
const CYCLE = 18;
type Phase = "prompt" | "process" | "code" | "assemble" | "reveal";

type PhaseInfo = { phase: Phase; progress: number };

function computePhase(t: number): PhaseInfo {
  const ct = t % CYCLE;
  if (ct < 4) return { phase: "prompt", progress: ct / 4 };
  if (ct < 8) return { phase: "process", progress: (ct - 4) / 4 };
  if (ct < 12) return { phase: "code", progress: (ct - 8) / 4 };
  if (ct < 15.5) return { phase: "assemble", progress: (ct - 12) / 3.5 };
  return { phase: "reveal", progress: (ct - 15.5) / 2.5 };
}

// ── Colors ──
const CP = new THREE.Color("#3D4EF0");
const CS = new THREE.Color("#23A0FF");
const CA = new THREE.Color("#6366f1");
const CG = new THREE.Color("#10B981");
const CW = new THREE.Color("#ffffff");

function pickBrandColor(i: number): THREE.Color {
  return i % 3 === 0 ? CP : i % 3 === 1 ? CS : CA;
}

// ── Phase-aware particles ──
function PhaseParticles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = pickBrandColor(i);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  // Speeds per-particle (stable across frames)
  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.0005 + Math.random() * 0.002;
    return s;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();
    const { phase, progress } = computePhase(elapsed);
    const pa = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const ca = ref.current.geometry.attributes.color as THREE.BufferAttribute;
    const p = pa.array as Float32Array;
    const c = ca.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = p[ix], y = p[ix + 1], z = p[ix + 2];

      // Base slow orbit
      const a = speeds[i];
      const co = Math.cos(a), si = Math.sin(a);
      const rx = x * co - z * si;
      const rz = x * si + z * co;
      x = rx;
      z = rz;

      const brand = pickBrandColor(i);

      if (phase === "prompt") {
        y += Math.sin(elapsed * 0.3 + i * 0.1) * 0.001;
        c[ix] = THREE.MathUtils.lerp(c[ix], brand.r, 0.01);
        c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], brand.g, 0.01);
        c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], brand.b, 0.01);
      } else if (phase === "process") {
        const d = Math.sqrt(x * x + y * y + z * z);
        const pull = progress * 0.025;
        if (d > 0.4) { x -= (x / d) * pull; y -= (y / d) * pull; z -= (z / d) * pull; }
        const sa = progress * 0.04;
        const sx = x * Math.cos(sa) - z * Math.sin(sa);
        const sz = x * Math.sin(sa) + z * Math.cos(sa);
        x = sx; z = sz;
        const wb = progress * 0.4;
        c[ix] = THREE.MathUtils.lerp(c[ix], CW.r, wb * 0.015);
        c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], CW.g, wb * 0.015);
        c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], CW.b, wb * 0.015);
      } else if (phase === "code") {
        y -= 0.025 + (i % 10) * 0.004;
        if (y < -7) { y = 7 + Math.random() * 2; x = (Math.random() - 0.5) * 10; z = -2 + Math.random() * 2; }
        c[ix] = THREE.MathUtils.lerp(c[ix], CG.r, 0.018);
        c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], CG.g, 0.018);
        c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], CG.b, 0.018);
      } else if (phase === "assemble") {
        const gx = ((i % 20) - 10) * 0.45;
        const gy = (Math.floor(i / 20) % 15 - 7) * 0.45;
        const sp = 0.015 * Math.min(progress * 2, 1);
        x = THREE.MathUtils.lerp(x, gx, sp);
        y = THREE.MathUtils.lerp(y, gy, sp);
        z = THREE.MathUtils.lerp(z, -1, sp);
        c[ix] = THREE.MathUtils.lerp(c[ix], brand.r, 0.015);
        c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], brand.g, 0.015);
        c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], brand.b, 0.015);
      } else {
        const d2 = Math.sqrt(x * x + y * y + z * z);
        if (d2 > 0.1) { x += (x / d2) * progress * 0.015; y += (y / d2) * progress * 0.015; z += (z / d2) * progress * 0.015; }
        c[ix] = THREE.MathUtils.lerp(c[ix], brand.r, 0.025);
        c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], brand.g, 0.025);
        c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], brand.b, 0.025);
      }

      p[ix] = x; p[ix + 1] = y; p[ix + 2] = z;
    }
    pa.needsUpdate = true;
    ca.needsUpdate = true;
    ref.current.rotation.y = elapsed * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ── Energy core ──
function EnergyCore() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { phase, progress } = computePhase(t);
    const pulse = 1 + Math.sin(t * 3) * 0.1;

    if (core.current) {
      let s = 0.3;
      if (phase === "process") s = 0.3 + progress * 1.4;
      else if (phase === "code") s = 1.7 - progress * 0.4;
      else if (phase === "assemble") s = 1.3 - progress * 0.8;
      else if (phase === "reveal") s = 0.5 + Math.sin(progress * Math.PI) * 0.4;
      core.current.scale.setScalar(s * pulse);
      (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        phase === "process" ? 3 + progress * 6 : 3;
    }
    if (halo.current) {
      let hs = 1;
      if (phase === "process") hs = 1 + progress * 3;
      else if (phase === "code") hs = 4 - progress * 2;
      else if (phase === "assemble") hs = 2 - progress;
      halo.current.scale.setScalar(hs * (1 + Math.sin(t * 2) * 0.12));
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        phase === "process" ? 0.06 + progress * 0.12 : 0.06;
    }
  });

  return (
    <>
      <mesh ref={core}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fff" emissive="#3D4EF0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#3D4EF0" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Pulse rings during processing ──
function PulseRings() {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.RingGeometry(0.8, 1, 64), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const { phase } = computePhase(t);
    const vis = phase === "process" || phase === "code";

    group.current.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      if (vis) {
        const wave = (t * 0.8 + i * 0.3) % 2;
        m.scale.setScalar(wave * 4);
        (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.25 - wave * 0.12);
        m.visible = true;
      } else {
        m.visible = false;
      }
    });
  });

  return (
    <group ref={group} rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial color="#3D4EF0" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── App wireframe panels during assembly ──
const PANELS: { pos: [number, number, number]; size: [number, number]; color: string }[] = [
  { pos: [0, 0, 0], size: [3, 4.5], color: "#3D4EF0" },
  { pos: [-1.7, 0.5, 0.15], size: [1, 2], color: "#23A0FF" },
  { pos: [1.7, 0.5, 0.15], size: [1, 2], color: "#6366f1" },
  { pos: [0, -1.5, 0.25], size: [2.5, 0.8], color: "#23A0FF" },
  { pos: [0, 1.8, 0.25], size: [2.5, 0.5], color: "#3D4EF0" },
];

function AppWireframe() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const { phase, progress } = computePhase(clock.getElapsedTime());
    const show = phase === "assemble" || phase === "reveal";

    group.current.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      if (show) {
        const delay = i * 0.12;
        const ep = Math.max(0, (phase === "assemble" ? progress : 1) - delay);
        const op = Math.min(ep * 2.5, 0.6);
        const sc = Math.min(ep * 2.5, 1);
        m.visible = true;
        m.scale.set(sc, sc, 1);
        (m.material as THREE.MeshBasicMaterial).opacity =
          phase === "reveal" ? op * (1 - progress) : op;
      } else {
        m.visible = false;
      }
    });
  });

  return (
    <group ref={group}>
      {PANELS.map((panel, i) => (
        <mesh key={i} position={panel.pos}>
          <planeGeometry args={panel.size} />
          <meshBasicMaterial color={panel.color} transparent opacity={0} side={THREE.DoubleSide} wireframe depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── Three.js scene ──
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={3} color="#3D4EF0" distance={25} />
      <pointLight position={[-4, 3, 2]} intensity={1.5} color="#23A0FF" distance={20} />
      <pointLight position={[4, -2, 3]} intensity={1} color="#6366f1" distance={18} />
      <PhaseParticles count={600} />
      <EnergyCore />
      <PulseRings />
      <AppWireframe />
    </>
  );
}

// ── CSS overlay for cinematic text stages ──
const PROMPT = "Build me a SaaS dashboard with real-time analytics...";

const CODE_LINES = [
  { text: "export default function Dashboard() {", cls: "text-[#6366f1]" },
  { text: "  const data = useQuery(api.analytics);", cls: "text-[#23A0FF]" },
  { text: "  const charts = processMetrics(data);", cls: "text-[#10B981]" },
  { text: "  return <DashboardLayout>", cls: "text-white/70" },
  { text: "    <MetricCards data={charts} />", cls: "text-[#23A0FF]" },
  { text: "  </DashboardLayout>;", cls: "text-white/70" },
  { text: "}", cls: "text-[#6366f1]" },
];

function PhaseOverlay() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [typed, setTyped] = useState("");
  const mountRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - mountRef.current) / 1000;
      const info = computePhase(elapsed);
      setPhase(info.phase);
      if (info.phase === "prompt") {
        setTyped(PROMPT.slice(0, Math.floor(info.progress * PROMPT.length)));
      }
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "prompt" && (
          <motion.div key="prompt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-5 max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-[10px] text-white/25 font-mono">prompt.ai</span>
            </div>
            <p className="text-white/80 font-mono text-sm leading-relaxed">
              <span className="text-[#23A0FF]">{">"} </span>
              {typed}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-4 bg-[#3D4EF0] ml-0.5 -mb-0.5 rounded-sm" />
            </p>
          </motion.div>
        )}

        {phase === "process" && (
          <motion.div key="process" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-[#3D4EF0] border-t-transparent rounded-full" />
            <p className="text-white/50 text-sm font-mono tracking-wider uppercase">AI is thinking...</p>
          </motion.div>
        )}

        {phase === "code" && (
          <motion.div key="code" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}
            className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 max-w-md font-mono text-xs leading-relaxed">
            {CODE_LINES.map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className={line.cls}>
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        )}

        {phase === "assemble" && (
          <motion.div key="assemble" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3">
            <motion.p className="text-white/60 text-sm font-mono tracking-wider uppercase" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
              Assembling your app...
            </motion.p>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.95] }} transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1] }}
            className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}>
              Your app is ready
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main export ──
export default function CinematicHero() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
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
