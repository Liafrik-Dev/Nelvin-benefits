import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";

import { CATEGORIES, COUNTRIES } from "@/lib/nelvinData";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import OfferCard from "@/components/nelvin/OfferCard";

export default function AllOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    setLoading(true);
    const query = { status: "active" };
    if (category) query.category = category;
    if (country) query.country = country;
    db.entities.Offer.filter(query, "-created_date", 150)
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch(() => {
        setOffers([]);
        setLoading(false);
      });
  }, [category, country]);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#282828]">Browse all offers</h1>
          <p className="text-[#484848] mt-2">{offers.length} offers available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[#F1F1F1] rounded-lg px-4 py-2 text-sm bg-[#FFFFFF] text-ivory outline-none focus:border-[#0866FF]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-[#F1F1F1] rounded-lg px-4 py-2 text-sm bg-[#FFFFFF] text-ivory outline-none focus:border-[#0866FF]"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-ivory-dim">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 text-ivory-dim">No offers match your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}