import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { ShoppingBag, Search, Filter, ArrowUpDown } from "lucide-react";

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "All");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 200)
      .then((data) => {
        setOffers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", "Food & Dining", "Travel & Stay", "Health & Wellness", "Shopping & Fashion", "Financial Services", "Electronics & Tech"];
  const tags = ["All", "Popular", "VIP", "Cashback", "Trending", "New", "Limited Time"];

  const filtered = offers.filter((o) => {
    const matchesSearch = !searchTerm || (o.title + o.business_name + o.description).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || o.category === selectedCategory;
    const matchesTag = selectedTag === "All" || o.tag === selectedTag;
    return matchesSearch && matchesCat && matchesTag;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_low") return (a.discount_price || 0) - (b.discount_price || 0);
    if (sortBy === "price_high") return (b.discount_price || 0) - (a.discount_price || 0);
    if (sortBy === "savings") return (b.savings_amount || 0) - (a.savings_amount || 0);
    return (b.rating || 0) - (a.rating || 0);
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> Complete Benefits Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-heading">
              Employee Marketplace
            </h1>
            <p className="text-gray-500 text-sm mt-1">Discover, redeem, and save on thousands of corporate perks.</p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search offers, brands, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === c ? "bg-[#082F24] text-[#B8FF00]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="popular">Top Rated</option>
              <option value="savings">Highest Savings</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Tags sub-bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-semibold text-gray-400 mr-2">Tags:</span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === t ? "bg-emerald-700 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading marketplace offers...</div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No matching offers found</h3>
            <p className="text-gray-500 text-xs">Try clearing filters or searching for another keyword.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedTag("All");
              }}
              className="mt-2 text-xs font-bold text-emerald-700 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sorted.map((offer) => (
              <OfferCard key={offer.id || offer.title} offer={offer} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}