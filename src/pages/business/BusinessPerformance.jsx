import React from "react";
import { TrendingUp, Eye, MousePointerClick, CheckCircle } from "lucide-react";

export default function BusinessPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Offer Conversion & CTR</h1>
        <p className="text-sm text-ivory-muted mt-1">Analyze impression views, clicks, and redemption conversion rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-2 shadow-sm">
          <Eye className="w-6 h-6 text-[#0866FF]" />
          <p className="text-xs font-bold text-ivory-dim uppercase">Offer Views</p>
          <p className="text-3xl font-black font-heading text-ivory">14,250</p>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-2 shadow-sm">
          <MousePointerClick className="w-6 h-6 text-[#0866FF]" />
          <p className="text-xs font-bold text-ivory-dim uppercase">Clicks</p>
          <p className="text-3xl font-black font-heading text-ivory">3,840</p>
          <p className="text-xs text-[#0866FF] font-bold">26.9% CTR</p>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-2 shadow-sm">
          <CheckCircle className="w-6 h-6 text-[#0866FF]" />
          <p className="text-xs font-bold text-ivory-dim uppercase">Successful Redemptions</p>
          <p className="text-3xl font-black font-heading text-ivory">842</p>
          <p className="text-xs text-[#0866FF] font-bold">21.9% Conversion</p>
        </div>
      </div>
    </div>
  );
}