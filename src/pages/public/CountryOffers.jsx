import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { findCountryBySlug } from "@/lib/nelvinData";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import OfferCard from "@/components/nelvin/OfferCard";

export default function CountryOffers() {
  const { countrySlug } = useParams();
  const country = findCountryBySlug(countrySlug);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!country) return;
    setLoading(true);
    db.entities.Offer.filter({ country: country.name, status: "active" }, "-created_date", 100)
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch(() => {
        setOffers([]);
        setLoading(false);
      });
  }, [countrySlug]);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-[#484848] hover:text-[#282828] text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#282828]">
            {country?.flag} {country?.name || "Country"}
          </h1>
          <p className="text-[#484848] mt-2">{offers.length} offers available</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-ivory-dim">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 text-ivory-dim">No offers available in this country yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}