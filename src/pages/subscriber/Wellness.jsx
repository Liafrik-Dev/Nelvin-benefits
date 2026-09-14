import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { HeartPulse, Dumbbell, ShieldAlert, Activity } from "lucide-react";

export default function Wellness() {
  const [wellnessOffers, setWellnessOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Offer.filter({ category: "Health & Wellness", is_published: true, status: "active" }, "-created_date", 20)
      .then((data) => {
        setWellnessOffers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20 text-xs font-bold uppercase">
              <HeartPulse className="w-3.5 h-3.5 text-[#D6B56D]" /> Employee Well-being Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory font-heading">
              Health, Gyms & Mental Wellness
            </h1>
            <p className="text-ivory-muted text-sm">
              Access subsidized gym passes, telemedicine consultations, mental health support, and spa packages.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="p-4 bg-[#0A3A2F] rounded-lg text-center">
              <Dumbbell className="w-6 h-6 text-[#D6B56D] mx-auto mb-1" />
              <p className="text-xs font-bold text-ivory">Gym Access</p>
              <p className="text-[10px] text-ivory-muted">250+ Venues</p>
            </div>
            <div className="p-4 bg-[#103F35]/70 rounded-lg text-center">
              <Activity className="w-6 h-6 text-[#D6B56D] mx-auto mb-1" />
              <p className="text-xs font-bold text-ivory">Telehealth</p>
              <p className="text-[10px] text-ivory-muted">24/7 On-Call</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading wellness perks...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessOffers.map((offer) => (
              <OfferCard key={offer.id || offer.title} offer={offer} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}