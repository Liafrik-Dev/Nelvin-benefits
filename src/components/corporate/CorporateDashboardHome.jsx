import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import {
  Users, UserCheck, Gift, TrendingUp, UserPlus, ArrowRight, Globe, Wallet,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold font-heading text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function CorporateDashboardHome({ company, employees, onGoEmployees }) {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ids = employees.filter((e) => e.user_id).map((e) => e.user_id);
        let rems = [];
        if (ids.length > 0) {
          rems = await db.entities.Redemption.filter({}, "-redeemed_at", 300).catch(() => []);
          rems = rems.filter((r) => ids.includes(r.user_id));
        }
        setRedemptions(rems);
        const activeOffers = await db.entities.Offer.filter({ status: "active" }, "-created_date", 1).catch(() => []);
        setOffers(activeOffers);
      } finally {
        setLoading(false);
      }
    })();
  }, [company.id, employees.length]);

  const total = employees.length;
  const active = employees.filter((e) => e.status === "active").length;
  const totalSavings = redemptions.reduce((s, r) => s + (r.savings_amount || 0), 0);
  const countriesTouched = new Set(redemptions.map((r) => r.country).filter(Boolean)).size + 1;

  // Monthly usage chart (last 6 months)
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleDateString("en", { month: "short" });
    const count = redemptions.filter((r) => {
      if (!r.redeemed_at) return false;
      const rd = new Date(r.redeemed_at);
      return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
    }).length;
    months.push({ label, count });
  }

  // Savings by department
  const depMap = {};
  redemptions.forEach((r) => {
    const emp = employees.find((e) => e.user_id === r.user_id);
    const dep = emp?.department || "Unassigned";
    depMap[dep] = (depMap[dep] || 0) + (r.savings_amount || 0);
  });
  const depData = Object.entries(depMap).map(([name, value]) => ({ name, value })).slice(0, 6);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Welcome back, {user?.full_name?.split(" ")[0] || "Admin"}.</h1>
        <p className="text-sm text-gray-500 mt-1">Here's how {company.name} is doing on Nelvin this month.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Employees" value={loading ? "—" : total} accent="bg-violet-100 text-violet-700" />
        <StatCard icon={UserCheck} label="Active Users" value={loading ? "—" : active} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Gift} label="Offer Redemptions" value={loading ? "—" : redemptions.length} accent="bg-amber-100 text-amber-600" />
        <StatCard icon={Wallet} label="Money Saved" value={loading ? "—" : `$${totalSavings.toLocaleString()}`} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Gift} label="Active Offers" value={loading ? "—" : (Array.isArray(offers) ? offers.length : "—")} accent="bg-rose-100 text-rose-700" />
        <StatCard icon={Globe} label="Countries" value={loading ? "—" : countriesTouched} accent="bg-sky-100 text-sky-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Usage</h3>
              <p className="text-xs text-gray-400">Redemptions over the last 6 months</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #f3f4f6" }} />
                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Savings by Department</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} strokeWidth={0} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #f3f4f6" }} />
                <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Quick actions</h3>
              <p className="text-xs text-gray-400">Manage your team</p>
            </div>
          </div>
          <button onClick={onGoEmployees} className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left">
            <span className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Invite employees by email</span>
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your plan</h3>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-lg font-bold text-emerald-700">{company.membership_tier || "Corporate"}</span>
            <span className="text-xs text-gray-400">{company.seats_used || 0} / {company.seats_purchased || 0} seats used</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((company.seats_used || 0) / Math.max(1, company.seats_purchased || 0)) * 100)}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-3">Need more seats? Email <a href="mailto:Nelvin23@proton.me" className="text-emerald-700">Nelvin23@proton.me</a> to upgrade.</p>
        </div>
      </div>
    </div>
  );
}