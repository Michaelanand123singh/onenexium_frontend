import { motion } from "motion/react";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Video,
  ArrowRight,
  Newspaper,
  GraduationCap,
  Lightbulb,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const RESOURCE_CATEGORIES = [
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Comprehensive guides, API references, and tutorials to help you get the most out of One Nexium.",
    linkLabel: "Read the docs",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: GraduationCap,
    title: "Tutorials",
    description:
      "Step-by-step walkthroughs for building real-world apps, from simple landing pages to full SaaS platforms.",
    linkLabel: "Start learning",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-100 dark:border-violet-500/20",
  },
  {
    icon: Video,
    title: "Video Guides",
    description:
      "Watch bite-sized videos covering common patterns, tips, and tricks for building faster with AI.",
    linkLabel: "Watch videos",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-100 dark:border-rose-500/20",
  },
  {
    icon: MessageSquare,
    title: "Community",
    description:
      "Join thousands of builders sharing ideas, getting help, and showcasing what they have built on One Nexium.",
    linkLabel: "Join the community",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-100 dark:border-sky-500/20",
  },
];

const BLOG_POSTS = [
  {
    category: "Product Update",
    title: "Introducing AI App Builder v4",
    excerpt:
      "Our most powerful update yet. Generate full-stack apps with a single prompt, now with real-time collaboration.",
    date: "Mar 28, 2026",
  },
  {
    category: "Tutorial",
    title: "Build a SaaS Dashboard in 10 Minutes",
    excerpt:
      "Learn how to create a complete analytics dashboard with charts, user management, and role-based access.",
    date: "Mar 20, 2026",
  },
  {
    category: "Case Study",
    title: "How Acme Corp Shipped 3x Faster",
    excerpt:
      "See how a 50-person engineering team reduced their development cycle from weeks to days with One Nexium.",
    date: "Mar 12, 2026",
  },
];

const HELP_ITEMS = [
  {
    icon: HelpCircle,
    title: "Help Center",
    desc: "Find answers to common questions",
  },
  {
    icon: Lightbulb,
    title: "Feature Requests",
    desc: "Vote on and suggest new features",
  },
  {
    icon: FileText,
    title: "Changelog",
    desc: "See what's new in every release",
  },
  {
    icon: Newspaper,
    title: "Blog",
    desc: "Product updates, tutorials, and more",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Resources
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] text-balance mb-6">
              Learn, build, and{" "}
              <span className="text-primary">grow</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to master One Nexium. From getting started
              guides to advanced patterns, we have you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {RESOURCE_CATEGORIES.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              className="group bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${res.bg} ${res.color} border ${res.border} flex items-center justify-center mb-6`}
              >
                <res.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{res.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {res.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                {res.linkLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blog / Latest */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest from the blog
            </h2>
            <span className="text-sm text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
              View all
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="group bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="text-xs font-medium text-primary mb-3 block">
                  {post.category}
                </span>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="text-xs text-muted-foreground">
                  {post.date}
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
            More resources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HELP_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                className="text-center p-5 rounded-2xl border border-border bg-card/50 hover:bg-card hover:shadow-sm transition-all cursor-pointer"
              >
                <item.icon className="w-5 h-5 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-14 border border-border shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Can{"'"}t find what you need?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Our support team is here to help. Reach out and we{"'"}ll get you
            unblocked fast.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg hover:opacity-90 transition-all"
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
