import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Users,
  Globe,
  Check,
  ArrowRight,
  Phone,
  ShieldCheck,
  X,
  Mail,
} from "lucide-react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
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

const OTP_LENGTH = 6;

/** Display-only OTP verification dialog */
function OtpVerificationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [otpValues, setOtpValues] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newValues = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      newValues[i] = pastedData[i];
    }
    setOtpValues(newValues);
    const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleClose = () => {
    setOtpValues(Array.from({ length: OTP_LENGTH }, () => ""));
    setIsVerifying(false);
    setIsVerified(false);
    onClose();
  };

  const allFilled = otpValues.every((v) => v !== "");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-black/8 bg-white p-8 shadow-xl relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black/30 hover:text-black/60 hover:bg-black/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isVerified ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Verified</h3>
                <p className="text-black/40 text-sm mb-6">
                  Your email address has been verified successfully.
                </p>
                <Button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-[#0a0a0a] text-white font-semibold text-sm hover:bg-[#1a1a1a] h-auto cursor-pointer"
                >
                  Continue
                </Button>
              </motion.div>
            ) : (
              /* OTP input state */
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-black/[0.04] border border-black/6 flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-6 h-6 text-black/50" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-1.5">Verify your email</h3>
                <p className="text-black/40 text-sm mb-7">
                  {"We've sent a 6-digit code to your email address. Enter it below to verify."}
                </p>

                {/* OTP inputs */}
                <div className="flex items-center justify-center gap-2.5 mb-6" onPaste={handlePaste}>
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-11 h-13 text-center text-lg font-semibold border border-black/10 rounded-xl bg-black/[0.02] focus:border-black/30 focus:ring-1 focus:ring-black/10 transition-all outline-none"
                    />
                  ))}
                </div>

                {/* Verify button */}
                <Button
                  onClick={handleVerify}
                  disabled={!allFilled || isVerifying}
                  className="w-full py-3 rounded-xl bg-[#0a0a0a] text-white font-semibold text-sm hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed h-auto cursor-pointer"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                {/* Resend */}
                <p className="mt-5 text-black/30 text-xs">
                  {"Didn't receive the code? "}
                  <button className="text-[#0a0a0a] font-medium hover:underline cursor-pointer">
                    Resend
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SignupContent() {
  const navigate = useNavigate();
  const [otpOpen, setOtpOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#fafafa] text-[#0a0a0a] overflow-hidden">
      <GridBackground />
      <OtpVerificationDialog open={otpOpen} onClose={() => setOtpOpen(false)} />

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
                <div>
                  <label className="block text-xs font-medium text-black/50 mb-1.5">
                    Phone Number <span className="text-black/25 font-normal">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 border border-black/10 rounded-xl bg-black/[0.02] text-sm text-black/50 shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                      <span>+1</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      readOnly
                      className="w-full rounded-xl border-black/10 bg-black/[0.02] h-11 text-sm placeholder:text-black/25 cursor-default focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Sign up button — opens OTP dialog */}
              <Button
                onClick={() => setOtpOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#0a0a0a] text-white font-semibold text-sm hover:bg-[#1a1a1a] transition-all cursor-pointer border-0 h-auto flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

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
