import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Central morphing wireframe sphere ──
function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(2.2, 4), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;

    // Slowly rotate
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.3;

    // Morph vertices
    const posAttr = geo.attributes.position;
    const original = geo.attributes.position.clone();
    for (let i = 0; i < posAttr.count; i++) {
      const ox = original.getX(i);
      const oy = original.getY(i);
      const oz = original.getZ(i);

      const noise =
        Math.sin(ox * 2 + t * 0.8) * 0.12 +
        Math.cos(oy * 3 + t * 0.6) * 0.1 +
        Math.sin(oz * 2.5 + t * 0.9) * 0.08;

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const scale = 1 + noise / len;
      posAttr.setXYZ(i, ox * scale, oy * scale, oz * scale);
    }
    posAttr.needsUpdate = true;

    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(geo, 15),
    [geo],
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Solid inner glow */}
      <mesh ref={meshRef} geometry={geo}>
        <meshStandardMaterial
          color="#3D4EF0"
          emissive="#3D4EF0"
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe edges */}
      <lineSegments ref={wireRef} geometry={edgesGeo}>
        <lineBasicMaterial
          color="#3D4EF0"
          transparent
          opacity={0.55}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

// ── Flowing energy ribbons ──
function EnergyRibbon({
  radius,
  speed,
  color,
  tiltX,
  tiltZ,
  thickness,
}: {
  radius: number;
  speed: number;
  color: string;
  tiltX: number;
  tiltZ: number;
  thickness: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 80 }, (_, i) => {
        const angle = (i / 80) * Math.PI * 2;
        const wobble = Math.sin(angle * 3) * 0.3 + Math.cos(angle * 5) * 0.15;
        return new THREE.Vector3(
          Math.cos(angle) * (radius + wobble),
          Math.sin(angle * 2) * 0.4,
          Math.sin(angle) * (radius + wobble),
        );
      }),
      true,
    );
    return new THREE.TubeGeometry(curve, 120, thickness, 6, true);
  }, [radius, thickness]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * speed;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[tiltX, 0, tiltZ]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Floating data particles with trails ──
function DataParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#3D4EF0");
    const c2 = new THREE.Color("#23A0FF");
    const c3 = new THREE.Color("#6366f1");

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Orbital velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const pick = Math.random();
      const c = pick < 0.4 ? c1 : pick < 0.7 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Orbit around center with drift
      const x = posAttr.array[idx] as number;
      const z = posAttr.array[idx + 2] as number;
      const angle = 0.002 + velocities[idx] * 0.5;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      (posAttr.array as Float32Array)[idx] = x * cos - z * sin;
      (posAttr.array as Float32Array)[idx + 2] = x * sin + z * cos;
      (posAttr.array as Float32Array)[idx + 1] +=
        Math.sin(t * 0.3 + i * 0.1) * 0.002;
    }
    posAttr.needsUpdate = true;

    // Slow overall rotation
    pointsRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Pulsing energy core ──
function EnergyCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      coreRef.current.scale.setScalar(pulse);
    }
    if (haloRef.current) {
      const haloPulse = 1 + Math.sin(t * 1.5 + 1) * 0.2;
      haloRef.current.scale.setScalar(haloPulse);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 2) * 0.03;
    }
  });

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#3D4EF0"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#3D4EF0"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// ── Floating geometric shards ──
function FloatingShard({
  position,
  speed,
  rotSpeed,
  color,
}: {
  position: [number, number, number];
  speed: number;
  rotSpeed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.8;
    ref.current.position.x = position[0] + Math.cos(t * 0.6) * 0.3;
    ref.current.rotation.x = t * rotSpeed;
    ref.current.rotation.z = t * rotSpeed * 0.7;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

// ── Scene ──
const SHARD_DATA: {
  position: [number, number, number];
  speed: number;
  rotSpeed: number;
  color: string;
}[] = [
  { position: [-4, 2, -3], speed: 0.4, rotSpeed: 0.5, color: "#3D4EF0" },
  { position: [4.5, -1.5, -2], speed: 0.35, rotSpeed: 0.7, color: "#23A0FF" },
  { position: [-3, -2.5, -4], speed: 0.5, rotSpeed: 0.4, color: "#6366f1" },
  { position: [3, 3, -3], speed: 0.45, rotSpeed: 0.6, color: "#23A0FF" },
  { position: [-5, 0.5, -2], speed: 0.3, rotSpeed: 0.8, color: "#3D4EF0" },
  { position: [5, 1, -4], speed: 0.55, rotSpeed: 0.35, color: "#6366f1" },
  { position: [0, -3.5, -3], speed: 0.42, rotSpeed: 0.55, color: "#23A0FF" },
  { position: [-2, 3.5, -5], speed: 0.38, rotSpeed: 0.65, color: "#3D4EF0" },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />

      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#3D4EF0" />
      <directionalLight position={[-5, -3, 3]} intensity={0.8} color="#23A0FF" />

      <pointLight position={[0, 0, 4]} intensity={3} color="#3D4EF0" distance={25} />
      <pointLight position={[-4, 3, 2]} intensity={2} color="#23A0FF" distance={20} />
      <pointLight position={[4, -2, 2]} intensity={1.5} color="#6366f1" distance={18} />

      {/* Central morphing wireframe sphere */}
      <MorphingSphere />

      {/* Pulsing energy core */}
      <EnergyCore />

      {/* Energy ribbons */}
      <EnergyRibbon radius={3.5} speed={0.06} color="#3D4EF0" tiltX={0.4} tiltZ={0.2} thickness={0.015} />
      <EnergyRibbon radius={4.2} speed={-0.04} color="#23A0FF" tiltX={-0.3} tiltZ={0.5} thickness={0.01} />
      <EnergyRibbon radius={5} speed={0.03} color="#6366f1" tiltX={0.8} tiltZ={-0.3} thickness={0.008} />

      {/* Data particles */}
      <DataParticles count={800} />

      {/* Floating geometric shards */}
      {SHARD_DATA.map((shard, i) => (
        <FloatingShard key={`shard-${i}`} {...shard} />
      ))}
    </>
  );
}

export default function ThreeBg() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
