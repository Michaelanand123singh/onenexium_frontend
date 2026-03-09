import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { ConvexError } from "convex/values";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.ts";
import { Loader2 } from "lucide-react";
import { BRAND_GRADIENT, LOGO_URL } from "@/lib/brand.ts";
import AnimatedBackground from "@/components/animated-background.tsx";
import AuthenticatedNav from "./index/_components/authenticated-nav.tsx";

export default function Index() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const joinWaitlist = useMutation(api.waitlist.join);
  const navigate = useNavigate();

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await joinWaitlist({ email: email.trim() });
      toast.success("You're on the list! We'll notify you when we launch.");
      setEmail("");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Top-right auth area */}
      <div className="absolute top-6 right-6 z-20">
        <Unauthenticated>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:shadow-lg hover:shadow-[#3D4EF0]/25 transition-all"
              style={{ background: BRAND_GRADIENT }}
            >
              Sign In
            </button>
          </motion.div>
        </Unauthenticated>
        <AuthLoading>
          <Loader2 className="w-5 h-5 animate-spin text-[#3D4EF0]" />
        </AuthLoading>
      </div>
      <Authenticated>
        <AuthenticatedNav />
      </Authenticated>

      {/* Shared animated background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-2xl text-center">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.img
              src={LOGO_URL}
              alt="OneNexium"
              className="h-16 w-auto"
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 3,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="text-3xl font-bold text-[#0C0F18] tracking-tight"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              OneNexium
            </motion.span>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0]">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#23A0FF]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Coming Soon
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0C0F18] leading-tight tracking-tight text-balance"
        >
          Something{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            extraordinary
          </span>{" "}
          is on the way
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-5 text-base sm:text-lg text-[#0C0F18]/50 max-w-md leading-relaxed"
        >
          We're crafting a new experience. Be the first to know when we launch.
        </motion.p>

        {/* Email form */}
        <motion.form
          onSubmit={handleNotify}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 w-full max-w-md"
        >
          <div className="relative group">
            {/* Glow ring */}
            <div
              className="absolute -inset-[1px] rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"
              style={{ background: BRAND_GRADIENT }}
            />
            <div className="relative flex items-center bg-white border border-[#0C0F18]/10 rounded-xl shadow-sm overflow-hidden">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-transparent text-[#0C0F18] placeholder:text-[#0C0F18]/30 text-sm px-4 py-3.5 outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mr-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#3D4EF0]/25 disabled:opacity-60 cursor-pointer shrink-0"
                style={{ background: BRAND_GRADIENT }}
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Sending...
                  </motion.span>
                ) : (
                  "Notify Me"
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#0C0F18]/30">
            No spam, ever. We'll only email you once when we go live.
          </p>
        </motion.form>

        {/* Countdown-style decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-14 flex items-center gap-8"
        >
          {[
            { label: "Days", value: "14" },
            { label: "Hours", value: "08" },
            { label: "Minutes", value: "42" },
          ].map((item, i) => (
            <div key={item.label} className="flex flex-col items-center">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="text-2xl sm:text-3xl font-bold text-[#0C0F18]/80 tabular-nums"
              >
                {item.value}
              </motion.span>
              <span className="text-[10px] uppercase tracking-widest text-[#0C0F18]/30 mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: BRAND_GRADIENT, opacity: 0.3 }}
      />

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-5 text-[11px] text-[#0C0F18]/25 tracking-wide"
      >
        &copy; {new Date().getFullYear()} OneNexium. All rights reserved.
      </motion.p>
    </div>
  );
}
