import {
  MessageSquare,
  History,
  Code2,
  FolderOpen,
  Database,
  KeyRound,
  Globe,
  DollarSign,
  Palette,
  Settings,
  Bug,
} from "lucide-react";

export type SidebarTab =
  | "chat"
  | "versions"
  | "code"
  | "files"
  | "database"
  | "secrets"
  | "domains"
  | "monetize"
  | "branding"
  | "more";

const SIDEBAR_TABS: {
  id: SidebarTab;
  icon: typeof MessageSquare;
  label: string;
}[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "versions", icon: History, label: "Versions" },
  { id: "code", icon: Code2, label: "Code" },
  { id: "files", icon: FolderOpen, label: "Files & Media" },
  { id: "database", icon: Database, label: "Database" },
  { id: "secrets", icon: KeyRound, label: "Secrets" },
  { id: "domains", icon: Globe, label: "Domains" },
  { id: "monetize", icon: DollarSign, label: "Monetize" },
  { id: "branding", icon: Palette, label: "Branding" },
  { id: "more", icon: Settings, label: "More" },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #3D4EF0, #23A0FF)";

export default function EditorSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: SidebarTab | null;
  onTabChange: (tab: SidebarTab | null) => void;
}) {
  return (
    <div className="w-12 shrink-0 bg-[#0B0D13] border-r border-white/5 flex flex-col items-center py-2 gap-0.5">
      {SIDEBAR_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="relative group">
            <button
              onClick={() => onTabChange(isActive ? null : tab.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-white/25 hover:text-white/50 hover:bg-white/[0.04]"
              }`}
              style={isActive ? { background: BRAND_GRADIENT } : undefined}
            >
              <tab.icon className="w-4 h-4" />
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              {tab.label}
            </div>
          </div>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Report issue */}
      <div className="relative group">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.04] transition-all cursor-pointer">
          <Bug className="w-4 h-4" />
        </button>
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          Report an Issue
        </div>
      </div>
    </div>
  );
}
