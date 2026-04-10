import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
};

const STATS: StatItem[] = [
  { value: 50, suffix: "K+", label: "Projects generated" },
  { value: 99.9, suffix: "%", label: "Uptime reliability" },
  { value: 3, suffix: "s", label: "Average build time" },
  { value: 12, suffix: "K+", label: "Active developers" },
];

function AnimatedCounter({
  value,
  suffix,
  prefix,
  duration = 2000,
  shouldAnimate,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  duration?: number;
  shouldAnimate: boolean;
}) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!shouldAnimate) return;

    const isFloat = value % 1 !== 0;
    const decimals = isFloat ? 1 : 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;

      setDisplay(current.toFixed(decimals));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [shouldAnimate, value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function StatsCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full max-w-5xl mx-auto py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-2">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                shouldAnimate={isInView}
              />
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
