import { db } from "@/services/api/base44Client";

import React, { useEffect, useState } from "react";

import { PiggyBank, Trophy, Wallet, Users } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-lg border border-white/10 p-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-ivory-dim font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold font-heading text-ivory mt-1">{value}</p>
      {sub && <p className="text-xs text-ivory-dim mt-1">{sub}</p>}
    </div>
  );
}

export default function SavingsPanel({ company, employees }) {
  const [redemptions, setRedemptions] = useState([]);
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
      } finally { setLoading(false); }
    })();
  }, [company.id, employees.length]);

  const totalSavings = redemptions.reduce((s, r) => s + (r.savings_amount || 0), 0);
  const activeCount = employees.filter((e) => e.status === "active").length || 1;
  const avg = totalSavings / activeCount;

  // Top saver: aggregate savings by user_id, join with employee name
  const byUser = {};
  redemptions.forEach((r) => {
    byUser[r.user_id] = (byUser[r.user_id] || 0) + (r.savings_amount || 0);
  });
  const topEntries = Object.entries(byUser)
    .map(([uid, sav]) => ({ uid, sav, emp: employees.find((e) => e.user_id === uid) }))
    .sort((a, b) => b.sav - a.sav);

  const topSaver = topEntries[0];

  // Ranking table (top 10)
  const ranked = topEntries.slice(0, 10);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Savings</h1>
        <p className="text-sm text-ivory-muted mt-1">Company-wide savings across all employee redemptions.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-white/10 p-12 text-center text-sm text-ivory-dim">Loading savings…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={PiggyBank} label="Total Company Savings" value={`$${totalSavings.toLocaleString()}`} sub="Across all employees" accent="bg-[#103F35]/60 text-[#D6B56D] ring-1 ring-[#D6B56D]/25" />
            <StatCard icon={Wallet} label="Average Per Employee" value={`$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub={`${activeCount} active employees`} accent="bg-violet-100 text-violet-700" />
            <StatCard icon={Trophy} label="Top Saver" value={topSaver ? (topSaver.emp?.user_name || topSaver.emp?.user_email || "Member") : "—"} sub={topSaver ? `$${topSaver.sav.toLocaleString()}` : "No redemptions yet"} accent="bg-amber-100 text-amber-600" />
          </div>

          <div className="bg-white rounded-lg border border-white/10 p-6 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#D6B56D]" />
              <h3 className="font-semibold text-ivory">Top Savers</h3>
            </div>
            {ranked.length === 0 ? (
              <p className="text-sm text-ivory-dim">No redemptions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {ranked.map((r, i) => (
                  <div key={r.uid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-forest-secondary/60">
                    <span className="text-xs text-ivory-dim w-5">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-[#103F35]/60 text-[#D6B56D] ring-1 ring-[#D6B56D]/25 flex items-center justify-center text-xs font-bold">
                      {(r.emp?.user_name || r.emp?.user_email || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ivory truncate">{r.emp?.user_name || r.emp?.user_email || "Member"}</p>
                      <p className="text-xs text-ivory-dim">{r.emp?.department || "—"}</p>
                    </div>
                    <span className="text-sm font-bold text-[#D6B56D]">${r.sav.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}