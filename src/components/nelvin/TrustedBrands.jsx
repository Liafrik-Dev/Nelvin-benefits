import React from "react";

const brands = ["DStv", "Shoprite", "Woolworths", "Nando's", "Emirates", "Kenya Airways", "Ethiopian Airlines", "MTN", "Jumia", "Konga"];

export default function TrustedBrands() {
  return (
    <section className="bg-[#1a0a0a] py-10 overflow-hidden">
      <p className="text-center text-xs tracking-[0.2em] text-white/40 uppercase mb-6">
        Trusted by 20,000+ leading African & global brands
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-16 items-center whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-white/30 text-xl sm:text-2xl font-heading font-semibold flex-shrink-0">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}