import React from "react";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";
import { LANDING_STATS } from "@/lib/landingData";

/**
 * Proof band — measured stats on one side, a real photograph carrying a
 * pull-quote on the other, matching the reference's split proof section.
 */
export default function StatsSection() {
  return (
    <section className="surface-nv-raised section-nv relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(55% 55% at 12% 18%, rgba(214,181,109,0.15) 0%, transparent 60%), radial-gradient(45% 45% at 92% 88%, rgba(6,43,35,0.85) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container-nv grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            tone="white"
            eyebrow="The numbers"
            title={<>Trusted by HR teams and loved by members.</>}
            className="max-w-lg"
          />

          <div className="mt-10 grid grid-cols-2 gap-4">
            {LANDING_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
              >
                <p className="text-2xl font-extrabold font-heading text-gold sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-ivory-dim">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt=""
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gold"
            />
            <div>
              <div className="flex items-center gap-1" aria-label="Rated 5 out of 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FFC107] text-[#FFC107]" />
                ))}
              </div>
              <p className="mt-1 max-w-xs text-[11px] text-ivory-muted">
                "The easiest rollout we've ever done — our members adopted it in days, not months."
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-nv-card ring-1 ring-white/10">
          <img
            src="/images/benifex/africa/south-africa.jpg"
            alt="Colleagues celebrating a reward milestone"
            loading="lazy"
            className="h-96 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/90 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-xl border border-[#D6B56D]/30 bg-[#062B23]/90 p-4 backdrop-blur">
            <Quote className="h-6 w-6 shrink-0 text-gold" />
            <p className="text-sm font-bold leading-snug text-ivory">
              "Nelvin cut our benefits admin time by 80% — while engagement tripled."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}