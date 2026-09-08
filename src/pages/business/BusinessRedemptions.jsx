import React from "react";
import { TicketCheck, CheckCircle2 } from "lucide-react";

export default function BusinessRedemptions() {
  const redemptions = [
    { id: "1", customer: "Alex Johnson", company: "Acme Corp", offer: "25% Off Footwear", code: "NV-8841", amount: "$35.00", date: "Today, 2:15 PM" },
    { id: "2", customer: "Sarah Connor", company: "Cyberdyne", offer: "Free Upgrade", code: "NV-3310", amount: "$12.00", date: "Today, 1:05 PM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Member Redemptions Log</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time stream of employee benefit redemptions verified in your store.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Customer & Corporate Company</th>
              <th className="px-6 py-3.5">Offer Title</th>
              <th className="px-6 py-3.5">Code</th>
              <th className="px-6 py-3.5">Gross Amount</th>
              <th className="px-6 py-3.5">Redemption Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {redemptions.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">
                  <p>{r.customer}</p>
                  <p className="text-xs text-gray-400 font-normal">{r.company}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">{r.offer}</td>
                <td className="px-6 py-4 font-mono font-bold text-gray-900">{r.code}</td>
                <td className="px-6 py-4 font-extrabold text-emerald-700">{r.amount}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}