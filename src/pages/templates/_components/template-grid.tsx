import { motion } from "motion/react";
import { useState } from "react";
import {
  Search,
  Shuffle,
  Eye,
  Globe,
  ShoppingBag,
  Briefcase,
  BarChart3,
  Bot,
  Smartphone,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const CATEGORIES: Category[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "startup", label: "Startup Websites", icon: Globe },
  { id: "ecommerce", label: "E-commerce Stores", icon: ShoppingBag },
  { id: "portfolio", label: "Portfolio Websites", icon: Briefcase },
  { id: "saas", label: "SaaS Dashboards", icon: BarChart3 },
  { id: "ai", label: "AI Tools", icon: Bot },
  { id: "mobile", label: "Mobile Apps", icon: Smartphone },
];

type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  image: string;
  tags: string[];
};

const TEMPLATES: Template[] = [
  {
    id: "1",
    title: "AI Marketing Platform",
    description: "Full SaaS landing page with pricing, features, and sign-up flow",
    category: "startup",
    prompt: "Build a SaaS landing page for an AI marketing tool",
    image: "https://cdn.hercules.app/file_Gi2tGINxomjpH8a0LfysdCKi",
    tags: ["SaaS", "Landing Page", "AI"],
  },
  {
    id: "2",
    title: "Luxury Watch Store",
    description: "Premium e-commerce with product catalog, cart, and checkout",
    category: "ecommerce",
    prompt: "Create a luxury watch ecommerce store with dark theme",
    image: "https://cdn.hercules.app/file_DmUmO5p8HnmcR1ecexodp3X6",
    tags: ["E-commerce", "Luxury", "Dark"],
  },
  {
    id: "3",
    title: "Creative Portfolio",
    description: "Stunning portfolio with image gallery and project showcase",
    category: "portfolio",
    prompt: "Design a creative portfolio with image gallery",
    image: "https://cdn.hercules.app/file_fhVR4M0gheASRaCDh2Evgfl5",
    tags: ["Portfolio", "Gallery", "Creative"],
  },
  {
    id: "4",
    title: "Analytics Dashboard",
    description: "Data-rich dashboard with charts, metrics, and team management",
    category: "saas",
    prompt: "Build a SaaS analytics dashboard with charts and graphs",
    image: "https://cdn.hercules.app/file_WMULVKIlD4h2EKyVH0eYaaBf",
    tags: ["Dashboard", "Analytics", "Charts"],
  },
  {
    id: "5",
    title: "AI Chat Assistant",
    description: "Modern chatbot interface with conversation history and settings",
    category: "ai",
    prompt: "Create an AI chatbot tool with modern UI",
    image: "https://cdn.hercules.app/file_0MCqDZOc9gAz7uPTLBdcSjSS",
    tags: ["AI", "Chat", "Futuristic"],
  },
  {
    id: "6",
    title: "Fitness Tracker",
    description: "Mobile-first fitness app with workout plans and progress tracking",
    category: "mobile",
    prompt: "Make a fitness tracking mobile app landing page",
    image: "https://cdn.hercules.app/file_BdMbOKtDnmOJuv90MVUJznAX",
    tags: ["Mobile", "Fitness", "Health"],
  },
  {
    id: "7",
    title: "Startup Landing Page",
    description: "Clean startup website with hero, testimonials, and pricing",
    category: "startup",
    prompt: "Build a modern startup landing page with animations",
    image: "https://cdn.hercules.app/file_Gi2tGINxomjpH8a0LfysdCKi",
    tags: ["Startup", "Landing Page", "Modern"],
  },
  {
    id: "8",
    title: "Fashion Boutique",
    description: "Elegant online store with lookbooks and size guides",
    category: "ecommerce",
    prompt: "Create a fashion boutique e-commerce website",
    image: "https://cdn.hercules.app/file_DmUmO5p8HnmcR1ecexodp3X6",
    tags: ["Fashion", "E-commerce", "Elegant"],
  },
  {
    id: "9",
    title: "Developer Portfolio",
    description: "Minimal dev portfolio with project cards and tech stack",
    category: "portfolio",
    prompt: "Design a minimal developer portfolio with dark theme",
    image: "https://cdn.hercules.app/file_fhVR4M0gheASRaCDh2Evgfl5",
    tags: ["Developer", "Minimal", "Dark"],
  },
];

type TemplateGridProps = {
  onUseTemplate: (prompt: string) => void;
};

export default function TemplateGrid({ onUseTemplate }: TemplateGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-border rounded-xl bg-card pl-11 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/20 transition-colors shadow-sm"
          />
        </div>
      </motion.div>

      {/* Category filter - matching landing page toggle style */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer transition-all border ${
                activeCategory === cat.id
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground text-lg font-medium">No templates found</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Try a different search or category</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
              layout
              className="group"
            >
              <div className="bg-card rounded-3xl border border-border overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                {/* Preview */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 px-4 rounded-xl bg-foreground text-background font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                      onClick={() => onUseTemplate(template.prompt)}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      Use Template
                    </motion.button>
                    <button className="h-9 px-4 rounded-xl text-white font-semibold text-sm flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground mb-1">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-1 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Prompt */}
                  <div className="bg-foreground/[0.03] border border-border rounded-xl px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-medium">
                      Prompt
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {`"${template.prompt}"`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
