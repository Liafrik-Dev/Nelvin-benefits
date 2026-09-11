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
    <div className="space-y-8 font-sans text-[#082F24]">
      {/* Premium Store Partner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#082F24] via-[#0D4435] to-[#082F24] text-white p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#B8FF00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#B8FF00] border border-[#B8FF00]/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-[#B8FF00]" /> Verified Merchant Partner
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight text-white">
              Gourmet Bistro & Retail Hub
            </h1>

            <p className="text-white/80 text-xs sm:text-sm max-w-xl flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#B8FF00]" /> 3 Active Locations · <Users className="w-3.5 h-3.5 text-[#B8FF00]" /> 1,240 Corporate Customers Reached
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/business/qr-codes"
              className="inline-flex items-center gap-2 bg-[#B8FF00] hover:bg-[#8DF01F] text-[#082F24] font-extrabold text-xs px-5 py-3 rounded-full shadow-lg shadow-[#B8FF00]/20 transition-all"
            >
              <QrCode className="w-4 h-4" /> Scan QR Redemption
            </Link>

            <Link
              to="/business/offers/new"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-5 py-3 rounded-full border border-white/20 backdrop-blur-md transition-all"
            >
              <Plus className="w-4 h-4 text-[#B8FF00]" /> Create New Offer
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Offers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00BD00] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-gray-900">{stats.activeOffers}</p>
            <p className="text-xs text-[#00BD00] font-extrabold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 2 Pending Admin Approval
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Total Redemptions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TicketCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-gray-900">{stats.totalRedemptions}</p>
            <p className="text-xs text-amber-600 font-extrabold flex items-center gap-1 mt-1">
              +24% vs last month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00BD00] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-gray-900">${stats.grossRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">Generated via corporate employees</p>
          </div>
        </div>

        <div className="bg-[#082F24] rounded-3xl p-6 space-y-3 text-white shadow-2xl relative overflow-hidden border border-[#B8FF00]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white/70 uppercase tracking-wider">Pending Payout</span>
            <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/20 text-[#B8FF00] flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-heading text-[#B8FF00]">${stats.payoutPending.toLocaleString()}</p>
            <p className="text-xs text-white/70 font-medium mt-1">Scheduled payout: Friday, Sep 15</p>
          </div>
        </div>
      </div>

      {/* Interactive Store Analytics & Performance Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#00BD00] tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Store Analytics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
              Weekly Revenue & Redemption Volume
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "overview" ? "bg-[#082F24] text-[#B8FF00]" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setActiveTab("volume")}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "volume" ? "bg-[#082F24] text-[#B8FF00]" : "text-gray-600 hover:text-gray-900"
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
                  cursor={{ fill: "rgba(8, 47, 36, 0.04)" }}
                  contentStyle={{ backgroundColor: "#082F24", borderRadius: "16px", border: "none", color: "#fff" }}
                  formatter={(v) => [`$${v}`, "Gross Revenue"]}
                />
                <Bar dataKey="sales" fill="#00BD00" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#082F24", borderRadius: "16px", border: "none", color: "#fff" }}
                  formatter={(v) => [`${v} redemptions`, "Volume"]}
                />
                <Line type="monotone" dataKey="redemptions" stroke="#B8FF00" strokeWidth={3} dot={{ r: 4, fill: "#082F24" }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stream of Recent Customer Redemptions */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-heading">Recent Customer Redemptions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Live feed of corporate members redeeming offers at your outlets.</p>
          </div>
          <Link to="/business/redemptions" className="text-xs font-extrabold text-[#00BD00] hover:text-[#082F24] flex items-center gap-1">
            View All Log <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentRedemptions.map((r) => (
            <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 p-3 rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#082F24] text-[#B8FF00] font-black text-sm flex items-center justify-center shrink-0">
                  {r.customer.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-sm text-gray-900">{r.customer}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#00BD00] text-[10px] font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-gray-400" /> {r.company} · <MapPin className="w-3 h-3 text-gray-400" /> {r.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                <div>
                  <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">{r.code}</span>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {r.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-base text-[#00BD00]">{r.amount}</p>
                  <p className="text-[11px] text-gray-500">{r.offer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}