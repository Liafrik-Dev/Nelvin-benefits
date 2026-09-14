import React, { useState } from "react";
import { BadgePercent, Plus, Copy, Check } from "lucide-react";

export default function BusinessPromoCodes() {
  const [codes, setCodes] = useState([
    { id: "1", code: "NELVIN-NIKE-25", discount: "25% Off", uses: 84, limit: 200, status: "active" },
    { id: "2", code: "NELVIN-VIP-50", discount: "$50 Off $200+", uses: 22, limit: 50, status: "active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Promo Code Generator</h1>
          <p className="text-sm text-ivory-muted mt-1">Issue unique promotional discount codes for point-of-sale or online checkout.</p>
        </div>
        <button className="bg-[#D6B56D] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generate Code
        </button>
      </div>

      <div className="bg-white rounded-lg border border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-forest-secondary/60 text-ivory-muted text-xs uppercase font-semibold border-b border-white/10">
            <tr>
              <th className="px-6 py-3.5">Promo Code</th>
              <th className="px-6 py-3.5">Discount</th>
              <th className="px-6 py-3.5">Usage</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {codes.map((c) => (
              <tr key={c.id} className="hover:bg-forest-secondary/60 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-ivory">{c.code}</td>
                <td className="px-6 py-4 font-extrabold text-[#D6B56D]">{c.discount}</td>
                <td className="px-6 py-4 font-semibold text-ivory">{c.uses} / {c.limit} Used</td>
                <td className="px-6 py-4">
                  <span className="bg-[#0A3A2F] text-[#D6B56D] text-xs font-bold px-2.5 py-1 rounded-full uppercase">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}