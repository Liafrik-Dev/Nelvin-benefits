import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/services/api/dataClient";
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

const CATEGORY_IMAGES = {
  "Food & Dining": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "Travel & Stay": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "Health & Wellness": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  "Shopping & Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  "Financial Services": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
  "Electronics & Tech": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
  "Fitness & Sports": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
  "Lifestyle & Entertainment": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
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
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#1B4F9C] uppercase tracking-wider bg-[#FFFFFF] px-3 py-1 rounded-full">Explore By Category</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
            Benefit Categories
          </h1>
          <p className="text-ivory-muted text-sm mt-1">Browse verified corporate perks organized by department and lifestyle theme.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-ivory-dim">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listToRender.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.name] || Grid;
              const imgUrl = CATEGORY_IMAGES[cat.name] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80";
              return (
                <div
                  key={cat.id || cat.name}
                  onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="font-bold text-sm font-heading">{cat.name}</span>
                      <div className="w-8 h-8 rounded-xl bg-[#F4F4F4] backdrop-blur flex items-center justify-center text-[#1B4F9C]">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-ivory-muted line-clamp-2">
                      {cat.description || "Exclusive corporate offers and employee savings in this category."}
                    </p>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#1B4F9C]">
                      <span>{cat.count || 12}+ Perks Available</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
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