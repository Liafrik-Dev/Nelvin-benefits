import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { CATEGORIES, COUNTRIES } from "@/lib/nelvinData";
import { useLanguage } from "@/lib/i18n";

const categoryIcons = {
  "restaurants-cafes": "🍽️",
  "hotels-resorts": "🏨",
  "travel-airlines": "✈️",
  entertainment: "🎬",
  "shopping-fashion": "🛍️",
  "beauty-spa": "💄",
  healthcare: "🏥",
  "fitness-sports": "💪",
  education: "🎓",
  automotive: "🚗",
  "professional-services": "💼",
  "home-services": "🏠"
};

const quickLinks = [
{ labelKey: "hero.quick.restaurants", slug: "restaurants-cafes" },
{ labelKey: "hero.quick.hotels", slug: "hotels-resorts" },
{ labelKey: "hero.quick.shopping", slug: "shopping-fashion" },
{ labelKey: "hero.quick.entertainment", slug: "entertainment" },
{ labelKey: "hero.quick.healthcare", slug: "healthcare" },
{ labelKey: "hero.quick.fitness", slug: "fitness-sports" },
{ labelKey: "hero.quick.spa", slug: "beauty-spa" },
{ labelKey: "hero.quick.travel", slug: "travel-airlines" }];

export default function HeroSearchPanel() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    if (category) navigate(`/category/${category}`);else
    if (country) navigate(`/country/${country}`);else
    navigate("/offers");
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-none">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
          <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none">
            
            <option value="">{t('hero.allCountries')}</option>
            {COUNTRIES.map((c) =>
            <option key={c.slug} value={c.slug}>
                {c.flag} {c.name}
              </option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
          <ChevronDown className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none">
            
            <option value="">{t('hero.allCategories')}</option>
            {CATEGORIES.map((c) =>
            <option key={c.slug} value={c.slug}>
                {categoryIcons[c.slug] || "•"} {c.name}
              </option>
            )}
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="bg-emerald-700 hover:bg-emerald-800 text-white w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
          
          <Search className="w-4 h-4" />
          {t('hero.search')}
        </button>
      </div>

      <div className="px-4 pb-4 flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
        <Link to="/offers" className="text-xs bg-emerald-700 text-white px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 hover:bg-emerald-800 transition-colors">
          {t('hero.exploreAll')}
        </Link>
        {quickLinks.map((link) =>
        <Link
          key={link.slug}
          to={`/category/${link.slug}`}
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 hover:bg-gray-200 transition-colors">
          
            {t(link.labelKey)}
          </Link>
        )}
      </div>
    </div>);

}