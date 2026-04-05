import { Link } from "react-router-dom";
import { LOGO_URL, APP_NAME } from "@/lib/brand.ts";

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/products" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/templates" },
      { label: "Changelog", href: "/resources" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Startups", href: "/solutions" },
      { label: "Agencies", href: "/solutions" },
      { label: "Enterprise", href: "/solutions" },
      { label: "Freelancers", href: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/resources" },
      { label: "Blog", href: "/resources" },
      { label: "Community", href: "/resources" },
      { label: "Support", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={LOGO_URL}
                alt={APP_NAME}
                className="h-7 w-7 rounded-lg object-cover"
              />
              <span className="font-semibold text-sm">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build production-ready apps with AI. Ship faster, iterate
              smarter.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-muted-foreground">
            {"©"} {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </span>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
