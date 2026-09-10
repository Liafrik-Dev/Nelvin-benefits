import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_CATEGORIES } from "@/lib/landingData";

export default function CategoriesGrid() {
  const [activeCategory, setActiveCategory] = useState(0);
  const current = LANDING_CATEGORIES[activeCategory] || LANDING_CATEGORIES[0];

  return (
    <section id="categories" className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-2">Categories</p>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#082F24] tracking-tight leading-tight">
              Life's every moment, covered.
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
              From breakfast in Lagos to a weekend in Marrakech — explore curated benefits across every category of your members' lives.
            </p>
          </div>
          <Link to="/offers" className="group inline-flex items-center gap-2 text-[#082F24] font-bold text-xs sm:text-sm whitespace-nowrap">
            <span>Browse all 500,000+ offers</span>
            <span className="w-7 h-7 rounded-full bg-[#082F24] text-[#B8FF00] flex items-center justify-center text-xs font-extrabold">→</span>
          </Link>
        </div>

        {/* Multi-Tab Category Selector */}
        <div className="bg-[#F7F3ED] rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LANDING_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.slug + cat.name}
                onClick={() => setActiveCategory(idx)}
                className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === idx
                    ? "bg-[#082F24] text-[#B8FF00] shadow-md scale-102"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LIcon name={cat.icon} className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Category Display Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-md">
              <img src={current.img} alt={current.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082F24]/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-[#B8FF00] text-[#082F24] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Featured Perks
              </span>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center font-bold">
                  <LIcon name={current.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-heading text-[#082F24]">{current.name}</h3>
                  <p className="text-xs font-bold text-gray-400">Curated Corporate Savings</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{current.desc}</p>
              <div className="pt-2">
                <Link
                  to={`/category/${current.slug}`}
                  className="inline-flex items-center gap-2 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-extrabold text-xs px-6 py-3 rounded-full shadow-md transition-colors"
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
