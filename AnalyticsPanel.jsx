const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import { PieChart as PieIcon, TrendingUp, Users } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const PALETTE = ["#059669", "#4f46e5", "#dc2626", "#ea580c", "#0891b2", "#7c3aed", "#c026d3", "#16a34a"];

export default function AnalyticsPanel({ company, employees }) {
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
          rems = await db.entities.Redemption.filter({}, "-redeemed_at", 1000).catch(() => []);
          rems = rems.filter((r) => ids.includes(r.user_id));
        }
        setRedemptions(rems);
        const offerIds = [...new Set(rems.map((r) => r.offer_id))];
        const fetched = [];
        for (const oid of offerIds.slice(0, 30)) {
          try { const o = await db.entities.Offer.get(oid); if (o) fetched.push(o); } catch {}
        }
        setOffers(fetched);
      } finally { setLoading(false); }
    })();
  }, [company.id, employees.length]);

  // Monthly usage — last 6 months
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
  const depData = Object.entries(depMap).map(([name, value]) => ({ name, value }));

  // Top categories
  const catMap = {};
  redemptions.forEach((r) => {
    const o = offers.find((x) => x.id === r.offer_id);
    const cat = o?.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);

  // Engagement: % active employees who redeemed
  const activeIds = new Set(employees.filter((e) => e.status === "active" && e.user_id).map((e) => e.user_id));
  const engagedIds = new Set(redemptions.map((r) => r.user_id));
  const engagement = activeIds.size > 0 ? Math.round((engagedIds.size / activeIds.size) * 100) : 0;

  // Most redeemed offers
  const offerCounts = {};
  redemptions.forEach((r) => {
    const o = offers.find((x) => x.id === r.offer_id);
    const title = o?.title || r.offer_title || "Unknown";
    offerCounts[title] = (offerCounts[title] || 0) + 1;
  });
  const topOffers = Object.entries(offerCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Deeper insights into how your team engages with Nelvin benefits.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-400">Loading analytics…</div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Employee Engagement</p>
              <p className="text-3xl font-bold font-heading text-gray-900">{engagement}%</p>
              <p className="text-xs text-gray-400">{engagedIds.size} of {activeIds.size} active employees redeemed an offer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-emerald-600" /><h3 className="font-semibold text-gray-900">Monthly Usage</h3></div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={months}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Savings by Department</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} strokeWidth={0} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-3"><PieIcon className="w-4 h-4 text-emerald-600" /><h3 className="font-semibold text-gray-900">Top Categories</h3></div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                      {catData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Most Redeemed Offers</h3>
              <div className="space-y-2 mt-2">
                {topOffers.length === 0 ? (
                  <p className="text-sm text-gray-400">No redemptions yet.</p>
                ) : topOffers.map((o, i) => (
                  <div key={o.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400 text-xs w-5">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">{o.name}</span>
                    <span className="text-xs text-gray-500">{o.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}