import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_CATEGORIES } from "@/lib/landingData";

export default function CategoriesGrid() {
  const [activeCategory, setActiveCategory] = useState(0);
  const current = LANDING_CATEGORIES[activeCategory] || LANDING_CATEGORIES[0];

  return (
    <section id="categories" className="bg-forest py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[#E5C77A] font-bold text-xs tracking-[0.2em] uppercase mb-2">Categories</p>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#F5F1E8] tracking-tight leading-tight">
              Life's every moment, covered.
            </h2>
            <p className="mt-3 text-ivory-muted text-sm sm:text-base leading-relaxed">
              From breakfast in Lagos to a weekend in Marrakech — explore curated benefits across every category of your members' lives.
            </p>
          </div>
          <Link to="/offers" className="group inline-flex items-center gap-2 text-[#F5F1E8] font-bold text-xs sm:text-sm whitespace-nowrap">
            <span>Browse all 500,000+ offers</span>
            <span className="w-7 h-7 rounded-full bg-[#062B23] text-[#D6B56D] flex items-center justify-center text-xs font-extrabold">→</span>
          </Link>
        </div>

        {/* Multi-Tab Category Selector */}
        <div className="bg-forest-secondary rounded-xl p-6 sm:p-8 border border-white/12 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LANDING_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.slug + cat.name}
                onClick={() => setActiveCategory(idx)}
                className={`py-3 px-5 rounded-lg text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === idx
                    ? "bg-[#062B23] text-[#D6B56D] shadow-md scale-102"
                    : "bg-emerald-black/90 text-ivory hover:bg-[#0A3A2F]/5"
                }`}
              >
                <LIcon name={cat.icon} className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Category Display Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-emerald-black/90 rounded-lg ring-1 ring-white/10 p-6 sm:p-8 border border-white/10 shadow-sm">
            <div className="lg:col-span-5 relative rounded-lg overflow-hidden h-64 sm:h-72 shadow-md">
              <img src={current.img} alt={current.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-[#D6B56D] text-[#062B23] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Featured Perks
              </span>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#062B23] text-[#D6B56D] flex items-center justify-center font-bold">
                  <LIcon name={current.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-heading text-[#F5F1E8]">{current.name}</h3>
                  <p className="text-xs font-bold text-ivory-dim">Curated Corporate Savings</p>
                </div>
              </div>
              <p className="text-sm text-ivory-muted leading-relaxed">{current.desc}</p>
              <div className="pt-2">
                <Link
                  to={`/category/${current.slug}`}
                  className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-extrabold text-xs px-6 py-3 rounded-lg shadow-md shadow-[#062B23]/30 transition-colors"
                >
                  Explore {current.name} Deals
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
