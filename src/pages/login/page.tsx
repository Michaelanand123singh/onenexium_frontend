import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Globe } from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const BRAND_GRADIENT = "linear-gradient(90deg, #3D4EF0, #23A0FF)";
const BG_GRADIENT =
  "linear-gradient(-45deg, #3D4EF0, #23A0FF, #6366f1, #0ea5e9)";

// Lightning bolt icon (matches Webflow SVG)
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 256L28.5 28c2-16 15.6-28 31.8-28L228.9 0c15 0 27.1 12.1 27.1 27.1 0 3.2-.6 6.5-1.7 9.5L208 160 347.3 160c20.2 0 36.7 16.4 36.7 36.7 0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7l-2.9 0c-15.7 0-28.5-12.8-28.5-28.5 0-2.3 .3-4.6 .9-6.9L176 288 32 288c-17.7 0-32-14.3-32-32z" />
    </svg>
  );
}

// Google icon
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="18"
      height="18"
      fill="currentColor"
      className="text-[#475569]"
    >
      <path d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  );
}

// Microsoft icon
function MicrosoftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 448"
      width="18"
      height="18"
    >
      <rect x="0" y="0" width="208" height="208" fill="#F25022" />
      <rect x="240" y="0" width="208" height="208" fill="#7FBA00" />
      <rect x="0" y="240" width="208" height="208" fill="#00A4EF" />
      <rect x="240" y="240" width="208" height="208" fill="#FFB900" />
    </svg>
  );
}

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
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
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
          <span className="text-[#0C0F18] font-bold">OneNexium</span>
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
              <h2 className="text-3xl font-bold text-[#0C0F18] mb-2">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-500"
          >
            {/* Stripe */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="60" height="24" fill="currentColor" className="text-[#0C0F18]">
              <path d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9l0-33.8c-5.7 2.3-33.7 10.5-33.7-15.7l0-63.2 33.7 0 0-37.8-33.7 0-.1-38.5zm89.1 51.6l-2.7-13.1-38.4 0 0 153.2 44.3 0 0-103.1c10.5-13.8 28.2-11.1 33.9-9.3l0-40.8c-6-2.1-26.7-6-37.1 13.1zM346.4 124l-44.6 9.5 0 36.2 44.6-9.5 0-36.2zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4l0-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2l0 40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5l0-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9l86.9 0c.2-2.3 .6-11.6 .6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4l-45.9 0zM439.2 180.2c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11-39.1 0 0 204.8 44.4-9.4 .1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6 .1-51.6-29.3-79.7-60.5-79.7zM428.6 302.7c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4 .1 23.9-10.9 41.8-27.4 41.8zM301.9 336.4l44.6 0 0-153.2-44.6 0 0 153.2z" />
            </svg>
            {/* Google Pay */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="60" height="24" fill="currentColor" className="text-[#0C0F18]">
              <path d="M105.7 215l0 41.2 57.1 0c-1.2 6.6-3.6 12.9-7.2 18.5s-8.4 10.4-13.9 14.1c-9.5 6.6-21.7 10.3-36 10.3-27.6 0-50.9-18.9-59.3-44.2-4.4-13.3-4.4-27.7 0-41 8.4-25.5 31.7-44.4 59.3-44.4 7.5-.1 14.9 1.2 21.9 4s13.3 6.9 18.6 12.1L176.5 155c-19.1-18.1-44.4-28.1-70.7-27.8-19.7 .1-38.9 5.7-55.6 16.1s-30.1 25.3-38.8 43C3.9 201.2 0 217.7 0 234.4s3.9 33.2 11.3 48.1l0 .2c8.7 17.7 22.1 32.5 38.8 43s35.9 16 55.6 16c28.5 0 52.5-9.5 70-25.9 20-18.6 31.4-46.2 31.4-78.9 0-7.3-.6-14.6-1.8-21.8l-99.7 0zm389.4-4c-10.1-9.4-23.9-14.1-41.4-14.1-22.5 0-39.3 8.3-50.5 24.9L424.1 235c7.6-11.3 18.1-17 31.3-17 8.4 0 16.5 3.2 22.7 8.8 3 2.6 5.5 5.9 7.1 9.6s2.5 7.6 2.5 11.7l0 5.5c-9.1-5.1-20.6-7.8-34.6-7.8-16.4 0-29.6 3.9-39.5 11.8s-14.8 18.3-14.8 31.6c-.2 5.9 1 11.8 3.4 17.2s6 10.2 10.5 14.1c9.2 8.3 21 12.5 34.8 12.5 16.3 0 29.2-7.3 39-21.9l1 0 0 17.7 22.6 0 0-78.7c.1-16.6-4.9-29.7-15-39zm-19.2 89.3c-3.5 3.5-7.6 6.3-12.2 8.2s-9.5 2.9-14.4 2.9c-6.7 .1-13.1-2.1-18.3-6.2-2.4-1.8-4.4-4.2-5.7-6.9s-2-5.7-2-8.7c0-7 3.2-12.8 9.5-17.4s14.5-7 24.1-7c13.2-.2 23.5 2.8 30.8 8.8 0 10.1-4 18.9-11.7 26.4zm-93.7-142c-5.3-5.3-11.6-9.5-18.6-12.3s-14.4-4.2-21.9-4l-62.7 0 0 186.7 23.6 0 0-75.6 39 0c16 0 29.5-5.4 40.5-15.9 .9-.9 1.8-1.8 2.6-2.7 9.6-10.5 14.8-24.4 14.3-38.6s-6.6-27.7-16.9-37.6l0 0zm-16.6 62.2c-3 3.2-6.6 5.7-10.6 7.4s-8.4 2.5-12.7 2.3l-39.6 0 0-65.2 39.6 0c8.5 0 16.6 3.3 22.6 9.2 6.1 6.1 9.6 14.3 9.8 23s-3.1 17-9 23.3l0 0zM614.3 201l-36.5 91.7-.5 0-37.4-91.7-25.7 0 51.8 119.6-29.4 64.3 24.3 0 79-183.9-25.7 0z" />
            </svg>
            {/* Apple Pay */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="60" height="24" fill="currentColor" className="text-[#0C0F18]">
              <path d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8zm10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9 .3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1zm100.4-36.2l0 194.9 30.3 0 0-66.6 41.9 0c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64l-73.2 0zM258.5 165l34.9 0c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8l-34.8 0 0-77.4zM420.7 335.9c19 0 36.6-9.6 44.6-24.9l.6 0 0 23.4 28 0 0-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6l27.3 0c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5l0 10.8-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5 .1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1 0 11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4l53.1-149-30.8 0-35.6 115.1-.6 0-35.6-115.1-31.6 0 51.2 141.9-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5l0 23.4c1.8 .4 9.3 .7 11.6 .7z" />
            </svg>
          </motion.div>
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
      className="min-h-screen bg-[#F5F8FF] text-[#0C0F18] antialiased"
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
