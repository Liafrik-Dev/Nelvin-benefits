import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { SectionHeading } from "@/components/nelvin/Brand";
import { LANDING_CATEGORIES } from "@/lib/landingData";

/**
 * Categories — the reference presents top-level offer categories as one
 * browsable row with a single large featured panel beneath it. The tab
 * interaction is preserved; only the surfaces and rhythm changed.
 */
export default function CategoriesGrid() {
  const [activeCategory, setActiveCategory] = useState(0);
  const current = LANDING_CATEGORIES[activeCategory] || LANDING_CATEGORIES[0];

  return (
    <section id="categories" className="surface-nv-primary section-nv border-b border-white/10">
      <div className="container-nv">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Categories"
            title="Life's every moment, covered."
            lead="From breakfast in Lagos to a weekend in Marrakech — explore curated benefits across every category of your members' lives."
          />
          <Link to="/offers" className="btn-nv btn-nv-md btn-nv-outline group w-fit shrink-0">
            Browse all 500,000+ offers
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Category selector */}
        <div className="mt-12">
          <div
            className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            role="tablist"
            aria-label="Offer categories"
          >
            {LANDING_CATEGORIES.map((cat, idx) => {
              const on = activeCategory === idx;
              return (
                <button
                  key={`${cat.slug}-${cat.name}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveCategory(idx)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-xs font-bold transition-colors ${
                    on
                      ? "bg-gold text-[#062B23] shadow-nv-card"
                      : "border border-white/10 bg-white/[0.04] text-ivory-muted hover:border-[#D6B56D]/35 hover:text-ivory"
                  }`}
                >
                  <LIcon name={cat.icon} className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Featured panel */}
          <div className="card-nv mt-6 grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="relative h-64 overflow-hidden rounded-xl sm:h-72 lg:col-span-5">
              <img
                src={current.img}
                alt={current.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/85 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#062B23]">
                Featured perks
              </span>
            </div>

            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#062B23] text-gold">
                  <LIcon name={current.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl font-extrabold font-heading text-ivory">{current.name}</h3>
                  <p className="text-xs font-semibold text-ivory-dim">Curated member savings</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ivory-muted">{current.desc}</p>

              <Link
                to={`/category/${current.slug}`}
                className="btn-nv btn-nv-md btn-nv-gold group mt-6"
              >
                Explore {current.name}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}