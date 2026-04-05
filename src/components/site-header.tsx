import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { LOGO_URL, APP_NAME } from "@/lib/brand.ts";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
];

export default function SiteHeader() {
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.img
            src={LOGO_URL}
            alt={APP_NAME}
            className="h-8 w-8 rounded-lg object-cover shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: [
                "drop-shadow(0 0 0px rgba(99,102,241,0))",
                "drop-shadow(0 0 8px rgba(99,102,241,0.5))",
                "drop-shadow(0 0 0px rgba(99,102,241,0))",
              ],
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              filter: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.15 }}
          />
          <motion.span
            className="font-semibold text-lg tracking-tight"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {APP_NAME}
          </motion.span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`hover:text-foreground transition-colors ${
                location.pathname === link.href ? "text-foreground" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:block text-sm font-medium hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-md hover:opacity-90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
