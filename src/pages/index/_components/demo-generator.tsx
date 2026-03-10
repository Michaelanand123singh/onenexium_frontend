import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Monitor,
  Smartphone,
  Bot,
  Image,
  Globe,
  Send,
  Check,
  Code,
  Palette,
  Database,
  Layers,
  Rocket,
  ShoppingBag,
  Coffee,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { BRAND_GRADIENT, BRAND_COLORS } from "@/lib/brand.ts";

// --- Demo scenarios ---
type Scenario = {
  prompt: string;
  label: string;
  icon: typeof Coffee;
  url: string;
  pages: string[];
  chatMessages: string[];
  preview: PreviewContent;
};

type PreviewContent = {
  navItems: string[];
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  cards: { title: string; desc: string; emoji: string }[];
  ctaText: string;
  accentColor: string;
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "Build a modern coffee shop website with menu and ordering",
    label: "Coffee Shop",
    icon: Coffee,
    url: "brewhaus.onenexium.app",
    pages: ["Home", "Menu", "Order", "About"],
    chatMessages: [
      "Setting up your coffee shop website...",
      "Creating a warm, inviting hero section with your brand",
      "Building the menu page with categories and pricing",
      "Adding online ordering with cart functionality",
      "Setting up the about page with your story",
      "Optimizing for mobile and adding animations",
      "Your coffee shop website is ready!",
    ],
    preview: {
      navItems: ["Home", "Menu", "Order", "About"],
      heroTitle: "Crafted with Passion",
      heroSubtitle: "Artisan coffee, fresh pastries, and a cozy atmosphere",
      heroImage: "☕",
      cards: [
        { title: "Espresso", desc: "Rich & bold", emoji: "☕" },
        { title: "Pastries", desc: "Freshly baked", emoji: "🥐" },
        { title: "Catering", desc: "For events", emoji: "🎉" },
      ],
      ctaText: "Order Now",
      accentColor: "#8B4513",
    },
  },
  {
    prompt: "Create a SaaS dashboard for project management with analytics",
    label: "SaaS App",
    icon: Briefcase,
    url: "taskflow.onenexium.app",
    pages: ["Dashboard", "Projects", "Analytics", "Settings"],
    chatMessages: [
      "Initializing your SaaS project...",
      "Creating the dashboard with key metrics",
      "Building the projects board with drag-and-drop",
      "Adding analytics charts and data visualization",
      "Setting up user authentication and roles",
      "Adding real-time notifications",
      "Your SaaS dashboard is ready!",
    ],
    preview: {
      navItems: ["Dashboard", "Projects", "Analytics", "Team"],
      heroTitle: "Ship Faster Together",
      heroSubtitle: "Project management that scales with your team",
      heroImage: "📊",
      cards: [
        { title: "12 Projects", desc: "Active", emoji: "📁" },
        { title: "98%", desc: "On track", emoji: "✅" },
        { title: "24 Members", desc: "Online", emoji: "👥" },
      ],
      ctaText: "Get Started Free",
      accentColor: "#6366f1",
    },
  },
  {
    prompt: "Make an online store for handmade jewelry with checkout",
    label: "E-Commerce",
    icon: ShoppingBag,
    url: "luxecraft.onenexium.app",
    pages: ["Shop", "Collections", "Cart", "About"],
    chatMessages: [
      "Setting up your online store...",
      "Creating a stunning product gallery",
      "Building collection pages with filters",
      "Adding shopping cart and checkout flow",
      "Setting up payment processing",
      "Adding inventory management",
      "Your online store is ready!",
    ],
    preview: {
      navItems: ["Shop", "Collections", "New In", "About"],
      heroTitle: "Handcrafted Elegance",
      heroSubtitle: "Unique jewelry pieces, made with love",
      heroImage: "💎",
      cards: [
        { title: "Rings", desc: "From $49", emoji: "💍" },
        { title: "Necklaces", desc: "From $79", emoji: "📿" },
        { title: "Earrings", desc: "From $35", emoji: "✨" },
      ],
      ctaText: "Shop Now",
      accentColor: "#d4a574",
    },
  },
  {
    prompt: "Build an online learning platform with courses and progress tracking",
    label: "Education",
    icon: GraduationCap,
    url: "learnhub.onenexium.app",
    pages: ["Courses", "My Learning", "Community", "Profile"],
    chatMessages: [
      "Creating your learning platform...",
      "Building the course catalog with search and filters",
      "Adding video player and lesson navigation",
      "Setting up progress tracking and certificates",
      "Building the community forum",
      "Adding gamification and achievements",
      "Your learning platform is ready!",
    ],
    preview: {
      navItems: ["Courses", "My Learning", "Community", "Profile"],
      heroTitle: "Learn Without Limits",
      heroSubtitle: "Master new skills with expert-led courses",
      heroImage: "🎓",
      cards: [
        { title: "150+ Courses", desc: "All levels", emoji: "📚" },
        { title: "Expert-Led", desc: "Top instructors", emoji: "👨‍🏫" },
        { title: "Certificates", desc: "Earn proof", emoji: "🏆" },
      ],
      ctaText: "Start Learning",
      accentColor: "#059669",
    },
  },
];

type DemoPhase = "idle" | "typing" | "generating" | "done";

export default function DemoGenerator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [typedText, setTypedText] = useState("");
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");
  const [chatIndex, setChatIndex] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[activeScenario];

  // Auto-start when in view
  useEffect(() => {
    if (isInView && phase === "idle") {
      setPhase("typing");
    }
  }, [isInView, phase]);

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedText.length < scenario.prompt.length) {
      const timeout = setTimeout(() => {
        setTypedText(scenario.prompt.slice(0, typedText.length + 1));
      }, 35);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setPhase("generating"), 500);
    return () => clearTimeout(timeout);
  }, [phase, typedText, scenario.prompt]);

  // Chat messages during generation
  useEffect(() => {
    if (phase !== "generating") return;
    if (chatIndex < scenario.chatMessages.length - 1) {
      const timeout = setTimeout(() => {
        setChatIndex((i) => i + 1);
      }, 900);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setPhase("done"), 600);
    return () => clearTimeout(timeout);
  }, [phase, chatIndex, scenario.chatMessages.length]);

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chatIndex]);

  const handleScenarioSelect = (index: number) => {
    setActiveScenario(index);
    setPhase("idle");
    setTypedText("");
    setChatIndex(0);
    setActivePage(0);
    setTimeout(() => setPhase("typing"), 200);
  };

  const handleReplay = () => {
    setPhase("idle");
    setTypedText("");
    setChatIndex(0);
    setActivePage(0);
    setTimeout(() => setPhase("typing"), 200);
  };

  const isBuilding = phase === "generating";
  const isDone = phase === "done";
  const progress = isBuilding
    ? Math.round(((chatIndex + 1) / scenario.chatMessages.length) * 100)
    : isDone
      ? 100
      : 0;

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-3xl mx-auto"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase border border-[#3D4EF0]/15 bg-[#3D4EF0]/5 text-[#3D4EF0] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Instant Demo
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          See{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
            OneNexium
          </span>{" "}
          in Action
        </h2>
        <p className="text-foreground/50 text-lg max-w-xl mx-auto">
          Watch how a single prompt turns into a fully functional website in seconds.
        </p>
      </motion.div>

      {/* Suggestion pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto"
      >
        {SCENARIOS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScenarioSelect(i)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border ${
                i === activeScenario
                  ? "bg-[#3D4EF0]/10 text-[#3D4EF0] border-[#3D4EF0]/25"
                  : "bg-foreground/3 text-foreground/50 border-foreground/8 hover:border-foreground/15 hover:text-foreground/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main demo container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <div className="rounded-2xl border border-foreground/10 overflow-hidden bg-background shadow-xl shadow-foreground/3">
          {/* Prompt input bar */}
          <div className="p-5 border-b border-foreground/8 bg-foreground/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <div className="bg-background border border-foreground/10 rounded-xl px-4 py-3.5 text-sm min-h-[48px] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#3D4EF0] shrink-0" />
                  <span className="text-foreground">
                    {typedText}
                    {phase === "typing" && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-[#3D4EF0] ml-0.5 align-middle"
                      />
                    )}
                    {phase === "idle" && (
                      <span className="text-foreground/25">Describe the website you want to build...</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl border border-foreground/8 text-foreground/30 hover:text-foreground/50 transition-colors cursor-pointer">
                  <Image className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={isDone ? handleReplay : undefined}
                  className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer shrink-0 flex items-center gap-2"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {isDone ? (
                    <>
                      <Rocket className="w-3.5 h-3.5" /> Try Again
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Generate
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Progress bar */}
            <AnimatePresence>
              {(isBuilding || isDone) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground/40">
                      {isDone ? "Build complete" : "Building your website..."}
                    </span>
                    <span className="text-xs font-medium text-[#3D4EF0]">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: BRAND_GRADIENT }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Two-column: AI chat + Preview */}
          <div className="flex flex-col lg:flex-row min-h-[480px]">
            {/* AI Chat sidebar */}
            <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-foreground/8 flex flex-col">
              <div className="px-4 py-3 border-b border-foreground/8 flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  AI Assistant
                </span>
                {isBuilding && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-[#3D4EF0]"
                  />
                )}
              </div>

              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: phase !== "idle" ? 1 : 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-[#3D4EF0] text-white rounded-xl rounded-tr-sm px-3.5 py-2.5 text-xs max-w-[90%] leading-relaxed">
                    {scenario.prompt}
                  </div>
                </motion.div>

                {/* AI responses */}
                {(isBuilding || isDone) &&
                  scenario.chatMessages.slice(0, chatIndex + 1).map((msg, i) => {
                    const isLast = i === chatIndex && isBuilding;
                    const stepIcons = [Layers, Palette, Code, Database, Rocket, Sparkles, Check];
                    const StepIcon = stepIcons[i % stepIcons.length];
                    return (
                      <motion.div
                        key={`${activeScenario}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2"
                      >
                        <div className="w-5 h-5 rounded-md bg-foreground/5 flex items-center justify-center shrink-0 mt-0.5">
                          <StepIcon className="w-3 h-3 text-[#3D4EF0]" />
                        </div>
                        <div className="bg-foreground/[0.04] rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-foreground/70 leading-relaxed">
                          {msg}
                          {isLast && (
                            <motion.span
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block ml-1"
                            >
                              ...
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                {/* Success message */}
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-emerald-600 leading-relaxed">
                        Website deployed to{" "}
                        <span className="font-semibold">{scenario.url}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Preview panel */}
            <div className="flex-1 flex flex-col">
              {/* Preview toolbar */}
              <div className="px-4 py-3 border-b border-foreground/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-foreground/30" />
                  <span className="text-xs text-foreground/40 font-medium">{scenario.url}</span>
                </div>
                {/* Pages tabs */}
                <div className="hidden sm:flex items-center gap-1">
                  {scenario.pages.map((page, i) => (
                    <button
                      key={page}
                      onClick={() => setActivePage(i)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-all ${
                        i === activePage
                          ? "bg-[#3D4EF0]/10 text-[#3D4EF0]"
                          : "text-foreground/30 hover:text-foreground/50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                {/* View toggle */}
                <div className="flex gap-1 bg-foreground/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveView("desktop")}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      activeView === "desktop" ? "bg-[#3D4EF0] text-white" : "text-foreground/30"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveView("mobile")}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      activeView === "mobile" ? "bg-[#3D4EF0] text-white" : "text-foreground/30"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Website preview */}
              <div className="flex-1 p-4 bg-foreground/[0.015] overflow-hidden">
                <motion.div
                  animate={{ opacity: isDone ? 1 : isBuilding ? 0.4 : 0.1 }}
                  transition={{ duration: 0.5 }}
                  className={`h-full border border-foreground/8 rounded-xl overflow-hidden bg-background ${
                    activeView === "mobile" ? "max-w-[300px] mx-auto" : "w-full"
                  }`}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-foreground/[0.03] border-b border-foreground/8">
                    <div className="w-2 h-2 rounded-full bg-red-400/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                    <div className="w-2 h-2 rounded-full bg-green-400/50" />
                    <div className="ml-2 flex-1 bg-foreground/5 rounded-md px-2.5 py-0.5 text-[9px] text-foreground/25 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      {scenario.url}
                    </div>
                  </div>

                  {/* Realistic website content */}
                  <div className="overflow-y-auto max-h-[350px]">
                    {/* Nav */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: isDone ? 1 : 0.15, y: isDone ? 0 : -8 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="px-4 py-2.5 flex items-center justify-between border-b border-foreground/5"
                    >
                      <span className="text-[10px] font-bold text-foreground/70">{scenario.label}</span>
                      <div className="flex gap-3">
                        {scenario.preview.navItems.map((item) => (
                          <span key={item} className="text-[9px] text-foreground/35 hover:text-foreground/60 cursor-pointer">
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Hero */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDone ? 1 : 0.1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="px-5 py-8 text-center"
                      style={{
                        background: isDone
                          ? `linear-gradient(135deg, ${scenario.preview.accentColor}08, ${BRAND_COLORS.primary}05)`
                          : undefined,
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: isDone ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                        className="text-3xl mb-3"
                      >
                        {scenario.preview.heroImage}
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 8 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="text-sm font-bold text-foreground/80 mb-1"
                      >
                        {scenario.preview.heroTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDone ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="text-[10px] text-foreground/40 mb-3 max-w-[200px] mx-auto"
                      >
                        {scenario.preview.heroSubtitle}
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isDone ? 1 : 0, scale: isDone ? 1 : 0.8 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="px-3 py-1 rounded-md text-[9px] font-semibold text-white"
                        style={{ background: scenario.preview.accentColor }}
                      >
                        {scenario.preview.ctaText}
                      </motion.button>
                    </motion.div>

                    {/* Cards grid */}
                    <div className={`px-4 pb-4 grid gap-2 ${activeView === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
                      {scenario.preview.cards.map((card, i) => (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 16, scale: 0.9 }}
                          animate={{
                            opacity: isDone ? 1 : 0.08,
                            y: isDone ? 0 : 16,
                            scale: isDone ? 1 : 0.9,
                          }}
                          transition={{ duration: 0.4, delay: isDone ? 0.5 + i * 0.1 : 0 }}
                          className="border border-foreground/8 rounded-lg p-3 text-center bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors"
                        >
                          <span className="text-lg block mb-1">{card.emoji}</span>
                          <p className="text-[10px] font-semibold text-foreground/70">{card.title}</p>
                          <p className="text-[8px] text-foreground/35">{card.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDone ? 1 : 0.05 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="px-4 py-3 border-t border-foreground/5 text-center"
                    >
                      <p className="text-[8px] text-foreground/20">
                        Built with OneNexium &bull; {new Date().getFullYear()}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Shimmer overlay during build */}
                <AnimatePresence>
                  {isBuilding && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-1/3"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.primary}08, transparent)`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
