import React from "react";
import { Building2, Tag, Globe, Users } from "lucide-react";

const stats = [
  { icon: Building2, value: "20K", suffix: "+", label: "Partner Brands" },
  { icon: Tag, value: "500K", suffix: "+", label: "Exclusive Offers", highlight: true },
  { icon: Globe, value: "54", suffix: "", label: "African Countries" },
  { icon: Users, value: "2.4M", suffix: "+", label: "Members Saving" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#faf8f5] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">
          Africa's Largest Savings Network
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-gray-900">
          One membership. A continent of savings.
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          From street-food gems in Accra to five-star escapes in Cape Town — Nelvin unlocks it all.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 text-left ${
              stat.highlight
                ? "border-2 border-emerald-200 bg-white"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              stat.highlight ? "bg-emerald-700" : "bg-emerald-700"
            }`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">{stat.value}</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-500">{stat.suffix}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}