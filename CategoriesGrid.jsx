import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Building2, Plane, Film, ShoppingBag, Sparkles, Heart, Dumbbell, BookOpen, Car, Briefcase, Home, ArrowRight } from "lucide-react";
import PdfCategoryImage, { CATEGORY_PDF_PAGE } from "@/components/nelvin/PdfCategoryImage";

const categories = [
  { name: "Restaurants & Cafés", slug: "restaurants-cafes", desc: "Fine dining, cafés & everyday bites", count: "1,247 offers", icon: UtensilsCrossed, accent: false },
  { name: "Hotels & Resorts", slug: "hotels-resorts", desc: "Luxury stays and city escapes", count: "638 offers", icon: Building2, accent: false },
  { name: "Travel & Airlines", slug: "travel-airlines", desc: "Flights, cars & holiday packages", count: "412 offers", icon: Plane, accent: true },
  { name: "Entertainment", slug: "entertainment", desc: "Cinemas, theme parks & shows", count: "289 offers", icon: Film, accent: false },
  { name: "Shopping & Fashion", slug: "shopping-fashion", desc: "Fashion, electronics & lifestyle", count: "951 offers", icon: ShoppingBag, accent: false },
  { name: "Beauty & Spa", slug: "beauty-spa", desc: "Salons, spas & wellness retreats", count: "476 offers", icon: Sparkles, accent: "yellow" },
  { name: "Healthcare", slug: "healthcare", desc: "Clinics, pharmacies & hospitals", count: "328 offers", icon: Heart, accent: false },
  { name: "Fitness & Sports", slug: "fitness-sports", desc: "Gyms, studios & sports clubs", count: "214 offers", icon: Dumbbell, accent: "dark" },
  { name: "Education", slug: "education", desc: "Courses, tutoring & training", count: "187 offers", icon: BookOpen, accent: false },
  { name: "Automotive", slug: "automotive", desc: "Fuel stations, service & rentals", count: "145 offers", icon: Car, accent: false },
  { name: "Professional Services", slug: "professional-services", desc: "Legal, finance & consulting", count: "98 offers", icon: Briefcase, accent: false },
  { name: "Home Services", slug: "home-services", desc: "Cleaning, repairs & installations", count: "76 offers", icon: Home, accent: false },
];

const getCardStyles = (accent) => {
  if (accent === true) return "bg-emerald-700 text-white";
  if (accent === "yellow") return "bg-amber-50 text-gray-900";
  if (accent === "dark") return "bg-gray-900 text-white";
  return "bg-white text-gray-900 border border-gray-100";
};

const getIconBg = (accent) => {
  if (accent === true) return "bg-emerald-600";
  if (accent === "yellow") return "bg-emerald-100";
  if (accent === "dark") return "bg-rose-500";
  return "bg-emerald-50";
};

const getIconColor = (accent) => (accent === true || accent === "dark" ? "text-white" : "text-emerald-700");
const getDescColor = (accent) => (accent === true || accent === "dark" ? "text-white/70" : "text-gray-500");
const getCountColor = (accent) => (accent === true ? "text-white/80" : accent === "dark" ? "text-rose-300" : "text-emerald-700");

export default function CategoriesGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#faf8f5]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <Link
            to={`/category/${cat.slug}`}
            key={i}
            className={`rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all group block ${getCardStyles(cat.accent)}`}
          >
            {CATEGORY_PDF_PAGE[cat.slug] && (
              <div className="w-full h-28 rounded-xl overflow-hidden mb-4 bg-black/5">
                <PdfCategoryImage slug={cat.slug} className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${getIconBg(cat.accent)}`}>
              <cat.icon className={`w-5 h-5 ${getIconColor(cat.accent)}`} />
            </div>
            <h3 className="font-bold text-base mb-1">{cat.name}</h3>
            <p className={`text-xs mb-3 ${getDescColor(cat.accent)}`}>{cat.desc}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${getCountColor(cat.accent)}`}>{cat.count}</span>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}