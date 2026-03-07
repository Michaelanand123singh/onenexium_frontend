import { FolderOpen, Upload, Image } from "lucide-react";
import { PanelShell } from "./panel-shell.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

export default function FilesPanel() {
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
        <div className="w-12 h-12 rounded-xl bg-[#0C0F18]/[0.02] border border-[#0C0F18]/5 flex items-center justify-center mb-4">
          <Image className="w-6 h-6 text-[#0C0F18]/15" />
        </div>
        <p className="text-sm font-medium text-[#0C0F18]/40 mb-1">
          No files uploaded
        </p>
        <p className="text-[11px] text-[#0C0F18]/25 leading-relaxed max-w-[200px] mb-5">
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
