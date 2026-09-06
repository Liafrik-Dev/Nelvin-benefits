const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";

const categoryTabs = [
  { label: "All", name: "" },
  { label: "Restaurants", name: "Restaurants & Cafés" },
  { label: "Hotels", name: "Hotels & Resorts" },
  { label: "Spa & Beauty", name: "Beauty & Spa" },
  { label: "Tours", name: "Travel & Airlines" },
  { label: "Nightlife", name: "Entertainment" },
  { label: "Fashion", name: "Shopping & Fashion" },
];

export default function FeaturedDeals() {
  const [active, setActive] = useState("All");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Offer.filter({ status: "active" }, "-created_date", 60).then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, []);

  const activeName = categoryTabs.find((c) => c.label === active)?.name || "";
  const filtered = (activeName ? offers.filter((o) => o.category === activeName) : offers).slice(0, 6);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-2">Featured Offers</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">Hand-picked drops this week</h2>
          <p className="text-gray-500 mt-2 text-sm">New offers added daily from top brands across Africa.</p>
        </div>
        <Link to="/offers" className="text-emerald-700 font-semibold text-sm flex items-center gap-1 hover:underline whitespace-nowrap">
          Browse all offers <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categoryTabs.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActive(cat.label)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              active === cat.label ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading offers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No offers yet in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((deal) => (
            <Link
              to={`/offer/${deal.id}`}
              key={deal.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group block"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {deal.discount_label && <span className="bg-gray-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">{deal.discount_label}</span>}
                  {deal.tag && <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{deal.tag}</span>}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {deal.business_name?.[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{deal.business_name}</span>
                  </div>
                  {deal.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-gray-800">{deal.rating}</span>
                      <span className="text-xs text-gray-400">({deal.reviews})</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{deal.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {deal.city}, {deal.country}
                  </span>
                </div>
                <div className="bg-emerald-700 group-hover:bg-emerald-800 text-white py-2.5 rounded-full text-sm font-semibold text-center transition-colors">
                  Redeem Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}