import React from "react";
import { ShieldCheck, Globe2, Users2, Layers } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Proof band. The stats here used to be traction numbers — "500K+ exclusive
 * offers", "20K+ partner brands", "4.8/5 average rating" — plus an anonymous
 * 5-star quote over a randomuser.me stock photo. The database has zero
 * offers, zero approved businesses and zero reviews today (pre-launch), so
 * every one of those was fabricated. Reframed as what's actually true right
 * now: platform capability and coverage design, not invented usage numbers.
 * Swap this back to real, measured stats once there's real traffic to
 * report.
 */
const CAPABILITIES = [
  { icon: Globe2, value: "54", label: "African countries supported" },
  { icon: Layers, value: "18", label: "Discount categories live" },
  { icon: Users2, value: "4", label: "Tailored account types" },
  { icon: ShieldCheck, value: "100%", label: "Tenant-isolated by design" },
];

export default function StatsSection() {
  return (
    <section className="surface-nv-raised section-nv relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "radial-gradient(55% 55% at 12% 18%, rgba(27,79,156,0.06) 0%, transparent 60%), radial-gradient(45% 45% at 92% 88%, rgba(27,79,156,0.05) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container-nv grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Built for scale"
            title={<>Designed for HR teams, ready for members.</>}
            className="max-w-lg"
          />

          <div className="mt-10 grid grid-cols-2 gap-4">
            {CAPABILITIES.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-5 backdrop-blur"
              >
                <p className="text-2xl font-extrabold font-heading text-gold sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-ivory-dim">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-ivory-muted">
            Nelvin is onboarding its first merchant partners now — every listing is
            vetted before it goes live, so members only ever see real, working deals.
          </p>
        </div>

        <div className="relative h-96 overflow-hidden rounded-2xl shadow-nv-card ring-1 ring-[#F1F1F1] lg:h-[32rem]">
          <img
            src="/images/benifex/africa/south-africa.jpg"
            alt="Cape Town, South Africa"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#1B4F9C] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
            Cape Town, South Africa
          </span>

          <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-xl bg-[#FFFFFF] p-4 shadow-nv-card-hover">
            <Globe2 className="h-6 w-6 shrink-0 text-[#1B4F9C]" />
            <p className="text-sm font-bold leading-snug text-[#282828]">
              One platform, built to work the same way in every market we launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}