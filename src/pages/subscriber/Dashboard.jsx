import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { ArrowRight, Tag, Wallet, UserPlus, Crown, Check } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";

export default function Dashboard() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [walletMsg, setWalletMsg] = useState(false);

  useEffect(() => {
    db.entities.Redemption.list("-created_date", 200).then((data) => {
      setRedemptions(data);
      setLoading(false);
    });
  }, []);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const total = redemptions
      .filter((r) => isSameDay(new Date(r.created_date), day))
      .reduce((sum, r) => sum + (r.savings_amount || 0), 0);
    return { day: format(day, "EEE").toUpperCase(), savings: total };
  });

  const handleInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id || ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-gray-900 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <p className="text-xs tracking-wider uppercase text-gray-400 font-semibold mb-2">Savings Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">
                Analytics: today, this month, this year, lifetime.
              </h1>
            </div>
            <Link to="/benefits" className="text-amber-600 hover:underline text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
              View full dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weekData}>
                <Tooltip />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Bar dataKey="savings" fill="#166534" radius={[6, 6, 6, 6]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            <span className="text-sm text-gray-500">Weekly savings</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <Link to="/offers" className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Browse Offers</span>
          </Link>
          <button
            onClick={() => setWalletMsg(true)}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">{walletMsg ? "Coming soon!" : "Top Up Wallet"}</span>
          </button>
          <button
            onClick={handleInvite}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              {copied ? <Check className="w-5 h-5 text-rose-500" /> : <UserPlus className="w-5 h-5 text-rose-500" />}
            </div>
            <span className="font-semibold text-sm text-gray-900">{copied ? "Link copied!" : "Invite Friends"}</span>
          </button>
          <Link to="/benefits" className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="font-semibold text-sm text-gray-900">View Membership</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}