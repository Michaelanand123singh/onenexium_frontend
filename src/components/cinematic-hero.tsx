import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

// ── Three clear phases: Prompt → Code → App ──
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
  return x * x * (3 - 2 * x);
}

// ── Brand palette ──
const BLUE = new THREE.Color("#3D4EF0");
const CYAN = new THREE.Color("#23A0FF");
const VIOLET = new THREE.Color("#6366f1");
const GREEN = new THREE.Color("#10B981");
const TEAL = new THREE.Color("#14b8a6");

// ── Main morphing particle system ──
const COUNT = 500;

function TransformParticles() {
  const ref = useRef<THREE.Points>(null);

  const { nebula, columns, appFrame, delays } = useMemo(() => {
    const neb = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const app = new Float32Array(COUNT * 3);
    const del = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // NEBULA: toroidal disc galaxy shape
      const angle = Math.random() * Math.PI * 2;
      const arm = Math.floor(Math.random() * 3); // 3 spiral arms
      const armAngle = angle + (arm * Math.PI * 2) / 3;
      const r = 1.2 + Math.random() * 3.8;
      const spread = (1 - r / 5) * 0.8;
      neb[i * 3] = Math.cos(armAngle + r * 0.3) * r;
      neb[i * 3 + 1] = (Math.random() - 0.5) * spread;
      neb[i * 3 + 2] = Math.sin(armAngle + r * 0.3) * r - 1;

      // CODE: vertical streaming columns
      const cIdx = i % 12;
      const cRow = Math.floor(i / 12);
      col[i * 3] = (cIdx - 5.5) * 0.75;
      col[i * 3 + 1] = 5.5 - (cRow % 42) * 0.28;
      col[i * 3 + 2] = -1 + (Math.random() - 0.5) * 0.4;

      // APP: UI layout frame
      const sec = i % 100;
      if (sec < 20) {
        // Outer rectangle border
        const side = sec % 4;
        if (side === 0) { app[i * 3] = (Math.random() - 0.5) * 6; app[i * 3 + 1] = 2.8; }
        else if (side === 1) { app[i * 3] = (Math.random() - 0.5) * 6; app[i * 3 + 1] = -2.8; }
        else if (side === 2) { app[i * 3] = -3; app[i * 3 + 1] = (Math.random() - 0.5) * 5.6; }
        else { app[i * 3] = 3; app[i * 3 + 1] = (Math.random() - 0.5) * 5.6; }
        app[i * 3 + 2] = -0.5;
      } else if (sec < 35) {
        // Sidebar
        app[i * 3] = -2.2 + Math.random() * 0.7;
        app[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
        app[i * 3 + 2] = -0.3;
      } else if (sec < 50) {
        // Top nav bar
        app[i * 3] = -1 + Math.random() * 4;
        app[i * 3 + 1] = 2.1 + Math.random() * 0.4;
        app[i * 3 + 2] = -0.3;
      } else if (sec < 75) {
        // Content cards (3 cards in a row)
        const card = Math.floor((sec - 50) / 8);
        const cardX = [-0.3, 1.2, 2.7][card % 3] ?? 1.2;
        app[i * 3] = cardX + (Math.random() - 0.5) * 0.9;
        app[i * 3 + 1] = 0.5 + (Math.random() - 0.5) * 1.2;
        app[i * 3 + 2] = -0.2;
      } else {
        // Bottom chart area
        app[i * 3] = -0.5 + Math.random() * 3.5;
        app[i * 3 + 1] = -1.5 + (Math.random() - 0.5) * 1.8;
        app[i * 3 + 2] = -0.2;
      }

      // Wave delay: particles near center transition first
      del[i] = Math.sqrt(neb[i * 3] ** 2 + neb[i * 3 + 1] ** 2) * 0.06;
    }
    return { nebula: neb, columns: col, appFrame: app, delays: del };
  }, []);

  const positions = useMemo(() => nebula.slice(), [nebula]);
  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const b = i % 3 === 0 ? BLUE : i % 3 === 1 ? CYAN : VIOLET;
      c[i * 3] = b.r; c[i * 3 + 1] = b.g; c[i * 3 + 2] = b.b;
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

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const d = delays[i];
      let tx: number, ty: number, tz: number;
      let tc: THREE.Color;
      let spd = 0.035;

      if (phase === "prompt") {
        // Rotating nebula
        const rot = t * 0.06 + d;
        const bx = nebula[ix], bz = nebula[ix + 2];
        tx = bx * Math.cos(rot) - bz * Math.sin(rot);
        ty = nebula[ix + 1] + Math.sin(t * 0.4 + i * 0.015) * 0.12;
        tz = bx * Math.sin(rot) + bz * Math.cos(rot);
        tc = i % 3 === 0 ? BLUE : i % 3 === 1 ? CYAN : VIOLET;

        // Pre-transition pull toward columns in last 15%
        if (progress > 0.85) {
          const blend = Math.max(0, ease((progress - 0.85) / 0.15) - d * 1.5);
          tx = THREE.MathUtils.lerp(tx, columns[ix], blend);
          ty = THREE.MathUtils.lerp(ty, columns[ix + 1], blend);
          tz = THREE.MathUtils.lerp(tz, columns[ix + 2], blend);
          spd = 0.05;
        }
      } else if (phase === "code") {
        // Cascading code columns
        const cascade = ((progress * 8 + d * 3 + i * 0.003) % 11) - 5.5;
        tx = columns[ix];
        ty = cascade;
        tz = columns[ix + 2];
        tc = i % 3 === 0 ? GREEN : i % 3 === 1 ? TEAL : CYAN;
        spd = 0.06;

        // Pre-transition snap toward app frame in last 15%
        if (progress > 0.85) {
          const blend = Math.max(0, ease((progress - 0.85) / 0.15) - d * 1.5);
          tx = THREE.MathUtils.lerp(tx, appFrame[ix], blend);
          ty = THREE.MathUtils.lerp(ty, appFrame[ix + 1], blend);
          tz = THREE.MathUtils.lerp(tz, appFrame[ix + 2], blend);
        }
      } else {
        // App UI layout with gentle float
        tx = appFrame[ix] + Math.sin(t * 0.25 + i * 0.008) * 0.025;
        ty = appFrame[ix + 1] + Math.cos(t * 0.2 + i * 0.008) * 0.02;
        tz = appFrame[ix + 2];
        tc = i % 3 === 0 ? BLUE : i % 3 === 1 ? CYAN : VIOLET;
        spd = 0.04;

        // Dissolve back to nebula in last 20%
        if (progress > 0.8) {
          const blend = Math.max(0, ease((progress - 0.8) / 0.2) - d * 1.2);
          const rot = t * 0.06 + d;
          const bx = nebula[ix], bz = nebula[ix + 2];
          const nx = bx * Math.cos(rot) - bz * Math.sin(rot);
          const nz = bx * Math.sin(rot) + bz * Math.cos(rot);
          tx = THREE.MathUtils.lerp(tx, nx, blend);
          ty = THREE.MathUtils.lerp(ty, nebula[ix + 1], blend);
          tz = THREE.MathUtils.lerp(tz, nz, blend);
        }
      }

      p[ix] = THREE.MathUtils.lerp(p[ix], tx, spd);
      p[ix + 1] = THREE.MathUtils.lerp(p[ix + 1], ty, spd);
      p[ix + 2] = THREE.MathUtils.lerp(p[ix + 2], tz, spd);

      c[ix] = THREE.MathUtils.lerp(c[ix], tc.r, 0.02);
      c[ix + 1] = THREE.MathUtils.lerp(c[ix + 1], tc.g, 0.02);
      c[ix + 2] = THREE.MathUtils.lerp(c[ix + 2], tc.b, 0.02);
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
      <pointsMaterial size={0.09} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Central glow orb ──
function CentralOrb() {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { phase, progress } = getPhase(t);
    const pulse = 1 + Math.sin(t * 2.5) * 0.12;

    if (inner.current) {
      const base = phase === "code" ? 0.5 + progress * 0.3 : phase === "app" ? 0.6 : 0.35;
      inner.current.scale.setScalar(base * pulse);
      const mat = inner.current.material as THREE.MeshStandardMaterial;
      mat.emissive = phase === "code" ? GREEN : BLUE;
      mat.emissiveIntensity = phase === "code" ? 4 + progress * 3 : 2.5;
    }
    if (outer.current) {
      const haloBase = phase === "code" ? 2.5 : phase === "app" ? 1.5 : 1.8;
      outer.current.scale.setScalar(haloBase * (1 + Math.sin(t * 1.8) * 0.1));
      const mat = outer.current.material as THREE.MeshBasicMaterial;
      mat.color = phase === "code" ? GREEN : BLUE;
      mat.opacity = phase === "code" ? 0.06 + progress * 0.04 : 0.04;
    }
  });

  return (
    <>
      <mesh ref={inner}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#fff" emissive="#3D4EF0" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh ref={outer}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#3D4EF0" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Transition shockwave rings ──
function ShockwaveRings() {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.RingGeometry(0.9, 1.05, 80), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const raw = t % CYCLE;
    // Trigger near phase transitions at t=6, t=12
    const triggers = [6, 12, 0];

    group.current.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      const trigger = triggers[i];
      const dt = ((raw - trigger + CYCLE) % CYCLE);
      if (dt < 2) {
        m.visible = true;
        const p = dt / 2;
        m.scale.setScalar(p * 6);
        (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.2 * (1 - p));
      } else {
        m.visible = false;
      }
    });
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#3D4EF0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── Ambient floating dust for depth ──
function AmbientDust({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.005;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.008) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#3D4EF0" transparent opacity={0.2} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Orbital accent rings ──
function OrbitalRing({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const dot = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime() * speed;
    if (dot.current) {
      dot.current.position.x = Math.cos(a) * radius;
      dot.current.position.z = Math.sin(a) * radius;
    }
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.4]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.008, radius + 0.008, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ── Scene composition ──
function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 4, 5]} intensity={0.3} color="#3D4EF0" />
      <directionalLight position={[-4, -2, 4]} intensity={0.2} color="#23A0FF" />

      <TransformParticles />
      <CentralOrb />
      <ShockwaveRings />
      <AmbientDust />

      <OrbitalRing radius={5.5} tilt={0.25} speed={0.12} color="#3D4EF0" />
      <OrbitalRing radius={7} tilt={-0.45} speed={-0.08} color="#23A0FF" />
      <OrbitalRing radius={4.2} tilt={0.7} speed={0.18} color="#6366f1" />
    </>
  );
}

// ── CSS phase overlay ──
const PROMPT_TEXT = "Build me a SaaS dashboard with real-time analytics...";

const CODE_LINES = [
  { text: "export default function Dashboard() {", cls: "text-[#6366f1]" },
  { text: "  const data = useQuery(api.analytics);", cls: "text-[#3D4EF0]" },
  { text: "  const metrics = processData(data);", cls: "text-[#10B981]" },
  { text: "  return (", cls: "text-[#0C0F18]/50 dark:text-white/50" },
  { text: "    <Layout sidebar={<NavMenu />}>", cls: "text-[#3D4EF0]" },
  { text: "      <MetricCards data={metrics} />", cls: "text-[#14b8a6]" },
  { text: "      <RevenueChart data={metrics} />", cls: "text-[#10B981]" },
  { text: "    </Layout>", cls: "text-[#0C0F18]/50 dark:text-white/50" },
  { text: "  );", cls: "text-[#0C0F18]/50 dark:text-white/50" },
  { text: "}", cls: "text-[#6366f1]" },
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
            className="bg-white/75 dark:bg-white/10 backdrop-blur-xl border border-[#3D4EF0]/10 dark:border-[#3D4EF0]/20 rounded-2xl px-8 py-5 max-w-lg shadow-xl shadow-[#3D4EF0]/6"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6059]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-2 text-[10px] text-[#0C0F18]/20 dark:text-white/20 font-mono tracking-wider">onenexium.ai</span>
            </div>
            <p className="text-[#0C0F18]/75 dark:text-white/75 font-mono text-sm leading-relaxed">
              <span className="text-[#3D4EF0] font-semibold">{">"} </span>
              {typed}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-[7px] h-[17px] bg-[#3D4EF0] ml-0.5 -mb-[3px] rounded-[2px]"
              />
            </p>
          </motion.div>
        )}

        {phase === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="bg-white/75 dark:bg-white/10 backdrop-blur-xl border border-[#10B981]/15 dark:border-[#10B981]/25 rounded-2xl px-6 py-4 max-w-md font-mono text-xs leading-[1.8] shadow-xl shadow-[#10B981]/6"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[10px] text-[#10B981]/60 dark:text-[#10B981]/80 font-mono tracking-wider">generating code...</span>
            </div>
            {CODE_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
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
            animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.97] }}
            transition={{ duration: 5.5, times: [0, 0.15, 0.75, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              className="w-12 h-12 rounded-xl border-2 border-[#3D4EF0]/30 flex items-center justify-center"
              animate={{ borderColor: ["rgba(61,78,240,0.3)", "rgba(35,160,255,0.5)", "rgba(61,78,240,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-5 h-5 rounded-md bg-gradient-to-br from-[#3D4EF0] to-[#23A0FF]"
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <p
              className="text-lg font-bold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}
            >
              Your app is ready
            </p>
            <p className="text-[#0C0F18]/35 dark:text-white/35 text-xs font-mono">Dashboard deployed successfully</p>
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
