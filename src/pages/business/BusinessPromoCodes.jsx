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
          <h1 className="text-2xl font-bold font-heading text-gray-900">Promo Code Generator</h1>
          <p className="text-sm text-gray-500 mt-1">Issue unique promotional discount codes for point-of-sale or online checkout.</p>
        </div>
        <button className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generate Code
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Promo Code</th>
              <th className="px-6 py-3.5">Discount</th>
              <th className="px-6 py-3.5">Usage</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {codes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-gray-900">{c.code}</td>
                <td className="px-6 py-4 font-extrabold text-emerald-700">{c.discount}</td>
                <td className="px-6 py-4 font-semibold text-gray-700">{c.uses} / {c.limit} Used</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}