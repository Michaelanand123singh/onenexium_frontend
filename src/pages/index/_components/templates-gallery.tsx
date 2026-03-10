import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { LayoutGrid, Shuffle } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const CATEGORIES = [
  "All",
  "Startup Websites",
  "E-commerce",
  "Portfolios",
  "SaaS Dashboards",
  "AI Tools",
  "Mobile Apps",
];

const TEMPLATES = [
  {
    title: "AI Marketing SaaS",
    category: "Startup Websites",
    prompt: "Build a SaaS landing page for an AI marketing tool",
    image: "https://cdn.hercules.app/file_Gi2tGINxomjpH8a0LfysdCKi",
  },
  {
    title: "Luxury Watch Store",
    category: "E-commerce",
    prompt: "Create a luxury watch ecommerce store",
    image: "https://cdn.hercules.app/file_DmUmO5p8HnmcR1ecexodp3X6",
  },
  {
    title: "Creative Portfolio",
    category: "Portfolios",
    prompt: "Design a creative portfolio with image gallery",
    image: "https://cdn.hercules.app/file_fhVR4M0gheASRaCDh2Evgfl5",
  },
  {
    title: "Analytics Dashboard",
    category: "SaaS Dashboards",
    prompt: "Build a SaaS analytics dashboard with charts",
    image: "https://cdn.hercules.app/file_WMULVKIlD4h2EKyVH0eYaaBf",
  },
  {
    title: "AI Chat Assistant",
    category: "AI Tools",
    prompt: "Create an AI chatbot tool with modern UI",
    image: "https://cdn.hercules.app/file_0MCqDZOc9gAz7uPTLBdcSjSS",
  },
  {
    title: "Fitness App",
    category: "Mobile Apps",
    prompt: "Make a fitness tracking mobile app landing page",
    image: "https://cdn.hercules.app/file_BdMbOKtDnmOJuv90MVUJznAX",
  },
];

export default function TemplatesGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

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
        className="text-center mb-12 max-w-3xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0] mb-6">
          <LayoutGrid className="w-3.5 h-3.5" />
          Templates
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          Live Templates{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            Gallery
          </span>
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          See what people built with OneNexium. Pick a template and remix it.
        </p>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
              activeCategory === cat
                ? "text-white shadow-lg shadow-[#3D4EF0]/20"
                : "text-foreground/50 border border-foreground/10 hover:border-foreground/20 bg-foreground/[0.02]"
            }`}
            style={activeCategory === cat ? { background: BRAND_GRADIENT } : undefined}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Template grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((template, i) => (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            layout
            className="group"
          >
            <div
              className="rounded-2xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:border-[#3D4EF0]/30 hover:shadow-xl hover:shadow-[#3D4EF0]/5"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Preview image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <Shuffle className="w-4 h-4" />
                    Remix This
                  </motion.button>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">{template.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-foreground/30 bg-foreground/5 px-2 py-0.5 rounded-full">
                    {template.category}
                  </span>
                </div>
                <div className="bg-background/50 border border-foreground/8 rounded-lg px-3 py-2">
                  <p className="text-xs text-foreground/40 mb-0.5 uppercase tracking-widest">Prompt used:</p>
                  <p className="text-sm text-foreground/70 font-mono">{`"${template.prompt}"`}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
