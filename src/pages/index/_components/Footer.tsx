const LOGO_URL = "https://cdn.hercules.app/file_IQepUTx3eL8c0gz4w8Pn9ncm";

const footerLinks = {
  Product: ["Features", "Pricing", "Templates", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Developers: ["Documentation", "API Reference", "Status", "GitHub"],
  Legal: ["Privacy", "Terms", "Security"],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C0F18] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img
                src={LOGO_URL}
                alt="OneNexium"
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-lg font-bold">OneNexium</span>
            </a>
            <p className="text-white/50 text-sm leading-relaxed">
              Build the future with AI-powered development.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/80 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {"©"} {currentYear} OneNexium. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white/80 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white/80 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-white/40 hover:text-white/80 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
