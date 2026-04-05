import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/site-header.tsx";
import SiteFooter from "@/components/site-footer.tsx";

type BillingCycle = "monthly" | "yearly";

const PLANS = [
  {
    name: "Free",
    description: "Perfect for trying things out",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Get Started",
    popular: false,
    features: [
      "1 project",
      "AI-powered builder",
      "Community support",
      "Basic analytics",
      "Free subdomain",
    ],
  },
  {
    name: "Pro",
    description: "For individuals and small teams",
    monthlyPrice: 29,
    yearlyPrice: 24,
    cta: "Start Free Trial",
    popular: true,
    features: [
      "Unlimited projects",
      "Custom domains",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "Remove branding",
      "Role-based access",
    ],
  },
  {
    name: "Enterprise",
    description: "For organizations at scale",
    monthlyPrice: null,
    yearlyPrice: null,
    cta: "Contact Sales",
    popular: false,
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Audit logging",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Volume discounts",
      "Onboarding assistance",
    ],
  },
];

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade, downgrade, or cancel at any time. Changes take effect immediately and we'll prorate any charges.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes! Every new account gets a 14-day free trial of Pro with no credit card required. Explore all features risk-free.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and support invoicing for Enterprise customers.",
  },
  {
    q: "Do you offer discounts for non-profits or education?",
    a: "Yes, we offer special pricing for non-profit organizations, educational institutions, and open-source projects. Contact us for details.",
  },
  {
    q: "What happens when my trial ends?",
    a: "Your projects stay intact. You'll simply be moved to the Free plan. Upgrade anytime to unlock Pro features again.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] text-balance mb-6">
              Simple, transparent{" "}
              <span className="text-primary">pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
              Start free, scale when you are ready. No hidden fees, no surprises.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 rounded-full border border-border p-1 bg-muted/50">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === "monthly"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billing === "yearly"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Yearly
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const price =
              billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
                className={`rounded-3xl p-8 border bg-card transition-all duration-300 relative ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border shadow-sm hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <div className="mb-8">
                  {price !== null ? (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold tracking-tight">
                        ${price}
                      </span>
                      <span className="text-muted-foreground text-sm mb-1">
                        /month
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight">
                      Custom
                    </span>
                  )}
                </div>

                <Link
                  to="/login"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition-all mb-8 ${
                    plan.popular
                      ? "bg-foreground text-background shadow-md hover:opacity-90"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <HelpCircle
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-14 border border-border shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Start building today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            No credit card required. Get started with the free plan and upgrade
            when you are ready.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg hover:opacity-90 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
