import { db } from "@/services/api/base44Client";

import React, { useEffect, useState } from "react";

import { BarChart3, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PALETTE = ["#059669", "#4f46e5", "#dc2626", "#ea580c", "#0891b2", "#7c3aed", "#c026d3", "#16a34a"];

export default function OfferUsagePanel({ company, employees }) {
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
          rems = await db.entities.Redemption.filter({}, "-redeemed_at", 500).catch(() => []);
          rems = rems.filter((r) => ids.includes(r.user_id));
        }
        setRedemptions(rems);
        const offerIds = [...new Set(rems.map((r) => r.offer_id))].slice(0, 30);
        const fetched = [];
        for (const oid of offerIds) {
          try {
            const o = await db.entities.Offer.get(oid);
            if (o) fetched.push(o);
          } catch { /* may be deleted */ }
        }
        setOffers(fetched);
      } finally { setLoading(false); }
    })();
  }, [company.id, employees.length]);

  const catCounts = {};
  redemptions.forEach((r) => {
    const o = offers.find((x) => x.id === r.offer_id);
    const cat = o?.category || "Other";
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  const topCategories = Object.entries(catCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);

  const bizCounts = {};
  redemptions.forEach((r) => {
    const biz = r.business_name || "Unknown";
    bizCounts[biz] = (bizCounts[biz] || 0) + 1;
  });
  const topBusinesses = Object.entries(bizCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Offer Usage</h1>
        <p className="text-sm text-ivory-muted mt-1">Where your employees are actually redeeming benefits.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-white/10 p-12 text-center text-sm text-ivory-dim">Loading offer usage…</div>
      ) : redemptions.length === 0 ? (
        <div className="bg-white rounded-lg border border-white/10 p-12 text-center">
          <BarChart3 className="w-10 h-10 text-ivory/60 mx-auto mb-3" />
          <p className="text-sm text-ivory-muted">No redemptions yet from your team. As employees start using offers, you'll see category and brand breakdowns here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#D6B56D]" />
                <h3 className="font-semibold text-ivory">Top Categories</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCategories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} strokeWidth={0} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} strokeWidth={0} width={100} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="font-semibold text-ivory mb-3">Redemptions by Brand</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topBusinesses} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                      {topBusinesses.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-white/10 p-6 mt-6">
            <h3 className="font-semibold text-ivory mb-3">Most Redeemed Offers</h3>
            <div className="space-y-2">
              {topBusinesses.map((b, i) => (
                <div key={b.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-ivory-dim text-xs w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-ivory flex-1">{b.name}</span>
                  <span className="text-xs text-ivory-muted">{b.value} redemptions</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}