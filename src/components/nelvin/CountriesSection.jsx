import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { COUNTRIES } from "@/lib/nelvinData";

const offerCounts = ["48,200", "62,100", "31,400", "28,700", "25,900", "18,300", "14,600", "9,200"];

export default function CountriesSection() {
  return (
    <section className="bg-[#1a0a0a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COUNTRIES.slice(0, 8).map((country, i) => (
            <Link
              to={`/country/${country.slug}`}
              key={i}
              className="relative h-56 sm:h-64 rounded-2xl overflow-hidden group cursor-pointer block"
            >
              <img src={country.image} alt={country.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-lg mb-1">{country.flag}</span>
                <h3 className="text-white font-bold text-lg">{country.name}</h3>
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <Tag className="w-3 h-3" />
                  {offerCounts[i]} offers
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}