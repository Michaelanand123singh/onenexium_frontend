import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  User,
  Briefcase,
  Rocket,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const ROLES = [
  { id: "founder", label: "Founder / CEO", icon: "🚀" },
  { id: "developer", label: "Developer", icon: "💻" },
  { id: "designer", label: "Designer", icon: "🎨" },
  { id: "marketer", label: "Marketer", icon: "📈" },
  { id: "product", label: "Product Manager", icon: "📋" },
  { id: "student", label: "Student", icon: "🎓" },
  { id: "other", label: "Other", icon: "✨" },
];

const GOALS = [
  { id: "build-saas", label: "Build a SaaS product", icon: "🏗️" },
  { id: "landing-page", label: "Create a landing page", icon: "🌐" },
  { id: "internal-tool", label: "Build an internal tool", icon: "🔧" },
  { id: "portfolio", label: "Make a portfolio", icon: "💼" },
  { id: "ecommerce", label: "Launch an online store", icon: "🛍️" },
  { id: "explore", label: "Just exploring", icon: "🔍" },
];

type OnboardingStep = "welcome" | "profile" | "role" | "goal" | "complete";

const STEPS: OnboardingStep[] = ["welcome", "profile", "role", "goal", "complete"];

function StepIndicator({ currentStep }: { currentStep: OnboardingStep }) {
  const currentIndex = STEPS.indexOf(currentStep);
  return (
    <div className="flex items-center gap-2">
      {STEPS.slice(0, -1).map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background:
                i <= currentIndex ? BRAND_GRADIENT : "rgba(12,15,24,0.1)",
              transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
          {i < STEPS.length - 2 && (
            <div
              className="w-6 h-0.5 rounded-full transition-colors duration-300"
              style={{
                background:
                  i < currentIndex
                    ? "linear-gradient(90deg, #3D4EF0, #23A0FF)"
                    : "rgba(12,15,24,0.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingFlow({
  userName,
  onComplete,
}: {
  userName: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [displayName, setDisplayName] = useState(userName || "");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        displayName: displayName.trim() || userName || "User",
        role: selectedRole || "other",
        goal: selectedGoal || "explore",
      });
      setStep("complete");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #3D4EF0, transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#3D4EF0 1px, transparent 1px), linear-gradient(90deg, #3D4EF0 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Step indicator */}
        {step !== "complete" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-10"
          >
            <StepIndicator currentStep={step} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-[#3D4EF0]/20"
                style={{ background: BRAND_GRADIENT }}
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold text-[#0C0F18] mb-3">
                Welcome to OneNexium
              </h1>
              <p className="text-[#0C0F18]/50 mb-10 max-w-sm mx-auto leading-relaxed">
                Let's set up your account in just a few quick steps so we can
                personalize your experience.
              </p>
              <button
                onClick={goNext}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25 cursor-pointer"
                style={{ background: BRAND_GRADIENT }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Profile */}
          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C0F18] mb-2">
                What should we call you?
              </h2>
              <p className="text-[#0C0F18]/40 mb-8 text-sm">
                This is how you'll appear across OneNexium
              </p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full max-w-xs mx-auto block bg-white border border-[#0C0F18]/10 rounded-xl px-4 py-3 text-[#0C0F18] text-center text-lg font-medium placeholder:text-[#0C0F18]/25 outline-none focus:border-[#3D4EF0]/40 focus:shadow-sm focus:shadow-[#3D4EF0]/10 transition-all"
                autoFocus
              />
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-[#0C0F18]/50 hover:text-[#0C0F18] hover:bg-[#0C0F18]/5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!displayName.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25 disabled:opacity-40 cursor-pointer"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Role */}
          {step === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C0F18] mb-2">
                What best describes you?
              </h2>
              <p className="text-[#0C0F18]/40 mb-8 text-sm">
                This helps us tailor your experience
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                      selectedRole === role.id
                        ? "border-[#3D4EF0]/40 bg-[#3D4EF0]/5 text-[#3D4EF0] shadow-sm shadow-[#3D4EF0]/10"
                        : "border-[#0C0F18]/8 text-[#0C0F18]/70 hover:border-[#0C0F18]/15 hover:bg-[#0C0F18]/[0.02]"
                    }`}
                  >
                    <span className="text-lg">{role.icon}</span>
                    {role.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-[#0C0F18]/50 hover:text-[#0C0F18] hover:bg-[#0C0F18]/5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!selectedRole}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25 disabled:opacity-40 cursor-pointer"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Goal */}
          {step === "goal" && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                <Rocket className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-[#0C0F18] mb-2">
                What's your main goal?
              </h2>
              <p className="text-[#0C0F18]/40 mb-8 text-sm">
                We'll customize your workspace accordingly
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                      selectedGoal === goal.id
                        ? "border-[#3D4EF0]/40 bg-[#3D4EF0]/5 text-[#3D4EF0] shadow-sm shadow-[#3D4EF0]/10"
                        : "border-[#0C0F18]/8 text-[#0C0F18]/70 hover:border-[#0C0F18]/15 hover:bg-[#0C0F18]/[0.02]"
                    }`}
                  >
                    <span className="text-lg">{goal.icon}</span>
                    {goal.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-[#0C0F18]/50 hover:text-[#0C0F18] hover:bg-[#0C0F18]/5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!selectedGoal || isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25 disabled:opacity-40 cursor-pointer"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {isSubmitting ? "Setting up..." : "Finish Setup"}
                  {!isSubmitting && <Check className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-[#3D4EF0]/20"
                style={{ background: BRAND_GRADIENT }}
              >
                <Check className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-bold text-[#0C0F18] mb-3">
                You're all set, {displayName.split(" ")[0]}!
              </h2>
              <p className="text-[#0C0F18]/50 mb-10 max-w-sm mx-auto leading-relaxed">
                Your account is ready. Let's start building something
                extraordinary.
              </p>
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/25 cursor-pointer"
                style={{ background: BRAND_GRADIENT }}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
