import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  Zap,
  Users,
  Globe,
  Shield,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  BRAND_GRADIENT,
  BG_GRADIENT,
  LOGO_URL,
  APP_NAME,
} from "@/lib/brand.ts";
import { GoogleIcon, MicrosoftIcon } from "../login/_components/social-icons.tsx";

function RedirectIfAuthenticated() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return null;
}

const BENEFITS = [
  {
    icon: Zap,
    title: "AI-Powered Builder",
    description: "Describe your idea and watch it come to life in seconds",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite teammates, share projects, and build together",
  },
  {
    icon: Globe,
    title: "Instant Deploy",
    description: "Go live with one click on our global CDN",
  },
];

const CHECKLIST = [
  "No credit card required",
  "Free tier with 3 projects",
  "Full AI generation access",
  "Team collaboration built in",
];

/** Animated dot grid overlay */
function DotGrid({ variant }: { variant: "light" | "blue" }) {
  const dotColor =
    variant === "light" ? "rgba(255,255,255,0.35)" : "#3D4EF0";
  const pulseColor =
    variant === "light" ? "rgba(255,255,255,0.2)" : "#23A0FF";
  const maskOpacity = variant === "light" ? "0.5" : "0.4";

  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          backgroundPosition: ["0px 0px", "28px 28px"],
        }}
        transition={{
          opacity: { duration: 2, delay: 0.5 },
          backgroundPosition: {
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
          maskImage: `radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,0,0,${maskOpacity}) 0%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 70% at 50% 40%, rgba(0,0,0,${maskOpacity}) 0%, transparent 75%)`,
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
          backgroundPosition: ["14px 14px", "-14px -14px"],
        }}
        transition={{
          opacity: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
          backgroundPosition: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{
          backgroundImage: `radial-gradient(circle, ${pulseColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
          maskImage: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.25) 0%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,0,0,0.25) 0%, transparent 70%)`,
        }}
      />
    </>
  );
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

function SignupContent() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex flex-row min-h-screen overflow-hidden max-md:flex-col">
      {/* ───── LEFT: Benefits Panel ───── */}
      <motion.section
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative hidden md:flex w-1/2 flex-col justify-between p-12 overflow-hidden"
        style={{
          background: BG_GRADIENT,
          backgroundSize: "400% 400%",
          animation: "gradientShift 12s ease infinite",
        }}
      >
        <DotGrid variant="light" />

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10"
            style={{ filter: "blur(64px)" }}
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400/20"
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-between h-full"
        >
          {/* Logo */}
          <motion.div variants={fadeDown} className="flex items-center gap-3">
            <motion.img
              src={LOGO_URL}
              alt={APP_NAME}
              className="h-10 w-auto brightness-0 invert"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="text-white text-2xl font-bold tracking-tight">
              {APP_NAME}
            </span>
          </motion.div>

          {/* Headline + benefits */}
          <motion.div variants={fadeUp} className="max-w-lg">
            <h1 className="text-[3.5rem] leading-[1.15] font-extrabold text-white mb-4">
              {"Start Building".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-block"
              >
                In Minutes
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-white/75 text-lg leading-relaxed mb-10"
            >
              Join thousands of creators using AI to build production-ready
              websites and apps.
            </motion.p>

            {/* Benefit cards */}
            <div className="space-y-4">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + i * 0.15 }}
                  className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {benefit.title}
                    </p>
                    <p className="text-white/60 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={fadeIn}
            className="flex gap-8 text-white/60 text-sm"
          >
            <span>{`© ${currentYear} ${APP_NAME} Inc.`}</span>
            <button className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ───── RIGHT: Signup Form ───── */}
      <section className="flex-1 flex items-center justify-center py-24 px-6 md:px-24 bg-[#F5F8FF] relative overflow-hidden">
        <DotGrid variant="blue" />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(61,78,240,0.04), transparent)",
          }}
        />

        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-8 left-8 flex items-center gap-2 z-10"
        >
          <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-auto" />
          <span className="text-foreground font-bold">{APP_NAME}</span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-[28rem] relative z-10"
        >
          <motion.div
            variants={scaleIn}
            whileHover={{
              y: -2,
              boxShadow: "0 30px 60px -12px rgb(0 0 0 / 0.3)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-10 max-sm:p-8 rounded-[2rem] border border-white/30"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.2)",
            }}
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Create your account
              </h2>
              <p className="text-[#64748b]">
                Get started for free — no credit card needed
              </p>
            </motion.div>

            {/* Social signup buttons */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              <SignInButton
                signInText=""
                className="flex items-center justify-center gap-3 py-3 px-4 border border-[#e2e8f0] rounded-xl bg-transparent hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-[#334155] text-sm font-semibold h-auto"
              >
                <GoogleIcon />
                <span>Google</span>
              </SignInButton>
              <SignInButton
                signInText=""
                className="flex items-center justify-center gap-3 py-3 px-4 border border-[#e2e8f0] rounded-xl bg-transparent hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-[#334155] text-sm font-semibold h-auto"
              >
                <MicrosoftIcon />
                <span>Microsoft</span>
              </SignInButton>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeIn}
              className="relative flex items-center mb-6"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex-grow border-t border-[#e2e8f0] origin-left"
              />
              <span className="shrink mx-4 text-[#94a3b8] text-xs font-medium uppercase tracking-widest">
                or email
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex-grow border-t border-[#e2e8f0] origin-right"
              />
            </motion.div>

            {/* Email sign-up button */}
            <motion.div variants={fadeUp}>
              <SignInButton
                signInText="Sign Up with Email"
                className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-[0_0_24px_rgba(61,78,240,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer border-0 h-auto"
                style={{ background: BRAND_GRADIENT }}
              />
            </motion.div>

            {/* Checklist */}
            <motion.div variants={fadeUp} className="mt-6 space-y-2">
              {CHECKLIST.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-sm text-[#64748b]"
                >
                  <div
                    className="w-4.5 h-4.5 rounded-full flex items-center justify-center"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </motion.div>

            {/* Already have account */}
            <motion.div variants={fadeIn} className="mt-8 text-center">
              <p className="text-[#94a3b8] text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#3D4EF0] font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeIn}
              className="mt-6 flex items-center justify-center gap-6 text-[#64748b]/60 text-xs"
            >
              {[
                { icon: Shield, label: "Secure login" },
                { icon: Sparkles, label: "AI-powered" },
                { icon: Globe, label: "100k+ users" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
                  className="flex items-center gap-1.5"
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F5F8FF] text-foreground antialiased">
      <Authenticated>
        <RedirectIfAuthenticated />
      </Authenticated>

      <AuthLoading>
        <div className="flex min-h-screen">
          <div
            className="hidden md:flex w-1/2"
            style={{ background: BG_GRADIENT }}
          />
          <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F8FF]">
            <div className="w-full max-w-[28rem] space-y-6">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <SignupContent />
      </Unauthenticated>
    </div>
  );
}
