import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For individuals and side projects",
    features: [
      "5 AI generations per day",
      "Basic templates",
      "Community support",
      "1 deployed project",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals and growing teams",
    features: [
      "Unlimited AI generations",
      "Premium templates",
      "Priority support",
      "Unlimited deployments",
      "Custom domains",
      "Team collaboration",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated infrastructure",
      "SLA guarantee",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            Start free. Scale as you grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 ${
                plan.highlighted
                  ? "bg-[#0C0F18] text-white border-2 border-[#3D4EF0]/50 shadow-[0_0_40px_rgba(61,78,240,0.15)]"
                  : "bg-card border border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold ${plan.highlighted ? "text-white" : ""}`}
                >
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? "text-white" : ""}`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-[#23A0FF]" : "text-[#3D4EF0]"}`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => toast.info(`${plan.name} plan coming soon!`)}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] text-white hover:shadow-[0_0_24px_rgba(61,78,240,0.5)]"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
