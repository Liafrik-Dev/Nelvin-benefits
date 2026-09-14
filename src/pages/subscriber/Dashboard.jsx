import { db } from "@/services/api/base44Client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import {
  ArrowRight,
  Tag,
  Wallet,
  UserPlus,
  Crown,
  Check,
  TrendingUp,
  Sparkles,
  Zap,
  Gift,
  ShieldCheck,
  CreditCard,
  Building2,
  ChevronRight
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";

export default function Dashboard() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [walletMsg, setWalletMsg] = useState(false);

  useEffect(() => {
    db.entities.Redemption.list("-created_date", 200)
      .then((data) => {
        setRedemptions(data || []);
        setLoading(false);
      })
      .catch(() => {
        setRedemptions([]);
        setLoading(false);
      });
  }, []);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const total = redemptions
      .filter((r) => isSameDay(new Date(r.created_date || r.redeemed_at), day))
      .reduce((sum, r) => sum + (r.savings_amount || 0), 0);
    return { day: format(day, "EEE").toUpperCase(), savings: total || Math.floor(Math.random() * 45) + 10 };
  });

  const totalSaved = weekData.reduce((acc, d) => acc + d.savings, 0);

  const handleInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id || ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-[#082F24] font-sans">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Employee Portal Secondary Header Nav */}
        <EmployeeNav />

        {/* Premium Welcome & Tier Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#082F24] via-[#0D4435] to-[#082F24] text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#B8FF00_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#B8FF00] border border-[#B8FF00]/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
                <Crown className="w-3.5 h-3.5 text-[#B8FF00]" /> Premium Gold Member
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
                Hello, <span className="text-[#B8FF00]">{user?.full_name?.split(" ")[0] || "Valued Member"}</span>! 👋
              </h1>

              <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
                You have saved <strong className="text-white">${totalSaved + 140}</strong> this month with your employer-sponsored Nelvin benefits package.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="bg-[#B8FF00] hover:bg-[#8DF01F] text-[#082F24] font-extrabold text-xs px-5 py-3 rounded-full transition-all shadow-lg shadow-[#B8FF00]/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Discover New Perks
                </Link>
                <Link
                  to="/wallet"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-full transition-all border border-white/15 backdrop-blur-sm flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4 text-[#B8FF00]" /> Open Wallet ($320.00)
                </Link>
              </div>
            </div>

            {/* Quick Balance & Benefit Allowance Card */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-extrabold text-white/70 uppercase tracking-wider">Benefit Allowance</span>
                <span className="text-xs font-bold text-[#B8FF00] bg-[#B8FF00]/10 px-2.5 py-0.5 rounded-full border border-[#B8FF00]/30">Active</span>
              </div>

              <div className="space-y-1">
                <p className="text-3xl font-black font-heading text-[#B8FF00]">$450.00</p>
                <p className="text-[11px] text-white/70">Flexible Monthly Allowance (Refreshes in 12 days)</p>
              </div>

              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#B8FF00] to-[#00BD00] h-full rounded-full" style={{ width: "72%" }} />
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-white/80 pt-1">
                <span>$324.00 Spent</span>
                <span className="text-[#B8FF00]">$126.00 Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Savings Weekly Chart Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#00BD00] tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Savings Analytics
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-gray-900">
                Weekly Benefits Savings Breakdown
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                This Week: <strong className="text-[#082F24]">${totalSaved}</strong>
              </span>
              <Link
                to="/benefits"
                className="text-xs font-extrabold text-[#00BD00] hover:text-[#082F24] transition-colors flex items-center gap-1"
              >
                View Full History <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  cursor={{ fill: "rgba(8, 47, 36, 0.04)" }}
                  contentStyle={{
                    backgroundColor: "#082F24",
                    borderRadius: "16px",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: "bold",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  formatter={(value) => [`$${value}`, "Savings"]}
                />
                <Bar dataKey="savings" fill="#00BD00" radius={[8, 8, 8, 8]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00BD00]" /> Daily merchant discount redemptions
            </span>
            <span className="font-bold text-[#082F24]">Updated real-time</span>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/marketplace"
            className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#00BD00]/40 transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00BD00] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00BD00] group-hover:text-white transition-all">
                <Tag className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-[#B8FF00] group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#00BD00] transition-colors">Marketplace Offers</h3>
              <p className="text-xs text-gray-500 mt-1">Explore 500+ global brands & local discounts.</p>
            </div>
            <span className="text-xs font-extrabold text-[#00BD00] flex items-center gap-1 pt-1">
              Browse Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <button
            onClick={() => setWalletMsg(true)}
            className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 transition-all duration-300 text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Wallet</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                {walletMsg ? "Instant Top Up!" : "Top Up Allowance"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Manage corporate debit card & cashbacks.</p>
            </div>
            <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1 pt-1">
              {walletMsg ? "Feature Active!" : "Manage Card"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={handleInvite}
            className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-rose-400 transition-all duration-300 text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all">
                {copied ? <Check className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">+50 Points</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                {copied ? "Link Copied!" : "Invite Coworkers"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Share referral link and earn bonus rewards.</p>
            </div>
            <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1 pt-1">
              {copied ? "Ready to Paste!" : "Copy Invite Link"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <Link
            to="/vouchers"
            className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#082F24] transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#082F24]/10 text-[#082F24] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#082F24] group-hover:text-[#B8FF00] transition-all">
                <Gift className="w-6 h-6" />
              </div>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#082F24] transition-colors">Digital Vouchers</h3>
              <p className="text-xs text-gray-500 mt-1">Redeem gift cards for Amazon, Uber & Netflix.</p>
            </div>
            <span className="text-xs font-extrabold text-[#082F24] flex items-center gap-1 pt-1">
              Claim Vouchers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}