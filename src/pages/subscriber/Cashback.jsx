import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { TrendingUp, DollarSign, Wallet } from "lucide-react";

export default function Cashback() {
  const [cashbackOffers, setCashbackOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 100)
      .then((data) => {
        const filtered = (data || []).filter((o) => o.tag === "Cashback" || o.discount_label?.includes("%"));
        setCashbackOffers(filtered.length > 0 ? filtered : data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Automatic Cashback Perk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
              Earn Instant Cashback On Everyday Purchases
            </h1>
            <p className="text-gray-500 text-sm">
              Shop with partner merchants or use your Nelvin card to automatically credit cash straight back into your digital wallet.
            </p>
          </div>

          <div className="bg-[#082F24] text-white p-5 rounded-2xl text-center min-w-[200px]">
            <p className="text-xs uppercase text-[#B8FF00] font-bold">Lifetime Cashback Earned</p>
            <p className="text-3xl font-black font-heading">$142.80</p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading cashback deals...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cashbackOffers.map((offer) => (
              <OfferCard key={offer.id || offer.title} offer={offer} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}