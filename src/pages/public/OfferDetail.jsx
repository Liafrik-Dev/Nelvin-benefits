import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import { Star, MapPin, Clock, Tag, CheckCircle2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import { toast } from "@/components/ui/use-toast";

export default function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, navigateToLogin } = useAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    db.entities.Offer.get(offerId)
      .then((data) => {
        setOffer(data);
        setLoading(false);
      })
      .catch(() => {
        setOffer(null);
        setLoading(false);
      });
  }, [offerId]);

  const handleRedeem = async () => {
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }
    setRedeeming(true);
    if (!user?.id) {
      navigateToLogin();
      return;
    }
    await db.entities.Redemption.create({
      offer_id: offer.id,
      offer_title: offer.title,
      business_name: offer.business_name,
      business_id: offer.business_id || "",
      savings_amount: offer.savings_amount || 0,
      country: offer.country,
      user_id: user.id,
      company_id: user.company_id || "",
      status: "issued",
    });
    await db.entities.Notification.create({
      title: "Offer redeemed",
      message: `You redeemed "${offer.title}" at ${offer.business_name}.`,
      type: "offer",
      channel: "system",
      audience: "specific_users",
      target_user_id: user?.id,
      recipient_email: user?.email,
    });
    db.integrations.Core.SendEmail({
      to: user.email,
      subject: "Your Nelvin offer is confirmed",
      body: `Hi ${user.full_name || "there"},\n\nYou've successfully redeemed "${offer.title}" at ${offer.business_name}. Show this confirmation or your QR code in-store.\n\nHappy saving!\nThe Nelvin Team`,
    });
    if (typeof window !== "undefined" && "Notification" in window) {
      if (window.Notification.permission === "granted") {
        new window.Notification("Offer redeemed!", { body: offer.title });
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission();
      }
    }
    toast({ title: "Offer redeemed!", description: "Check your email for confirmation." });
    setRedeemed(true);
    setRedeeming(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest">
        <div className="relative bg-[#062B23] pt-24 pb-10 px-4">
          <Navbar />
        </div>
        <div className="py-24 text-center text-ivory-dim">Loading offer...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-forest">
        <div className="relative bg-[#062B23] pt-24 pb-10 px-4">
          <Navbar />
        </div>
        <div className="py-24 text-center text-ivory-dim">Offer not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-6 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative rounded-lg overflow-hidden h-80">
            <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
            {offer.discount_label && (
              <span className="absolute top-4 left-4 bg-[#062B23]/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {offer.discount_label}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-ivory mt-6">{offer.title}</h1>
          <p className="text-ivory-muted mt-3 leading-relaxed">{offer.description}</p>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 sticky top-24">
            <p className="font-semibold text-ivory">{offer.business_name}</p>
            <div className="flex items-center gap-3 text-sm text-ivory-dim mt-2">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#D6B56D] text-[#E5C77A]" />
                {offer.rating} ({offer.reviews})
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-ivory-muted mt-2">
              <MapPin className="w-3.5 h-3.5" />
              {offer.city}, {offer.country}
            </div>
            {offer.expires_date && (
              <div className="flex items-center gap-1 text-sm text-ivory-muted mt-1">
                <Clock className="w-3.5 h-3.5" />
                Expires {new Date(offer.expires_date).toLocaleDateString()}
              </div>
            )}
            {offer.savings_amount > 0 && (
              <div className="mt-4 bg-[#0A3A2F] rounded-xl p-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D6B56D]" />
                <span className="text-sm font-semibold text-[#D6B56D]">Save ₦{offer.savings_amount.toLocaleString()}</span>
              </div>
            )}
            {redeemed ? (
              <div className="mt-6 bg-[#D6B56D] text-white rounded-full py-3 text-center font-semibold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Redeemed!
              </div>
            ) : (
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="mt-6 w-full bg-[#D6B56D] hover:bg-[#E5C77A] text-white rounded-full py-3 font-semibold text-sm"
              >
                {redeeming ? "Redeeming..." : isAuthenticated ? "Redeem Now" : "Log in to Redeem"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}