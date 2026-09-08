import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { LANDING_STATS } from "@/lib/landingData";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F3ED]">
      {/* backdrop image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600881333168-2f3f1b1b1b9?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F3ED]/80 via-[#F7F3ED]/90 to-[#F7F3ED]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-[#180126]/10 rounded-full pl-1 pr-4 py-1 mb-6 shadow-sm">
            <span className="bg-[#B8FF00] text-[#082F24] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">New</span>
            <span className="text-xs font-semibold text-[#180126]/70">The all-in-one Employee Benefits platform for Africa &amp; MENA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold font-heading text-[#180126] tracking-tight leading-[1.05]">
            One platform for{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-[#B8FF00] px-2 rounded-2xl">everything</span>
            </span>{" "}
            your people need
          </h1>

          <p className="mt-6 text-lg text-[#180126]/65 leading-relaxed max-w-xl">
            Exclusive deals, flexible benefits, rewards, wallet and wellbeing toolkit —
            delivered in one beautiful, localised experience across 54 African countries and growing MENA footprint.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2.5 bg-[#180126] hover:bg-[#2b0140] text-white font-bold text-sm h-12 px-7 rounded-[24px] transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Get started free
              <span className="w-5 h-5 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#180126] text-xs font-extrabold transition-transform group-hover:-translate-x-1">→</span>
            </Link>
            <Link
              to="/corporate"
              className="group inline-flex items-center justify-center gap-2.5 bg-white border-2 border-[#180126]/15 hover:border-[#180126] text-[#180126] font-bold text-sm h-12 px-7 rounded-[24px] transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              Book a demo
            </Link>
          </div>

          {/* trust chips */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#180126]/70">
              <ShieldCheck className="w-4 h-4 text-[#00BD00]" /> Secure &amp; compliant
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#180126]/70">
              <TrendingUp className="w-4 h-4 text-[#00BD00]" /> 20K+ partner brands
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#180126]/70">
              <Sparkles className="w-4 h-4 text-[#00BD00]" /> 500K+ exclusive offers
            </span>
          </div>

          {/* stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
            {LANDING_STATS.map((s) => (
              <div key={s.label} className="bg-white/80 backdrop-blur border border-[#180126]/10 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-xl sm:text-2xl font-extrabold font-heading text-[#180126]">{s.value}</p>
                <p className="text-[10px] text-[#180126]/55 font-medium mt-0.5 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* visual: real photo card + phone mockup */}
        <div className="relative">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-[#180126]/10">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97325c3e?w=1100&q=80"
              alt="Happy professional team"
              className="w-full h-[420px] sm:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#180126]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#00BD00] font-bold">Member savings</p>
                <p className="text-sm font-extrabold text-[#180126]">₦2.4M saved this month</p>
              </div>
              <div className="flex -space-x-2">
                {["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/68.jpg"].map((u) => (
                  <img key={u} src={u} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="w-9 h-9 rounded-full bg-[#B8FF00] text-[#082F24] text-[10px] font-extrabold flex items-center justify-center border-2 border-white">+12K</span>
              </div>
            </div>
          </div>

          {/* floating rating card */}
          <div className="absolute -top-5 -right-3 sm:right-6 bg-white rounded-2xl shadow-xl px-5 py-3.5 border border-[#180126]/5 hidden sm:block">
            <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
            ))}</div>
            <p className="text-[10px] font-bold text-[#180126] mt-1">4.8/5 member rating</p>
          </div>

          {/* floating AI chip */}
          <div className="absolute -bottom-4 left-2 sm:left-8 bg-[#082F24] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-[#B8FF00]/30 hidden sm:flex">
            <span className="w-8 h-8 rounded-xl bg-[#B8FF00]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#B8FF00]" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold leading-none">AI recommendations</p>
              <p className="text-[9px] text-white/60 mt-1">Personalised for every member</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
