import { motion } from "motion/react";
import {
  History,
  Code2,
  FolderOpen,
  Database,
  KeyRound,
  Globe,
  DollarSign,
  Palette,
  Settings,
  Upload,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
  Table2,
  Shield,
  ChevronRight,
  Clock,
  FileCode,
  Image,
  FileText,
  HardDrive,
  Link,
  Paintbrush,
  Type,
  AppWindow,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { SidebarTab } from "./EditorSidebar.tsx";

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

// Panel wrapper
function PanelShell({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: typeof History;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="w-[320px] shrink-0 border-r border-white/5 bg-[#0B0D13] flex flex-col h-full"
    >
      <div className="h-11 shrink-0 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/30" />
          <span className="text-xs font-semibold text-white/50">{title}</span>
        </div>
        {action}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}

// Row item used in many panels
function ListRow({
  icon: Icon,
  label,
  detail,
  onClick,
}: {
  icon: typeof History;
  label: string;
  detail?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors cursor-pointer group"
    >
      <Icon className="w-4 h-4 text-white/20 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/60 truncate">{label}</p>
        {detail && (
          <p className="text-[10px] text-white/20 truncate">{detail}</p>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white/25 transition-colors" />
    </button>
  );
}

// ─── VERSIONS PANEL ────────────────────────────────

function VersionsPanel() {
  const mockVersions = [
    { id: "v5", label: "Added contact form", time: "2 min ago", active: true },
    { id: "v4", label: "Updated hero section", time: "8 min ago", active: false },
    { id: "v3", label: "Changed color scheme", time: "15 min ago", active: false },
    { id: "v2", label: "Added pricing section", time: "22 min ago", active: false },
    { id: "v1", label: "Initial creation", time: "30 min ago", active: false },
  ];

  return (
    <PanelShell icon={History} title="Versions">
      <div className="py-2">
        {mockVersions.map((v) => (
          <button
            key={v.id}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
              v.active
                ? "bg-[#3D4EF0]/10 border-l-2 border-[#3D4EF0]"
                : "hover:bg-white/[0.03] border-l-2 border-transparent"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                v.active ? "text-white" : "bg-white/5 text-white/30"
              }`}
              style={v.active ? { background: BRAND_GRADIENT } : undefined}
            >
              {v.id.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13px] truncate ${
                  v.active ? "text-white/80 font-medium" : "text-white/50"
                }`}
              >
                {v.label}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-white/15" />
                <span className="text-[10px] text-white/20">{v.time}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}

// ─── CODE PANEL ────────────────────────────────────

function CodePanel() {
  const files = [
    { name: "index.html", icon: FileCode, size: "2.1 KB" },
    { name: "styles.css", icon: FileCode, size: "4.8 KB" },
    { name: "script.js", icon: FileCode, size: "1.3 KB" },
    { name: "components/", icon: FolderOpen, size: "3 files" },
    { name: "package.json", icon: FileText, size: "0.5 KB" },
  ];

  return (
    <PanelShell
      icon={Code2}
      title="Code"
      action={
        <button className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="py-2">
        {files.map((file) => (
          <ListRow
            key={file.name}
            icon={file.icon}
            label={file.name}
            detail={file.size}
          />
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-3">
        <p className="text-[10px] text-white/15 text-center">
          Edit code directly in the editor
        </p>
      </div>
    </PanelShell>
  );
}

// ─── FILES & MEDIA PANEL ───────────────────────────

function FilesPanel() {
  return (
    <PanelShell
      icon={FolderOpen}
      title="Files & Media"
      action={
        <button
          className="h-6 px-2.5 rounded-md flex items-center gap-1.5 text-[11px] font-medium text-white transition-colors cursor-pointer"
          style={{ background: BRAND_GRADIENT }}
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
      }
    >
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
          <Image className="w-6 h-6 text-white/15" />
        </div>
        <p className="text-sm font-medium text-white/40 mb-1">
          No files uploaded
        </p>
        <p className="text-[11px] text-white/20 leading-relaxed max-w-[200px] mb-5">
          Upload images, videos, documents, and other assets for your project
        </p>
        <button
          className="h-8 px-4 rounded-lg flex items-center gap-2 text-xs font-medium text-white cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20 transition-all"
          style={{ background: BRAND_GRADIENT }}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Files
        </button>
      </div>
    </PanelShell>
  );
}

// ─── DATABASE PANEL ────────────────────────────────

function DatabasePanel() {
  const tables = [
    { name: "users", rows: 1, icon: Users },
    { name: "projects", rows: 1, icon: AppWindow },
    { name: "projectMessages", rows: 2, icon: Table2 },
    { name: "waitlist", rows: 0, icon: Table2 },
  ];

  return (
    <PanelShell
      icon={Database}
      title="Database"
      action={
        <button className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="py-2">
        {tables.map((table) => (
          <button
            key={table.name}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <table.icon className="w-4 h-4 text-white/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white/60 font-mono">{table.name}</p>
            </div>
            <span className="text-[10px] text-white/15 font-medium px-1.5 py-0.5 rounded bg-white/[0.03]">
              {table.rows} {table.rows === 1 ? "row" : "rows"}
            </span>
          </button>
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-white/15">
          <HardDrive className="w-3 h-3" />
          <span>4 tables, 4 documents</span>
        </div>
      </div>
    </PanelShell>
  );
}

// ─── SECRETS PANEL ─────────────────────────────────

function SecretsPanel() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const secrets = [
    { key: "OPENAI_API_KEY", value: "sk-proj-...Xk4a" },
    { key: "STRIPE_SECRET_KEY", value: "sk_live_...9f2m" },
    { key: "DATABASE_URL", value: "postgres://...prod" },
  ];

  return (
    <PanelShell
      icon={KeyRound}
      title="Secrets"
      action={
        <button
          className="h-6 px-2.5 rounded-md flex items-center gap-1.5 text-[11px] font-medium text-white transition-colors cursor-pointer"
          style={{ background: BRAND_GRADIENT }}
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      }
    >
      <div className="py-2 space-y-1">
        {secrets.map((secret) => (
          <div
            key={secret.key}
            className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[12px] font-mono font-medium text-white/50">
                {secret.key}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setRevealed((r) => ({
                      ...r,
                      [secret.key]: !r[secret.key],
                    }))
                  }
                  className="w-5 h-5 rounded flex items-center justify-center text-white/15 hover:text-white/40 cursor-pointer"
                >
                  {revealed[secret.key] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                <button className="w-5 h-5 rounded flex items-center justify-center text-white/15 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-md px-2.5 py-1.5 text-[11px] font-mono text-white/25 border border-white/5">
              {revealed[secret.key]
                ? secret.value
                : "••••••••••••••••••••"}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-white/15">
          <Shield className="w-3 h-3" />
          <span>Secrets are encrypted at rest</span>
        </div>
      </div>
    </PanelShell>
  );
}

// ─── DOMAINS PANEL ─────────────────────────────────

function DomainsPanel() {
  return (
    <PanelShell
      icon={Globe}
      title="Domains"
      action={
        <button
          className="h-6 px-2.5 rounded-md flex items-center gap-1.5 text-[11px] font-medium text-white transition-colors cursor-pointer"
          style={{ background: BRAND_GRADIENT }}
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      }
    >
      <div className="py-2">
        {/* Default domain */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-[12px] font-medium text-white/60">
                Default Domain
              </p>
            </div>
            <button className="w-5 h-5 rounded flex items-center justify-center text-white/15 hover:text-white/40 cursor-pointer">
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] rounded-md px-2.5 py-1.5 border border-white/5">
            <Link className="w-3 h-3 text-white/15" />
            <span className="text-[11px] font-mono text-[#23A0FF]/60">
              my-project.onenexium.app
            </span>
          </div>
        </div>

        {/* Add custom domain */}
        <div className="flex flex-col items-center text-center px-6 py-8">
          <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5 text-white/15" />
          </div>
          <p className="text-[12px] text-white/40 mb-1 font-medium">
            Custom Domain
          </p>
          <p className="text-[11px] text-white/20 leading-relaxed max-w-[200px] mb-4">
            Connect your own domain for a professional look
          </p>
          <button
            className="h-7 px-3.5 rounded-lg text-[11px] font-medium text-white cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20 transition-all"
            style={{ background: BRAND_GRADIENT }}
          >
            Add Domain
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

// ─── MONETIZE PANEL ────────────────────────────────

function MonetizePanel() {
  const features = [
    { icon: CreditCard, label: "Accept Payments", desc: "Stripe, PayPal, and more" },
    { icon: ShoppingBag, label: "Products", desc: "Manage your catalog" },
    { icon: Tag, label: "Pricing Plans", desc: "Subscriptions & one-time" },
    { icon: BarChart3, label: "Revenue", desc: "Track earnings" },
  ];

  return (
    <PanelShell icon={DollarSign} title="Monetize">
      <div className="py-2">
        {features.map((f) => (
          <ListRow
            key={f.label}
            icon={f.icon}
            label={f.label}
            detail={f.desc}
          />
        ))}
      </div>
      <div className="border-t border-white/5 px-4 py-4">
        <button
          className="w-full h-9 rounded-lg text-xs font-semibold text-white cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20 transition-all"
          style={{ background: BRAND_GRADIENT }}
        >
          Set Up Payments
        </button>
        <p className="text-[10px] text-white/15 text-center mt-2">
          Start accepting payments in minutes
        </p>
      </div>
    </PanelShell>
  );
}

// ─── BRANDING PANEL ────────────────────────────────

function BrandingPanel() {
  const items = [
    { icon: Paintbrush, label: "Theme & Colors", desc: "Customize color palette" },
    { icon: Type, label: "Typography", desc: "Fonts and text styles" },
    { icon: Image, label: "Logo & Favicon", desc: "Brand identity assets" },
    { icon: AppWindow, label: "Login Page", desc: "Customize auth branding" },
  ];

  return (
    <PanelShell icon={Palette} title="Branding">
      <div className="py-2">
        {items.map((item) => (
          <ListRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            detail={item.desc}
          />
        ))}
      </div>

      {/* Color preview */}
      <div className="border-t border-white/5 px-4 py-4">
        <p className="text-[11px] text-white/30 font-medium mb-3">
          Brand Colors
        </p>
        <div className="flex gap-2">
          {["#3D4EF0", "#23A0FF", "#0C0F18", "#FFFFFF", "#F5F5F7"].map(
            (color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer hover:scale-110 transition-transform"
                style={{ background: color }}
              />
            )
          )}
        </div>
      </div>
    </PanelShell>
  );
}

// ─── MORE PANEL ────────────────────────────────────

function MorePanel() {
  const sections = [
    {
      title: "General",
      items: [
        { icon: AppWindow, label: "App Name", detail: "My Project" },
        { icon: Shield, label: "App Visibility", detail: "Public" },
        { icon: Globe, label: "SEO & Open Graph", detail: "Configure" },
      ],
    },
    {
      title: "Advanced",
      items: [
        { icon: Code2, label: "Download Code", detail: "Export source" },
        { icon: BarChart3, label: "Analytics", detail: "View stats" },
        { icon: Shield, label: "Security Check", detail: "Run scan" },
      ],
    },
  ];

  return (
    <PanelShell icon={Settings} title="More">
      <div className="py-2">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] uppercase tracking-wider text-white/15 font-semibold px-4 py-2 mt-2">
              {section.title}
            </p>
            {section.items.map((item) => (
              <ListRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                detail={item.detail}
              />
            ))}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

// ─── PANEL ROUTER ──────────────────────────────────

export default function SidebarPanel({ tab }: { tab: SidebarTab }) {
  switch (tab) {
    case "versions":
      return <VersionsPanel />;
    case "code":
      return <CodePanel />;
    case "files":
      return <FilesPanel />;
    case "database":
      return <DatabasePanel />;
    case "secrets":
      return <SecretsPanel />;
    case "domains":
      return <DomainsPanel />;
    case "monetize":
      return <MonetizePanel />;
    case "branding":
      return <BrandingPanel />;
    case "more":
      return <MorePanel />;
    default:
      return null;
  }
}
