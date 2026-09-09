import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { Smile, Users, Baby, Plane } from "lucide-react";

export default function Lifestyle() {
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

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase">
              <Smile className="w-3.5 h-3.5 text-amber-600" /> Family, Travel & Lifestyle
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
              Family & Lifestyle Perks
            </h1>
            <p className="text-gray-500 text-sm">
              Childcare support, school fee discounts, vacation stays, movie tickets, and family entertainment.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="p-4 bg-indigo-50 rounded-2xl text-center">
              <Baby className="w-6 h-6 text-indigo-700 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-900">Childcare</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl text-center">
              <Plane className="w-6 h-6 text-amber-700 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-900">Vacations</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading lifestyle perks...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id || offer.title} offer={offer} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}