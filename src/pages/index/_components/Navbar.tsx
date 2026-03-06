import { motion } from "motion/react";
import { toast } from "sonner";

const LOGO_URL = "https://cdn.hercules.app/file_IQepUTx3eL8c0gz4w8Pn9ncm";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40"
    >
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
        <a href="#" className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="OneNexium" className="h-7 w-7 rounded-lg" />
          <span className="text-base font-bold tracking-tight">OneNexium</span>
        </a>

        <button
          onClick={() => toast.info("Get started coming soon!")}
          className="text-sm font-semibold text-primary-foreground bg-foreground px-5 py-2 rounded-full hover:opacity-90 transition-all duration-200 cursor-pointer"
        >
          Start Building Now
        </button>
      </nav>
    </motion.header>
  );
}
