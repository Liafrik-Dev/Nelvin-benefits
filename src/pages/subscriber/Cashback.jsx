import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { TrendingUp, DollarSign, Wallet, ArrowDownRight, CheckCircle2, X } from "lucide-react";

export default function Cashback() {
  const [cashbackOffers, setCashbackOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);
  const [earnings, setEarnings] = useState(142.8);

  useEffect(() => {
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 100)
      .then((data) => {
        const filtered = (data || []).filter((o) => o.tag === "Cashback" || o.discount_label?.includes("%"));
        setCashbackOffers(filtered.length > 0 ? filtered : data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTransfer = () => {
    setPayoutDone(true);
    setTimeout(() => {
      setEarnings(0);
      setPayoutDone(false);
      setPayoutModal(false);
    }, 2000);
  };

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

          <div className="bg-[#082F24] text-white p-5 rounded-2xl text-center min-w-[220px] space-y-3">
            <div>
              <p className="text-[10px] uppercase text-[#B8FF00] font-bold">Available Cashback Balance</p>
              <p className="text-3xl font-black font-heading text-[#B8FF00]">${earnings.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setPayoutModal(true)}
              disabled={earnings === 0}
              className="w-full bg-[#00BD00] hover:bg-[#00a800] text-white text-xs font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              Transfer to Wallet
            </button>
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

      {payoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center relative shadow-2xl">
            <button onClick={() => setPayoutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-[#00BD00]">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#082F24]">Transfer to Wallet</h3>
            <p className="text-xs text-gray-500">
              Move <strong className="text-gray-900">${earnings.toFixed(2)}</strong> from cashback directly into your spendable Nelvin balance.
            </p>
            {payoutDone ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transfer Complete!
              </div>
            ) : (
              <button
                onClick={handleTransfer}
                className="w-full bg-[#082F24] hover:bg-[#0d4636] text-[#B8FF00] font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Confirm Instant Transfer
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}