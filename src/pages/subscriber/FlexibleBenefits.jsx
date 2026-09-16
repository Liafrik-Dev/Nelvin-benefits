import React from "react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Sparkles, Utensils, Bus, HeartPulse, GraduationCap, CheckCircle } from "lucide-react";

export default function FlexibleBenefits() {
  const buckets = [
    { title: "Meal & Groceries", icon: Utensils, limit: "$150/mo", spent: "$85.00", color: "bg-[#FFFFFF] text-ivory" },
    { title: "Commute & Travel", icon: Bus, limit: "$100/mo", spent: "$40.00", color: "bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20" },
    { title: "Health & Gym", icon: HeartPulse, limit: "$120/mo", spent: "$120.00", color: "bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20" },
    { title: "Learning & Upskilling", icon: GraduationCap, limit: "$200/yr", spent: "$50.00", color: "bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20" },
  ];

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#1B4F9C] text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#1B4F9C]" /> Flexible Spending Allowances
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory font-heading">
              My Flexible Benefits & Stipends
            </h1>
            <p className="text-ivory-muted text-sm">Allocate your company benefit budget across meal cards, fitness, learning, and transportation.</p>
          </div>
          <div className="bg-[#FFFFFF] text-[#1B4F9C] p-5 rounded-lg text-center min-w-[200px]">
            <p className="text-xs uppercase font-bold text-[#484848]">Annual Flex Budget</p>
            <p className="text-3xl font-black font-heading">$1,200.00</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buckets.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${b.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-ivory-dim">Limit: {b.limit}</span>
                </div>
                <div>
                  <h3 className="font-bold text-ivory text-lg font-heading">{b.title}</h3>
                  <p className="text-xs text-ivory-muted mt-1">Used: <span className="font-bold text-ivory">{b.spent}</span></p>
                </div>
                <div className="w-full bg-[#F4F4F4] rounded-full h-2">
                  <div className="bg-[#FFFFFF] h-2 rounded-full" style={{ width: "60%" }} />
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#1B4F9C] font-bold">
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