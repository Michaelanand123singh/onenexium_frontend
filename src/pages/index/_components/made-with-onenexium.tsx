import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ExternalLink, Heart, ArrowUpRight } from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const SHOWCASED_SITES = [
  {
    name: "Brew & Bean",
    tagline: "Artisan coffee shop",
    url: "brewbean.onenexium.app",
    upvotes: 142,
    image: "https://cdn.hercules.app/file_DmUmO5p8HnmcR1ecexodp3X6",
  },
  {
    name: "FitPulse",
    tagline: "Fitness tracking platform",
    url: "fitpulse.onenexium.app",
    upvotes: 98,
    image: "https://cdn.hercules.app/file_BdMbOKtDnmOJuv90MVUJznAX",
  },
  {
    name: "NovaDash",
    tagline: "Analytics dashboard",
    url: "novadash.onenexium.app",
    upvotes: 215,
    image: "https://cdn.hercules.app/file_WMULVKIlD4h2EKyVH0eYaaBf",
  },
  {
    name: "ArtFolio",
    tagline: "Creative portfolio",
    url: "artfolio.onenexium.app",
    upvotes: 176,
    image: "https://cdn.hercules.app/file_fhVR4M0gheASRaCDh2Evgfl5",
  },
];

export default function MadeWithOneNexium() {
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
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0] mb-6">
          <ExternalLink className="w-3.5 h-3.5" />
          Community
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          Made With{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            OneNexium
          </span>
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          Discover what our community has shipped. Product Hunt style.
        </p>
      </motion.div>

      {/* Gallery — Product Hunt style list */}
      <div className="max-w-3xl mx-auto space-y-4">
        {SHOWCASED_SITES.map((site, i) => (
          <motion.div
            key={site.name}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
          >
            <div
              className="group flex items-center gap-5 rounded-2xl border border-foreground/10 p-4 transition-all duration-300 hover:border-[#3D4EF0]/25 hover:shadow-lg hover:shadow-[#3D4EF0]/5 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
            >
              {/* Thumbnail */}
              <div className="w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-foreground/10 shrink-0">
                <img
                  src={site.image}
                  alt={site.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground truncate">{site.name}</h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-[#3D4EF0] transition-colors shrink-0" />
                </div>
                <p className="text-sm text-foreground/50 mb-1">{site.tagline}</p>
                <p className="text-xs text-foreground/30 font-mono">{site.url}</p>
              </div>

              {/* Upvote */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:border-[#3D4EF0]/30 hover:bg-[#3D4EF0]/5 transition-all shrink-0"
              >
                <Heart className="w-4 h-4 text-foreground/40 group-hover:text-[#3D4EF0] transition-colors" />
                <span className="text-xs font-bold text-foreground/60">{site.upvotes}</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
