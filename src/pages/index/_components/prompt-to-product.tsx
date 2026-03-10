import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Globe, CreditCard, BarChart3, Lock } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const SHOWCASE = {
  prompt: "Build a SaaS landing page for an AI marketing tool",
  outputs: [
    { icon: Globe, label: "Full Website", detail: "Hero, features, testimonials, footer" },
    { icon: CreditCard, label: "Pricing Page", detail: "3-tier pricing with toggle" },
    { icon: BarChart3, label: "Dashboard", detail: "Analytics, charts, sidebar nav" },
    { icon: Lock, label: "Login System", detail: "Auth, profiles, secure access" },
  ],
  image: "https://cdn.hercules.app/file_Gi2tGINxomjpH8a0LfysdCKi",
};

export default function PromptToProduct() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: BRAND_GRADIENT, opacity: 0.2 }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {"Prompt to "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            Product
          </span>
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          See the before and after. One prompt builds an entire product.
        </p>
      </motion.div>

      {/* Split view */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT — Prompt */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          <div
            className="rounded-2xl border border-foreground/10 p-8 flex-1 flex flex-col justify-center"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs uppercase tracking-widest text-foreground/30 mb-4">Input Prompt</p>
            <div className="bg-background/50 border border-foreground/8 rounded-xl p-5 mb-6">
              <p className="text-lg font-mono text-foreground/80 leading-relaxed">
                {`"${SHOWCASE.prompt}"`}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${BRAND_GRADIENT}` }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-sm text-foreground/40 font-medium">OneNexium generates...</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Output */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col"
        >
          <div
            className="rounded-2xl border border-[#3D4EF0]/20 p-8 flex-1"
            style={{ background: "rgba(61,78,240,0.03)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-xs uppercase tracking-widest text-[#3D4EF0] mb-6">Generated Output</p>

            {/* Preview image */}
            <div className="rounded-xl overflow-hidden border border-foreground/10 mb-6 aspect-video">
              <img
                src={SHOWCASE.image}
                alt="Generated website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Output cards */}
            <div className="grid grid-cols-2 gap-3">
              {SHOWCASE.outputs.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="rounded-xl border border-foreground/8 bg-background/30 p-3 flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#3D4EF015", border: "1px solid #3D4EF025" }}
                  >
                    <item.icon className="w-4 h-4 text-[#3D4EF0]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-[11px] text-foreground/40">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
