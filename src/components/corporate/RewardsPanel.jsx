import React, { useState } from "react";
import { Gift, Award, Trophy, Plus, Star } from "lucide-react";

export default function RewardsPanel({ company }) {
  const [feed] = useState([
    { id: "1", sender: "Sarah Connor (HR)", recipient: "Pamela A.", points: 250, reason: "Excellent client presentation in Q1", date: "Yesterday" },
    { id: "2", sender: "David Kim", recipient: "Michael S.", points: 100, reason: "Helped onboard the engineering team", date: "3 days ago" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Rewards & Recognition</h1>
          <p className="text-sm text-gray-500 mt-1">Manage peer praise point allocations, milestone awards, and company gift cards.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> Issue Points
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Monthly Recognition Pool</p>
          <p className="text-3xl font-black text-gray-900">50,000 Pts</p>
          <p className="text-xs text-emerald-700 font-semibold">12,400 Distributed this month</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Active Rewards Claimed</p>
          <p className="text-3xl font-black text-gray-900">142 Vouchers</p>
          <p className="text-xs text-gray-500">Value: $7,100</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Top Recognized Employee</p>
          <p className="text-lg font-bold text-gray-900">Pamela Anderson (Designer)</p>
          <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> 1,450 Points Earned
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 font-heading">Recent Recognition Stream</h3>
        <div className="space-y-3">
          {feed.map((item) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900"><span className="text-emerald-700">{item.sender}</span> awarded <span className="text-emerald-700">{item.recipient}</span></p>
                <p className="text-gray-500 italic mt-0.5">"{item.reason}"</p>
              </div>
              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">{item.points} Pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}