import React from "react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Sparkles, Utensils, Bus, HeartPulse, GraduationCap, CheckCircle } from "lucide-react";

export default function FlexibleBenefits() {
  const buckets = [
    { title: "Meal & Groceries", icon: Utensils, limit: "$150/mo", spent: "$85.00", color: "bg-emerald-50 text-emerald-700" },
    { title: "Commute & Travel", icon: Bus, limit: "$100/mo", spent: "$40.00", color: "bg-amber-50 text-amber-700" },
    { title: "Health & Gym", icon: HeartPulse, limit: "$120/mo", spent: "$120.00", color: "bg-rose-50 text-rose-700" },
    { title: "Learning & Upskilling", icon: GraduationCap, limit: "$200/yr", spent: "$50.00", color: "bg-indigo-50 text-indigo-700" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Flexible Spending Allowances
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
              My Flexible Benefits & Stipends
            </h1>
            <p className="text-gray-500 text-sm">Allocate your company benefit budget across meal cards, fitness, learning, and transportation.</p>
          </div>
          <div className="bg-[#082F24] text-[#B8FF00] p-5 rounded-2xl text-center min-w-[200px]">
            <p className="text-xs uppercase font-bold text-white/60">Annual Flex Budget</p>
            <p className="text-3xl font-black font-heading">$1,200.00</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buckets.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">Limit: {b.limit}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg font-heading">{b.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Used: <span className="font-bold text-gray-900">{b.spent}</span></p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#082F24] h-2 rounded-full" style={{ width: "60%" }} />
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4" /> Auto-reimbursed via Nelvin Card
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}