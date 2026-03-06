import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://cdn.hercules.app/file_IQepUTx3eL8c0gz4w8Pn9ncm";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50"
    >
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2.5"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <img src={LOGO_URL} alt="OneNexium" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-bold tracking-tight">OneNexium</span>
        </motion.a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 28px rgba(61,78,240,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => toast.info("Get started coming soon!")}
            className="text-sm font-semibold text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Start Building Now
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  toast.info("Get started coming soon!");
                  setMobileOpen(false);
                }}
                className="text-sm font-semibold text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2.5 rounded-xl w-full mt-2 cursor-pointer"
              >
                Start Building Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
