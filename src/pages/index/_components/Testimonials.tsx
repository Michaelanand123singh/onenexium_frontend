import { motion } from "motion/react";

const testimonials = [
  {
    initials: "CS",
    name: "Charlie S.",
    quote:
      "I've tried all the AI app builders and OneNexium is the best by far. The built in backend and database is incredible.",
  },
  {
    initials: "RO",
    name: "Roberto O.",
    quote:
      "OneNexium is the best AI app builder I've used. It's fast, the designs are stunning, and the team is incredibly responsive.",
  },
  {
    initials: "MM",
    name: "Merveille M.",
    quote:
      "I built and launched a website for my non-profit over a weekend thanks to OneNexium",
  },
  {
    initials: "HC",
    name: "Heather C.",
    quote: "OneNexium is soooo amazing. I'm the hugest fan so far",
  },
  {
    initials: "PG",
    name: "Paramjit G.",
    quote:
      "I built my entire startup on OneNexium. It's incredible! And whenever I had questions, the team was unbelievably helpful.",
  },
  {
    initials: "VV",
    name: "Vani V.",
    quote:
      "I love using OneNexium! It made my site exactly how I imagined it and I didn't touch a line of code",
  },
  {
    initials: "BB",
    name: "Brittany B.",
    quote:
      "As a non-technical founder this app has already saved me thousands that I would have otherwise spent on a developer.",
  },
  {
    initials: "DP",
    name: "Dorian P.",
    quote:
      "It took me an hour to build an app that now my team and I use every day. I can't even code but OneNexium makes it so easy.",
  },
];

function TestimonialCard({
  initials,
  name,
  quote,
}: {
  initials: string;
  name: string;
  quote: string;
}) {
  return (
    <div className="flex-shrink-0 w-[340px] bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{quote}</p>
    </div>
  );
}

export default function Testimonials() {
  // Duplicate for infinite scroll
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center"
        >
          Loved by 100k+ users
        </motion.h2>
      </div>

      {/* Scrolling row 1 */}
      <div className="overflow-hidden mb-4">
        <motion.div
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 w-max"
        >
          {allTestimonials.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </motion.div>
      </div>

      {/* Scrolling row 2 (reverse) */}
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["-33.33%", "0%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 w-max"
        >
          {[...allTestimonials].reverse().map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </motion.div>
      </div>

      {/* Start Building CTA below testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mt-12"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-foreground text-background px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
        >
          Start Building Now
        </button>
      </motion.div>
    </section>
  );
}
