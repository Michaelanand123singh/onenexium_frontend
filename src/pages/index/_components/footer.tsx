import { motion } from "motion/react";
import { BRAND_GRADIENT, LOGO_URL, APP_NAME } from "@/lib/brand.ts";
import { Twitter, Github, Linkedin, Youtube, Mail, ArrowUpRight } from "lucide-react";

const NAV_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Community", href: "#" },
      { label: "Support", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Licenses", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/5">
      {/* Subtle gradient glow at the top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-40"
        style={{ background: BRAND_GRADIENT }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* Top area: brand + newsletter + nav columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand + newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-5"
          >
            <div className="flex items-center gap-2.5">
              <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-auto" />
              <span className="text-lg font-bold text-foreground tracking-tight">
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-foreground/40 leading-relaxed max-w-xs">
              Build stunning websites with a single prompt. Powered by AI, designed for everyone.
            </p>

            {/* Newsletter mini form */}
            <div className="pt-2">
              <p className="text-xs font-medium text-foreground/50 mb-2.5 uppercase tracking-wider">
                Stay updated
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20" />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full bg-foreground/5 border border-foreground/8 rounded-lg text-xs text-foreground placeholder:text-foreground/25 pl-9 pr-3 py-2.5 outline-none focus:border-[#3D4EF0]/30 transition-colors"
                  />
                </div>
                <button
                  className="shrink-0 px-4 py-2.5 rounded-lg text-xs font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#3D4EF0]/20"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

          {/* Nav columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {NAV_COLUMNS.map((col, colIdx) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + colIdx * 0.06 }}
              >
                <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-foreground/35 hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 h-px w-full bg-foreground/5 origin-left"
        />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[11px] text-foreground/25 tracking-wide"
          >
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </motion.p>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="group flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5 hover:bg-[#3D4EF0]/10 border border-foreground/5 hover:border-[#3D4EF0]/20 transition-all duration-200"
              >
                <social.icon className="w-3.5 h-3.5 text-foreground/30 group-hover:text-[#3D4EF0] transition-colors" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
