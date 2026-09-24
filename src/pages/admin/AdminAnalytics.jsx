import { db } from "@/services/api/dataClient";

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  BarChart3, Users, Store, Tag, TicketCheck, Globe2, TrendingUp, MousePointerClick, Loader2,
} from "lucide-react";

import { formatMoney, formatDate } from "@/lib/adminUtils";

const RANGES = [
  { id: 30, label: "30 days" },
  { id: 90, label: "90 days" },
  { id: 365, label: "12 months" },
];

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFFFFF] text-[#1B4F9C]">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ivory-dim truncate">{label}</p>
          <p className="text-xl font-bold text-ivory">{value}</p>
          {sub && <p className="text-[11px] text-ivory-dim">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [range, setRange] = useState(90);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ redemptions: [], offers: [], users: [], businesses: [], events: [], payments: [], countries: [] });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [redemptions, offers, users, businesses, events, payments, countries] = await Promise.all([
          db.entities.Redemption.list("-redeemed_at", 2000).catch(() => []),
          db.entities.Offer.list("-created_date", 500).catch(() => []),
          db.entities.User.list("-created_date", 1000).catch(() => []),
          db.entities.VendorApplication.list("-created_date", 500).catch(() => []),
          db.entities.AnalyticsEvent.list("-created_date", 5000).catch(() => []),
          db.entities.Payment.list("-created_date", 1000).catch(() => []),
          db.entities.Country.list("-created_date", 300).catch(() => []),
        ]);
        setData({ redemptions, offers, users, businesses, events, payments, countries });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - range);
    return d;
  }, [range]);

  const inRange = useMemo(() => (rows, field) => rows.filter((r) => {
    const t = r[field] || r.created_date || r.updated_date;
    return t && new Date(t) >= since;
  }), [since]);

  const stats = useMemo(() => {
    const redemptions = inRange(data.redemptions, "redeemed_at");
    const offers = inRange(data.offers, "created_date");
    const users = inRange(data.users, "created_date");
    const businesses = inRange(data.businesses, "created_date");
    const completed = data.payments.filter((p) => p.status === "completed" && new Date(p.created_date || 0) >= since);

    const savings = redemptions.reduce((s, r) => s + (Number(r.savings_amount) || 0), 0);
    const revenue = completed.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const offerClicks = data.events.filter((e) => e.event_type === "offer_click" && new Date(e.created_date || 0) >= since).length;

    return {
      redemptions: redemptions.length,
      newMembers: users.length,
      newBusinesses: businesses.length,
      newOffers: offers.length,
      savings,
      revenue,
      offerClicks,
      activeOffers: data.offers.filter((o) => o.status === "active").length,
      avgSaving: redemptions.length ? savings / redemptions.length : 0,
    };
  }, [data, inRange, since]);

  // Daily buckets built from real rows only: a quiet day is a zero, not an
  // invented number.
  const trend = useMemo(() => {
    const buckets = new Map();
    const days = Math.min(range, 90);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dayKey(d);
      buckets.set(k, {
        date: k,
        label: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
        redemptions: 0, savings: 0, members: 0,
      });
    }
    for (const r of inRange(data.redemptions, "redeemed_at")) {
      const b = buckets.get(dayKey(r.redeemed_at));
      if (!b) continue;
      b.redemptions += 1;
      b.savings += Number(r.savings_amount) || 0;
    }
    for (const u of inRange(data.users, "created_date")) {
      const b = buckets.get(dayKey(u.created_date));
      if (b) b.members += 1;
    }
    return [...buckets.values()];
  }, [data, inRange, range]);

  const byCountry = useMemo(() => {
    const counts = new Map();
    for (const r of inRange(data.redemptions, "redeemed_at")) {
      const key = r.country || "Unknown";
      const row = counts.get(key) || { name: key, redemptions: 0, savings: 0 };
      row.redemptions += 1;
      row.savings += Number(r.savings_amount) || 0;
      counts.set(key, row);
    }
    return [...counts.values()].sort((a, b) => b.redemptions - a.redemptions).slice(0, 10);
  }, [data, inRange]);

  const byCategory = useMemo(() => {
    const catOfOffer = new Map(data.offers.map((o) => [o.id, o.category]));
    const counts = new Map();
    for (const r of inRange(data.redemptions, "redeemed_at")) {
      const name = catOfOffer.get(r.offer_id) || r.category || "Other";
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [data, inRange]);

  const topOffers = useMemo(() => {
    const counts = new Map();
    for (const r of inRange(data.redemptions, "redeemed_at")) {
      const key = r.offer_id || r.offer_title;
      if (!key) continue;
      const row = counts.get(key) || { name: r.offer_title || key, redemptions: 0, savings: 0 };
      row.redemptions += 1;
      row.savings += Number(r.savings_amount) || 0;
      counts.set(key, row);
    }
    return [...counts.values()].sort((a, b) => b.redemptions - a.redemptions).slice(0, 8);
  }, [data, inRange]);

  const recentEvents = useMemo(() => data.events.slice(0, 12), [data.events]);
  const hasActivity = stats.redemptions > 0 || stats.newMembers > 0 || stats.newOffers > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ivory-muted">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading analytics…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Analytics</h1>
          <p className="text-sm text-ivory-muted mt-1">
            Member growth, redemptions, savings delivered and offer engagement — computed from live platform records.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-[#F4F4F4] p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                range === r.id ? "bg-[#FFFFFF] text-[#1B4F9C] shadow-sm" : "text-ivory-muted hover:text-ivory"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TicketCheck} label="Redemptions" value={stats.redemptions.toLocaleString()} sub={`${stats.avgSaving ? formatMoney(stats.avgSaving) : "—"} avg saving`} />
        <StatCard icon={TrendingUp} label="Savings delivered" value={formatMoney(stats.savings)} sub="total member value" />
        <StatCard icon={Users} label="New members" value={stats.newMembers.toLocaleString()} sub={`${data.users.length} total`} />
        <StatCard icon={Store} label="New businesses" value={stats.newBusinesses.toLocaleString()} sub={`${data.businesses.filter((b) => b.status === "approved").length} approved`} />
        <StatCard icon={Tag} label="Active offers" value={stats.activeOffers.toLocaleString()} sub={`${stats.newOffers} added in range`} />
        <StatCard icon={MousePointerClick} label="Offer clicks" value={stats.offerClicks.toLocaleString()} sub="tracked events" />
        <StatCard icon={Globe2} label="Countries with activity" value={byCountry.length.toLocaleString()} sub={`${data.countries.length} enabled`} />
        <StatCard icon={BarChart3} label="Revenue" value={formatMoney(stats.revenue)} sub="completed payments" />
      </div>

      {!hasActivity && (
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 text-sm text-ivory-muted">
          No activity recorded in this range yet. These numbers come from real records — redemptions,
          sign-ups, offers and payments — so the panel stays empty until members start using the platform.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <h2 className="font-semibold text-ivory mb-4">Redemptions</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4F9C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1B4F9C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1", fontSize: 12 }} />
                <Area type="monotone" dataKey="redemptions" stroke="#1B4F9C" strokeWidth={2} fill="url(#gRed)" name="Redemptions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <h2 className="font-semibold text-ivory mb-4">Member sign-ups</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1", fontSize: 12 }} />
                <Line type="monotone" dataKey="members" stroke="#C99000" strokeWidth={2} dot={false} name="New members" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <h2 className="font-semibold text-ivory mb-4">Top countries</h2>
          {byCountry.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCountry} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={90} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1", fontSize: 12 }} />
                  <Bar dataKey="redemptions" fill="#1B4F9C" radius={[0, 6, 6, 0]} name="Redemptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-ivory-muted py-16 text-center">No redemptions recorded in this range.</p>
          )}
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <h2 className="font-semibold text-ivory mb-4">Redemptions by category</h2>
          {byCategory.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" interval={0} angle={-25} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F1F1", fontSize: 12 }} />
                  <Bar dataKey="value" fill="#C99000" radius={[6, 6, 0, 0]} name="Redemptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-ivory-muted py-16 text-center">No redemptions recorded in this range.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <h2 className="font-semibold text-ivory mb-4">Best performing offers</h2>
          {topOffers.length ? (
            <ul className="divide-y divide-[#F1F1F1]">
              {topOffers.map((o, i) => (
                <li key={o.name + i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ivory truncate pr-3">{i + 1}. {o.name}</span>
                  <span className="shrink-0 text-ivory-muted text-xs">
                    {o.redemptions} redeemed · {formatMoney(o.savings)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ivory-muted py-10 text-center">No redemptions recorded in this range.</p>
          )}
        </div>

        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ivory">Recent tracked events</h2>
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-[#1B4F9C]">Audit logs</Link>
          </div>
          {recentEvents.length ? (
            <ul className="divide-y divide-[#F1F1F1]">
              {recentEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ivory truncate pr-3">
                    {e.event_type || e.name || "event"}{e.entity_name ? ` — ${e.entity_name}` : ""}
                  </span>
                  <span className="shrink-0 text-ivory-dim text-xs">{formatDate(e.created_date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ivory-muted py-10 text-center">No page-view or click events recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
