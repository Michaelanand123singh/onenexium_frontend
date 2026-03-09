import { motion } from "motion/react";
import FloatingOrb from "./floating-orb.tsx";
import Particle from "./particle.tsx";

const PARTICLES = [
  { delay: 0, x: "20%", y: "70%" },
  { delay: 1.2, x: "75%", y: "60%" },
  { delay: 2.4, x: "40%", y: "80%" },
  { delay: 0.8, x: "60%", y: "75%" },
  { delay: 1.6, x: "30%", y: "65%" },
  { delay: 3, x: "85%", y: "50%" },
  { delay: 0.4, x: "15%", y: "55%" },
];

const EMOJIS = [
  { emoji: "\u{1F680}", x: "8%", y: "18%", delay: 0, duration: 6 },
  { emoji: "\u{2728}", x: "88%", y: "22%", delay: 1, duration: 7 },
  { emoji: "\u{1F4A1}", x: "12%", y: "72%", delay: 0.5, duration: 5.5 },
  { emoji: "\u{26A1}", x: "85%", y: "68%", delay: 1.5, duration: 6.5 },
  { emoji: "\u{1F30D}", x: "5%", y: "45%", delay: 2, duration: 7.5 },
  { emoji: "\u{1F525}", x: "92%", y: "45%", delay: 0.8, duration: 5 },
  { emoji: "\u{1F389}", x: "18%", y: "88%", delay: 1.2, duration: 6.2 },
  { emoji: "\u{1F4AB}", x: "78%", y: "85%", delay: 2.5, duration: 5.8 },
];

/**
 * Shared animated background with orbs, grid, particles, and floating emojis.
 * Used on both the landing page and the dashboard to create visual continuity.
 */
export default function AnimatedBackground() {
  return (
    <>
      {/* Background gradient wash */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #3D4EF0, transparent)",
        }}
      />

      {/* Floating orbs */}
      <FloatingOrb className="w-[500px] h-[500px] -top-40 -left-40 bg-[#3D4EF0]" />
      <FloatingOrb className="w-[400px] h-[400px] -bottom-32 -right-32 bg-[#23A0FF]" />
      <FloatingOrb className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3D4EF0]/30" />

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Dot grid — radial dots that drift slowly */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundPosition: ["0px 0px", "28px 28px"],
        }}
        transition={{
          opacity: { duration: 2 },
          backgroundPosition: {
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, #3D4EF0 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,0,0,0.35) 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,0,0,0.35) 0%, transparent 75%)",
        }}
      />

      {/* Dot grid pulse — offset dots drifting opposite direction */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
          backgroundPosition: ["14px 14px", "-14px -14px"],
        }}
        transition={{
          opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          backgroundPosition: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, #23A0FF 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.2) 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Floating emojis */}
      {EMOJIS.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl sm:text-3xl pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0.6, 0],
            scale: [0, 1, 1.1, 1, 0],
            y: [0, -20, -10, -25, -40],
            rotate: [0, 10, -10, 5, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </>
  );
}
