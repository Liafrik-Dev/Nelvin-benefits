import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import {
  Tag, TicketCheck, DollarSign, TrendingUp, Plus, QrCode, ArrowUpRight, Users
} from "lucide-react";

export default function BusinessDashboard() {
  const [stats, setStats] = useState({
    activeOffers: 6,
    totalRedemptions: 142,
    grossRevenue: 8450.0,
    payoutPending: 1250.0,
  });

  const recentRedemptions = [
    { id: "r1", customer: "Alex Johnson (Acme Corp)", offer: "25% Off Storewide", date: "10 mins ago", code: "NV-8841", amount: "$35.00" },
    { id: "r2", customer: "Sarah Connor (Cyberdyne)", offer: "Free Meal Upgrade", date: "1 hour ago", code: "NV-3310", amount: "$12.00" },
    { id: "r3", customer: "Michael Scott (Dunder Mifflin)", offer: "$20 Voucher", date: "3 hours ago", code: "NV-9902", amount: "$20.00" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Partner Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store performance, active offers, and redemption transactions.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/business/qr-codes"
            className="inline-flex items-center gap-1.5 bg-[#082F24] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-emerald-950 transition-colors"
          >
            <QrCode className="w-4 h-4" /> Scan QR Redemption
          </Link>
          <Link
            to="/business/offers/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Offer
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Active Offers</span>
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black font-heading text-gray-900">{stats.activeOffers}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">2 Pending approval</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Total Redemptions</span>
            <TicketCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-heading text-gray-900">{stats.totalRedemptions}</p>
          <p className="text-[11px] text-gray-500">+18% vs last month</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Gross Sales Generated</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black font-heading text-gray-900">${stats.grossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Via corporate members</p>
        </div>

        <div className="bg-[#082F24] rounded-2xl p-5 space-y-2 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60 uppercase">Pending Payout</span>
            <ArrowUpRight className="w-4 h-4 text-[#B8FF00]" />
          </div>
          <p className="text-2xl font-black font-heading text-[#B8FF00]">${stats.payoutPending.toLocaleString()}</p>
          <p className="text-[11px] text-white/60">Payout scheduled Friday</p>
        </div>
      </div>

      {/* Stream of Recent Redemptions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 font-heading">Recent Customer Redemptions</h2>
          <Link to="/business/redemptions" className="text-xs font-bold text-emerald-700 hover:underline">
            View All
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentRedemptions.map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900">{r.customer}</p>
                <p className="text-gray-500">{r.offer} · <span className="font-mono text-gray-700">{r.code}</span></p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-emerald-700">{r.amount}</p>
                <p className="text-gray-400 text-[10px]">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}