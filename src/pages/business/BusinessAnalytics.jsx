import React from "react";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";

export default function BusinessAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Partner Sales Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Deep insights into revenue generated, top selling items, and peak redemption days.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center space-y-3">
        <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold font-heading text-gray-900">Total GMV Generated: $48,200.00</h3>
        <p className="text-xs text-gray-500">Over 1,200 corporate redemptions processed in the last 12 months across all store branches.</p>
      </div>
    </div>
  );
}