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
        <h1 className="text-2xl font-bold font-heading text-ivory">Membership Cards</h1>
        <p className="text-sm text-ivory-muted mt-1">Every employee gets a digital card with a unique Subscriber ID and scannable verification QR.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#F1F1F1]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-dim" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or NV-ID..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#F1F1F1] rounded-lg outline-none focus:border-[#0866FF]/40 focus:ring-2 focus:ring-[#F1F1F1]" />
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto divide-y divide-[#F1F1F1]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-ivory-dim">No employees yet.</div>
            ) : filtered.map((e) => (
              <button key={e.id} onClick={() => setSelected(e)}
                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-[#F9F8F7] ${selected?.id === e.id ? "bg-[#FFFFFF]/40" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-[#F4F4F4] text-[#0866FF] ring-1 ring-[#0866FF]/25 flex items-center justify-center text-xs font-bold">
                  {(e.user_name || e.user_email || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ivory truncate">{e.user_name || e.user_email}</p>
                  <p className="text-xs text-ivory-dim truncate">{e.department || "—"} · <span className="font-mono">{e.subscriber_id || "no ID"}</span></p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${e.status === "active" ? "bg-[#F4F4F4] text-[#0866FF] ring-1 ring-[#0866FF]/25" : "bg-[#F9F8F7] text-[#0866FF] ring-1 ring-[#0866FF]/20"}`}>{e.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {selected ? (
            <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-4 sticky top-4">
              <p className="text-xs text-ivory-dim uppercase tracking-wider mb-3 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Membership Card</p>
              <MembershipCard employee={{ ...selected, membership_tier: company.membership_tier }} company={company} accent={company.branding_primary_color || "#059669"} />
              <div className="mt-4 border-t border-[#F1F1F1] pt-4 text-xs text-ivory-muted space-y-1">
                <p><span className="text-ivory-dim uppercase tracking-wider">Member ID:</span> <span className="font-mono text-ivory">{selected.subscriber_id || "—"}</span></p>
                <p><span className="text-ivory-dim uppercase tracking-wider">Tier:</span> <span className="text-ivory">{company.membership_tier || "Corporate"}</span></p>
                <p><span className="text-ivory-dim uppercase tracking-wider">Status:</span> <span className="text-ivory capitalize">{selected.status}</span></p>
                <p className="text-[11px] text-ivory-dim mt-2">Merchants scan the QR to verify the member is active. The same card replaces the redemption code for corporate employees — individual subscribers continue to use the standard redemption flow.</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 text-center text-sm text-ivory-dim">Select an employee to preview their card.</div>
          )}
        </div>
      </div>
    </div>
  );
}