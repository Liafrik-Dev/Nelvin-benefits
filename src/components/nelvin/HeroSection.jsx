import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, TrendingUp, Sparkles, Video } from "lucide-react";

const HERO_VIDEOS = [
  { id: "team", title: "Corporate Teams", url: "https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-an-office-42861-large.mp4" },
  { id: "shopping", title: "Lifestyle & Deals", url: "https://assets.mixkit.co/videos/preview/mixkit-friends-walking-with-shopping-bags-in-a-mall-42901-large.mp4" },
  { id: "wellness", title: "Health & Fitness", url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-yoga-exercises-at-home-43026-large.mp4" },
  { id: "tech", title: "Digital Wallet", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-over-a-wooden-table-41525-large.mp4" },
];

export default function HeroSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#082F24] text-white min-h-[90vh] flex items-center">
      {/* 4 Background Video Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          key={HERO_VIDEOS[activeVideoIndex].url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 scale-105 transition-opacity duration-1000"
        >
          <source src={HERO_VIDEOS[activeVideoIndex].url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#082F24] via-[#082F24]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 lg:pt-40 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full pl-1 pr-4 py-1 mb-6 shadow-sm">
            <span className="bg-[#B8FF00] text-[#082F24] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">New</span>
            <span className="text-xs font-semibold text-white/90">The All-in-One Benefits Super App for Africa & MENA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold font-heading tracking-tight leading-[1.08]">
            One platform for{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#082F24] bg-[#B8FF00] px-3 rounded-2xl">everything</span>
            </span>{" "}
            your workforce needs
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl font-medium">
            Exclusive corporate discounts, flexible stipends, peer rewards, digital wallet, and mental wellness — delivered in one seamless experience.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2.5 bg-[#B8FF00] hover:bg-[#a2e600] text-[#082F24] font-extrabold text-sm h-12 px-7 rounded-[24px] transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/corporate"
              className="group inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 hover:border-white text-white font-bold text-sm h-12 px-7 rounded-[24px] transition-all"
            >
              <Play className="w-4 h-4 fill-current text-[#B8FF00]" />
              Book Corporate Demo
            </Link>
          </div>

          {/* Background Video Selector Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase font-bold text-[#B8FF00] tracking-wider mb-2 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Interactive Video Atmosphere:
            </p>
            <div className="flex flex-wrap gap-2">
              {HERO_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeVideoIndex === idx
                      ? "bg-[#B8FF00] text-[#082F24] shadow-md scale-105"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeVideoIndex === idx ? "bg-[#082F24] animate-ping" : "bg-white/50"}`} />
                  {vid.title}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#B8FF00]" /> Enterprise ISO Security
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <TrendingUp className="w-4 h-4 text-[#B8FF00]" /> 20K+ Vetted Merchant Partners
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <Sparkles className="w-4 h-4 text-[#B8FF00]" /> 500K+ Active Perks
            </span>
          </div>
        </div>

        {/* Visual Showcase Card utilizing attached luxury hotel image */}
        <div className="relative">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
            <img
              src="/images/assets/b1-foto-hotel-1643982_1920.jpg"
              alt="Luxury Hotel Benefit Showcase"
              className="w-full h-[420px] sm:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082F24] via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl text-gray-900 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">Featured Luxury Stays</p>
                <p className="text-base font-extrabold font-heading text-gray-900">$2.4M Saved This Quarter</p>
              </div>
              <div className="flex -space-x-2">
                {["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/68.jpg"].map((u) => (
                  <img key={u} src={u} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="w-8 h-8 rounded-full bg-[#B8FF00] text-[#082F24] text-[10px] font-black flex items-center justify-center border-2 border-white">+50K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
