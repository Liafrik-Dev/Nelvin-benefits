import React, { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Users, X, Sparkles } from "lucide-react";

export default function ROICalculatorModal({ isOpen, onClose }) {
  const [employeesTarget, setEmployeesTarget] = useState(500);
  const [avgDiscount, setAvgDiscount] = useState(15);
  const [avgTicket, setAvgTicket] = useState(40);

  if (!isOpen) return null;

  const estimatedRedemptions = Math.round(employeesTarget * 0.35);
  const totalGrossVolume = estimatedRedemptions * avgTicket;
  const estimatedSavings = Math.round(totalGrossVolume * (avgDiscount / 100));
  const estimatedPartnerPayout = totalGrossVolume - estimatedSavings;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#062B23] text-[#D6B56D] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#F5F1E8]">Partner ROI & Revenue Simulator</h3>
            <p className="text-xs text-slate-500">Estimate potential sales volume from Nelvin corporate users</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Target Corporate Audience Size</span>
              <span className="text-[#F5F1E8]">{employeesTarget} employees</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={employeesTarget}
              onChange={(e) => setEmployeesTarget(Number(e.target.value))}
              className="w-full accent-[#062B23]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Avg. Ticket (€)</label>
              <input
                type="number"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062B23]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount Rate (%)</label>
              <input
                type="number"
                value={avgDiscount}
                onChange={(e) => setAvgDiscount(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#062B23]"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-[#062B23] text-white p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D6B56D]">
            <Sparkles className="w-4 h-4" /> Projected Monthly Metrics
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-[11px] text-[#D6B56D] block">Est. Redemptions</span>
              <span className="text-xl font-extrabold text-white">{estimatedRedemptions} claims</span>
            </div>
            <div>
              <span className="text-[11px] text-[#D6B56D] block">Gross Sales Volume</span>
              <span className="text-xl font-extrabold text-[#D6B56D]">€{totalGrossVolume.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#D6B56D] block">Employee Savings</span>
              <span className="text-lg font-bold text-[#E5C77A]">€{estimatedSavings.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#D6B56D] block">Merchant Net Sales</span>
              <span className="text-lg font-bold text-white">€{estimatedPartnerPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#062B23] hover:bg-[#062B23]/90 text-white font-bold py-2.5 rounded-xl text-sm"
        >
          Close Calculator
        </button>
      </div>
    </div>
  );
}
