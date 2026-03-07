import { motion } from "motion/react";

export default function Particle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#3D4EF0]/20"
      style={{ left: x, top: y }}
      animate={{
        opacity: [0, 0.5, 0],
        scale: [0, 1.5, 0],
        y: [0, -40, -80],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}
