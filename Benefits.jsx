const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { startOfMonth, startOfYear, subMonths, endOfMonth, isWithinInterval } from "date-fns";
import { Download, ArrowUpRight, Calendar, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import Avatar from "@/components/nelvin/Avatar";

export default function Benefits() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Redemption.list("-created_date", 500).then((data) => {
      setRedemptions(data);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const yearStart = startOfYear(now);

  const sumIn = (predicate) => redemptions.filter(predicate).reduce((s, r) => s + (r.savings_amount || 0), 0);

  const lifetimeSavings = sumIn(() => true);
  const thisMonth = sumIn((r) => new Date(r.created_date) >= thisMonthStart);
  const lastMonth = sumIn((r) => isWithinInterval(new Date(r.created_date), { start: lastMonthStart, end: lastMonthEnd }));
  const thisYear = sumIn((r) => new Date(r.created_date) >= yearStart);
  const changePct = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : "0.0";

  const handleExport = () => {
    const rows = [["Offer", "Business", "Savings", "Date"], ...redemptions.map((r) => [r.offer_title, r.business_name, r.savings_amount, r.created_date])];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nelvin-savings-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-gray-900 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <p className="max-w-5xl mx-auto text-emerald-400 font-semibold text-sm">Benefits</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4">
            <Avatar user={user} className="w-14 h-14" fallbackClassName="bg-emerald-700 text-white font-bold text-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user?.full_name || "Member"}</h1>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {user?.role === "admin" ? "Admin" : "Free Member"}
                </span>
              </div>
              <p className="text-sm text-gray-400">{redemptions.length} offers redeemed all time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <Link to="/choose-plan" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-5 py-2 text-sm font-semibold">
              Upgrade Plan
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-4">
          <p className="text-xs tracking-wider uppercase text-white/50 mb-3">Lifetime Savings</p>
          <p className="text-4xl sm:text-5xl font-bold text-white font-heading">₦{lifetimeSavings.toLocaleString()}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            <span className="text-amber-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> {changePct}% vs last month
            </span>
            <span className="text-white/60">🔥 {redemptions.filter((r) => new Date(r.created_date) >= thisMonthStart).length} offers redeemed this month</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <Calendar className="w-5 h-5 text-emerald-700 mb-3" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">This Month</p>
            <p className="text-xl font-bold text-gray-900">₦{thisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <TrendingUp className="w-5 h-5 text-gray-400 mb-3" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Last Month</p>
            <p className="text-xl font-bold text-gray-900">₦{lastMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <BarChart3 className="w-5 h-5 text-amber-500 mb-3" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">This Year</p>
            <p className="text-xl font-bold text-gray-900">₦{thisYear.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mb-3" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Redeemed</p>
            <p className="text-xl font-bold text-gray-900">{redemptions.length} offers</p>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/my-offers" className="text-emerald-700 font-semibold text-sm hover:underline">
            View all redeemed offers →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}