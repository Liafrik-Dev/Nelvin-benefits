import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";
import { LANDING_AUDIENCES } from "@/lib/landingData";

/**
 * Audiences — the reference's segmented "who it's for" panel: a compact
 * switcher over one shared content card. Same tab model, calmer surfaces.
 */
export default function AudiencesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = LANDING_AUDIENCES[activeTab];

  return (
    <section id="audiences" className="surface-nv-secondary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Who it's for"
          title={<>One platform that keeps everyone happy.</>}
          lead="Whether you're a member, an employer or a partner — Nelvin has a home for you."
        />

        <div className="mx-auto mt-12 max-w-4xl">
          <div
            className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 sm:grid-cols-4"
            role="tablist"
            aria-label="Audiences"
          >
            {LANDING_AUDIENCES.map((aud, idx) => {
              const on = activeTab === idx;
              return (
                <button
                  key={aud.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTab(idx)}
                  className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${
                    on
                      ? "bg-gold text-[#062B23] shadow-nv-card"
                      : "text-ivory-muted hover:bg-white/5 hover:text-ivory"
                  }`}
                >
                  {aud.kicker}
                </button>
              );
            })}
          </div>

          <div className="card-nv mt-4 grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2 md:items-center">
            <div className="relative h-60 overflow-hidden rounded-xl">
              <img
                src={current.img}
                alt={current.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/85 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#062B23]">
                {current.kicker}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold font-heading text-ivory">{current.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ivory-muted">{current.desc}</p>

              <ul className="mt-5 space-y-2.5">
                {current.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-xs font-medium text-ivory">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D6B56D]/15">
                      <Check className="h-3 w-3 text-gold" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <Link to={current.to} className="btn-nv btn-nv-md btn-nv-gold group mt-6">
                {current.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}