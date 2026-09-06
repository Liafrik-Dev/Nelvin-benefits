import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const categoryTabs = [
  { labelKey: "deals.tab.all", name: "" },
  { labelKey: "deals.tab.restaurants", name: "Restaurants & Cafés" },
  { labelKey: "deals.tab.hotels", name: "Hotels & Resorts" },
  { labelKey: "deals.tab.spa", name: "Beauty & Spa" },
  { labelKey: "deals.tab.tours", name: "Travel & Airlines" },
  { labelKey: "deals.tab.nightlife", name: "Entertainment" },
  { labelKey: "deals.tab.fashion", name: "Shopping & Fashion" },
];

export default function FeaturedDeals() {
  const { t } = useLanguage();
  const [active, setActive] = useState("deals.tab.all");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Offer.filter({ status: "active" }, "-created_date", 60).then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, []);

  const activeName = categoryTabs.find((c) => c.labelKey === active)?.name || "";
  const filtered = (activeName ? offers.filter((o) => o.category === activeName) : offers).slice(0, 6);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-2">{t('deals.eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">{t('deals.title')}</h2>
          <p className="text-gray-500 mt-2 text-sm">{t('deals.subtitle')}</p>
        </div>
        <Link to="/offers" className="text-emerald-700 font-semibold text-sm flex items-center gap-1 hover:underline whitespace-nowrap">
          {t('deals.browseAll')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categoryTabs.map((cat) => (
          <button
            key={cat.labelKey}
            onClick={() => setActive(cat.labelKey)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              active === cat.labelKey ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">{t('deals.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t('deals.empty')}</div>
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
                  {t('deals.redeem')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}