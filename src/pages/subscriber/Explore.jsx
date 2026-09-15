import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { Compass, Sparkles, TrendingUp, Flame, Award, ArrowRight } from "lucide-react";

export default function Explore() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 20)
      .then((data) => {
        setOffers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const featured = offers.filter((o) => o.is_featured || o.tag === "VIP" || o.tag === "Exclusive");
  const trending = offers.filter((o) => o.tag === "Trending" || o.tag === "Popular");
  const cashback = offers.filter((o) => o.tag === "Cashback");

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#0866FF] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0866FF]" /> Curated Lifestyle Perks
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ivory tracking-tight font-heading">
              Explore Top Employee Benefits & Exclusive Deals
            </h1>
            <p className="text-ivory-muted text-sm leading-relaxed">
              Discover verified corporate discounts, cashback rewards, and wellness packages crafted for you and your family across Africa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/marketplace" className="bg-[#FFFFFF] text-[#0866FF] font-bold px-5 py-3 rounded-full text-sm hover:bg-[#FFFFFF] transition-colors flex items-center gap-2">
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/nearby" className="bg-[#FFFFFF] text-[#0866FF] font-bold px-5 py-3 rounded-full text-sm hover:bg-[#FFFFFF] transition-colors">
              Find Nearby
            </Link>
          </div>
        </div>

        {/* Featured Deals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0866FF]" />
              <h2 className="text-xl font-bold text-ivory font-heading">Featured & VIP Deals</h2>
            </div>
            <Link to="/marketplace?filter=featured" className="text-xs font-bold text-[#0866FF] hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-ivory-dim">Loading recommendations...</div>
          ) : featured.length === 0 ? (
            <div className="p-8 bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg text-center text-ivory-muted text-sm">
              No featured deals found at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map((offer) => (
                <OfferCard key={offer.id || offer.title} offer={offer} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Deals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#0866FF]" />
              <h2 className="text-xl font-bold text-ivory font-heading">Trending Right Now</h2>
            </div>
            <Link to="/marketplace?filter=trending" className="text-xs font-bold text-[#0866FF] hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-ivory-dim">Loading recommendations...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(trending.length ? trending : offers).slice(0, 4).map((offer) => (
                <OfferCard key={offer.id || offer.title} offer={offer} />
              ))}
            </div>
          )}
        </section>

        {/* Cashback Offers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0866FF]" />
              <h2 className="text-xl font-bold text-ivory font-heading">High Cashback Perks</h2>
            </div>
            <Link to="/cashback" className="text-xs font-bold text-[#0866FF] hover:underline">View Cashback</Link>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-ivory-dim">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(cashback.length ? cashback : offers).slice(0, 4).map((offer) => (
                <OfferCard key={offer.id || offer.title} offer={offer} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}