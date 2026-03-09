import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Globe } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { BRAND_GRADIENT, BG_GRADIENT } from "@/lib/brand.ts";
import { BoltIcon, GoogleIcon, MicrosoftIcon } from "./_components/social-icons.tsx";
import { TrustedLogos } from "./_components/trusted-logos.tsx";

function RedirectIfAuthenticated() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return null;
}

function LoginContent() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex flex-row min-h-screen overflow-hidden max-md:flex-col">
      {/* ───── LEFT: Brand Section ───── */}
      <section
        className="relative hidden md:flex w-1/2 flex-col justify-between p-12 overflow-hidden"
        style={{
          background: BG_GRADIENT,
          backgroundSize: "400% 400%",
          animation: "gradientShift 12s ease infinite",
        }}
      >
        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10"
            style={{ filter: "blur(64px)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400/20"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-indigo-300/20"
            style={{ filter: "blur(40px)" }}
          />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-lg">
            <BoltIcon className="w-5 h-5 text-[#3D4EF0]" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            OneNexium
          </span>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg"
        >
          <h1 className="text-[3.75rem] leading-[1.15] font-extrabold text-white mb-6">
            Welcome Back to
            <br />
            <span className="opacity-90">OneNexium</span>
          </h1>
          <p className="text-white/80 text-xl leading-relaxed font-medium">
            Build websites and apps instantly using the world{"'"}s most
            advanced AI platform.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 flex gap-8 text-white/60 text-sm"
        >
          <span>{`© ${currentYear} OneNexium Inc.`}</span>
          <button className="hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button className="hover:text-white transition-colors cursor-pointer">
            Terms of Service
          </button>
        </motion.div>
      </section>

      {/* ───── RIGHT: Login Section ───── */}
      <section className="flex-1 flex items-center justify-center py-24 px-6 md:px-24 bg-[#F5F8FF] relative">
        {/* Mobile logo (top-left) */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3D4EF0] rounded-lg flex items-center justify-center">
            <BoltIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-foreground font-bold">OneNexium</span>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[28rem]"
        >
          <div
            className="p-10 max-sm:p-8 rounded-[2rem] border border-white/30"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Sign in
              </h2>
              <p className="text-[#64748b]">
                Enter your details to access your dashboard
              </p>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <SignInButton
                signInText=""
                className="flex items-center justify-center gap-3 py-3 px-4 border border-[#e2e8f0] rounded-xl bg-transparent hover:bg-white hover:shadow-sm transition-all cursor-pointer text-[#334155] text-sm font-semibold h-auto"
              >
                <GoogleIcon />
                <span>Google</span>
              </SignInButton>
              <SignInButton
                signInText=""
                className="flex items-center justify-center gap-3 py-3 px-4 border border-[#e2e8f0] rounded-xl bg-transparent hover:bg-white hover:shadow-sm transition-all cursor-pointer text-[#334155] text-sm font-semibold h-auto"
              >
                <MicrosoftIcon />
                <span>Microsoft</span>
              </SignInButton>
            </div>

            {/* Divider */}
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-[#e2e8f0]" />
              <span className="shrink mx-4 text-[#94a3b8] text-xs font-medium uppercase tracking-widest">
                or email
              </span>
              <div className="flex-grow border-t border-[#e2e8f0]" />
            </div>

            {/* Email sign-in button */}
            <SignInButton
              signInText="Continue with Email"
              className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(61,78,240,0.4)] hover:-translate-y-px transition-all cursor-pointer border-0 h-auto"
              style={{ background: BRAND_GRADIENT }}
            />

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-[#64748b]/60 text-xs">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>100k+ users</span>
              </div>
            </div>
          </div>

          {/* Trusted by logos (grayscale) */}
          <TrustedLogos />
        </motion.div>
      </section>

      {/* Gradient animation keyframe */}
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

export default function LoginPage() {
  return (
    <div
      className="min-h-screen bg-[#F5F8FF] text-foreground antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Authenticated>
        <RedirectIfAuthenticated />
      </Authenticated>

      <AuthLoading>
        <div className="flex min-h-screen">
          <div className="hidden md:flex w-1/2" style={{ background: BG_GRADIENT }} />
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
        <LoginContent />
      </Unauthenticated>
    </div>
  );
}
