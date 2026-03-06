import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CAPABILITIES = [
  "AI",
  "Database",
  "Auth",
  "Payments",
  "Hosting",
  "Security",
  "Analytics",
  "Email",
  "1000+ APIs",
];

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold tracking-tight">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16"
        >
          How does OneNexium work?
        </motion.h2>

        <div className="space-y-6">
          {/* Card 1: Build anything */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Build anything
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Build web SaaS, eCommerce, internal tools, mobile apps,
                  landing pages, websites and more by chatting with AI. No code
                  required. It really just works.
                </p>
              </div>
              {/* Chat mockup */}
              <div className="bg-muted rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
                  <span className="text-xs text-muted-foreground font-medium">
                    OneNexium AI
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-background rounded-xl px-4 py-3 text-sm max-w-[80%]">
                    Build me a
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["SaaS dashboard", "landing page", "eCommerce store"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-1.5 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Build powerful apps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Build powerful apps
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              All OneNexium apps include auth, backend, database, file & media
              storage, email, AI, payments, push notifications, analytics,
              hosting, and integrations with 1000s of existing APIs out of the
              box.
            </p>
            {/* Scrolling capability pills */}
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-3 w-max"
              >
                {[...CAPABILITIES, ...CAPABILITIES].map((cap, i) => (
                  <div
                    key={`${cap}-${i}`}
                    className="flex-shrink-0 text-sm font-medium bg-muted border border-border px-5 py-2.5 rounded-full"
                  >
                    {cap}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Cards row: Publish + Scale */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 3: Publish in one click */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-3xl border border-border p-8 md:p-10"
            >
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Publish in one click
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Deploy your apps instantly. Use a OneNexium domain or bring your
                own. Share with the world in seconds.
              </p>
              {/* Publish button mockup */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    toast.info("Publish coming soon! This is a demo.")
                  }
                  className="bg-foreground text-background px-10 py-4 rounded-2xl text-base font-bold shadow-lg cursor-pointer flex items-center gap-2"
                >
                  Publish
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Card 4: Scale to millions */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-3xl border border-border p-8 md:p-10"
            >
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Scale to millions
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                OneNexium infrastructure is designed to scale. Grow your app to
                millions of users and revenue with ease.
              </p>
              <div className="flex justify-center">
                <AnimatedCounter target={0} label="Active users" />
              </div>
              <p className="text-center text-xs text-muted-foreground/50 mt-4">
                Your next big thing starts at zero
              </p>
            </motion.div>
          </div>

          {/* Card 5: Make money */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  Make money
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Accept payments from day one. Sell SaaS subscriptions, physical
                  goods, digital goods, services, and more. OneNexium Commerce is
                  built in and lets you accept payments from anywhere in the
                  world.
                </p>
              </div>
              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="w-52 bg-foreground rounded-3xl p-4 shadow-xl">
                  <div className="bg-background rounded-2xl p-4 space-y-3">
                    <div className="text-xs text-muted-foreground font-medium">
                      3:52
                    </div>
                    <div className="text-xs font-bold">Thursday, March 6</div>
                    <div className="bg-muted rounded-xl p-3 space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">
                            $
                          </span>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold">
                            Payment received
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            $249.00 from customer
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">
                            +
                          </span>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold">
                            New subscriber
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            Pro plan - $29/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
