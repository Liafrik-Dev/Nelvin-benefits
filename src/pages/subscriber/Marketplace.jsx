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
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#1B4F9C] text-xs font-bold uppercase">
              <ShoppingBag className="w-3.5 h-3.5 text-[#1B4F9C]" /> Complete Benefits Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
              Employee Marketplace
            </h1>
            <p className="text-ivory-muted text-sm mt-1">Discover, redeem, and save on thousands of corporate perks.</p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-ivory-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search offers, brands, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-emerald-black ring-1 ring-[#F1F1F1] border border-transparent pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F9C]/40"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ivory-dim flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === c ? "bg-[#FFFFFF] text-[#1B4F9C]" : "bg-[#F4F4F4] text-ivory-muted hover:bg-[#F4F4F4]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ivory-dim flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F9F8F7] border border-[#F1F1F1] text-ivory text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
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
          <span className="text-xs font-semibold text-ivory-dim mr-2">Tags:</span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === t ? "bg-[#1B4F9C] text-white" : "bg-emerald-black ring-1 ring-[#F1F1F1] border border-transparent text-ivory-muted hover:bg-[#F9F8F7]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading marketplace offers...</div>
        ) : sorted.length === 0 ? (
          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[#282828]/60 mx-auto" />
            <h3 className="text-lg font-bold text-ivory">No matching offers found</h3>
            <p className="text-ivory-muted text-xs">Try clearing filters or searching for another keyword.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedTag("All");
              }}
              className="mt-2 text-xs font-bold text-[#1B4F9C] underline"
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