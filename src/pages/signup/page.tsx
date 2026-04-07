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
import { Input } from "@/components/ui/input.tsx";
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

/** Subtle grid lines on light background */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0,0,0,0.015), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-black"
        style={{ filter: "blur(120px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-black"
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
    <main className="relative min-h-screen bg-[#fafafa] text-[#0a0a0a] overflow-hidden">
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
                className="h-9 w-auto"
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
              <span className="text-black/35">in minutes</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-black/40 text-lg leading-relaxed mb-12 max-w-sm">
              Join thousands of creators using AI to build production-ready websites and apps.
            </motion.p>

            {/* Benefits */}
            <div className="space-y-4">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-start gap-4 rounded-xl border border-black/6 bg-white p-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-black/[0.04] border border-black/6 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-4.5 h-4.5 text-black/50" />
                  </div>
                  <div>
                    <p className="text-[#0a0a0a] font-medium text-sm">{benefit.title}</p>
                    <p className="text-black/35 text-sm">{benefit.description}</p>
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
              <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-auto" />
              <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp} className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Create your account
              </h2>
              <p className="text-black/35 text-base">
                Get started for free — no credit card needed
              </p>
            </motion.div>

            {/* Auth card */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-black/8 bg-white p-8 sm:p-10 shadow-sm"
            >
              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SignInButton
                  signInText=""
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-black/10 rounded-xl bg-transparent hover:bg-black/[0.03] hover:border-black/15 transition-all cursor-pointer text-[#0a0a0a] text-sm font-medium h-auto"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </SignInButton>
                <SignInButton
                  signInText=""
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-black/10 rounded-xl bg-transparent hover:bg-black/[0.03] hover:border-black/15 transition-all cursor-pointer text-[#0a0a0a] text-sm font-medium h-auto"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </SignInButton>
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-black/8" />
                <span className="shrink mx-4 text-black/25 text-xs font-medium uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-black/8" />
              </div>

              {/* Email & Password fields (display only) */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-black/50 mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Smith"
                    readOnly
                    className="w-full rounded-xl border-black/10 bg-black/[0.02] h-11 text-sm placeholder:text-black/25 cursor-default focus-visible:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black/50 mb-1.5">Email</label>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    readOnly
                    className="w-full rounded-xl border-black/10 bg-black/[0.02] h-11 text-sm placeholder:text-black/25 cursor-default focus-visible:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black/50 mb-1.5">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    readOnly
                    className="w-full rounded-xl border-black/10 bg-black/[0.02] h-11 text-sm placeholder:text-black/25 cursor-default focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Sign up button */}
              <SignInButton
                signInText="Create Account"
                className="w-full py-3.5 rounded-xl bg-[#0a0a0a] text-white font-semibold text-sm hover:bg-[#1a1a1a] transition-all cursor-pointer border-0 h-auto flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </SignInButton>

              {/* Checklist */}
              <div className="mt-6 space-y-2.5">
                {CHECKLIST.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-black/40"
                  >
                    <div className="w-4 h-4 rounded-full bg-black/[0.06] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-black/40" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Sign in link */}
              <p className="mt-8 text-center text-black/35 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#0a0a0a] font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center justify-center gap-6 text-black/20 text-xs"
            >
              <span>Secure login</span>
              <span className="w-1 h-1 rounded-full bg-black/15" />
              <span>SOC 2 compliant</span>
              <span className="w-1 h-1 rounded-full bg-black/15" />
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
    <div className="min-h-screen bg-[#fafafa] antialiased">
      <Authenticated>
        <RedirectIfAuthenticated />
      </Authenticated>

      <AuthLoading>
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-9 w-36 mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <SignupContent />
      </Unauthenticated>
    </div>
  );
}
