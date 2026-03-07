import { Database, Plus, Users, AppWindow, Table2, HardDrive } from "lucide-react";
import { PanelShell } from "./panel-shell.tsx";

const TABLES = [
  { name: "users", rows: 1, icon: Users },
  { name: "projects", rows: 1, icon: AppWindow },
  { name: "projectMessages", rows: 2, icon: Table2 },
  { name: "waitlist", rows: 0, icon: Table2 },
];

export default function DatabasePanel() {
  return (
    <PanelShell
      icon={Database}
      title="Database"
      action={
        <button className="w-6 h-6 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-[#0C0F18]/50 hover:bg-[#0C0F18]/5 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="py-2">
        {TABLES.map((table) => (
          <button
            key={table.name}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#0C0F18]/[0.02] transition-colors cursor-pointer group"
          >
            <table.icon className="w-4 h-4 text-[#0C0F18]/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#0C0F18]/60 font-mono">{table.name}</p>
            </div>
            <span className="text-[10px] text-[#0C0F18]/20 font-medium px-1.5 py-0.5 rounded bg-[#0C0F18]/[0.03]">
              {table.rows} {table.rows === 1 ? "row" : "rows"}
            </span>
          </button>
        ))}
      </div>
      <div className="border-t border-[#0C0F18]/5 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-[#0C0F18]/20">
          <HardDrive className="w-3 h-3" />
          <span>4 tables, 4 documents</span>
        </div>
      </div>
    </PanelShell>
  );
}
