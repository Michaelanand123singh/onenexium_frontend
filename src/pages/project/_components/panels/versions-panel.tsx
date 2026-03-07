import { History, Clock } from "lucide-react";
import { PanelShell } from "./panel-shell.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const MOCK_VERSIONS = [
  { id: "v5", label: "Added contact form", time: "2 min ago", active: true },
  { id: "v4", label: "Updated hero section", time: "8 min ago", active: false },
  { id: "v3", label: "Changed color scheme", time: "15 min ago", active: false },
  { id: "v2", label: "Added pricing section", time: "22 min ago", active: false },
  { id: "v1", label: "Initial creation", time: "30 min ago", active: false },
];

export default function VersionsPanel() {
  return (
    <PanelShell icon={History} title="Versions">
      <div className="py-2">
        {MOCK_VERSIONS.map((v) => (
          <button
            key={v.id}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
              v.active
                ? "bg-[#3D4EF0]/5 border-l-2 border-[#3D4EF0]"
                : "hover:bg-[#0C0F18]/[0.02] border-l-2 border-transparent"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                v.active ? "text-white" : "bg-[#0C0F18]/5 text-[#0C0F18]/30"
              }`}
              style={v.active ? { background: BRAND_GRADIENT } : undefined}
            >
              {v.id.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13px] truncate ${
                  v.active ? "text-[#0C0F18]/80 font-medium" : "text-[#0C0F18]/50"
                }`}
              >
                {v.label}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-[#0C0F18]/15" />
                <span className="text-[10px] text-[#0C0F18]/25">{v.time}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </PanelShell>
  );
}
