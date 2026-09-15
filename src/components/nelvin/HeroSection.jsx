import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Search,
  MapPin,
  Tag,
  Utensils,
  Hotel,
  Dumbbell,
} from "lucide-react";

/**
 * Hero — modelled on The ENTERTAINER: a full-bleed media band, one
 * restrained headline, a single horizontal search/CTA control, trust
 * signals, then proof imagery. Video rotates automatically and can be
 * pinned by the viewer.
 */

const HERO_VIDEOS = [
  { id: "savanna-sunset", title: "Savanna at Sunset", url: "https://assets.mixkit.co/videos/preview/mixkit-sunset-in-the-savanna-through-a-tree-5278-large.mp4" },
  { id: "savanna-aerial", title: "Savanna Aerial", url: "https://assets.mixkit.co/videos/preview/mixkit-area-in-the-savanna-aerial-shot-3880-large.mp4" },
  { id: "african-plains", title: "African Plains", url: "https://assets.mixkit.co/videos/preview/mixkit-herds-of-african-animals-on-a-vast-plain-11239-large.mp4" },
  { id: "savanna-lake", title: "Savanna Lake", url: "https://assets.mixkit.co/videos/preview/mixkit-lake-in-a-savanna-at-sunset-5029-large.mp4" },
  { id: "savanna-horizon", title: "Savanna Horizon", url: "https://assets.mixkit.co/videos/preview/mixkit-sunset-on-the-savanna-seen-behind-the-skyline-5031-large.mp4" },
  { id: "savanna-tree", title: "Savanna Tree", url: "https://assets.mixkit.co/videos/preview/mixkit-huge-argan-tree-in-the-savanna-4027-large.mp4" },
];

const LEISURE_PHOTOS = [
  { title: "Luxury Hotels & Stays", discount: "Up to 35% OFF", img: "/images/benifex/africa/kenya.jpg", icon: Hotel },
  { title: "Gourmet Dining & Cafés", discount: "2-for-1 Specials", img: "/images/benifex/cat/food-dining.jpg", icon: Utensils },
  { title: "Sports & Fitness Clubs", discount: "Free Trial Pass", img: "/images/benifex/cat/fitness-sports.jpg", icon: Dumbbell },
];

const TRUST = [
  { icon: ShieldCheck, label: "Enterprise ISO security" },
  { icon: TrendingUp, label: "20K+ vetted merchant partners" },
  { icon: Sparkles, label: "500K+ active perks" },
];

export default function HeroSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : "/search");
  };

  const activePhoto = LEISURE_PHOTOS[activePhotoIndex];
  const ActivePhotoIcon = activePhoto.icon;

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-[#FFFFFF] text-ivory">
      {/* Media band */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#FFFFFF]">
        <video
          key={HERO_VIDEOS[activeVideoIndex].url}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover opacity-70"
        >
          <source src={HERO_VIDEOS[activeVideoIndex].url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-lux-diagonal opacity-60" aria-hidden="true" />
      </div>

      <div className="relative z-10 container-nv w-full pb-20 pt-32 lg:pb-24 lg:pt-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* Copy column */}
          <div className="animate-fade-up">
            <span className="chip-nv">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Open to everyone
            </span>

            <h1 className="text-balance-nv mt-6 text-4xl font-bold font-heading leading-[1.08] tracking-tight text-ivory sm:text-5xl xl:text-[3.5rem]">
              Perks &amp; savings, built for{" "}
              <span className="text-gold italic">everyone</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-muted sm:text-lg">
              Daily discounts for individuals, flexible benefits for employees, and
              effortless administration for HR teams — one platform connecting every
              side of the employee benefits story across Africa.
            </p>

            {/* Single unified search control */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="mt-8 rounded-2xl border border-[#F1F1F1] bg-[#FFFFFF]/80 p-2 shadow-nv-card backdrop-blur-xl sm:rounded-full"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 py-2.5 sm:py-1.5">
                  <Search className="h-4 w-4 shrink-0 text-gold" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search deals — brands, dining, hotels…"
                    aria-label="Search deals"
                    className="w-full min-w-0 bg-transparent text-xs font-semibold text-ivory outline-none placeholder:text-ivory-dim"
                  />
                </div>

                <div className="hidden h-6 w-px bg-[#F9F8F7] sm:block" />

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 sm:w-40 sm:py-1.5">
                  <Tag className="h-4 w-4 shrink-0 text-gold" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Category"
                    className="w-full bg-transparent text-xs font-semibold text-ivory outline-none"
                  >
                    <option value="" className="bg-[#FFFFFF]">Category</option>
                    <option value="dining" className="bg-[#FFFFFF]">Dining</option>
                    <option value="wellness" className="bg-[#FFFFFF]">Wellness</option>
                    <option value="travel" className="bg-[#FFFFFF]">Travel</option>
                    <option value="shopping" className="bg-[#FFFFFF]">Shopping</option>
                  </select>
                </div>

                <div className="hidden h-6 w-px bg-[#F9F8F7] sm:block" />

                <div className="flex items-center gap-2.5 px-3.5 py-2.5 sm:w-36 sm:py-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    aria-label="City or country"
                    className="w-full min-w-0 bg-transparent text-xs font-semibold text-ivory outline-none placeholder:text-ivory-dim"
                  />
                </div>

                <button type="submit" className="btn-nv btn-nv-md btn-nv-gold shrink-0">
                  Find offers
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* Secondary CTA */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/corporate" className="btn-nv btn-nv-md btn-nv-outline">
                <Play className="h-3.5 w-3.5 fill-current text-gold" />
                Book a corporate demo
              </Link>
              <Link
                to="/offers"
                className="btn-nv btn-nv-md btn-nv-ghost group"
              >
                Browse all offers
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Trust signals */}
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {TRUST.map((t) => (
                <li key={t.label} className="inline-flex items-center gap-2 text-xs font-semibold text-ivory-muted">
                  <t.icon className="h-4 w-4 text-gold" />
                  {t.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Proof column */}
          <div className="animate-fade-up-delay-2 space-y-3">
            <div className="group relative overflow-hidden rounded-2xl border border-[#F1F1F1] shadow-nv-card">
              <img
                src={activePhoto.img}
                alt={activePhoto.title}
                className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[440px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#E3E3E3] bg-black/55 px-3 py-1.5 text-[11px] font-bold text-ivory backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                {activePhoto.title}
              </span>

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-4 shadow-nv-card backdrop-blur">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    <ActivePhotoIcon className="h-3 w-3" />
                    Exclusive perk
                  </p>
                  <p className="mt-1 truncate text-base font-extrabold font-heading text-ivory">
                    {activePhoto.discount}
                  </p>
                </div>
                <div className="flex shrink-0 -space-x-2">
                  {[
                    "https://randomuser.me/api/portraits/women/44.jpg",
                    "https://randomuser.me/api/portraits/men/32.jpg",
                    "https://randomuser.me/api/portraits/women/68.jpg",
                  ].map((u) => (
                    <img
                      key={u}
                      src={u}
                      alt=""
                      loading="lazy"
                      className="h-8 w-8 rounded-full border-2 border-[#F1F1F1] object-cover"
                    />
                  ))}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F1F1F1] bg-gold text-[10px] font-black text-white">
                    50K
                  </span>
                </div>
              </div>
            </div>

            {/* Photo + video switchers, kept as one quiet control row */}
            <div className="grid grid-cols-3 gap-2">
              {LEISURE_PHOTOS.map((p, i) => {
                const Icon = p.icon;
                const on = activePhotoIndex === i;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setActivePhotoIndex(i)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all ${
                      on
                        ? "border-gold bg-gold text-white"
                        : "border-[#F1F1F1] bg-[#F9F8F7] text-ivory-muted hover:border-[#0866FF]/40 hover:text-ivory"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-[10px] font-bold leading-tight">{p.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-2.5">
              <span className="pl-1 pr-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-dim">
                Atmosphere
              </span>
              {HERO_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => setActiveVideoIndex(idx)}
                  aria-pressed={activeVideoIndex === idx}
                  className={`inline-flex min-h-8 items-center rounded-full px-3 py-1.5 text-[10px] font-bold transition-colors ${
                    activeVideoIndex === idx
                      ? "bg-gold text-white"
                      : "text-ivory-dim hover:text-gold"
                  }`}
                >
                  {vid.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline for a crisp edge into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-[#0866FF]/30 to-transparent" />
    </section>
  );
}