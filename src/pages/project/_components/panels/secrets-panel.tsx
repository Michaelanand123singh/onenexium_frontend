import { KeyRound, Plus, Eye, EyeOff, Trash2, Shield } from "lucide-react";
import { useState } from "react";
import { PanelShell } from "./panel-shell.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const MOCK_SECRETS = [
  { key: "OPENAI_API_KEY", value: "sk-proj-...Xk4a" },
  { key: "STRIPE_SECRET_KEY", value: "sk_live_...9f2m" },
  { key: "DATABASE_URL", value: "postgres://...prod" },
];

export default function SecretsPanel() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <PanelShell
      icon={KeyRound}
      title="Secrets"
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
      <div className="py-2 space-y-1">
        {MOCK_SECRETS.map((secret) => (
          <div
            key={secret.key}
            className="px-4 py-3 hover:bg-[#0C0F18]/[0.01] transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[12px] font-mono font-medium text-[#0C0F18]/50">
                {secret.key}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setRevealed((r) => ({
                      ...r,
                      [secret.key]: !r[secret.key],
                    }))
                  }
                  className="w-5 h-5 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-[#0C0F18]/50 cursor-pointer"
                >
                  {revealed[secret.key] ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </button>
                <button className="w-5 h-5 rounded flex items-center justify-center text-[#0C0F18]/20 hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="bg-[#0C0F18]/[0.02] rounded-md px-2.5 py-1.5 text-[11px] font-mono text-[#0C0F18]/30 border border-[#0C0F18]/5">
              {revealed[secret.key]
                ? secret.value
                : "••••••••••••••••••••"}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#0C0F18]/5 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-[#0C0F18]/20">
          <Shield className="w-3 h-3" />
          <span>Secrets are encrypted at rest</span>
        </div>
      </div>
    </PanelShell>
  );
}
