const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

export default function OfferCard({ offer }) {
  return (
    <Link
      to={`/offer/${offer.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group block">
      
      <div className="relative h-48 overflow-hidden">
        <img src="https://media.db.com/images/public/6a5398f7ed23004e65369928/d5151c2bd_12019-lobby-398845_1920.jpg"

        alt={offer.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {offer.discount_label &&
          <span className="bg-gray-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">{offer.discount_label}</span>
          }
          {offer.tag &&
          <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{offer.tag}</span>
          }
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{offer.business_name}</span>
          {offer.rating &&
          <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-800">{offer.rating}</span>
            </div>
          }
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{offer.title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <MapPin className="w-3 h-3" /> {offer.city}, {offer.country}
        </div>
        <div className="bg-emerald-700 group-hover:bg-emerald-800 text-white text-center py-2.5 rounded-full text-sm font-semibold transition-colors">
          View Offer
        </div>
      </div>
    </Link>);

}