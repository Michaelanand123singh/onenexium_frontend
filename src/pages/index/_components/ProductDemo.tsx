import { motion } from "motion/react";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const highlights = [
  { icon: Sparkles, text: "Natural language to production code" },
  { icon: Zap, text: "Real-time preview as you iterate" },
  { icon: Shield, text: "Enterprise-grade security built in" },
];

export default function ProductDemo() {
  return (
    <section id="product" className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-[#3D4EF0] dark:text-[#23A0FF] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
              From Prompt to Production{" "}
              <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
                in Seconds
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
              Describe your vision in plain English. OneNexium{"'"}s AI
              understands your intent and generates a complete, deployable
              application.
            </p>

            <div className="space-y-4 mt-8">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D4EF0]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#3D4EF0] dark:text-[#23A0FF]" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => toast.info("Try it free coming soon!")}
              className="group flex items-center gap-2 mt-8 text-[#3D4EF0] dark:text-[#23A0FF] font-semibold text-sm hover:gap-3 transition-all cursor-pointer"
            >
              Try it free
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Right - Interactive Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#3D4EF0]/15 to-[#23A0FF]/15 rounded-3xl blur-2xl scale-105" />

              <div className="relative bg-[#0C0F18] rounded-2xl overflow-hidden border border-white/10">
                {/* Title bar */}
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Step 1: Prompt */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#3D4EF0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-xs mb-1.5">
                        Your prompt
                      </p>
                      <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                        <p className="text-white/80 text-sm font-mono break-words">
                          {'"'}Create a SaaS landing page for a fitness app
                          {'"'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: AI Analysis */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#23A0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-xs mb-1.5">
                        AI Analysis
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Layout",
                          "Colors",
                          "Components",
                          "Copy",
                          "Images",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-md bg-[#23A0FF]/10 text-[#23A0FF] border border-[#23A0FF]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Result */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-xs mb-1.5">
                        Generated result
                      </p>
                      <div className="bg-white rounded-lg p-2.5">
                        <div className="bg-gray-50 rounded px-2 py-1 flex items-center justify-between mb-2">
                          <div className="h-1.5 w-12 bg-gray-300 rounded" />
                          <div className="flex gap-1.5">
                            <div className="h-1.5 w-6 bg-gray-200 rounded" />
                            <div className="h-1.5 w-6 bg-gray-200 rounded" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-3/4 bg-gray-800 rounded" />
                          <div className="h-1.5 w-full bg-gray-200 rounded" />
                          <div className="h-4 w-16 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded mt-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
