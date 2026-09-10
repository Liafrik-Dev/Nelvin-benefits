import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { LANDING_AUDIENCES } from "@/lib/landingData";

export default function AudiencesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = LANDING_AUDIENCES[activeTab];

  return (
    <section id="audiences" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Who it's for</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
            One platform that keeps{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-[#B8FF00] px-2 rounded-2xl">everyone happy.</span>
            </span>
          </h2>
          <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-xl mx-auto">
            Whether you're a member, an employer or a partner — Nelvin has a home for you.
          </p>
        </div>

        {/* Compact Audience Multi-Tab Block */}
        <div className="max-w-4xl mx-auto bg-[#F7F3ED] rounded-3xl p-6 sm:p-8 border border-[#180126]/10 shadow-sm space-y-6">
          <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-gray-200">
            {LANDING_AUDIENCES.map((aud, idx) => (
              <button
                key={aud.title}
                onClick={() => setActiveTab(idx)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                  activeTab === idx
                    ? "bg-[#082F24] text-[#B8FF00] shadow-md"
                    : "text-[#180126]/70 hover:text-[#180126]"
                }`}
              >
                {aud.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="relative rounded-2xl overflow-hidden h-60 shadow-md">
              <img src={current.img} alt={current.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082F24]/80 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-[#B8FF00] text-[#082F24] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {current.kicker}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-extrabold font-heading text-[#180126]">{current.title}</h3>
              <p className="text-xs text-[#180126]/70 leading-relaxed">{current.desc}</p>
              <ul className="space-y-2">
                {current.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs font-medium text-[#180126]">
                    <span className="w-4 h-4 rounded-full bg-[#00BD00]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#00BD00]" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link
                to={current.to}
                className="inline-flex items-center justify-center gap-2 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-bold text-xs h-11 px-6 rounded-full transition-colors"
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