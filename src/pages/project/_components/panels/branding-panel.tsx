import { Palette, Paintbrush, Type, Image, AppWindow } from "lucide-react";
import { PanelShell, ListRow } from "./panel-shell.tsx";

const ITEMS = [
  { icon: Paintbrush, label: "Theme & Colors", desc: "Customize color palette" },
  { icon: Type, label: "Typography", desc: "Fonts and text styles" },
  { icon: Image, label: "Logo & Favicon", desc: "Brand identity assets" },
  { icon: AppWindow, label: "Login Page", desc: "Customize auth branding" },
];

export default function BrandingPanel() {
  return (
    <PanelShell icon={Palette} title="Branding">
      <div className="py-2">
        {ITEMS.map((item) => (
          <ListRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            detail={item.desc}
          />
        ))}
      </div>

      {/* Color preview */}
      <div className="border-t border-[#0C0F18]/5 px-4 py-4">
        <p className="text-[11px] text-[#0C0F18]/30 font-medium mb-3">
          Brand Colors
        </p>
        <div className="flex gap-2">
          {["#3D4EF0", "#23A0FF", "#0C0F18", "#FFFFFF", "#F5F5F7"].map(
            (color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-lg border border-[#0C0F18]/10 cursor-pointer hover:scale-110 transition-transform"
                style={{ background: color }}
              />
            )
          )}
        </div>
      </div>
    </PanelShell>
  );
}
