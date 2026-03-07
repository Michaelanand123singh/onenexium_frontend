import { DollarSign, CreditCard, ShoppingBag, Tag, BarChart3 } from "lucide-react";
import { PanelShell, ListRow } from "./panel-shell.tsx";
import { BRAND_GRADIENT } from "@/lib/brand.ts";

const FEATURES = [
  { icon: CreditCard, label: "Accept Payments", desc: "Stripe, PayPal, and more" },
  { icon: ShoppingBag, label: "Products", desc: "Manage your catalog" },
  { icon: Tag, label: "Pricing Plans", desc: "Subscriptions & one-time" },
  { icon: BarChart3, label: "Revenue", desc: "Track earnings" },
];

export default function MonetizePanel() {
  return (
    <PanelShell icon={DollarSign} title="Monetize">
      <div className="py-2">
        {FEATURES.map((f) => (
          <ListRow
            key={f.label}
            icon={f.icon}
            label={f.label}
            detail={f.desc}
          />
        ))}
      </div>
      <div className="border-t border-[#0C0F18]/5 px-4 py-4">
        <button
          className="w-full h-9 rounded-lg text-xs font-semibold text-white cursor-pointer hover:shadow-md hover:shadow-[#3D4EF0]/20 transition-all"
          style={{ background: BRAND_GRADIENT }}
        >
          Set Up Payments
        </button>
        <p className="text-[10px] text-[#0C0F18]/20 text-center mt-2">
          Start accepting payments in minutes
        </p>
      </div>
    </PanelShell>
  );
}
