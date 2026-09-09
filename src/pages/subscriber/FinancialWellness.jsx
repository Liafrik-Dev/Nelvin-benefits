import React, { useState } from "react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { DollarSign, ShieldCheck, TrendingUp, Calculator, Lock } from "lucide-react";

export default function FinancialWellness() {
  const [requestedAmount, setRequestedAmount] = useState(200);
  const [submitted, setSubmitted] = useState(false);

  const handleAdvanceRequest = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-[#082F24] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Financial Health & Salary On-Demand
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
              Financial Wellness & Earned Wage Access
            </h1>
            <p className="text-gray-500 text-sm">
              Access earned salary before payday with zero predatory interest rates, financial coaching, and emergency savings tools.
            </p>
          </div>
          <div className="bg-[#082F24] text-[#B8FF00] p-5 rounded-2xl text-center min-w-[220px]">
            <p className="text-xs uppercase font-bold text-white/60">Available Earned Salary</p>
            <p className="text-3xl font-black font-heading">$850.00</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Salary Advance Request */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold font-heading text-lg">
              <Calculator className="w-5 h-5 text-emerald-600" /> Instant Earned Salary Advance
            </div>
            <p className="text-xs text-gray-500">
              Select how much of your earned salary you wish to transfer to your Nelvin Wallet or bank account today.
            </p>

            <form onSubmit={handleAdvanceRequest} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                  <span>Transfer Amount</span>
                  <span className="text-emerald-700">${requestedAmount}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="850"
                  step="25"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Transfer Fee:</span>
                  <span className="font-bold text-gray-900">$1.50 flat fee</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payday Deduction:</span>
                  <span className="font-bold text-gray-900">${requestedAmount + 1.5}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#082F24] text-[#B8FF00] font-bold py-3.5 rounded-full text-xs hover:bg-emerald-950 transition-colors shadow-sm"
              >
                Transfer ${requestedAmount} Now
              </button>
              {submitted && (
                <p className="text-xs font-bold text-emerald-700 text-center">
                  Transfer submitted! Funds will arrive in your wallet shortly.
                </p>
              )}
            </form>
          </div>

          {/* Financial Perks */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-base font-heading">Free 1-on-1 Financial Coaching</h3>
                <p className="text-xs text-gray-500">Book free 30-minute consultation sessions with certified financial planners.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-base font-heading">High-Yield Emergency Fund</h3>
                <p className="text-xs text-gray-500">Automate high-interest savings directly from your monthly paycheck.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 text-base font-heading">Zero Interest Rate Guarantee</h3>
                <p className="text-xs text-gray-500">Nelvin earned wage transfers never charge interest or hidden penalties.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}