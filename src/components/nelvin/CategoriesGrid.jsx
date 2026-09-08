import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_CATEGORIES } from "@/lib/landingData";

export default function CategoriesGrid() {
  return (
    <section id="categories" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Categories</p>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
              Life's every moment,{" "}
              <span className="text-[#7637E3]">covered.</span>
            </h2>
            <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-xl">
              From breakfast in Lagos to a weekend in Marrakech — explore curated benefits
              across every category of your members' lives.



            </p>
          </div>
          <Link to="/offers" className="group inline-flex items-center gap-2 text-[#180126] font-bold text-sm whitespace-nowrap">
            <span className="transition-transform group-hover:-translate-x-1">Browse all 500,000+ offers</span>
            <span className="w-7 h-7 rounded-full bg-[#180126] group-hover:bg-[#00BD00] transition-colors flex items-center justify-center text-white text-xs font-extrabold">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LANDING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug + cat.name}
              to={`/category/${cat.slug}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm ring-1 ring-[#180126]/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#180126]/85 via-[#180126]/20 to-transparent group-hover:from-[#180126]/90 transition-colors" />
              <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow-sm group-hover:bg-[#B8FF00] group-hover:text-[#082F24] transition-colors">
                <LIcon name={cat.icon} className="w-5 h-5" />
              </div>
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
              <div className="absolute bottom-0 inset-x-0 p-5">
                <h3 className="text-lg font-extrabold font-heading text-white leading-snug">{cat.name}</h3>
                <p className="text-xs text-white/70 mt-1 line-clamp-2">{cat.desc}</p>
                <span className="mt-2.5 inline-block text-[10px] font-bold uppercase tracking-widest text-[#B8FF00] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
