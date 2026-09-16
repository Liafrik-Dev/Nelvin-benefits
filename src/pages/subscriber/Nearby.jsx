import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { MapPin, Navigation, Compass, Store } from "lucide-react";

export default function Nearby() {
  const [locations, setLocations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Lagos");

  useEffect(() => {
    db.entities.Offer.filter({ is_published: true, status: "active" }, "-created_date", 100)
      .then((data) => {
        setOffers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cities = ["Lagos", "Nairobi", "Johannesburg", "Accra", "Kigali", "Abidjan"];

  const filteredOffers = offers.filter(
    (o) => !o.city || o.city.toLowerCase() === selectedCity.toLowerCase() || o.country
  );

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#1B4F9C] text-xs font-bold uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#1B4F9C]" /> Geolocation & Local Perks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory font-heading">
              Nearby Benefits & Store Deals
            </h1>
            <p className="text-ivory-muted text-sm">Find physical store discounts, restaurants, and gym spots near your location.</p>
          </div>

          <div className="flex max-w-full flex-wrap items-center gap-2 bg-[#F9F8F7] p-1.5 rounded-lg border border-[#F1F1F1]">
            <span className="text-xs font-bold text-ivory-muted pl-2">City:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === city
                    ? "bg-[#FFFFFF] text-[#1B4F9C] shadow-sm"
                    : "text-ivory-muted hover:text-ivory"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Map preview box */}
        <div className="bg-[#FFFFFF] rounded-xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 relative z-10 max-w-lg">
            <div className="flex items-center gap-2 text-[#1B4F9C] text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-4 h-4" /> GPS Radar Active
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              Showing active store locations in {selectedCity}
            </h2>
            <p className="text-[#484848] text-xs leading-relaxed">
              Present your Nelvin digital card or QR code at checkout in any of these registered partner locations to claim instant savings.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 bg-[#F4F4F4] backdrop-blur border border-[#E3E3E3] p-4 rounded-lg">
            <Store className="w-8 h-8 text-[#1B4F9C]" />
            <div>
              <p className="text-sm font-bold">{filteredOffers.length} Verified Spots</p>
              <p className="text-xs text-[#484848]">Within {selectedCity} Metro Area</p>
            </div>
          </div>
        </div>

        {/* Nearby Offers */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Locating nearby spots...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id || offer.title} offer={offer} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}