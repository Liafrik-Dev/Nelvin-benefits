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

/**
 * Offer card — the reference's offer tiles: image-led, a badge row, then
 * merchant/rating and location, closing on a single full-width action.
 */
export default function OfferCard({ offer }) {
  const imageUrl = getOfferImage(offer);

  return (
    <Link
      to={`/offer/${offer.id}`}
      className="card-nv card-nv-interactive group block overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={offer.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {offer.discount_label && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-white">
              {offer.discount_label}
            </span>
          )}
          {offer.tag && (
            <span className="rounded-full border border-[#E3E3E3] bg-[#FFFFFF]/80 px-2.5 py-1 text-xs font-medium text-ivory backdrop-blur">
              {offer.tag}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="truncate text-sm font-medium text-ivory-muted">{offer.business_name}</span>
          {offer.rating && (
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-sm font-semibold text-ivory">{offer.rating}</span>
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 font-bold text-ivory">{offer.title}</h3>

        <p className="mb-4 flex items-center gap-1 text-xs text-ivory-dim">
          <MapPin className="h-3 w-3" />
          {offer.city || "Lagos"}, {offer.country || "Nigeria"}
        </p>

        <span className="block rounded-lg bg-gold py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-[#1B4F9C]">
          View offer
        </span>
      </div>
    </Link>
  );
}