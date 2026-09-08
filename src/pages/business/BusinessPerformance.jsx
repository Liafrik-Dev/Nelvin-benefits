import React from "react";
import { TrendingUp, Eye, MousePointerClick, CheckCircle } from "lucide-react";

export default function BusinessPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Offer Conversion & CTR</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze impression views, clicks, and redemption conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <Eye className="w-6 h-6 text-emerald-600" />
          <p className="text-xs font-bold text-gray-400 uppercase">Offer Views</p>
          <p className="text-3xl font-black font-heading text-gray-900">14,250</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <MousePointerClick className="w-6 h-6 text-indigo-600" />
          <p className="text-xs font-bold text-gray-400 uppercase">Clicks</p>
          <p className="text-3xl font-black font-heading text-gray-900">3,840</p>
          <p className="text-xs text-indigo-700 font-bold">26.9% CTR</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <CheckCircle className="w-6 h-6 text-amber-500" />
          <p className="text-xs font-bold text-gray-400 uppercase">Successful Redemptions</p>
          <p className="text-3xl font-black font-heading text-gray-900">842</p>
          <p className="text-xs text-emerald-700 font-bold">21.9% Conversion</p>
        </div>
      </div>
    </div>
  );
}