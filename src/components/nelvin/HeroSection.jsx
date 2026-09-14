import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, TrendingUp, Sparkles, Video, Search, MapPin, Tag, Utensils, Hotel, Dumbbell, Sparkle } from "lucide-react";

const HERO_VIDEOS = [
  { id: "team", title: "Corporate Teams", url: "https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-an-office-42861-large.mp4" },
  { id: "shopping", title: "Lifestyle & Deals", url: "https://assets.mixkit.co/videos/preview/mixkit-friends-walking-with-shopping-bags-in-a-mall-42901-large.mp4" },
  { id: "wellness", title: "Health & Fitness", url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-yoga-exercises-at-home-43026-large.mp4" },
  { id: "tech", title: "Digital Wallet", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-over-a-wooden-table-41525-large.mp4" },
];

const LEISURE_PHOTOS = [
  { title: "Luxury Hotels & Stays", discount: "Up to 35% OFF", img: "/images/benifex/africa/kenya.jpg", icon: Hotel },
  { title: "Gourmet Dining & Cafés", discount: "2-for-1 Specials", img: "/images/benifex/cat/food-dining.jpg", icon: Utensils },
  { title: "Sports & Fitness Clubs", discount: "Free Trial Pass", img: "/images/benifex/cat/fitness-sports.jpg", icon: Dumbbell },
];

export default function HeroSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#062B23] text-white min-h-[90vh] flex items-center">
      {/* 4 Background Video Loop with 95% Opacity */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          key={HERO_VIDEOS[activeVideoIndex].url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-95 scale-105 transition-opacity duration-1000"
        >
          <source src={HERO_VIDEOS[activeVideoIndex].url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#062B23]/90 via-[#062B23]/75 to-[#062B23]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 lg:pt-40 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0A3A2F]/5 backdrop-blur border border-gold-soft rounded-lg pl-1 pr-4 py-1 mb-6 shadow-sm">
            <span className="bg-[#D6B56D]/15 text-[#D6B56D] border border-[#D6B56D]/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">Open To All</span>
            <span className="text-xs font-semibold text-ivory/90">For Individuals, Particulars, HR Teams & Merchants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold font-heading tracking-tight leading-[1.08] text-ivory">
            Perks "&" Savings, built for <span className="text-gold italic tracking-tight">Everyone</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl font-medium">
            Whether you are an individual looking for daily discounts, an HR team managing company benefits, or a business growing your customer base — Nelvin connects everyone in one place.
          </p>

          {/* Horizontal Search Bar for Individual Users */}
          <form onSubmit={handleSearchSubmit} className="mt-8 bg-emerald-black/95 backdrop-blur p-2 rounded-lg sm:rounded-full shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 text-ivory">
            <div className="flex items-center gap-2 px-3 py-1.5 flex-1 w-full border-b sm:border-b-0 sm:border-r border-white/12">
              <Search className="w-4 h-4 text-ivory-dim shrink-0" />
              <input
                type="text"
                placeholder="Search deals (e.g. Nike, Uber, Gym)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none placeholder:text-ivory-dim"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-36 border-b sm:border-b-0 sm:border-r border-white/12">
              <Tag className="w-4 h-4 text-ivory-dim shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none text-ivory"
              >
                <option value="">Category</option>
                <option value="dining">Dining</option>
                <option value="wellness">Wellness</option>
                <option value="travel">Travel</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-32">
              <MapPin className="w-4 h-4 text-ivory-dim shrink-0" />
              <input
                type="text"
                placeholder="City / Country"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none placeholder:text-ivory-dim"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-bold text-xs px-6 py-3 rounded-lg transition-all shadow-md shadow-[#062B23]/30 shrink-0 flex items-center justify-center gap-1.5"
            >
              Find Offers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row gap-3.5">
            <Link
              to="/corporate"
              className="group inline-flex items-center justify-center gap-2.5 bg-[#0A3A2F]/10 hover:bg-emerald-black/35 backdrop-blur border border-white/30 hover:border-white text-white font-bold text-xs h-10 px-6 rounded-full transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#D6B56D]" />
              Book Corporate Demo
            </Link>
          </div>

          {/* Background Video Selector Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase font-bold text-[#D6B56D] tracking-wider mb-2 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Interactive Video Atmosphere:
            </p>
            <div className="flex flex-wrap gap-2">
              {HERO_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeVideoIndex === idx
                      ? "bg-[#D6B56D] text-[#062B23] shadow-md scale-105"
                      : "bg-[#0A3A2F]/10 text-ivory/70 hover:bg-emerald-black/35 hover:text-white"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeVideoIndex === idx ? "bg-[#062B23] animate-ping" : "bg-[#0A3A2F]/50"}`} />
                  {vid.title}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#D6B56D]" /> Enterprise ISO Security
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <TrendingUp className="w-4 h-4 text-[#D6B56D]" /> 20K+ Vetted Merchant Partners
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
              <Sparkles className="w-4 h-4 text-[#D6B56D]" /> 500K+ Active Perks
            </span>
          </div>
        </div>

        {/* Visual Showcase Gallery with Multiple Leisure Photos */}
        <div className="relative space-y-3">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/20 group">
            <img
              src={LEISURE_PHOTOS[activePhotoIndex].img}
              alt={LEISURE_PHOTOS[activePhotoIndex].title}
              className="w-full h-[420px] sm:h-[460px] object-cover transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062B23] via-[#062B23]/20 to-transparent" />

            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D6B56D] animate-pulse" />
              <span>{LEISURE_PHOTOS[activePhotoIndex].title}</span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 bg-emerald-black/95 backdrop-blur rounded-lg p-4 shadow-xl text-ivory flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#E5C77A] font-bold">Exclusive Perk</p>
                <p className="text-base font-extrabold font-heading text-ivory">{LEISURE_PHOTOS[activePhotoIndex].discount}</p>
              </div>
              <div className="flex -space-x-2">
                {["https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/68.jpg"].map((u) => (
                  <img key={u} src={u} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="w-8 h-8 rounded-full bg-[#D6B56D] text-[#062B23] text-[10px] font-black flex items-center justify-center border-2 border-white">+50K</span>
              </div>
            </div>
          </div>

          {/* Leisure Photo Switcher Chips */}
          <div className="grid grid-cols-3 gap-2">
            {LEISURE_PHOTOS.map((p, i) => {
              const IconComp = p.icon;
              return (
                <button
                  key={p.title}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    activePhotoIndex === i
                      ? "bg-[#D6B56D] border-[#D6B56D] text-[#062B23] font-extrabold shadow-md scale-105"
                      : "bg-[#0A3A2F]/10 border-white/15 text-ivory/80 hover:bg-emerald-black/35 hover:text-white"
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] leading-tight truncate block">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
