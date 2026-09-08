import React, { useState } from "react";
import { HandCoins, Building2, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function BusinessPayouts() {
  const [payouts] = useState([
    { id: "p1", netAmount: "$1,250.00", commission: "$65.00", gross: "$1,315.00", date: "Scheduled: 10 May 2026", status: "pending" },
    { id: "p2", netAmount: "$2,400.00", commission: "$120.00", gross: "$2,520.00", date: "Paid: 03 May 2026", status: "paid" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Partner Earnings & Bank Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">View revenue settlements, platform fee deductions, and linked bank account details.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base font-heading">Settlement History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Net Payout</th>
                <th className="px-6 py-3.5">Gross Sales</th>
                <th className="px-6 py-3.5">Commission Fee</th>
                <th className="px-6 py-3.5">Settlement Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-black text-emerald-700 text-base">{p.netAmount}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{p.gross}</td>
                  <td className="px-6 py-4 text-gray-500">{p.commission}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      p.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}