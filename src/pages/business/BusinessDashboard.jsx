import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import {
  Tag,
  TicketCheck,
  DollarSign,
  TrendingUp,
  Plus,
  QrCode,
  ArrowUpRight,
  Users,
  Eye,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Store,
  MapPin,
  Building2
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    activeOffers: 8,
    totalRedemptions: 342,
    grossRevenue: 18450.0,
    payoutPending: 2850.0,
    storeViews: 4210,
    avgDiscount: "22%"
  });

  const chartData = [
    { day: "Mon", sales: 1200, redemptions: 18 },
    { day: "Tue", sales: 1900, redemptions: 24 },
    { day: "Wed", sales: 1600, redemptions: 20 },
    { day: "Thu", sales: 2400, redemptions: 32 },
    { day: "Fri", sales: 3800, redemptions: 48 },
    { day: "Sat", sales: 4200, redemptions: 54 },
    { day: "Sun", sales: 3300, redemptions: 40 },
  ];

  const recentRedemptions = [
    { id: "r1", customer: "Alex Johnson", company: "Acme Corp", offer: "25% Off Storewide", date: "10 mins ago", code: "NV-8841", amount: "$35.00", location: "Downtown Flagship" },
    { id: "r2", customer: "Sarah Connor", company: "Cyberdyne Systems", offer: "Free Meal Upgrade", date: "1 hour ago", code: "NV-3310", amount: "$12.00", location: "Tech Park Hub" },
    { id: "r3", customer: "Michael Scott", company: "Dunder Mifflin", offer: "$20 Voucher", date: "3 hours ago", code: "NV-9902", amount: "$20.00", location: "Downtown Flagship" },
    { id: "r4", customer: "Elena Rostova", company: "Global Logistics", offer: "Buy 1 Get 1 Free", date: "5 hours ago", code: "NV-4412", amount: "$28.50", location: "Metro Mall Outlet" },
  ];

  return (
    <div className="space-y-8 font-sans text-[#282828]">
      {/* Premium Store Partner Header */}
      <div className="rounded-xl bg-gradient-to-r from-black via-[#FFFFFF] to-black text-white p-6 sm:p-8 shadow-2xl border border-[#F1F1F1] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#0866FF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F4] text-[#0866FF] border border-[#0866FF]/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-[#0866FF]" /> Verified Merchant Partner
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-white">
              Gourmet Bistro & Retail Hub
            </h1>

            <p className="text-[#282828] text-xs sm:text-sm max-w-xl flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#0866FF]" /> 3 Active Locations · <Users className="w-3.5 h-3.5 text-[#0866FF]" /> 1,240 Corporate Customers Reached
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/business/qr-codes"
              className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0866FF] text-white font-extrabold text-xs px-5 py-3 rounded-full shadow-lg shadow-[#0866FF]/20 transition-all"
            >
              <QrCode className="w-4 h-4" /> Scan QR Redemption
            </Link>

            <Link
              to="/business/offers/new"
              className="inline-flex items-center gap-2 bg-[#F4F4F4] hover:bg-[#F4F4F4] text-white font-extrabold text-xs px-5 py-3 rounded-full border border-[#E3E3E3] backdrop-blur-md transition-all"
            >
              <Plus className="w-4 h-4 text-[#0866FF]" /> Create New Offer
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ivory-dim uppercase tracking-wider">Active Offers</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] text-[#0866FF] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-ivory">{stats.activeOffers}</p>
            <p className="text-xs text-[#0866FF] font-extrabold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 2 Pending Admin Approval
            </p>
          </div>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ivory-dim uppercase tracking-wider">Total Redemptions</span>
            <div className="w-9 h-9 rounded-xl bg-[#F9F8F7] text-[#0866FF] flex items-center justify-center">
              <TicketCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-ivory">{stats.totalRedemptions}</p>
            <p className="text-xs text-[#0866FF] font-extrabold flex items-center gap-1 mt-1">
              +24% vs last month
            </p>
          </div>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ivory-dim uppercase tracking-wider">Gross Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] text-[#0866FF] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-ivory">${stats.grossRevenue.toLocaleString()}</p>
            <p className="text-xs text-ivory-muted font-semibold mt-1">Generated via corporate employees</p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl p-6 space-y-3 text-white shadow-2xl relative overflow-hidden border border-[#0866FF]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#484848] uppercase tracking-wider">Pending Payout</span>
            <div className="w-9 h-9 rounded-xl bg-[#0866FF]/20 text-[#0866FF] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-[#0866FF]">${stats.payoutPending.toLocaleString()}</p>
            <p className="text-xs text-[#484848] font-medium mt-1">Scheduled payout: Friday, Sep 15</p>
          </div>
        </div>
      </div>

      {/* Interactive Store Analytics & Performance Chart */}
      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F1F1] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0866FF] tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Store Analytics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-ivory">
              Weekly Revenue & Redemption Volume
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#F4F4F4] p-1 rounded-full">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "overview" ? "bg-[#FFFFFF] text-[#0866FF]" : "text-ivory-muted hover:text-ivory"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setActiveTab("volume")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "volume" ? "bg-[#FFFFFF] text-[#0866FF]" : "text-ivory-muted hover:text-ivory"
              }`}
            >
              Volume (Qty)
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "overview" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  cursor={{ fill: "rgba(8, 102, 255, 0.04)" }}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "none", color: "#282828" }}
                  formatter={(v) => [`$${v}`, "Gross Revenue"]}
                />
                <Bar dataKey="sales" fill="#0866FF" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "none", color: "#282828" }}
                  formatter={(v) => [`${v} redemptions`, "Volume"]}
                />
                <Line type="monotone" dataKey="redemptions" stroke="#0866FF" strokeWidth={3} dot={{ r: 4, fill: "#FFFFFF" }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stream of Recent Customer Redemptions */}
      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ivory font-heading">Recent Customer Redemptions</h2>
            <p className="text-xs text-ivory-muted mt-0.5">Live feed of corporate members redeeming offers at your outlets.</p>
          </div>
          <Link to="/business/redemptions" className="text-xs font-extrabold text-[#0866FF] hover:text-[#282828] flex items-center gap-1">
            View All Log <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-[#F1F1F1]">
          {recentRedemptions.map((r) => (
            <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F9F8F7]/80 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#0866FF] font-black text-sm flex items-center justify-center shrink-0">
                  {r.customer.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-sm text-ivory">{r.customer}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#0866FF] text-[10px] font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-ivory-muted flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-ivory-dim" /> {r.company} · <MapPin className="w-3 h-3 text-ivory-dim" /> {r.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                <div>
                  <span className="font-mono text-xs font-bold bg-[#F4F4F4] px-2.5 py-1 rounded-lg text-ivory">{r.code}</span>
                  <p className="text-[10px] text-ivory-dim mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {r.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-base text-[#0866FF]">{r.amount}</p>
                  <p className="text-[11px] text-ivory-muted">{r.offer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}