import React, { useState } from "react";
import MembershipCard from "@/components/corporate/MembershipCard";
import { CreditCard, Search } from "lucide-react";

export default function MembershipPanel({ company, employees }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(employees.find((e) => e.status === "active") || employees[0]);

  const filtered = employees.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (e.user_email || "").toLowerCase().includes(s) || (e.user_name || "").toLowerCase().includes(s) || (e.subscriber_id || "").toLowerCase().includes(s);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Membership Cards</h1>
        <p className="text-sm text-gray-500 mt-1">Every employee gets a digital card with a unique Subscriber ID and scannable verification QR.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or NV-ID..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50" />
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No employees yet.</div>
            ) : filtered.map((e) => (
              <button key={e.id} onClick={() => setSelected(e)}
                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-gray-50 ${selected?.id === e.id ? "bg-emerald-50/40" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {(e.user_name || e.user_email || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.user_name || e.user_email}</p>
                  <p className="text-xs text-gray-400 truncate">{e.department || "—"} · <span className="font-mono">{e.subscriber_id || "no ID"}</span></p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${e.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{e.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Membership Card</p>
              <MembershipCard employee={{ ...selected, membership_tier: company.membership_tier }} company={company} accent={company.branding_primary_color || "#059669"} />
              <div className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-500 space-y-1">
                <p><span className="text-gray-400 uppercase tracking-wider">Member ID:</span> <span className="font-mono text-gray-900">{selected.subscriber_id || "—"}</span></p>
                <p><span className="text-gray-400 uppercase tracking-wider">Tier:</span> <span className="text-gray-900">{company.membership_tier || "Corporate"}</span></p>
                <p><span className="text-gray-400 uppercase tracking-wider">Status:</span> <span className="text-gray-900 capitalize">{selected.status}</span></p>
                <p className="text-[11px] text-gray-400 mt-2">Merchants scan the QR to verify the member is active. The same card replaces the redemption code for corporate employees — individual subscribers continue to use the standard redemption flow.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400">Select an employee to preview their card.</div>
          )}
        </div>
      </div>
    </div>
  );
}