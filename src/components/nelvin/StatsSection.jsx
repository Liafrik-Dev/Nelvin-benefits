import React from "react";
import { Star, Quote } from "lucide-react";
import { LANDING_STATS } from "@/lib/landingData";

export default function StatsSection() {
  return (
    <section className="bg-[#180126] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(55% 55% at 15% 20%, rgba(184,255,0,0.2)) 0%, transparent 60%), radial-gradient(45% 45% at 90% 85%, rgba(118,55,227,0.4)) 0%, transparent 55%)" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-[#B8FF00] font-bold text-xs tracking-[0.2em] uppercase mb-3">The numbers</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-lg">
            Trusted by HR teams and loved by millions.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {LANDING_STATS.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur rounded-2xl p-5 ring-1 ring-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold font-heading text-[#B8FF00]">{s.value}</p>
                <p className="mt-1 text-[11px] text-white/55 font-semibold leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#B8FF00]"
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
          <div className="rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97325c3e?w=1000&q=80"
              alt="People celebrating"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#180126]/70 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-[#B8FF00] rounded-2xl p-4 flex items-center gap-3">
              <Quote className="w-6 h-6 text-[#082F24] flex-shrink-0" />
              <p className="text-sm font-extrabold text-[#082F24] leading-snug">
                "Nelvin cut our benefits admin time by 80%- while engagement tripled."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
