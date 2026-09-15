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
            className="grid grid-cols-2 gap-1.5 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-1.5 sm:grid-cols-4"
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
                      ? "bg-gold text-white shadow-nv-card"
                      : "text-ivory-muted hover:bg-[#F9F8F7] hover:text-ivory"
                  }`}
                >
                  {aud.kicker}
                </button>
              );
            })}
          </div>

          <div className="card-nv mt-4 grid grid-cols-1 overflow-hidden md:grid-cols-2 md:items-stretch">
            <div className="relative min-h-[18rem] sm:min-h-[22rem]">
              <img
                src={current.img}
                alt={current.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-[#0866FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                {current.kicker}
              </span>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-9">
              <h3 className="text-2xl font-extrabold font-heading text-ivory">{current.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-ivory-muted">{current.desc}</p>

              <ul className="mt-5 space-y-2.5">
                {current.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-xs font-medium text-ivory">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0866FF]/15">
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