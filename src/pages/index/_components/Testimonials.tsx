import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "OneNexium changed how we build products. What used to take weeks now takes minutes. The AI understands exactly what we need.",
    name: "Sarah Chen",
    role: "CTO",
    company: "TechVault",
    initials: "SC",
  },
  {
    quote:
      "We shipped our entire SaaS platform in a weekend. The code quality is production-ready and the UI is beautiful out of the box.",
    name: "Marcus Rivera",
    role: "Founder",
    company: "LaunchPad AI",
    initials: "MR",
  },
  {
    quote:
      "The smart deployment feature alone saved us thousands in DevOps costs. OneNexium is the future of software development.",
    name: "Emily Watson",
    role: "VP Engineering",
    company: "ScaleForce",
    initials: "EW",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              Builders
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            See what developers and founders are saying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-[#3D4EF0]/20 hover:shadow-[0_0_20px_rgba(61,78,240,0.06)] transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#3D4EF0] text-[#3D4EF0]"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 mb-6">
                {'"'}
                {t.quote}
                {'"'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
