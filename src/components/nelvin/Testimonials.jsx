import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Nelvin paid for itself in the first weekend. I saved over ₦45,000 dining out and on a spa day — insane value.",
    name: "Amara Okonkwo",
    role: "Premium Member · Lagos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    quote: "The concierge booked me a suite in Zanzibar at half price. Nelvin genuinely elevated how I travel across Africa.",
    name: "Kwame Mensah",
    role: "VIP Member · Accra",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  },
  {
    quote: "From weekend brunches to kids activities and shopping, our whole family finally saves money on the things we love.",
    name: "Zainab El-Amin",
    role: "Family Plan · Cairo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Members Love Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">2.4M savers can't be wrong.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-800 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}