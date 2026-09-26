import React from "react";
import { Globe2, ShieldCheck, Users2, Sparkles } from "lucide-react";

/**
 * Trust strip. This used to scroll 23 real companies' logos (Microsoft-
 * adjacent enterprise brands like Salesforce, Sony, Shopify, AstraZeneca,
 * Bank of Ireland...) under "Join the remarkable organisations..." — falsely
 * implying they were Nelvin clients. Those were a competitor's actual
 * customer logos, not Nelvin's; displaying them was both a trademark risk
 * and a straightforwardly false claim. Replaced with an honest statement of
 * what the platform actually offers today.
 */

const POINTS = [
  { icon: Globe2, label: "Built for Africa, ready for the world" },
  { icon: ShieldCheck, label: "Enterprise-grade data isolation for every tenant" },
  { icon: Users2, label: "One platform for members, employers and merchants" },
  { icon: Sparkles, label: "Launching with hand-picked regional partners" },
];

export default function TrustedBrands() {
  return (
    <section className="surface-nv-secondary py-12 lg:py-16" aria-label="What Nelvin stands for">
      <div className="container-nv">
        <p className="text-balance-nv text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ivory-dim">
          Built to put people at the heart of what they do
        </p>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B4F9C]/10">
                <Icon className="h-4 w-4 text-gold" />
              </span>
              <span className="text-sm font-semibold leading-snug text-ivory">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}