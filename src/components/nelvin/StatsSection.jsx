import React from "react";
import { Star, Quote } from "lucide-react";
import { LANDING_STATS } from "@/lib/landingData";

export default function StatsSection() {
  return (
    <section className="bg-[#103F35] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(55% 55% at 15% 20%, rgba(214,181,109,0.15) 0%, transparent 60%), radial-gradient(45% 45% at 90% 85%, rgba(10,58,47,0.8) 0%, transparent 55%)" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-[#D6B56D] font-bold text-xs tracking-[0.2em] uppercase mb-3">The numbers</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-lg">
            Trusted by HR teams and loved by millions.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {LANDING_STATS.map((s) => (
              <div key={s.label} className="bg-[#0A3A2F]/5 backdrop-blur rounded-lg p-5 ring-1 ring-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold font-heading text-[#D6B56D]">{s.value}</p>
                <p className="mt-1 text-[11px] text-white/55 font-semibold leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D6B56D]"
            />
            <div>
              <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
              ))}</div>
              <p className="mt-1 text-[11px] text-white/55 max-w-xs">
                "The easiest rollout we've ever done — our members adopted it in days, not months."
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img
              src="/images/benifex/africa/south-africa.jpg"
              alt="People celebrating"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/85 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-[#103F35]/95 backdrop-blur rounded-lg p-4 flex items-center gap-3 ring-1 ring-[#D6B56D]/30">
              <Quote className="w-6 h-6 text-[#D6B56D] flex-shrink-0" />
              <p className="text-sm font-bold text-ivory leading-snug">
                "Nelvin cut our benefits admin time by 80%- while engagement tripled."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
