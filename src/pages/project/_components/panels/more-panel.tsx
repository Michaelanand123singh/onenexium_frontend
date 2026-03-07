import { Settings, AppWindow, Shield, Globe, Code2, BarChart3 } from "lucide-react";
import { PanelShell, ListRow } from "./panel-shell.tsx";

const SECTIONS = [
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

export default function MorePanel() {
  return (
    <PanelShell icon={Settings} title="More">
      <div className="py-2">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] uppercase tracking-wider text-[#0C0F18]/15 font-semibold px-4 py-2 mt-2">
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
