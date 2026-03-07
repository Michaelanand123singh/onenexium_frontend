import { useState } from "react";
import { motion } from "motion/react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Code2,
  Eye,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type Device = "desktop" | "tablet" | "mobile";
type ViewMode = "preview" | "code" | "layers";

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function EditorPreview({
  project,
}: {
  project: Doc<"projects">;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  const devices: { id: Device; icon: typeof Monitor; label: string }[] = [
    { id: "desktop", icon: Monitor, label: "Desktop" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "mobile", icon: Smartphone, label: "Mobile" },
  ];

  const views: { id: ViewMode; icon: typeof Eye; label: string }[] = [
    { id: "preview", icon: Eye, label: "Preview" },
    { id: "code", icon: Code2, label: "Code" },
    { id: "layers", icon: Layers, label: "Layers" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0F1117] overflow-hidden">
      {/* Preview toolbar */}
      <div className="h-11 shrink-0 border-b border-white/5 flex items-center justify-between px-4">
        {/* View mode tabs */}
        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                if (v.id !== "preview") {
                  toast.info("Coming soon in a future milestone!");
                  return;
                }
                setViewMode(v.id);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                viewMode === v.id
                  ? "bg-white/8 text-white/70"
                  : "text-white/25 hover:text-white/45"
              }`}
            >
              <v.icon className="w-3 h-3" />
              {v.label}
            </button>
          ))}
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                device === d.id
                  ? "bg-white/8 text-white/60"
                  : "text-white/15 hover:text-white/40 hover:bg-white/[0.03]"
              }`}
              title={d.label}
            >
              <d.icon className="w-3.5 h-3.5" />
            </button>
          ))}

          <div className="w-px h-4 bg-white/5 mx-1.5" />

          <button
            onClick={() => toast.info("Coming soon in a future milestone!")}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.03] transition-all cursor-pointer"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toast.info("Coming soon in a future milestone!")}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.03] transition-all cursor-pointer"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          className="bg-white rounded-xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5"
          style={{
            width: DEVICE_WIDTHS[device],
            maxWidth: "100%",
            height: device === "desktop" ? "100%" : "auto",
            minHeight: device === "desktop" ? "100%" : "600px",
          }}
        >
          {/* Browser chrome */}
          <div className="h-9 bg-[#F5F5F7] border-b border-[#E5E5E7] flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 max-w-sm mx-auto">
              <div className="bg-white rounded-md px-3 py-1 text-[10px] text-[#0C0F18]/30 text-center border border-[#E5E5E7]">
                {project.name.toLowerCase().replace(/\s+/g, "-")}.onenexium.app
              </div>
            </div>
          </div>

          {/* Mock website content */}
          <div className="p-0">
            {/* Mock navbar */}
            <div className="h-12 border-b border-[#0C0F18]/5 flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#3D4EF0] to-[#23A0FF]" />
                <div className="w-20 h-2.5 rounded-full bg-[#0C0F18]/8" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-2 rounded-full bg-[#0C0F18]/5" />
                <div className="w-12 h-2 rounded-full bg-[#0C0F18]/5" />
                <div className="w-16 h-6 rounded-md bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF]" />
              </div>
            </div>

            {/* Mock hero */}
            <div className="px-6 py-16 text-center">
              <div className="w-40 h-3 rounded-full bg-[#3D4EF0]/10 mx-auto mb-4" />
              <div className="w-72 h-5 rounded-full bg-[#0C0F18]/10 mx-auto mb-3" />
              <div className="w-56 h-5 rounded-full bg-[#0C0F18]/7 mx-auto mb-3" />
              <div className="w-48 h-3 rounded-full bg-[#0C0F18]/5 mx-auto mb-8" />
              <div className="flex justify-center gap-3">
                <div className="w-28 h-9 rounded-lg bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF]" />
                <div className="w-28 h-9 rounded-lg border border-[#0C0F18]/10" />
              </div>
            </div>

            {/* Mock features grid */}
            <div className="px-6 pb-12">
              <div className="w-32 h-3 rounded-full bg-[#0C0F18]/8 mx-auto mb-8" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#0C0F18]/5 p-5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3D4EF0]/15 to-[#23A0FF]/15 mb-3" />
                    <div className="w-20 h-2.5 rounded-full bg-[#0C0F18]/8 mb-2" />
                    <div className="w-full h-2 rounded-full bg-[#0C0F18]/4 mb-1.5" />
                    <div className="w-3/4 h-2 rounded-full bg-[#0C0F18]/3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mock CTA */}
            <div className="px-6 py-12 bg-gradient-to-r from-[#3D4EF0]/5 to-[#23A0FF]/5">
              <div className="text-center">
                <div className="w-48 h-4 rounded-full bg-[#0C0F18]/8 mx-auto mb-3" />
                <div className="w-64 h-2.5 rounded-full bg-[#0C0F18]/5 mx-auto mb-6" />
                <div className="w-32 h-9 rounded-lg bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] mx-auto" />
              </div>
            </div>

            {/* Mock footer */}
            <div className="px-6 py-6 border-t border-[#0C0F18]/5">
              <div className="flex justify-between items-center">
                <div className="w-24 h-2 rounded-full bg-[#0C0F18]/5" />
                <div className="flex gap-3">
                  <div className="w-12 h-2 rounded-full bg-[#0C0F18]/4" />
                  <div className="w-12 h-2 rounded-full bg-[#0C0F18]/4" />
                  <div className="w-12 h-2 rounded-full bg-[#0C0F18]/4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
