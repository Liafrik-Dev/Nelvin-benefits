import React, { useState, useEffect } from "react";
import { db } from "@/services/api/dataClient";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import OfferCard from "@/components/nelvin/OfferCard";
import { Heart, Trash2 } from "lucide-react";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavs() {
      if (!user?.id) { setLoading(false); return; }
      try {
        const favData = await db.entities.Favorite.filter({ user_id: user.id }).catch(() => []);
        setFavorites(favData);
        if (favData.length > 0) {
          const offerIds = favData.map((f) => f.offer_id);
          const allOffers = await db.entities.Offer.list("-created_date", 200).catch(() => []);
          setOffers(allOffers.filter((o) => offerIds.includes(o.id)));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadFavs();
  }, [user?.id]);

  const removeFavorite = async (offerId) => {
    const fav = favorites.find((f) => f.offer_id === offerId);
    if (fav?.id) {
      await db.entities.Favorite.delete(fav.id);
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
    }
  };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 text-xs font-bold uppercase">
              <Heart className="w-3.5 h-3.5 text-[#1B4F9C] fill-[#1B4F9C]" /> Saved Perks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
              Your Favorite Benefits
            </h1>
            <p className="text-ivory-muted text-sm mt-1">Quick access to deals and discounts you saved for later.</p>
          </div>
          <span className="text-xs font-bold bg-[#F4F4F4] text-ivory px-3 py-1.5 rounded-full">
            {offers.length} Saved
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading favorites...</div>
        ) : offers.length === 0 ? (
          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-lg bg-[#F9F8F7] text-[#1B4F9C] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ivory font-heading">No favorite deals yet</h3>
            <p className="text-ivory-muted text-xs">
              When browsing offers in the marketplace, click the heart icon on any deal card to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <div key={offer.id || offer.title} className="relative group">
                <OfferCard offer={offer} />
                <button
                  onClick={() => removeFavorite(offer.id)}
                  title="Remove from favorites"
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-[#F4F4F4] backdrop-blur rounded-full flex items-center justify-center text-[#1B4F9C] hover:bg-[#1B4F9C] hover:text-[#282828] transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}