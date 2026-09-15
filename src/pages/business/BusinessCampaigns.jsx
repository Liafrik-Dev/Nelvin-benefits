import React from "react";
import { Megaphone, Plus, Sparkles } from "lucide-react";

export default function BusinessCampaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Merchant Promotional Campaigns</h1>
          <p className="text-sm text-ivory-muted mt-1">Request featured banners or push notifications on Nelvin employee apps.</p>
        </div>
        <button className="bg-[#0866FF] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Request Featured Placement
        </button>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 text-center space-y-3 shadow-sm max-w-xl mx-auto">
        <Sparkles className="w-10 h-10 text-[#0866FF] mx-auto" />
        <h3 className="text-lg font-bold text-ivory font-heading">Boost Your Store Reach</h3>
        <p className="text-xs text-ivory-muted">
          Get your deals placed at the top of the Employee Explore page or send targeted pushes to corporate members near your branches.
        </p>
      </div>
    </div>
  );
}