import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Tag, MapPin } from "lucide-react";

import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";

export default function MyOffers() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Redemption.list("-created_date", 200)
      .then((data) => {
        setRedemptions(data);
        setLoading(false);
      })
      .catch(() => {
        setRedemptions([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-16">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold font-heading text-ivory">Offers You've Used</h1>
              <p className="text-sm text-ivory-dim mt-1">Track every offer you've redeemed and how much you saved</p>
            </div>
            <span className="bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
              {redemptions.length} Redeemed
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-ivory-dim">Loading...</div>
          ) : redemptions.length === 0 ? (
            <div className="py-16 text-center text-ivory-dim">You haven't redeemed any offers yet.</div>
          ) : (
            <div className="space-y-3">
              {redemptions.map((r, i) => (
                <div key={r.id} className={`flex items-center justify-between p-4 rounded-xl border ${i === 0 ? "border-[#1B4F9C]/30 bg-[#FFFFFF]/30" : "border-[#F1F1F1]"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FFFFFF] rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-[#1B4F9C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-ivory text-sm">{r.business_name}</p>
                      <p className="text-xs text-ivory-muted">{r.offer_title}</p>
                      <p className="text-xs text-ivory-dim flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {r.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1B4F9C] font-bold text-sm">+₦{(r.savings_amount || 0).toLocaleString()}</p>
                    <p className="text-xs text-ivory-dim">{new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}