import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { Search as SearchIcon, Filter, X, Tag } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    if (!query) { setOffers([]); return; }
    setLoading(true);
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 100)
      .then((data) => {
        const matched = (data || []).filter((o) => {
          const textMatches = (o.title + " " + o.business_name + " " + (o.description || "") + " " + (o.category || "")).toLowerCase().includes(query.toLowerCase());
          const countryMatches = selectedCountry === "All" || o.country === selectedCountry;
          const discountMatches = (o.savings_amount || 0) >= minDiscount;
          return textMatches && countryMatches && discountMatches;
        });
        setOffers(matched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCountry, minDiscount]);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory font-heading">Search Nelvin Benefits</h1>
            <p className="text-ivory-muted text-sm">Instant search across thousands of corporate offers, vendor stores, and location perks.</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <SearchIcon className="w-5 h-5 text-ivory-dim absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand name, deal title, city, or benefit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-forest-secondary/60 border border-white/12 pl-12 pr-10 py-3.5 rounded-full text-sm font-medium focus:bg-[#0A3A2F] focus:outline-none focus:ring-2 focus:ring-[#D6B56D]/40 transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory-dim hover:text-ivory-muted">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-ivory-muted pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-ivory-dim" />
              <span>Country:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-forest-secondary/60 border border-white/12 rounded-lg px-2.5 py-1"
              >
                <option value="All">All Countries</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Ghana">Ghana</option>
                <option value="Rwanda">Rwanda</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-ivory-dim" />
              <span>Min Savings ($):</span>
              <input
                type="number"
                min="0"
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="w-16 bg-forest-secondary/60 border border-white/12 rounded-lg px-2 py-1 text-center"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-12 text-ivory-dim text-sm">
            Type in keywords above to search benefits.
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-ivory-dim text-sm">Searching perks...</div>
        ) : offers.length === 0 ? (
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-8 text-center text-ivory-muted text-sm">
            No results found for "{query}".
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-ivory-muted uppercase tracking-wider">{offers.length} Results Found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id || offer.title} offer={offer} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}