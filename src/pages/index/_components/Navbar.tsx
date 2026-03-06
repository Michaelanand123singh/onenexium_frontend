import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://cdn.hercules.app/file_IQepUTx3eL8c0gz4w8Pn9ncm";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs", isToast: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50"
    >
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <img
            src={LOGO_URL}
            alt="OneNexium"
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight">OneNexium</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={
                link.isToast
                  ? (e) => {
                      e.preventDefault();
                      toast.info("Documentation coming soon!");
                    }
                  : undefined
              }
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => toast.info("Login coming soon!")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => toast.info("Get started coming soon!")}
            className="text-sm font-semibold text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2 rounded-xl hover:shadow-[0_0_24px_rgba(61,78,240,0.4)] transition-all duration-300 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.isToast) {
                      e.preventDefault();
                      toast.info("Documentation coming soon!");
                    }
                    setMobileOpen(false);
                  }}
                  className="text-sm font-medium text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  toast.info("Login coming soon!");
                  setMobileOpen(false);
                }}
                className="text-sm font-medium text-foreground py-2 text-left cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  toast.info("Get started coming soon!");
                  setMobileOpen(false);
                }}
                className="text-sm font-semibold text-white bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] px-5 py-2.5 rounded-xl w-full mt-2 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
