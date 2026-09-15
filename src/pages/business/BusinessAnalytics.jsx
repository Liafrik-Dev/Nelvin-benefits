import React, { useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Calculator } from "lucide-react";
import ROICalculatorModal from "@/components/business/ROICalculatorModal";

export default function BusinessAnalytics() {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Partner Sales Analytics</h1>
          <p className="text-sm text-ivory-muted mt-1">Deep insights into revenue generated, top selling items, and peak redemption days.</p>
        </div>
        <button
          onClick={() => setIsCalcOpen(true)}
          className="bg-[#FFFFFF] hover:bg-[#F9F8F7] text-[#0866FF] font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all"
        >
          <Calculator className="w-4 h-4" /> Simulate Partner ROI
        </button>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 shadow-sm text-center space-y-3">
        <BarChart3 className="w-12 h-12 text-[#0866FF] mx-auto" />
        <h3 className="text-lg font-bold font-heading text-ivory">Total GMV Generated: $48,200.00</h3>
        <p className="text-xs text-ivory-muted">Over 1,200 corporate redemptions processed in the last 12 months across all store branches.</p>
      </div>

      <ROICalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
}