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
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">Search Nelvin Benefits</h1>
            <p className="text-gray-500 text-sm">Instant search across thousands of corporate offers, vendor stores, and location perks.</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand name, deal title, city, or benefit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 pl-12 pr-10 py-3.5 rounded-full text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span>Country:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1"
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
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Min Savings ($):</span>
              <input
                type="number"
                min="0"
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-center"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Type in keywords above to search benefits.
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Searching perks...</div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
            No results found for "{query}".
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{offers.length} Results Found</p>
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