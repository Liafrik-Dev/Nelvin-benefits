import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Grid, Utensils, Plane, HeartPulse, ShoppingBag, ShieldCheck, Laptop, Dumbbell, Sparkles, ArrowRight } from "lucide-react";

const CATEGORY_ICONS = {
  "Food & Dining": Utensils,
  "Travel & Stay": Plane,
  "Health & Wellness": HeartPulse,
  "Shopping & Fashion": ShoppingBag,
  "Financial Services": ShieldCheck,
  "Electronics & Tech": Laptop,
  "Fitness & Sports": Dumbbell,
  "Lifestyle & Entertainment": Sparkles,
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    db.entities.Category.list("name", 100)
      .then((data) => {
        setCategories(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const defaultCategories = [
    { name: "Food & Dining", slug: "food-dining", count: 48, description: "Restaurants, cafes, delivery, and corporate meal vouchers." },
    { name: "Travel & Stay", slug: "travel-stay", count: 32, description: "Hotels, flights, car rentals, and holiday getaways." },
    { name: "Health & Wellness", slug: "health-wellness", count: 56, description: "Gym memberships, spa retreats, and health checkups." },
    { name: "Shopping & Fashion", slug: "shopping-fashion", count: 84, description: "Top global & local retail brands, clothing, and accessories." },
    { name: "Financial Services", slug: "financial-services", count: 21, description: "Salary advances, insurance discounts, and financial advice." },
    { name: "Electronics & Tech", slug: "electronics-tech", count: 39, description: "Smartphones, laptops, home appliances, and gadgets." },
    { name: "Fitness & Sports", slug: "fitness-sports", count: 27, description: "Personal trainers, sports gear, and yoga studios." },
    { name: "Lifestyle & Entertainment", slug: "lifestyle-entertainment", count: 42, description: "Cinemas, concerts, events, and family activities." },
  ];

  const listToRender = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Explore By Category</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-heading">
            Benefit Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">Browse verified corporate perks organized by department and lifestyle theme.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listToRender.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.name] || Grid;
              const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <div
                  key={cat.id || cat.name}
                  onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-[#082F24] group-hover:text-[#B8FF00] transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors font-heading">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {cat.description || "Exclusive corporate offers and employee savings in this category."}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-emerald-700 mt-4">
                    <span>{cat.count || 12}+ Perks Available</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}