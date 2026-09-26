import React from "react";
import { ShoppingBag, Utensils, Plane, HeartPulse, Dumbbell, Smartphone, Home, Car, Shirt, GraduationCap, Sparkles, Baby, PawPrint, Wallet, Wifi, Leaf, Hotel, Film } from "lucide-react";

/**
 * Trust strip. This used to scroll 23 real companies' logos (Microsoft-
 * adjacent enterprise brands like Salesforce, Sony, Shopify, AstraZeneca,
 * Bank of Ireland...) under "Join the remarkable organisations..." — falsely
 * implying they were Nelvin clients. Those were a competitor's actual
 * customer logos, not Nelvin's; displaying them was both a trademark risk
 * and a straightforwardly false claim.
 *
 * There are zero approved vendors in the database today — pre-launch, any
 * "partner logo" shown here would be just as fabricated as the ones that
 * were removed. So instead of client logos, this scrolls the real thing
 * Nelvin already has: its own category coverage. True today, no placeholder
 * brand needed, and it'll make sense to swap in real merchant logos here
 * once the first ones are approved.
 */

const CATEGORIES = [
  { icon: Utensils, label: "Food & Dining" },
  { icon: Plane, label: "Travel & Holidays" },
  { icon: Dumbbell, label: "Fitness & Sports" },
  { icon: ShoppingBag, label: "Shopping & Retail" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Smartphone, label: "Technology" },
  { icon: Home, label: "Home & Living" },
  { icon: Car, label: "Automotive & Mobility" },
  { icon: Shirt, label: "Fashion" },
  { icon: GraduationCap, label: "Education & Learning" },
  { icon: Sparkles, label: "Beauty & Personal Care" },
  { icon: Baby, label: "Family & Parenting" },
  { icon: PawPrint, label: "Pets" },
  { icon: Wallet, label: "Financial Wellness" },
  { icon: Wifi, label: "Telecom & Digital" },
  { icon: Leaf, label: "Sustainability" },
  { icon: Hotel, label: "Hotels & Hospitality" },
  { icon: Film, label: "Entertainment" },
];

function CategoryRow() {
  return (
    <>
      {CATEGORIES.map(({ icon: Icon, label }) => (
        <span key={label} className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#F1F1F1] bg-[#F9F8F7] px-5 py-2.5">
          <Icon className="h-4 w-4 text-gold" />
          <span className="whitespace-nowrap text-xs font-bold text-ivory">{label}</span>
        </span>
      ))}
    </>
  );
}

export default function TrustedBrands() {
  return (
    <section className="surface-nv-secondary py-12 lg:py-16" aria-label="Categories on Nelvin">
      <div className="container-nv">
        <p className="text-balance-nv text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ivory-dim">
          One platform, every category your people already spend on
        </p>
      </div>

      <div className="mask-fade-x relative mt-9 overflow-hidden">
        <div className="flex w-max animate-scroll-slow items-center gap-3">
          <CategoryRow />
          <CategoryRow />
        </div>
      </div>
    </section>
  );
}