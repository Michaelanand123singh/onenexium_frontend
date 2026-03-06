import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { toast } from "sonner";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-[#3D4EF0]/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] bg-[#23A0FF]/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -left-20 w-[300px] h-[300px] bg-[#3D4EF0]/5 rounded-full blur-[80px]"
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#3D4EF0]/10 text-[#3D4EF0] dark:text-[#23A0FF] px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#3D4EF0] dark:bg-[#23A0FF] rounded-full"
            />
            Now in Public Beta
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-balance"
          >
            The Future of Building Apps{" "}
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              Starts With One Prompt
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            OneNexium lets anyone create powerful websites and applications
            instantly using AI. No code required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => toast.info("Start building coming soon!")}
              className="group flex items-center gap-2 text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-7 py-3.5 rounded-xl font-semibold text-base hover:shadow-[0_0_30px_rgba(61,78,240,0.5)] transition-all duration-300 cursor-pointer"
            >
              Start Building
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#product"
              className="group flex items-center gap-2 text-foreground bg-secondary px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-accent transition-all duration-300"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Hero Visual - AI Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 md:mt-24 max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3D4EF0]/20 to-[#23A0FF]/20 rounded-3xl blur-2xl scale-105" />

            {/* Card */}
            <div className="relative bg-[#0C0F18] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-white/40 font-mono">
                    OneNexium AI Studio
                  </span>
                </div>
                <div className="w-[52px]" />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 space-y-4">
                {/* Prompt input */}
                <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <p className="text-white/70 text-sm font-mono">
                    <span className="text-[#23A0FF] mr-2">{">"}</span>
                    Create a SaaS landing page for a fitness app
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="text-[#23A0FF] ml-0.5"
                    >
                      |
                    </motion.span>
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 px-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-3.5 h-3.5 border-2 border-[#23A0FF] border-t-transparent rounded-full"
                  />
                  <span className="text-xs text-[#23A0FF] font-mono">
                    Generating your website...
                  </span>
                </div>

                {/* Generated preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="bg-white rounded-xl overflow-hidden"
                >
                  {/* Mini navbar */}
                  <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF]" />
                      <div className="h-2 w-16 bg-gray-200 rounded" />
                    </div>
                    <div className="hidden sm:flex gap-3">
                      <div className="h-2 w-10 bg-gray-200 rounded" />
                      <div className="h-2 w-10 bg-gray-200 rounded" />
                      <div className="h-2 w-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                  {/* Mini hero content */}
                  <div className="p-4 space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-gray-800 rounded" />
                        <div className="h-3 w-1/2 bg-gray-800 rounded" />
                        <div className="h-2 w-full bg-gray-200 rounded mt-3" />
                        <div className="h-2 w-4/5 bg-gray-200 rounded" />
                        <div className="h-6 w-24 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded-md mt-3" />
                      </div>
                      <div className="hidden sm:flex w-32 h-24 bg-gradient-to-br from-[#3D4EF0]/10 to-[#23A0FF]/10 rounded-lg items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#3D4EF0]/30 to-[#23A0FF]/30 rounded-lg" />
                      </div>
                    </div>
                    {/* Mini feature cards */}
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gray-50 rounded-lg p-2 space-y-1"
                        >
                          <div className="w-5 h-5 bg-[#3D4EF0]/10 rounded" />
                          <div className="h-1.5 w-full bg-gray-200 rounded" />
                          <div className="h-1.5 w-2/3 bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
