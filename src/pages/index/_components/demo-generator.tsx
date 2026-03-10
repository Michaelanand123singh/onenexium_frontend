import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Monitor,
  Smartphone,
  Bot,
  Send,
  Check,
  Code,
  Palette,
  Database,
  Layers,
  Rocket,
  Coffee,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Globe,
  FileText,
  Settings,
  Lock,
  BarChart3,
  Image,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  PanelLeftClose,
  Paintbrush,
  HardDrive,
  Mail,
  Bell,
  Eye,
} from "lucide-react";
import { BRAND_GRADIENT, BRAND_COLORS, LOGO_URL } from "@/lib/brand.ts";

// --- Sidebar icons (mimicking Hercules App Builder) ---
const SIDEBAR_ICONS = [
  { icon: Bot, label: "AI Editor", active: true },
  { icon: Eye, label: "Visual Editor" },
  { icon: Paintbrush, label: "Branding" },
  { icon: FileText, label: "Files & Media" },
  { icon: Users, label: "Users & Auth" },
  { icon: CreditCard, label: "Commerce" },
  { icon: Mail, label: "Email" },
  { icon: Bell, label: "Push Notifications" },
  { icon: Globe, label: "Domains" },
  { icon: BarChart3, label: "Analytics" },
  { icon: HardDrive, label: "Database" },
  { icon: Lock, label: "Secrets" },
  { icon: Settings, label: "Settings" },
];

// --- Demo scenarios ---
type PreviewContent = {
  navItems: string[];
  heroTitle: string;
  heroSubtitle: string;
  heroEmoji: string;
  cards: { title: string; desc: string; emoji: string }[];
  ctaText: string;
  accentColor: string;
};

type Scenario = {
  prompt: string;
  label: string;
  icon: typeof Coffee;
  url: string;
  chatMessages: string[];
  preview: PreviewContent;
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "Build a modern coffee shop website with menu and ordering",
    label: "Coffee Shop",
    icon: Coffee,
    url: "brewhaus.onenexium.app",
    chatMessages: [
      "Setting up your coffee shop website...",
      "Creating a warm, inviting hero section",
      "Building the menu page with categories",
      "Adding online ordering with cart",
      "Setting up the about page",
      "Optimizing for mobile and adding animations",
      "Your coffee shop website is ready!",
    ],
    preview: {
      navItems: ["Home", "Menu", "Order", "About"],
      heroTitle: "Crafted with Passion",
      heroSubtitle: "Artisan coffee, fresh pastries, and a cozy atmosphere",
      heroEmoji: "☕",
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
    prompt: "Create a SaaS dashboard for project management",
    label: "SaaS App",
    icon: Briefcase,
    url: "taskflow.onenexium.app",
    chatMessages: [
      "Initializing your SaaS project...",
      "Creating the dashboard with key metrics",
      "Building the projects board",
      "Adding analytics and data visualization",
      "Setting up user authentication",
      "Adding real-time notifications",
      "Your SaaS dashboard is ready!",
    ],
    preview: {
      navItems: ["Dashboard", "Projects", "Analytics", "Team"],
      heroTitle: "Ship Faster Together",
      heroSubtitle: "Project management that scales with your team",
      heroEmoji: "📊",
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
    prompt: "Make an online store for handmade jewelry",
    label: "E-Commerce",
    icon: ShoppingBag,
    url: "luxecraft.onenexium.app",
    chatMessages: [
      "Setting up your online store...",
      "Creating a stunning product gallery",
      "Building collection pages with filters",
      "Adding shopping cart and checkout",
      "Setting up payment processing",
      "Adding inventory management",
      "Your online store is ready!",
    ],
    preview: {
      navItems: ["Shop", "Collections", "New In", "About"],
      heroTitle: "Handcrafted Elegance",
      heroSubtitle: "Unique jewelry pieces, made with love",
      heroEmoji: "💎",
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
    prompt: "Build an online learning platform with courses",
    label: "Education",
    icon: GraduationCap,
    url: "learnhub.onenexium.app",
    chatMessages: [
      "Creating your learning platform...",
      "Building the course catalog",
      "Adding video player and lessons",
      "Setting up progress tracking",
      "Building the community forum",
      "Adding gamification and achievements",
      "Your learning platform is ready!",
    ],
    preview: {
      navItems: ["Courses", "My Learning", "Community", "Profile"],
      heroTitle: "Learn Without Limits",
      heroSubtitle: "Master new skills with expert-led courses",
      heroEmoji: "🎓",
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
  const chatRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[activeScenario];

  useEffect(() => {
    if (isInView && phase === "idle") setPhase("typing");
  }, [isInView, phase]);

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

  useEffect(() => {
    if (phase !== "generating") return;
    if (chatIndex < scenario.chatMessages.length - 1) {
      const timeout = setTimeout(() => setChatIndex((i) => i + 1), 900);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setPhase("done"), 600);
    return () => clearTimeout(timeout);
  }, [phase, chatIndex, scenario.chatMessages.length]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chatIndex]);

  const handleScenarioSelect = (index: number) => {
    setActiveScenario(index);
    setPhase("idle");
    setTypedText("");
    setChatIndex(0);
    setTimeout(() => setPhase("typing"), 200);
  };

  const handleReplay = () => {
    setPhase("idle");
    setTypedText("");
    setChatIndex(0);
    setTimeout(() => setPhase("typing"), 200);
  };

  const isBuilding = phase === "generating";
  const isDone = phase === "done";
  const progress = isBuilding
    ? Math.round(((chatIndex + 1) / scenario.chatMessages.length) * 100)
    : isDone ? 100 : 0;

  const stepIcons = [Layers, Palette, Code, Database, Rocket, Sparkles, Check];

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
                  : "bg-foreground/3 text-foreground/50 border-foreground/8 hover:border-foreground/15"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ===== HERCULES-STYLE APP BUILDER MOCKUP ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <div className="rounded-2xl border border-foreground/10 overflow-hidden bg-background shadow-2xl shadow-foreground/5">
          {/* ── Top bar (mimicking app header) ── */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-foreground/8 bg-foreground/[0.02]">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="OneNexium" className="h-5 w-auto" />
              <span className="text-xs font-semibold text-foreground/70 hidden sm:inline">
                OneNexium
              </span>
            </div>
            <span className="text-[10px] text-foreground/30 font-medium">
              {scenario.label} Website
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-foreground/30 bg-foreground/5 px-2 py-0.5 rounded">
                v1
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-3 py-1 rounded-lg text-[10px] font-semibold text-white"
                style={{ background: BRAND_GRADIENT }}
              >
                Publish
              </motion.button>
            </div>
          </div>

          {/* ── Main 3-panel layout ── */}
          <div className="flex min-h-[480px]">
            {/* LEFT: Icon sidebar */}
            <div className="hidden md:flex flex-col w-12 border-r border-foreground/8 bg-foreground/[0.01] py-2 items-center gap-1">
              {SIDEBAR_ICONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    title={item.label}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      item.active
                        ? "bg-[#3D4EF0]/10 text-[#3D4EF0]"
                        : "text-foreground/25 hover:text-foreground/50 hover:bg-foreground/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                );
              })}
            </div>

            {/* CENTER: Chat panel */}
            <div className="w-full md:w-80 lg:w-[340px] border-b md:border-b-0 md:border-r border-foreground/8 flex flex-col">
              {/* Chat header */}
              <div className="px-4 py-2.5 border-b border-foreground/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PanelLeftClose className="w-3.5 h-3.5 text-foreground/25" />
                  <span className="text-xs font-semibold text-foreground/60">
                    {scenario.label} Website
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isBuilding && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#3D4EF0]"
                    />
                  )}
                </div>
              </div>

              {/* Chat messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
                {/* User message */}
                <AnimatePresence>
                  {phase !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-[#3D4EF0] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs max-w-[85%] leading-relaxed">
                        {scenario.prompt}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI responses */}
                {(isBuilding || isDone) &&
                  scenario.chatMessages.slice(0, chatIndex + 1).map((msg, i) => {
                    const isLast = i === chatIndex && isBuilding;
                    const StepIcon = stepIcons[i % stepIcons.length];
                    return (
                      <motion.div
                        key={`${activeScenario}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2.5"
                      >
                        <div className="w-6 h-6 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0 mt-0.5">
                          <StepIcon className="w-3 h-3 text-[#3D4EF0]" />
                        </div>
                        <div className="bg-foreground/[0.03] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-foreground/60 leading-relaxed">
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

                {/* Deploy success */}
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-emerald-600 leading-relaxed">
                        Website deployed to{" "}
                        <span className="font-semibold">{scenario.url}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat input */}
              <div className="p-3 border-t border-foreground/8">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-foreground/[0.03] border border-foreground/8 rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <span className="text-xs text-foreground/70 flex-1 truncate">
                      {typedText || (
                        <span className="text-foreground/25">Type your message...</span>
                      )}
                      {phase === "typing" && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-0.5 h-3.5 bg-[#3D4EF0] ml-0.5 align-middle"
                        />
                      )}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isDone ? handleReplay : undefined}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 cursor-pointer"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    {isDone ? <RotateCcw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  </motion.button>
                </div>
                {/* Progress bar */}
                <AnimatePresence>
                  {(isBuilding || isDone) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-foreground/30">
                          {isDone ? "Build complete" : "Building..."}
                        </span>
                        <span className="text-[10px] font-medium text-[#3D4EF0]">{progress}%</span>
                      </div>
                      <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: BRAND_GRADIENT }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Preview panel */}
            <div className="flex-1 flex flex-col bg-foreground/[0.01]">
              {/* Preview toolbar */}
              <div className="px-3 py-2 border-b border-foreground/8 flex items-center gap-3">
                <span className="text-[10px] font-semibold text-foreground/40">Preview</span>
                {/* Browser navigation */}
                <div className="flex items-center gap-1 text-foreground/20">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5" />
                  <RotateCcw className="w-3 h-3" />
                </div>
                {/* URL bar */}
                <div className="flex-1 bg-foreground/[0.04] border border-foreground/6 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-foreground/20" />
                  <span className="text-[10px] text-foreground/30 truncate">/{""}</span>
                </div>
                <span className="text-[9px] text-foreground/20 hidden lg:inline">Dev Machine</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 hidden lg:block" />
                {/* View toggle */}
                <div className="flex gap-0.5 bg-foreground/5 rounded-md p-0.5">
                  <button
                    onClick={() => setActiveView("desktop")}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      activeView === "desktop" ? "bg-[#3D4EF0] text-white" : "text-foreground/25"
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveView("mobile")}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      activeView === "mobile" ? "bg-[#3D4EF0] text-white" : "text-foreground/25"
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Website preview */}
              <div className="flex-1 p-3 overflow-hidden">
                <motion.div
                  animate={{ opacity: isDone ? 1 : isBuilding ? 0.35 : 0.08 }}
                  transition={{ duration: 0.5 }}
                  className={`h-full border border-foreground/6 rounded-xl overflow-hidden bg-background ${
                    activeView === "mobile" ? "max-w-[280px] mx-auto" : "w-full"
                  }`}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.025] border-b border-foreground/6">
                    <div className="w-2 h-2 rounded-full bg-red-400/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                    <div className="w-2 h-2 rounded-full bg-green-400/50" />
                    <div className="ml-2 flex-1 bg-foreground/5 rounded px-2 py-0.5 text-[8px] text-foreground/20 flex items-center gap-1">
                      <Globe className="w-2 h-2" />
                      {scenario.url}
                    </div>
                  </div>

                  {/* Website content */}
                  <div className="overflow-y-auto max-h-[350px]">
                    {/* Nav */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDone ? 1 : 0.12 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="px-4 py-2 flex items-center justify-between border-b border-foreground/5"
                    >
                      <span className="text-[10px] font-bold text-foreground/70">{scenario.label}</span>
                      <div className="flex gap-3">
                        {scenario.preview.navItems.map((item) => (
                          <span key={item} className="text-[8px] text-foreground/30">{item}</span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Hero */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDone ? 1 : 0.08 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="px-5 py-7 text-center"
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
                        className="text-3xl mb-2"
                      >
                        {scenario.preview.heroEmoji}
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 6 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="text-sm font-bold text-foreground/80 mb-1"
                      >
                        {scenario.preview.heroTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDone ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="text-[9px] text-foreground/40 mb-3 max-w-[180px] mx-auto"
                      >
                        {scenario.preview.heroSubtitle}
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isDone ? 1 : 0, scale: isDone ? 1 : 0.8 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="px-3 py-1 rounded text-[8px] font-semibold text-white"
                        style={{ background: scenario.preview.accentColor }}
                      >
                        {scenario.preview.ctaText}
                      </motion.button>
                    </motion.div>

                    {/* Cards */}
                    <div className={`px-4 pb-4 grid gap-2 ${activeView === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
                      {scenario.preview.cards.map((card, i) => (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: isDone ? 1 : 0.06, y: isDone ? 0 : 12 }}
                          transition={{ duration: 0.4, delay: isDone ? 0.5 + i * 0.1 : 0 }}
                          className="border border-foreground/6 rounded-lg p-2.5 text-center"
                        >
                          <span className="text-base block mb-1">{card.emoji}</span>
                          <p className="text-[9px] font-semibold text-foreground/70">{card.title}</p>
                          <p className="text-[7px] text-foreground/30">{card.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDone ? 1 : 0.04 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="px-4 py-2 border-t border-foreground/5 text-center"
                    >
                      <p className="text-[7px] text-foreground/15">
                        Built with OneNexium &bull; {new Date().getFullYear()}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Console bar at bottom */}
              <div className="px-3 py-1.5 border-t border-foreground/8 flex items-center gap-2">
                <Image className="w-3 h-3 text-foreground/20" />
                <span className="text-[9px] text-foreground/20">Console</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
