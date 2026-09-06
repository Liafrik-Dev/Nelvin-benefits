import React from "react";
import { UserPlus, Search, QrCode, Wallet } from "lucide-react";

const steps = [
  { num: "01", icon: UserPlus, title: "Join in seconds", desc: "Sign up free and pick the plan that fits your lifestyle.", color: "bg-emerald-700" },
  { num: "02", icon: Search, title: "Discover offers", desc: "Browse thousands of hand-curated offers near you or across Africa.", color: "bg-rose-500" },
  { num: "03", icon: QrCode, title: "Redeem instantly", desc: "Show your QR code in-store or apply your voucher online.", color: "bg-emerald-700" },
  { num: "04", icon: Wallet, title: "Earn cashback", desc: "Watch your Nelvin wallet grow with every redemption and referral.", color: "bg-rose-500" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">Save in four simple steps.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.color}`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-4xl font-bold text-gray-100 font-heading">{step.num}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}