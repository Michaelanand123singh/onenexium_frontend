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
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent"
      >
        {count.toLocaleString()}
      </motion.div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

// Typing animation for the chat mockup
function TypingText({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 40);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, text, delay]);

  return (
    <div ref={ref} className="bg-background rounded-xl px-4 py-3 text-sm max-w-[80%]">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-[#3D4EF0] ml-0.5 align-middle"
        />
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16"
        >
          How does{" "}
          <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
            OneNexium
          </span>{" "}
          work?
        </motion.h2>

        <div className="space-y-6">
          {/* Card 1: Build anything */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              borderColor: "rgba(61,78,240,0.25)",
              boxShadow: "0 0 40px rgba(61,78,240,0.08)",
            }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12 transition-colors duration-300"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
                >
                  Build anything
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-muted-foreground text-base md:text-lg leading-relaxed"
                >
                  Build web SaaS, eCommerce, internal tools, mobile apps,
                  landing pages, websites and more by chatting with AI. No code
                  required. It really just works.
                </motion.p>
              </div>
              {/* Chat mockup with typing animation */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-muted rounded-2xl p-5 border border-border"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-[#3D4EF0]"
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    OneNexium AI
                  </span>
                </div>
                <div className="space-y-3">
                  <TypingText text="Build me a SaaS dashboard..." delay={500} />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="flex gap-2 flex-wrap"
                  >
                    {["SaaS dashboard", "landing page", "eCommerce store"].map(
                      (tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 2.8 + i * 0.15, duration: 0.3 }}
                          className="text-xs bg-[#3D4EF0]/10 text-[#3D4EF0] dark:text-[#23A0FF] px-3 py-1.5 rounded-full font-medium"
                        >
                          {tag}
                        </motion.span>
                      ),
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, delay: 3.5, ease: "easeOut" }}
                    className="h-1.5 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Card 2: Build powerful apps */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              borderColor: "rgba(61,78,240,0.25)",
              boxShadow: "0 0 40px rgba(61,78,240,0.08)",
            }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12 transition-colors duration-300"
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
            >
              Build powerful apps
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              All OneNexium apps include auth, backend, database, file {"&"} media
              storage, email, AI, payments, push notifications, analytics,
              hosting, and integrations with 1000s of existing APIs out of the
              box.
            </motion.p>
            {/* Scrolling capability pills */}
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-3 w-max"
              >
                {[...CAPABILITIES, ...CAPABILITIES].map((cap, i) => (
                  <div
                    key={`${cap}-${i}`}
                    className="flex-shrink-0 text-sm font-medium bg-[#3D4EF0]/8 text-[#3D4EF0] dark:text-[#23A0FF] border border-[#3D4EF0]/15 px-5 py-2.5 rounded-full"
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
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                borderColor: "rgba(61,78,240,0.25)",
                boxShadow: "0 0 40px rgba(61,78,240,0.08)",
              }}
              className="bg-card rounded-3xl border border-border p-8 md:p-10 transition-colors duration-300"
            >
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Publish in one click
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Deploy your apps instantly. Use a OneNexium domain or bring your
                own. Share with the world in seconds.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 30px rgba(61,78,240,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    toast.info("Publish coming soon! This is a demo.")
                  }
                  className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] text-white px-10 py-4 rounded-2xl text-base font-bold shadow-lg cursor-pointer flex items-center gap-2"
                >
                  Publish
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Card 4: Scale to millions */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                borderColor: "rgba(61,78,240,0.25)",
                boxShadow: "0 0 40px rgba(61,78,240,0.08)",
              }}
              className="bg-card rounded-3xl border border-border p-8 md:p-10 transition-colors duration-300"
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
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              borderColor: "rgba(61,78,240,0.25)",
              boxShadow: "0 0 40px rgba(61,78,240,0.08)",
            }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12 transition-colors duration-300"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
                >
                  Make money
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-muted-foreground text-base md:text-lg leading-relaxed"
                >
                  Accept payments from day one. Sell SaaS subscriptions, physical
                  goods, digital goods, services, and more. OneNexium Commerce is
                  built in and lets you accept payments from anywhere in the
                  world.
                </motion.p>
              </div>
              {/* Phone mockup with entrance animation */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center"
              >
                <motion.div
                  whileHover={{ y: -5, rotateZ: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-52 bg-[#0C0F18] rounded-3xl p-4 shadow-xl shadow-[#3D4EF0]/10"
                >
                  <div className="bg-background rounded-2xl p-4 space-y-3">
                    <div className="text-xs text-muted-foreground font-medium">
                      3:52
                    </div>
                    <div className="text-xs font-bold">Thursday, March 6</div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-muted rounded-xl p-3 space-y-2 mt-2"
                    >
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
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="bg-muted rounded-xl p-3 space-y-2"
                    >
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
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
