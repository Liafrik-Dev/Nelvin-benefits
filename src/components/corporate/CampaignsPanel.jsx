import React, { useState } from "react";
import { Sparkles, Plus, Calendar, Target } from "lucide-react";

export default function CampaignsPanel({ company }) {
  const [campaigns] = useState([
    { id: "c1", title: "Q2 Mental Health & Wellness Month", goal: "100% Gym Pass Adoption", participants: 180, status: "active" },
    { id: "c2", title: "Eco-Friendly Commute Stipend Challenge", goal: "Promote public transit vouchers", participants: 95, status: "active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Internal Wellness Campaigns</h1>
          <p className="text-sm text-ivory-muted mt-1">Run engagement initiatives and benefit uptake challenges for employees.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D6B56D] bg-[#0A3A2F] px-2.5 py-0.5 rounded-full uppercase">{c.status}</span>
              <Sparkles className="w-4 h-4 text-[#D6B56D]" />
            </div>
            <h3 className="font-bold text-ivory text-lg font-heading">{c.title}</h3>
            <p className="text-xs text-ivory-muted">Goal: {c.goal}</p>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-ivory">
              <span>{c.participants} Enrolled Employees</span>
              <button className="text-[#D6B56D] hover:underline">View Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}