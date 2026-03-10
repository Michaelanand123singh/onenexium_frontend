import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
};

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  progress: number;
  opacity: number;
};

const NODE_COUNT = 45;
const PARTICLE_COUNT = 20;
const CONNECTION_DISTANCE = 180;
const PRIMARY_COLOR = { r: 61, g: 78, b: 240 }; // #3D4EF0
const SECONDARY_COLOR = { r: 35, g: 160, b: 255 }; // #23A0FF

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize nodes — weighted to the left side
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    nodesRef.current = Array.from({ length: NODE_COUNT }, () => {
      // Bias x position toward left (use exponential distribution)
      const xBias = Math.pow(Math.random(), 0.7);
      return {
        x: xBias * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    });

    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(w, h),
    );

    const animate = () => {
      timeRef.current += 1;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      ctx.clearRect(0, 0, cw, ch);

      const nodes = nodesRef.current;
      const particles = particlesRef.current;

      // Update nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += node.pulseSpeed;

        // Bounce off edges with padding
        if (node.x < -20 || node.x > cw + 20) node.vx *= -1;
        if (node.y < -20 || node.y > ch + 20) node.vy *= -1;
        node.x = Math.max(-20, Math.min(cw + 20, node.x));
        node.y = Math.max(-20, Math.min(ch + 20, node.y));
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            const t = (Math.sin(timeRef.current * 0.01 + i) + 1) / 2;
            const r = Math.round(lerp(PRIMARY_COLOR.r, SECONDARY_COLOR.r, t));
            const g = Math.round(lerp(PRIMARY_COLOR.g, SECONDARY_COLOR.g, t));
            const b = Math.round(lerp(PRIMARY_COLOR.b, SECONDARY_COLOR.b, t));

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const glowRadius = node.radius + pulse * 3;
        const baseOpacity = 0.3 + pulse * 0.3;

        // Glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          glowRadius * 3,
        );
        const t = (Math.sin(timeRef.current * 0.005 + node.pulsePhase) + 1) / 2;
        const r = Math.round(lerp(PRIMARY_COLOR.r, SECONDARY_COLOR.r, t));
        const g = Math.round(lerp(PRIMARY_COLOR.g, SECONDARY_COLOR.g, t));
        const b = Math.round(lerp(PRIMARY_COLOR.b, SECONDARY_COLOR.b, t));

        gradient.addColorStop(0, `rgba(${r},${g},${b},${baseOpacity})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${baseOpacity + 0.2})`;
        ctx.fill();
      }

      // Draw & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles[i] = createParticle(cw, ch);
          continue;
        }

        p.x = lerp(p.x, p.targetX, p.speed);
        p.y = lerp(p.y, p.targetY, p.speed);
        p.opacity = Math.sin(p.progress * Math.PI) * 0.6;

        const t = p.progress;
        const r = Math.round(lerp(PRIMARY_COLOR.r, SECONDARY_COLOR.r, t));
        const g = Math.round(lerp(PRIMARY_COLOR.g, SECONDARY_COLOR.g, t));
        const b = Math.round(lerp(PRIMARY_COLOR.b, SECONDARY_COLOR.b, t));

        // Particle trail
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();

        // Small glow
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
        pg.addColorStop(0, `rgba(${r},${g},${b},${p.opacity * 0.4})`);
        pg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      // Draw circuit-like lines on the left
      drawCircuitLines(ctx, ch, timeRef.current);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-[0.6]"
    />
  );
}

function createParticle(w: number, h: number): Particle {
  const startX = Math.random() * w * 0.4;
  const startY = Math.random() * h;
  return {
    x: startX,
    y: startY,
    targetX: startX + (Math.random() * 200 + 100),
    targetY: startY + (Math.random() - 0.5) * 150,
    speed: Math.random() * 0.008 + 0.003,
    progress: 0,
    opacity: 0,
  };
}

function drawCircuitLines(
  ctx: CanvasRenderingContext2D,
  h: number,
  time: number,
) {
  const lines = [
    { y: h * 0.2, len: 120 },
    { y: h * 0.35, len: 90 },
    { y: h * 0.5, len: 150 },
    { y: h * 0.65, len: 100 },
    { y: h * 0.8, len: 80 },
  ];

  for (const line of lines) {
    const pulse = (Math.sin(time * 0.015 + line.y * 0.01) + 1) / 2;
    const opacity = 0.04 + pulse * 0.06;

    ctx.beginPath();
    ctx.moveTo(0, line.y);
    ctx.lineTo(line.len, line.y);
    // Add a right-angle turn
    ctx.lineTo(line.len, line.y + 20);
    ctx.strokeStyle = `rgba(61, 78, 240, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Node at the junction
    ctx.beginPath();
    ctx.arc(line.len, line.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(35, 160, 255, ${opacity + 0.1})`;
    ctx.fill();
  }
}
