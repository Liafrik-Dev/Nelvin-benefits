import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

function getOfferImage(offer) {
  if (offer.image_url) return offer.image_url;

  const cat = (offer.category || "").toLowerCase();
  const title = (offer.title || "").toLowerCase();

  if (cat.includes("food") || cat.includes("dining") || title.includes("meal") || title.includes("eat")) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("travel") || cat.includes("stay") || title.includes("hotel") || title.includes("flight")) {
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("health") || cat.includes("wellness") || cat.includes("fitness") || title.includes("gym")) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("tech") || cat.includes("electronics") || title.includes("phone") || title.includes("laptop")) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("shopping") || cat.includes("fashion") || title.includes("shoe") || title.includes("nike")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
}

export default function OfferCard({ offer }) {
  const imageUrl = getOfferImage(offer);

  return (
    <Link
      to={`/offer/${offer.id}`}
      className="bg-emerald-black rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-[#D6B56D]/40 hover:shadow-xl transition-shadow group block"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {offer.discount_label && (
            <span className="bg-[#062B23]/85 text-[#E5C77A] text-xs font-bold px-2.5 py-1 rounded-full">
              {offer.discount_label}
            </span>
          )}
          {offer.tag && (
            <span className="bg-emerald-black/90 text-ivory text-xs font-medium px-2.5 py-1 rounded-full">
              {offer.tag}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ivory">{offer.business_name}</span>
          {offer.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-ivory">{offer.rating}</span>
            </div>
          )}
        </div>
        <h3 className="font-bold text-ivory mb-2 line-clamp-2">{offer.title}</h3>
        <div className="flex items-center gap-1 text-xs text-ivory-dim mb-4">
          <MapPin className="w-3 h-3" /> {offer.city || "Lagos"}, {offer.country || "Nigeria"}
        </div>
        <div className="bg-[#D6B56D] group-hover:bg-[#E5C77A] text-[#062B23] text-center py-2.5 rounded-lg text-sm font-semibold transition-colors">
          View Offer
        </div>
      </div>
    </Link>
  );
}