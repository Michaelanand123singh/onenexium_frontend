import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { LOGO_URL, APP_NAME } from "@/lib/brand.ts";
import { GoogleIcon, MicrosoftIcon } from "./_components/social-icons.tsx";

function RedirectIfAuthenticated() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return null;
}

/** Subtle crosshatch grid lines */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.02), transparent 70%)",
        }}
      />
      {/* Grid pattern */}
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
      {/* Floating glow orbs */}
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

function LoginContent() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-[#08090d] text-white overflow-hidden">
      <GridBackground />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-12">
          <motion.img
            src={LOGO_URL}
            alt={APP_NAME}
            className="h-9 w-auto brightness-0 invert"
            whileHover={{ rotate: 8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Welcome back
          </h1>
          <p className="text-white/40 text-base">
            Sign in to continue building with {APP_NAME}
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
            signInText="Continue with Email"
            className="w-full py-3.5 rounded-xl bg-white text-[#08090d] font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer border-0 h-auto flex items-center justify-center gap-2"
          >
            <span>Continue with Email</span>
            <ArrowRight className="w-4 h-4" />
          </SignInButton>

          {/* Sign up link */}
          <p className="mt-6 text-center text-white/30 text-sm">
            {"Don't have an account? "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white font-medium hover:underline cursor-pointer"
            >
              Create one
            </button>
          </p>
        </motion.div>

        {/* Bottom trust strip */}
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
    </main>
  );
}

export default function LoginPage() {
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
            <Skeleton className="h-48 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <LoginContent />
      </Unauthenticated>
    </div>
  );
}
