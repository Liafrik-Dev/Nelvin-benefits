import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { findCategoryBySlug } from "@/lib/nelvinData";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import OfferCard from "@/components/nelvin/OfferCard";

export default function CategoryOffers() {
  const { categorySlug } = useParams();
  const category = findCategoryBySlug(categorySlug);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    db.entities.Offer.filter({ category: category.name, status: "active" }, "-created_date", 100).then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, [categorySlug]);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-gray-900 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">{category?.name || "Category"}</h1>
          <p className="text-white/60 mt-2">{offers.length} offers available</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No offers available in this category yet.</div>
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