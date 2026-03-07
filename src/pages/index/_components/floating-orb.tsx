import { motion } from "motion/react";

export default function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-10 pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
