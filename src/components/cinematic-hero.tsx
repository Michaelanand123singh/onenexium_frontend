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

// ── Soft gradient backdrop spheres ──
function GradientSpheres() {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (g1.current) {
      g1.current.position.x = Math.sin(t * 0.15) * 2 - 3;
      g1.current.position.y = Math.cos(t * 0.12) * 1.5 + 1;
    }
    if (g2.current) {
      g2.current.position.x = Math.cos(t * 0.1) * 2 + 3;
      g2.current.position.y = Math.sin(t * 0.13) * 1.5 - 0.5;
    }
    if (g3.current) {
      g3.current.position.x = Math.sin(t * 0.08 + 2) * 1.5;
      g3.current.position.y = Math.cos(t * 0.1 + 1) * 2 - 1;
    }
  });

  return (
    <>
      <mesh ref={g1} position={[-3, 1, -6]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#3D4EF0" transparent opacity={0.06} />
      </mesh>
      <mesh ref={g2} position={[3, -0.5, -5]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#23A0FF" transparent opacity={0.05} />
      </mesh>
      <mesh ref={g3} position={[0, -1, -7]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.04} />
      </mesh>
    </>
  );
}

// ── Connected constellation network ──
const NODE_COUNT = 120;
const CONNECT_DIST = 2.2;

function ConstellationNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Base positions for each phase target
  const { basePositions, codeTargets, gridTargets } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3);
    const code = new Float32Array(NODE_COUNT * 3);
    const grid = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      // Ambient: scattered in a wide ellipsoid
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 4;
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.4;
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      base[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 1;

      // Code: vertical columns
      const col = i % 8;
      const row = Math.floor(i / 8);
      code[i * 3] = (col - 3.5) * 0.9;
      code[i * 3 + 1] = 4 - row * 0.55;
      code[i * 3 + 2] = -1 + Math.random() * 0.3;

      // Grid: rectangular UI layout
      const gCol = i % 12;
      const gRow = Math.floor(i / 12);
      grid[i * 3] = (gCol - 5.5) * 0.7;
      grid[i * 3 + 1] = (5 - gRow) * 0.65;
      grid[i * 3 + 2] = -0.5;
    }
    return { basePositions: base, codeTargets: code, gridTargets: grid };
  }, []);

  // Line buffer (max possible connections)
  const maxLines = NODE_COUNT * 6;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  const driftSeeds = useMemo(() => {
    const s = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT * 3; i++) s[i] = Math.random() * 100;
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !linesRef.current) return;
    const t = clock.getElapsedTime();
    const { phase, progress } = computePhase(t);

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    // Determine target positions and lerp speed
    let lerpSpeed = 0.012;
    const eased = progress * progress * (3 - 2 * progress); // smoothstep

    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      let tx: number, ty: number, tz: number;

      if (phase === "prompt" || phase === "reveal") {
        tx = basePositions[ix];
        ty = basePositions[ix + 1];
        tz = basePositions[ix + 2];
        lerpSpeed = phase === "reveal" ? 0.015 * eased : 0.008;
      } else if (phase === "process") {
        // Pull toward center
        const pullFactor = 1 - eased * 0.7;
        tx = basePositions[ix] * pullFactor;
        ty = basePositions[ix + 1] * pullFactor;
        tz = basePositions[ix + 2] * pullFactor;
        lerpSpeed = 0.02;
      } else if (phase === "code") {
        tx = codeTargets[ix];
        ty = codeTargets[ix + 1];
        tz = codeTargets[ix + 2];
        lerpSpeed = 0.025 * eased;
      } else {
        tx = gridTargets[ix];
        ty = gridTargets[ix + 1];
        tz = gridTargets[ix + 2];
        lerpSpeed = 0.02 * eased;
      }

      // Add gentle drift
      const dx = Math.sin(t * 0.3 + driftSeeds[ix]) * 0.08;
      const dy = Math.cos(t * 0.25 + driftSeeds[ix + 1]) * 0.06;

      pos[ix] = THREE.MathUtils.lerp(pos[ix], tx + dx, lerpSpeed);
      pos[ix + 1] = THREE.MathUtils.lerp(pos[ix + 1], ty + dy, lerpSpeed);
      pos[ix + 2] = THREE.MathUtils.lerp(pos[ix + 2], tz, lerpSpeed);
    }
    posAttr.needsUpdate = true;

    // Slow global rotation
    pointsRef.current.rotation.y = Math.sin(t * 0.04) * 0.15;
    pointsRef.current.rotation.x = Math.sin(t * 0.03) * 0.05;

    // Rebuild connections
    let lineIdx = 0;
    const connectDist = phase === "process" ? CONNECT_DIST * 1.5 : CONNECT_DIST;

    const cPrimary = new THREE.Color("#3D4EF0");
    const cSecondary = new THREE.Color("#23A0FF");
    const cCode = new THREE.Color("#10B981");
    const lineColor = phase === "code" ? cCode : phase === "process" ? cSecondary : cPrimary;

    for (let i = 0; i < NODE_COUNT; i++) {
      const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (lineIdx >= maxLines) break;
        const bx = pos[j * 3], by = pos[j * 3 + 1], bz = pos[j * 3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectDist) {
          const alpha = 1 - dist / connectDist;
          const base6 = lineIdx * 6;
          linePositions[base6] = ax;
          linePositions[base6 + 1] = ay;
          linePositions[base6 + 2] = az;
          linePositions[base6 + 3] = bx;
          linePositions[base6 + 4] = by;
          linePositions[base6 + 5] = bz;
          lineColors[base6] = lineColor.r * alpha;
          lineColors[base6 + 1] = lineColor.g * alpha;
          lineColors[base6 + 2] = lineColor.b * alpha;
          lineColors[base6 + 3] = lineColor.r * alpha;
          lineColors[base6 + 4] = lineColor.g * alpha;
          lineColors[base6 + 5] = lineColor.b * alpha;
          lineIdx++;
        }
      }
    }

    // Zero out unused lines
    for (let k = lineIdx * 6; k < linePositions.length; k++) {
      linePositions[k] = 0;
      lineColors[k] = 0;
    }

    const lPosAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const lColAttr = linesRef.current.geometry.attributes.color as THREE.BufferAttribute;
    (lPosAttr.array as Float32Array).set(linePositions);
    (lColAttr.array as Float32Array).set(lineColors);
    lPosAttr.needsUpdate = true;
    lColAttr.needsUpdate = true;

    linesRef.current.rotation.copy(pointsRef.current.rotation);
  });

  // Initial node colors
  const nodeColors = useMemo(() => {
    const c = new Float32Array(NODE_COUNT * 3);
    const colors = [
      new THREE.Color("#3D4EF0"),
      new THREE.Color("#23A0FF"),
      new THREE.Color("#6366f1"),
    ];
    for (let i = 0; i < NODE_COUNT; i++) {
      const col = colors[i % 3];
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[basePositions.slice(), 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
    </>
  );
}

// ── Floating translucent shapes ──
const SHAPES: { pos: [number, number, number]; speed: number; rotSpeed: number; color: string; geo: "oct" | "tet" | "ico" }[] = [
  { pos: [-4.5, 2.5, -2], speed: 0.3, rotSpeed: 0.4, color: "#3D4EF0", geo: "oct" },
  { pos: [4.8, -1.8, -1.5], speed: 0.25, rotSpeed: 0.5, color: "#23A0FF", geo: "tet" },
  { pos: [-3.2, -2.8, -3], speed: 0.35, rotSpeed: 0.35, color: "#6366f1", geo: "ico" },
  { pos: [3.5, 3.2, -2.5], speed: 0.28, rotSpeed: 0.6, color: "#23A0FF", geo: "oct" },
  { pos: [-5.5, 0.3, -1], speed: 0.22, rotSpeed: 0.45, color: "#3D4EF0", geo: "tet" },
  { pos: [5.2, 1.2, -3.5], speed: 0.4, rotSpeed: 0.3, color: "#6366f1", geo: "ico" },
];

function FloatingShape({ pos, speed, rotSpeed, color, geo }: typeof SHAPES[number]) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = pos[1] + Math.sin(t) * 0.6;
    ref.current.position.x = pos[0] + Math.cos(t * 0.7) * 0.25;
    ref.current.rotation.x = t * rotSpeed;
    ref.current.rotation.z = t * rotSpeed * 0.6;
  });

  const Geo = geo === "oct"
    ? <octahedronGeometry args={[0.2, 0]} />
    : geo === "tet"
      ? <tetrahedronGeometry args={[0.22, 0]} />
      : <icosahedronGeometry args={[0.18, 0]} />;

  return (
    <mesh ref={ref} position={pos}>
      {Geo}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.35}
        metalness={0.2}
        roughness={0.6}
        wireframe
      />
    </mesh>
  );
}

// ── Orbital rings with traveling dots ──
function OrbitalRing({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (dotRef.current) {
      dotRef.current.position.x = Math.cos(t) * radius;
      dotRef.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.5]}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ── Scene ──
function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#3D4EF0" />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color="#23A0FF" />

      <GradientSpheres />
      <ConstellationNetwork />

      {SHAPES.map((shape, i) => (
        <FloatingShape key={`shape-${i}`} {...shape} />
      ))}

      <OrbitalRing radius={5} tilt={0.3} speed={0.15} color="#3D4EF0" />
      <OrbitalRing radius={6.5} tilt={-0.5} speed={-0.1} color="#23A0FF" />
      <OrbitalRing radius={4} tilt={0.8} speed={0.2} color="#6366f1" />
    </>
  );
}

// ── CSS phase overlay ──
const PROMPT_TEXT = "Build me a SaaS dashboard with real-time analytics...";

const CODE_LINES = [
  { text: "export default function Dashboard() {", cls: "text-[#6366f1]" },
  { text: "  const data = useQuery(api.analytics);", cls: "text-[#3D4EF0]" },
  { text: "  const charts = processMetrics(data);", cls: "text-[#10B981]" },
  { text: "  return <DashboardLayout>", cls: "text-[#0C0F18]/60" },
  { text: "    <MetricCards data={charts} />", cls: "text-[#3D4EF0]" },
  { text: "  </DashboardLayout>;", cls: "text-[#0C0F18]/60" },
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-xl border border-[#3D4EF0]/10 rounded-2xl px-8 py-5 max-w-lg shadow-xl shadow-[#3D4EF0]/8"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6059]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-2 text-[10px] text-[#0C0F18]/25 font-mono">prompt.ai</span>
            </div>
            <p className="text-[#0C0F18]/75 font-mono text-sm leading-relaxed">
              <span className="text-[#3D4EF0] font-bold">{">"} </span>
              {typed}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.53, repeat: Infinity }}
                className="inline-block w-1.5 h-4 bg-[#3D4EF0] ml-0.5 -mb-0.5 rounded-sm"
              />
            </p>
          </motion.div>
        )}

        {phase === "process" && (
          <motion.div
            key="process"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full border-2 border-[#3D4EF0]/60 border-t-transparent"
            />
            <p className="text-[#0C0F18]/40 text-sm font-mono tracking-wider uppercase">
              AI is thinking...
            </p>
          </motion.div>
        )}

        {phase === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/70 backdrop-blur-xl border border-[#3D4EF0]/10 rounded-2xl px-6 py-4 max-w-md font-mono text-xs leading-relaxed shadow-xl shadow-[#3D4EF0]/8"
          >
            {CODE_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className={line.cls}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        )}

        {phase === "assemble" && (
          <motion.div
            key="assemble"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.p
              className="text-[#0C0F18]/40 text-sm font-mono tracking-wider uppercase"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Assembling your app...
            </motion.p>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.97] }}
            transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <p
              className="text-lg font-bold text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}
            >
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
