import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Star } from "lucide-react";

// Company logos as styled text badges (no external SVGs needed)
const LOGOS = [
  "Stripe",
  "Vercel",
  "Linear",
  "Notion",
  "Figma",
  "Slack",
  "Shopify",
  "Atlassian",
];

const TESTIMONIALS = [
  {
    quote:
      "OneNexium cut our prototyping time from weeks to hours. Our team shipped 3x faster in the first month alone.",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechFlow",
    initials: "SC",
    accentBg: "bg-foreground/10 dark:bg-foreground/15",
    accentText: "text-foreground dark:text-foreground",
  },
  {
    quote:
      "The AI-generated code is genuinely production-ready. We pushed it straight to staging with zero refactoring needed.",
    name: "Marcus Rivera",
    role: "Lead Developer",
    company: "BuildStack",
    initials: "MR",
    accentBg: "bg-foreground/10 dark:bg-foreground/15",
    accentText: "text-foreground dark:text-foreground",
  },
  {
    quote:
      "We replaced three separate tools with OneNexium. Design, code, deploy -- all in one workflow. Game changer.",
    name: "Aisha Patel",
    role: "CTO",
    company: "NovaBridge",
    initials: "AP",
    accentBg: "bg-foreground/10 dark:bg-foreground/15",
    accentText: "text-foreground dark:text-foreground",
  },
];

function LogoBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto mb-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8"
      >
        Trusted by teams at
      </motion.p>
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
        {LOGOS.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            className="text-lg sm:text-xl font-semibold text-foreground/20 hover:text-foreground/40 transition-colors select-none tracking-tight"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  isInView,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="bg-card rounded-3xl p-7 border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-foreground text-foreground"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-foreground/80 leading-relaxed mb-6 min-h-[72px]">
        {'"'}{testimonial.quote}{'"'}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${testimonial.accentBg} ${testimonial.accentText} flex items-center justify-center text-xs font-bold shrink-0`}
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="w-full max-w-6xl mx-auto py-20 px-4">
      {/* Logo bar */}
      <LogoBar />

      {/* Testimonials header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance">
          Loved by developers worldwide
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-balance">
          Join thousands of teams who build and ship faster with OneNexium.
        </p>
      </motion.div>

      {/* Testimonial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.map((testimonial, i) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Bottom social proof strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
      >
        {/* Stacked avatars */}
        <div className="flex items-center">
          <div className="flex -space-x-2.5">
            {["SC", "MR", "AP", "JL", "KW"].map((initials, i) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full bg-foreground/10 border-2 border-background flex items-center justify-center text-[9px] font-bold text-foreground/50"
                style={{ zIndex: 5 - i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <span className="ml-3 font-medium">
            <span className="text-foreground font-semibold">12,000+</span>{" "}
            developers building with OneNexium
          </span>
        </div>
      </motion.div>
    </section>
  );
}
