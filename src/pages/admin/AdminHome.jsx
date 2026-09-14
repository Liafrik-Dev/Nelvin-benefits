import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Link } from "react-router-dom";
import {
  Users, Building2, Store, Tag, Globe2, Star, CreditCard, Crown,
  TrendingUp, Clock, LayoutDashboard, UserCheck,
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { formatMoney, formatDate } from "@/lib/adminUtils";
import StatusBadge from "@/components/admin/StatusBadge";

const PIE_COLORS = ["#166534", "#65a30d", "#d97706", "#9333ea", "#0ea5e9", "#ef4444", "#14b8a6", "#f59e0b"];

function StatCard({ icon: Icon, label, value, accent = "emerald", to }) {
  const accents = {
    emerald: "bg-[#0A3A2F] text-[#D6B56D]",
    sky: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    amber: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    violet: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    rose: "bg-[#103F35]/70 text-[#D6B56D] ring-1 ring-[#D6B56D]/20",
    gray: "bg-[#0A3A2F]/5 text-ivory",
  };
  const inner = (
    <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow h-full">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ivory-dim truncate">{label}</p>
          <p className="text-xl font-bold text-ivory">{value}</p>
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
}

export default function AdminHome() {
  const { user: adminUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [],
    companies: [],
    businesses: [],
    offers: [],
    redemptions: [],
    payments: [],
    reviews: [],
    categories: [],
    countries: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const [
          users, companies, businesses, offers, redemptions, payments,
          reviews, categories, countries,
        ] = await Promise.all([
          db.entities.User.list("-created_date", 500).catch(() => []),
          db.entities.Company.list("-created_date", 500).catch(() => []),
          db.entities.VendorApplication.list("-created_date", 500).catch(() => []),
          db.entities.Offer.list("-created_date", 500).catch(() => []),
          db.entities.Redemption.list("-created_date", 500).catch(() => []),
          db.entities.Payment.list("-created_date", 500).catch(() => []),
          db.entities.Review.list("-created_date", 500).catch(() => []),
          db.entities.Category.list("-display_order", 500).catch(() => []),
          db.entities.Country.list("-created_date", 300).catch(() => []),
        ]);
        setData({ users, companies, businesses, offers, redemptions, payments, reviews, categories, countries });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const { users, companies, businesses, offers, redemptions, payments, reviews } = data;
    const individual = users.filter((u) => (u.account_type || "individual") === "individual").length;
    const corporate = users.filter((u) => u.account_type === "corporate").length;
    const activeUsers = users.filter((u) => !u.is_suspended && (u.status || "active") === "active").length;
    const premiumMembers = users.filter((u) =>
      ["Silver", "Gold", "Platinum", "Enterprise"].includes(u.plan_tier || u.membership_plan_id || "")
    ).length;
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((s, p) => s + (p.amount || 0), 0);
    const membershipSales = payments
      .filter((p) => p.status === "completed" && p.type === "membership")
      .reduce((s, p) => s + (p.amount || 0), 0);

    return {
      totalUsers: users.length,
      individual,
      corporate,
      activeUsers,
      premiumMembers,
      totalCompanies: companies.length,
      totalBusinesses: businesses.filter((b) => b.status === "approved").length,
      pendingBusinesses: businesses.filter((b) => b.status === "pending").length,
      totalOffers: offers.length,
      pendingOffers: offers.filter((o) => o.status === "pending").length,
      featuredOffers: offers.filter((o) => o.is_featured).length,
      categories: data.categories.length,
      countries: data.countries.length,
      reviews: reviews.length,
      revenue: totalRevenue,
      membershipSales,
    };
  }, [data]);

  const growthData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return d;
    });
    return months.map((d) => {
      const month = d.getMonth();
      const year = d.getFullYear();
      const inMonth = (arr, cond = () => true) =>
        arr.filter((r) => {
          const rd = new Date(r.created_date);
          return rd.getMonth() === month && rd.getFullYear() === year && cond(r);
        }).length;
      return {
        label: d.toLocaleString("en-US", { month: "short" }),
        individual: inMonth(data.users, (u) => (u.account_type || "individual") === "individual"),
        corporate: inMonth(data.users, (u) => u.account_type === "corporate"),
      };
    });
  }, [data.users]);

  const salesData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return d;
    });
    return months.map((d) => {
      const month = d.getMonth();
      const year = d.getFullYear();
      const total = data.payments
        .filter((p) => {
          const pd = new Date(p.created_date);
          return pd.getMonth() === month && pd.getFullYear() === year && p.status === "completed" && p.type === "membership";
        })
        .reduce((s, p) => s + (p.amount || 0), 0);
      return { label: d.toLocaleString("en-US", { month: "short" }), sales: total };
    });
  }, [data.payments]);

  const offersByCategory = useMemo(() => {
    const counts = {};
    data.offers.forEach((o) => {
      const k = o.category || "Uncategorized";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data.offers]);

  const offersByCountry = useMemo(() => {
    const counts = {};
    data.offers.forEach((o) => {
      const k = o.country || "Unknown";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data.offers]);

  const revenueData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return d;
    });
    let cumulative = 0;
    return months.map((d) => {
      const month = d.getMonth();
      const year = d.getFullYear();
      const monthRevenue = data.payments
        .filter((p) => {
          const pd = new Date(p.created_date);
          return pd.getMonth() === month && pd.getFullYear() === year && p.status === "completed";
        })
        .reduce((s, p) => s + (p.amount || 0), 0);
      cumulative += monthRevenue;
      return { label: d.toLocaleString("en-US", { month: "short" }), revenue: cumulative };
    });
  }, [data.payments]);

  const recentRegistrations = useMemo(
    () => [...data.users].slice(0, 5),
    [data.users]
  );
  const latestOffers = useMemo(
    () => [...data.offers].slice(0, 5),
    [data.offers]
  );
  const recentPayments = useMemo(
    () => [...data.payments].slice(0, 5),
    [data.payments]
  );
  const recentReviews = useMemo(
    () => [...data.reviews].slice(0, 5),
    [data.reviews]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-white/15 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">Welcome back, {adminUser?.full_name?.split(" ")[0] || "Admin"}</h1>
        <p className="text-sm text-ivory-muted mt-1">Overview of Nelvin's users, businesses, offers and revenue.</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} accent="emerald" to="/admin/users" />
        <StatCard icon={UserCheck} label="Individual Subscribers" value={stats.individual} accent="sky" to="/admin/users" />
        <StatCard icon={Building2} label="Corporate Employees" value={stats.corporate} accent="violet" to="/admin/companies" />
        <StatCard icon={Users} label="Active Users" value={stats.activeUsers} accent="emerald" to="/admin/users" />
        <StatCard icon={Crown} label="Premium Members" value={stats.premiumMembers} accent="amber" to="/admin/users" />
        <StatCard icon={Building2} label="Total Companies" value={stats.totalCompanies} accent="violet" to="/admin/companies" />
        <StatCard icon={Store} label="Total Businesses" value={stats.totalBusinesses} accent="emerald" to="/admin/businesses" />
        <StatCard icon={Clock} label="Pending Businesses" value={stats.pendingBusinesses} accent="amber" to="/admin/pending-businesses" />
        <StatCard icon={Tag} label="Total Offers" value={stats.totalOffers} accent="sky" to="/admin/offers" />
        <StatCard icon={Clock} label="Pending Offers" value={stats.pendingOffers} accent="amber" to="/admin/pending-offers" />
        <StatCard icon={Tag} label="Featured Offers" value={stats.featuredOffers} accent="amber" to="/admin/offers" />
        <StatCard icon={LayoutDashboard} label="Categories" value={stats.categories} accent="emerald" to="/admin/categories" />
        <StatCard icon={Globe2} label="Countries" value={stats.countries} accent="sky" to="/admin/countries" />
        <StatCard icon={Star} label="Reviews" value={stats.reviews} accent="amber" to="/admin/reviews" />
        <StatCard icon={CreditCard} label="Total Revenue" value={formatMoney(stats.revenue, "USD")} accent="emerald" />
        <StatCard icon={Crown} label="Membership Sales" value={formatMoney(stats.membershipSales, "USD")} accent="violet" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#D6B56D]" />
            <h3 className="font-semibold text-ivory">User Growth</h3>
            <span className="text-xs text-ivory-dim ml-auto">Individual vs Corporate</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="individual" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="corporate" stroke="#9333ea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-[#E5C77A]" />
            <h3 className="font-semibold text-ivory">Membership Sales</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="sales" fill="#166534" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-[#D6B56D]" />
            <h3 className="font-semibold text-ivory">Offers by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={offersByCategory} dataKey="value" nameKey="name" outerRadius={90} label fontSize={11}>
                {offersByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4 text-[#D6B56D]" />
            <h3 className="font-semibold text-ivory">Offers by Country</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={offersByCountry} dataKey="value" nameKey="name" outerRadius={90} label fontSize={11}>
                {offersByCountry.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-[#D6B56D]" />
            <h3 className="font-semibold text-ivory">Revenue Overview</h3>
            <span className="text-xs text-ivory-dim ml-auto">Cumulative</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#166534" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ivory">Recent Registrations</h3>
            <Link to="/admin/users" className="text-xs text-[#D6B56D] font-semibold">View all</Link>
          </div>
          <ul className="divide-y divide-white/10">
            {recentRegistrations.length === 0 && <li className="py-3 text-sm text-ivory-dim">No users yet.</li>}
            {recentRegistrations.map((u) => (
              <li key={u.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ivory truncate">{u.full_name || u.email}</p>
                  <p className="text-xs text-ivory-dim truncate">{u.email}</p>
                </div>
                <StatusBadge status={u.account_type || "individual"} label={u.account_type === "corporate" ? "Corporate" : "Individual"} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ivory">Latest Offers</h3>
            <Link to="/admin/offers" className="text-xs text-[#D6B56D] font-semibold">View all</Link>
          </div>
          <ul className="divide-y divide-white/10">
            {latestOffers.length === 0 && <li className="py-3 text-sm text-ivory-dim">No offers yet.</li>}
            {latestOffers.map((o) => (
              <li key={o.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ivory truncate">{o.title}</p>
                  <p className="text-xs text-ivory-dim truncate">{o.business_name} · {o.country}</p>
                </div>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ivory">Recent Payments</h3>
            <Link to="/admin/payments" className="text-xs text-[#D6B56D] font-semibold">View all</Link>
          </div>
          <ul className="divide-y divide-white/10">
            {recentPayments.length === 0 && <li className="py-3 text-sm text-ivory-dim">No payments yet.</li>}
            {recentPayments.map((p) => (
              <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ivory truncate">
                    {p.user_name || p.company_name || p.business_name || "Payment"}
                  </p>
                  <p className="text-xs text-ivory-dim truncate">{formatDate(p.created_date)} · {p.payment_method || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ivory">{formatMoney(p.amount, p.currency)}</span>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ivory">Recent Reviews</h3>
            <Link to="/admin/reviews" className="text-xs text-[#D6B56D] font-semibold">View all</Link>
          </div>
          <ul className="divide-y divide-white/10">
            {recentReviews.length === 0 && <li className="py-3 text-sm text-ivory-dim">No reviews yet.</li>}
            {recentReviews.map((r) => (
              <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ivory truncate">
                    {r.title || `★ ${r.rating}`} · {r.user_name || "—"}
                  </p>
                  <p className="text-xs text-ivory-dim truncate">{r.target_name || r.target_type}</p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}