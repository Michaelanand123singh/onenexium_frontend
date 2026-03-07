import { Code2, FolderOpen, FileCode, FileText, Plus } from "lucide-react";
import { PanelShell, ListRow } from "./panel-shell.tsx";

const FILES = [
  { name: "index.html", icon: FileCode, size: "2.1 KB" },
  { name: "styles.css", icon: FileCode, size: "4.8 KB" },
  { name: "script.js", icon: FileCode, size: "1.3 KB" },
  { name: "components/", icon: FolderOpen, size: "3 files" },
  { name: "package.json", icon: FileText, size: "0.5 KB" },
];

export default function CodePanel() {
  return (
    <PanelShell
      icon={Code2}
      title="Code"
      action={
        <button className="w-6 h-6 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-[#0C0F18]/50 hover:bg-[#0C0F18]/5 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="py-2">
        {FILES.map((file) => (
          <ListRow
            key={file.name}
            icon={file.icon}
            label={file.name}
            detail={file.size}
          />
        ))}
      </div>
      <div className="border-t border-[#0C0F18]/5 px-4 py-3">
        <p className="text-[10px] text-[#0C0F18]/20 text-center">
          Edit code directly in the editor
        </p>
      </div>
    </PanelShell>
  );
}
