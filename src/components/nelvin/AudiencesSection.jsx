import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { LANDING_AUDIENCES } from "@/lib/landingData";

export default function AudiencesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = LANDING_AUDIENCES[activeTab];

  return (
    <section id="audiences" className="bg-forest py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-[#E5C77A] font-bold text-xs tracking-[0.2em] uppercase mb-3">Who it's for</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#F5F1E8] tracking-tight leading-tight">
            One platform that keeps{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-[#D6B56D] px-2 rounded-lg">everyone happy.</span>
            </span>
          </h2>
          <p className="mt-4 text-[#F5F1E8]/60 leading-relaxed max-w-xl mx-auto">
            Whether you're a member, an employer or a partner — Nelvin has a home for you.
          </p>
        </div>

        {/* Compact Audience Multi-Tab Block */}
        <div className="max-w-4xl mx-auto bg-forest-secondary rounded-xl p-6 sm:p-8 border border-[#D6B56D]/15 shadow-sm space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-emerald-black/90 p-1.5 ring-1 ring-white/10 rounded-lg border border-white/12">
            {LANDING_AUDIENCES.map((aud, idx) => (
              <button
                key={aud.title}
                onClick={() => setActiveTab(idx)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                  activeTab === idx
                    ? "bg-[#062B23] text-[#D6B56D] shadow-md"
                    : "text-[#F5F1E8]/70 hover:text-[#F5F1E8]"
                }`}
              >
                {aud.kicker}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="relative rounded-lg overflow-hidden h-60 shadow-md">
              <img src={current.img} alt={current.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/80 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-[#D6B56D] text-[#062B23] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {current.kicker}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold font-heading text-[#F5F1E8]">{current.title}</h3>
              <p className="text-xs text-[#F5F1E8]/70 leading-relaxed">{current.desc}</p>
              <ul className="space-y-2">
                {current.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs font-medium text-[#F5F1E8]">
                    <span className="w-4 h-4 rounded-full bg-[#0A3A2F]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#E5C77A]" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link
                to={current.to}
                className="inline-flex items-center justify-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-bold text-xs h-11 px-6 rounded-lg shadow-md shadow-[#062B23]/30 transition-colors"
              >
                {current.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}