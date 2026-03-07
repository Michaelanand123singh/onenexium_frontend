import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

// Shared panel wrapper used by all sidebar panels
export function PanelShell({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="w-[320px] shrink-0 border-r border-[#0C0F18]/5 bg-white flex flex-col h-full"
    >
      <div className="h-11 shrink-0 border-b border-[#0C0F18]/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#0C0F18]/30" />
          <span className="text-xs font-semibold text-[#0C0F18]/50">{title}</span>
        </div>
        {action}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}

// Reusable row item used across many panels
export function ListRow({
  icon: Icon,
  label,
  detail,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#0C0F18]/[0.02] transition-colors cursor-pointer group"
    >
      <Icon className="w-4 h-4 text-[#0C0F18]/20 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-[#0C0F18]/60 truncate">{label}</p>
        {detail && (
          <p className="text-[10px] text-[#0C0F18]/25 truncate">{detail}</p>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-[#0C0F18]/10 group-hover:text-[#0C0F18]/25 transition-colors" />
    </button>
  );
}
