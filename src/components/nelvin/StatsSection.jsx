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
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "radial-gradient(55% 55% at 12% 18%, rgba(8,102,255,0.06) 0%, transparent 60%), radial-gradient(45% 45% at 92% 88%, rgba(8,102,255,0.05) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container-nv grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="The numbers"
            title={<>Trusted by HR teams and loved by members.</>}
            className="max-w-lg"
          />

          <div className="mt-10 grid grid-cols-2 gap-4">
            {LANDING_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-5 backdrop-blur"
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
                  <Star key={i} className="h-3.5 w-3.5 fill-[#0866FF] text-[#0866FF]" />
                ))}
              </div>
              <p className="mt-1 max-w-xs text-[11px] text-ivory-muted">
                "The easiest rollout we've ever done — our members adopted it in days, not months."
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-96 overflow-hidden rounded-2xl shadow-nv-card ring-1 ring-[#F1F1F1] lg:h-[32rem]">
          <img
            src="/images/benifex/africa/south-africa.jpg"
            alt="Colleagues celebrating a reward milestone"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#0866FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
            Member story
          </span>

          <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-xl bg-[#FFFFFF] p-4 shadow-nv-card-hover">
            <Quote className="h-6 w-6 shrink-0 text-[#0866FF]" />
            <p className="text-sm font-bold leading-snug text-[#282828]">
              "Nelvin cut our benefits admin time by 80% — while engagement tripled."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}