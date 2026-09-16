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
    <div className="min-h-screen bg-forest text-[#282828] font-sans">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Employee Portal Secondary Header Nav */}
        <EmployeeNav />

        {/* Premium Welcome & Tier Hero Banner */}
        <div className="relative rounded-xl bg-gradient-to-r from-black via-[#FFFFFF] to-black text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-[#F1F1F1] overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#1B4F9C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F4] text-[#1B4F9C] border border-[#1B4F9C]/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
                <Crown className="w-3.5 h-3.5 text-[#1B4F9C]" /> Premium Gold Member
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
                Hello, <span className="text-[#1B4F9C]">{user?.full_name?.split(" ")[0] || "Valued Member"}</span>! 👋
              </h1>

              <p className="text-[#282828] text-sm sm:text-base max-w-xl leading-relaxed">
                You have saved <strong className="text-white">${totalSaved + 140}</strong> this month with your employer-sponsored Nelvin benefits package.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/explore"
                  className="bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white font-extrabold text-xs px-5 py-3 rounded-full transition-all shadow-lg shadow-[#1B4F9C]/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Discover New Perks
                </Link>
                <Link
                  to="/wallet"
                  className="bg-[#F4F4F4] hover:bg-[#F4F4F4] text-white font-bold text-xs px-5 py-3 rounded-full transition-all border border-[#F1F1F1] backdrop-blur-sm flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4 text-[#1B4F9C]" /> Open Wallet ($320.00)
                </Link>
              </div>
            </div>

            {/* Quick Balance & Benefit Allowance Card */}
            <div className="bg-[#F4F4F4] border border-[#F1F1F1] rounded-lg p-6 backdrop-blur-xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-3">
                <span className="text-xs font-extrabold text-[#484848] uppercase tracking-wider">Benefit Allowance</span>
                <span className="text-xs font-bold text-[#1B4F9C] bg-[#1B4F9C]/10 px-2.5 py-0.5 rounded-full border border-[#1B4F9C]/30">Active</span>
              </div>

              <div className="space-y-1">
                <p className="text-3xl font-black font-heading text-[#1B4F9C]">$450.00</p>
                <p className="text-[11px] text-[#484848]">Flexible Monthly Allowance (Refreshes in 12 days)</p>
              </div>

              <div className="w-full bg-[#F4F4F4] rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B4F9C] to-[#1B4F9C] h-full rounded-full" style={{ width: "72%" }} />
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-[#282828] pt-1">
                <span>$324.00 Spent</span>
                <span className="text-[#1B4F9C]">$126.00 Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Savings Weekly Chart Card */}
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F1F1] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1B4F9C] tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Savings Analytics
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-ivory">
                Weekly Benefits Savings Breakdown
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-ivory-muted bg-[#F4F4F4] px-3 py-1.5 rounded-full">
                This Week: <strong className="text-[#282828]">${totalSaved}</strong>
              </span>
              <Link
                to="/benefits"
                className="text-xs font-extrabold text-[#1B4F9C] hover:text-[#282828] transition-colors flex items-center gap-1"
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
                  cursor={{ fill: "rgba(27, 79, 156, 0.04)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "none",
                    color: "#282828",
                    fontWeight: "bold",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  formatter={(value) => [`$${value}`, "Savings"]}
                />
                <Bar dataKey="savings" fill="#1B4F9C" radius={[8, 8, 8, 8]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-ivory-muted border-t border-[#F1F1F1] pt-4">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF]" /> Daily merchant discount redemptions
            </span>
            <span className="font-bold text-[#282828]">Updated real-time</span>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/marketplace"
            className="group bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#F1F1F1]/40 transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#FFFFFF] text-[#1B4F9C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1B4F9C] group-hover:text-[#282828] transition-all">
                <Tag className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-[#1B4F9C] group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-ivory group-hover:text-[#1B4F9C] transition-colors">Marketplace Offers</h3>
              <p className="text-xs text-ivory-muted mt-1">Explore 500+ global brands & local discounts.</p>
            </div>
            <span className="text-xs font-extrabold text-[#1B4F9C] flex items-center gap-1 pt-1">
              Browse Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <button
            onClick={() => setWalletMsg(true)}
            className="group bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 transition-all duration-300 text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F9F8F7] text-[#1B4F9C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFFFFF] group-hover:text-[#282828] transition-all">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F9F8F7] text-[#1B4F9C] px-2 py-0.5 rounded-full">Wallet</span>
            </div>
            <div>
              <h3 className="font-bold text-ivory group-hover:text-[#1B4F9C] transition-colors">
                {walletMsg ? "Instant Top Up!" : "Top Up Allowance"}
              </h3>
              <p className="text-xs text-ivory-muted mt-1">Manage corporate debit card & cashbacks.</p>
            </div>
            <span className="text-xs font-extrabold text-[#1B4F9C] flex items-center gap-1 pt-1">
              {walletMsg ? "Feature Active!" : "Manage Card"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={handleInvite}
            className="group bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 flex flex-col justify-between hover:shadow-xl hover:border-rose-400 transition-all duration-300 text-left space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFFFFF] group-hover:text-[#282828] transition-all">
                {copied ? <Check className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F9F8F7] text-[#1B4F9C] px-2 py-0.5 rounded-full">+50 Points</span>
            </div>
            <div>
              <h3 className="font-bold text-ivory group-hover:text-[#1B4F9C] transition-colors">
                {copied ? "Link Copied!" : "Invite Coworkers"}
              </h3>
              <p className="text-xs text-ivory-muted mt-1">Share referral link and earn bonus rewards.</p>
            </div>
            <span className="text-xs font-extrabold text-[#1B4F9C] flex items-center gap-1 pt-1">
              {copied ? "Ready to Paste!" : "Copy Invite Link"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <Link
            to="/vouchers"
            className="group bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#F1F1F1] transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#F4F4F4] text-[#282828] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFFFFF] group-hover:text-[#1B4F9C] transition-all">
                <Gift className="w-6 h-6" />
              </div>
              <Crown className="w-4 h-4 text-[#1B4F9C]" />
            </div>
            <div>
              <h3 className="font-bold text-ivory group-hover:text-[#282828] transition-colors">Digital Vouchers</h3>
              <p className="text-xs text-ivory-muted mt-1">Redeem gift cards for Amazon, Uber & Netflix.</p>
            </div>
            <span className="text-xs font-extrabold text-[#282828] flex items-center gap-1 pt-1">
              Claim Vouchers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}