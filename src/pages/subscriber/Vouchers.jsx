import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Ticket, QrCode, Copy, Check, Calendar, X, Eye } from "lucide-react";

export default function Vouchers() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [activeQRModal, setActiveQRModal] = useState(null);

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
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3A2F] text-[#E5C77A] text-xs font-bold uppercase">
              <Ticket className="w-3.5 h-3.5 text-[#D6B56D]" /> Digital Vouchers & Gift Cards
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
              My Active Vouchers
            </h1>
            <p className="text-ivory-muted text-sm mt-1">Show these codes or QR barcodes at point of sale to claim your discounts.</p>
          </div>
          <span className="text-xs font-bold bg-[#062B23] text-[#D6B56D] px-3.5 py-2 rounded-full">
            {listToDisplay.length} Total Vouchers
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading vouchers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listToDisplay.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-white/10 p-6 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B56D] bg-[#0A3A2F] px-2.5 py-0.5 rounded-full">
                      {v.merchant || v.business_name || "Partner Store"}
                    </span>
                    <h3 className="font-bold text-ivory text-base mt-2 font-heading">
                      {v.offer_title || v.offer_name || "Special Perk Voucher"}
                    </h3>
                  </div>
                  <QrCode className="w-8 h-8 text-ivory-dim flex-shrink-0" />
                </div>

                <div className="bg-forest-secondary/60 border border-dashed border-white/15 rounded-lg p-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-ivory-dim">Voucher / Promo Code</p>
                    <p className="text-sm font-extrabold font-mono text-ivory tracking-wider">
                      {v.promo_code || v.redemption_code || "NV-PROMO-77"}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(v.promo_code || v.redemption_code || "NV-PROMO-77", v.id)}
                    className="p-2 bg-white rounded-xl border border-white/12 text-ivory-muted hover:text-[#D6B56D] hover:border-[#D6B56D]/40 transition-colors"
                  >
                    {copiedId === v.id ? <Check className="w-4 h-4 text-[#D6B56D]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-ivory-muted pt-2 border-t border-gray-50">
                  <button
                    onClick={() => setActiveQRModal(v)}
                    className="font-bold text-[#F5F1E8] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Barcode QR
                  </button>
                  <span className={`font-bold capitalize ${v.status === "active" ? "text-[#D6B56D]" : "text-ivory-dim"}`}>
                    {v.status || "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Code Reveal Modal */}
      {activeQRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveQRModal(null)}
              className="absolute top-4 right-4 text-ivory-dim hover:text-ivory-muted"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B56D] bg-[#0A3A2F] px-3 py-1 rounded-full">
                {activeQRModal.merchant || activeQRModal.business_name || "Partner Store"}
              </span>
              <h3 className="font-extrabold text-ivory text-lg mt-2 font-heading">
                {activeQRModal.offer_title || "Perk Voucher"}
              </h3>
            </div>

            <div className="bg-[#062B23] p-6 rounded-lg flex flex-col items-center justify-center space-y-3">
              <QrCode className="w-32 h-32 text-[#D6B56D]" />
              <p className="font-mono text-sm font-extrabold text-white tracking-widest">
                {activeQRModal.promo_code || "NV-PROMO-77"}
              </p>
            </div>

            <p className="text-xs text-ivory-muted">Scan this code directly at checkout or terminal.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}