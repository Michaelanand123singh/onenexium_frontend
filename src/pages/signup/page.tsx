import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  Zap,
  Users,
  Globe,
  Check,
  ArrowRight,
} from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { LOGO_URL, APP_NAME } from "@/lib/brand.ts";
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
    description: "Describe your idea and watch it come to life",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite teammates and build together",
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

/** Subtle crosshatch grid lines */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.02), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-white"
        style={{ filter: "blur(120px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white"
        style={{ filter: "blur(100px)" }}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

function SignupContent() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-[#08090d] text-white overflow-hidden">
      <GridBackground />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* ─── LEFT: Value proposition ─── */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-lg"
          >
            {/* Logo */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-16">
              <motion.img
                src={LOGO_URL}
                alt={APP_NAME}
                className="h-9 w-auto brightness-0 invert"
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Start building
              <br />
              <span className="text-white/50">in minutes</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-white/40 text-lg leading-relaxed mb-12 max-w-sm">
              Join thousands of creators using AI to build production-ready websites and apps.
            </motion.p>

            {/* Benefits */}
            <div className="space-y-4">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/[0.02] p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-4.5 h-4.5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white/80 font-medium text-sm">{benefit.title}</p>
                    <p className="text-white/30 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: Signup form ─── */}
        <div className="flex-1 flex items-center justify-center px-6 py-24 lg:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-10 lg:hidden">
              <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-auto brightness-0 invert" />
              <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp} className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Create your account
              </h2>
              <p className="text-white/35 text-base">
                Get started for free — no credit card needed
              </p>
            </motion.div>

            {/* Auth card */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-white/8 p-8 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SignInButton
                  signInText=""
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-white text-sm font-medium h-auto"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </SignInButton>
                <SignInButton
                  signInText=""
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-white text-sm font-medium h-auto"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </SignInButton>
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-white/8" />
                <span className="shrink mx-4 text-white/25 text-xs font-medium uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-white/8" />
              </div>

              {/* Email button */}
              <SignInButton
                signInText="Sign Up with Email"
                className="w-full py-3.5 rounded-xl bg-white text-[#08090d] font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer border-0 h-auto flex items-center justify-center gap-2"
              >
                <span>Sign Up with Email</span>
                <ArrowRight className="w-4 h-4" />
              </SignInButton>

              {/* Checklist */}
              <div className="mt-6 space-y-2.5">
                {CHECKLIST.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-white/35"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white/50" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Sign in link */}
              <p className="mt-8 text-center text-white/30 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-white font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center justify-center gap-6 text-white/20 text-xs"
            >
              <span>Secure login</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span>SOC 2 compliant</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span>12k+ users</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#08090d] antialiased">
      <Authenticated>
        <RedirectIfAuthenticated />
      </Authenticated>

      <AuthLoading>
        <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-9 w-36 mx-auto bg-white/5" />
            <Skeleton className="h-10 w-64 mx-auto bg-white/5" />
            <Skeleton className="h-4 w-48 mx-auto bg-white/5" />
            <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <SignupContent />
      </Unauthenticated>
    </div>
  );
}
