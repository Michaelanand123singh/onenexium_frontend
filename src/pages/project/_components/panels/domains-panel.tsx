import { Globe, Plus, ExternalLink, Link } from "lucide-react";
import { PanelShell } from "./panel-shell.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

export default function DomainsPanel() {
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
        <div className="px-4 py-3 border-b border-[#0C0F18]/5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-[12px] font-medium text-[#0C0F18]/60">
                Default Domain
              </p>
            </div>
            <button className="w-5 h-5 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-[#0C0F18]/50 cursor-pointer">
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#0C0F18]/[0.02] rounded-md px-2.5 py-1.5 border border-[#0C0F18]/5">
            <Link className="w-3 h-3 text-[#0C0F18]/20" />
            <span className="text-[11px] font-mono text-[#3D4EF0]/70">
              my-project.onenexium.app
            </span>
          </div>
        </div>

        {/* Add custom domain */}
        <div className="flex flex-col items-center text-center px-6 py-8">
          <div className="w-10 h-10 rounded-lg bg-[#0C0F18]/[0.02] border border-[#0C0F18]/5 flex items-center justify-center mb-3">
            <Globe className="w-5 h-5 text-[#0C0F18]/15" />
          </div>
          <p className="text-[12px] text-[#0C0F18]/40 mb-1 font-medium">
            Custom Domain
          </p>
          <p className="text-[11px] text-[#0C0F18]/25 leading-relaxed max-w-[200px] mb-4">
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
