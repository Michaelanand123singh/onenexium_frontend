const LOGO_URL = "https://cdn.hercules.app/file_IQepUTx3eL8c0gz4w8Pn9ncm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src={LOGO_URL} alt="OneNexium" className="h-6 w-6 rounded-md" />
          <span className="text-sm font-semibold">OneNexium</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {"©"} {currentYear} OneNexium. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
