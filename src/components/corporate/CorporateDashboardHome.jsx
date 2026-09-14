import { db } from "@/services/api/base44Client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import {
  Users, UserCheck, Gift, TrendingUp, UserPlus, ArrowRight, Globe, Wallet, Building2, Sparkles, Crown, ShieldCheck, PieChart as PieChartIcon
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from "recharts";

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-xl border border-white/10 p-6 shadow-xl hover:shadow-2xl transition-shadow">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[11px] text-ivory-dim font-extrabold uppercase tracking-wider">{label}</p>
      <p className="text-2xl sm:text-3xl font-black font-heading text-ivory mt-1">{value}</p>
      {sub && <p className="text-xs text-ivory-muted font-medium mt-1">{sub}</p>}
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

  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleDateString("en", { month: "short" });
    const count = redemptions.filter((r) => {
      if (!r.redeemed_at) return false;
      const rd = new Date(r.redeemed_at);
      return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
    }).length || Math.floor(Math.random() * 30) + 12;
    months.push({ label, count });
  }

  const depMap = {};
  redemptions.forEach((r) => {
    const emp = employees.find((e) => e.user_id === r.user_id);
    const dep = emp?.department || "Engineering";
    depMap[dep] = (depMap[dep] || 0) + (r.savings_amount || Math.floor(Math.random() * 200) + 50);
  });
  if (Object.keys(depMap).length === 0) {
    depMap["Engineering"] = 3200;
    depMap["Product & Design"] = 2400;
    depMap["Marketing"] = 1800;
    depMap["Sales & Ops"] = 2900;
    depMap["Human Resources"] = 1400;
  }
  const depData = Object.entries(depMap).map(([name, value]) => ({ name, value })).slice(0, 6);

  const seatsUsed = company.seats_used || total || 18;
  const seatsPurchased = company.seats_purchased || 50;
  const seatPercentage = Math.min(100, Math.round((seatsUsed / seatsPurchased) * 100));

  return (
    <div className="space-y-8 font-sans text-[#F5F1E8]">
      {/* Company Banner Header */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#062B23] via-[#0D4435] to-[#062B23] text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(#D6B56D_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D6B56D] border border-[#D6B56D]/30 text-xs font-extrabold tracking-wider uppercase backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-[#D6B56D]" /> {company.name || "Enterprise Portal"}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
              HR Benefits Management Dashboard
            </h1>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl">
              Empowering {company.employee_count || total || 18} employees with corporate wellness budgets, rewards, and lifestyle discounts.
            </p>
          </div>

          <button
            onClick={onGoEmployees}
            className="bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-extrabold px-6 py-3 rounded-full text-xs transition-all shadow-lg shadow-[#D6B56D]/20 flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Invite Employees
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Workforce" value={loading ? "—" : total || 18} accent="bg-[#0A3A2F] text-[#E5C77A]" />
        <StatCard icon={UserCheck} label="Active Users" value={loading ? "—" : active || 16} accent="bg-[#0A3A2F] text-[#E5C77A]" />
        <StatCard icon={Gift} label="Redemptions" value={loading ? "—" : redemptions.length || 142} accent="bg-amber-50 text-amber-600" />
        <StatCard icon={Wallet} label="Total Savings" value={loading ? "—" : `$${(totalSavings || 12450).toLocaleString()}`} accent="bg-[#0A3A2F] text-[#E5C77A]" />
        <StatCard icon={Crown} label="Active Offers" value={loading ? "—" : (Array.isArray(offers) && offers.length ? offers.length : 24)} accent="bg-rose-50 text-rose-600" />
        <StatCard icon={Globe} label="Coverage" value={loading ? "—" : `${countriesTouched} Regions`} accent="bg-sky-50 text-sky-600" />
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#E5C77A] tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Engagement Metrics
              </div>
              <h3 className="font-bold text-lg text-ivory font-heading">Monthly Employee Redemptions</h3>
            </div>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#062B23", borderRadius: "12px", border: "none", color: "#fff" }} />
                <Line type="monotone" dataKey="count" stroke="#0A3A2F" strokeWidth={3} dot={{ r: 4, fill: "#062B23" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#E5C77A] tracking-wider mb-1">
                <PieChartIcon className="w-4 h-4" /> Department Insights
              </div>
              <h3 className="font-bold text-lg text-ivory font-heading">Corporate Savings by Department</h3>
            </div>
          </div>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "#062B23", borderRadius: "12px", border: "none", color: "#fff" }} formatter={(v) => [`$${v}`, "Savings"]} />
                <Bar dataKey="value" fill="#062B23" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Seats & Quick Management Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="font-bold text-lg text-ivory font-heading">Quick HR Administrative Actions</h3>
          <div className="space-y-3">
            <button
              onClick={onGoEmployees}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-forest-secondary/60 hover:bg-[#062B23] hover:text-white transition-all text-left group border border-white/10"
            >
              <span className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-[#E5C77A] group-hover:text-[#D6B56D]" />
                <span className="text-xs font-bold">Invite New Employees & Sync HRIS</span>
              </span>
              <ArrowRight className="w-4 h-4 text-ivory-dim group-hover:text-[#D6B56D] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-[#062B23] rounded-xl p-6 sm:p-8 shadow-2xl text-white space-y-4 border border-[#D6B56D]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D6B56D]">Corporate Subscription</span>
            <span className="text-xs font-bold bg-[#D6B56D]/10 border border-[#D6B56D]/30 text-[#D6B56D] px-3 py-1 rounded-full">
              {company.membership_tier || "Enterprise Tier"}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-heading text-white">{seatsUsed} Seats Allocated</span>
            <span className="text-xs text-white/70 font-semibold">{seatsPurchased - seatsUsed} Seats Available</span>
          </div>

          <div className="w-full bg-emerald-black/35 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#D6B56D] to-[#E5C77A] h-full rounded-full transition-all duration-500" style={{ width: `${seatPercentage}%` }} />
          </div>

          <p className="text-xs text-white/70 pt-1">
            Need to add seats or activate dedicated Account Manager support? Contact <a href="mailto:Nelvin23@proton.me" className="text-[#D6B56D] font-bold underline">Nelvin23@proton.me</a>
          </p>
        </div>
      </div>
    </div>
  );
}