import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Ticket, QrCode, Copy, Check, Calendar } from "lucide-react";

export default function Vouchers() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    db.entities.Redemption.list("-created_date", 100)
      .then((data) => {
        setRedemptions(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleVouchers = [
    { id: "v1", offer_title: "Nike Store - 25% Off Footwear", promo_code: "NELVIN-NIKE-9821", expiry: "31 Dec 2026", status: "active", merchant: "Nike" },
    { id: "v2", offer_title: "Uber Eats - $20 Lunch Voucher", promo_code: "NELVIN-UBER-5510", expiry: "15 Jun 2026", status: "active", merchant: "Uber Eats" },
    { id: "v3", offer_title: "Jumia Shopping Voucher", promo_code: "NELVIN-JUMIA-0034", expiry: "01 Aug 2026", status: "redeemed", merchant: "Jumia" },
  ];

  const listToDisplay = redemptions.length > 0 ? redemptions : sampleVouchers;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
              <Ticket className="w-3.5 h-3.5 text-emerald-600" /> Digital Vouchers & Gift Cards
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-heading">
              My Active Vouchers
            </h1>
            <p className="text-gray-500 text-sm mt-1">Show these codes or QR barcodes at point of sale to claim your discounts.</p>
          </div>
          <span className="text-xs font-bold bg-[#082F24] text-[#B8FF00] px-3.5 py-2 rounded-full">
            {listToDisplay.length} Total Vouchers
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading vouchers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listToDisplay.map((v) => (
              <div key={v.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {v.merchant || v.business_name || "Partner Store"}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-2 font-heading">
                      {v.offer_title || v.offer_name || "Special Perk Voucher"}
                    </h3>
                  </div>
                  <QrCode className="w-8 h-8 text-gray-400 flex-shrink-0" />
                </div>

                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Voucher / Promo Code</p>
                    <p className="text-sm font-extrabold font-mono text-gray-900 tracking-wider">
                      {v.promo_code || v.redemption_code || "NV-PROMO-77"}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(v.promo_code || v.redemption_code || "NV-PROMO-77", v.id)}
                    className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-600 transition-colors"
                  >
                    {copiedId === v.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Valid until: {v.expiry || v.created_date || "31 Dec 2026"}
                  </span>
                  <span className={`font-bold capitalize ${v.status === "active" ? "text-emerald-700" : "text-gray-400"}`}>
                    {v.status || "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}