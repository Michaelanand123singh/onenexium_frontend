import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// ── Floating glowing sphere ──
function GlowSphere({
  position,
  color,
  size,
  speed,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.position.y = position[1] + Math.sin(t) * 0.5;
      glowRef.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[size * 2.5, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </>
  );
}

// ── Particle field ──
function ParticleField({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const primaryColor = new THREE.Color("#3D4EF0");
    const secondaryColor = new THREE.Color("#23A0FF");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const t = Math.random();
      const mixed = primaryColor.clone().lerp(secondaryColor, t);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;

      sz[i] = Math.random() * 3 + 0.5;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.05;
    meshRef.current.rotation.y = t;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Connection lines between spheres ──
function ConnectionLines({
  points,
}: {
  points: [number, number, number][];
}) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const cols: number[] = [];
    const primaryColor = new THREE.Color("#3D4EF0");
    const secondaryColor = new THREE.Color("#23A0FF");

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 5) {
          verts.push(...points[i], ...points[j]);
          const t1 = i / points.length;
          const t2 = j / points.length;
          const c1 = primaryColor.clone().lerp(secondaryColor, t1);
          const c2 = primaryColor.clone().lerp(secondaryColor, t2);
          cols.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
        }
      }
    }
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verts, 3),
    );
    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(cols, 3),
    );
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 0.5) * 0.06;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ── Orbiting ring ──
function OrbitRing({
  radius,
  speed,
  tilt,
  color,
}: {
  radius: number;
  speed: number;
  tilt: number;
  color: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

// ── Scene composition ──
const SPHERE_POSITIONS: [number, number, number][] = [
  [-3.5, 1.8, -2],
  [3.8, -1.5, -1.5],
  [-1.2, -2.5, -3],
  [2.5, 2.8, -2.5],
  [-4.5, -0.5, -1],
  [0.8, 3.2, -4],
  [4.2, 0.3, -3],
  [-2, 0.5, -1.5],
  [1.5, -3, -2],
  [-3, 3, -3.5],
];

function Scene() {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />

      {/* Blue directional lights */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#3D4EF0"
      />
      <directionalLight
        position={[-5, -3, 3]}
        intensity={0.6}
        color="#23A0FF"
      />

      {/* Point lights for glow effect */}
      <pointLight position={[0, 0, 3]} intensity={1} color="#3D4EF0" distance={15} />
      <pointLight position={[-3, 2, 1]} intensity={0.7} color="#23A0FF" distance={12} />

      {/* Stars in the background */}
      <Stars
        radius={12}
        depth={40}
        count={2500}
        factor={4}
        saturation={0.8}
        fade
        speed={0.8}
      />

      {/* Floating glowing spheres */}
      {SPHERE_POSITIONS.map((pos, i) => (
        <Float
          key={`float-${pos[0]}-${pos[1]}`}
          speed={1 + i * 0.2}
          rotationIntensity={0.2}
          floatIntensity={0.4}
        >
          <GlowSphere
            position={pos}
            color={i % 2 === 0 ? "#3D4EF0" : "#23A0FF"}
            size={0.12 + Math.random() * 0.15}
            speed={0.3 + i * 0.05}
          />
        </Float>
      ))}

      {/* Particle field */}
      <ParticleField count={600} />

      {/* Connection lines between sphere positions */}
      <ConnectionLines points={SPHERE_POSITIONS} />

      {/* Orbiting rings */}
      <OrbitRing radius={4} speed={0.08} tilt={0.5} color="#3D4EF0" />
      <OrbitRing radius={5.5} speed={-0.05} tilt={-0.3} color="#23A0FF" />
      <OrbitRing radius={3} speed={0.12} tilt={1.2} color="#6366f1" />
    </>
  );
}

// ── Main export ──
export default function ThreeBg() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
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
