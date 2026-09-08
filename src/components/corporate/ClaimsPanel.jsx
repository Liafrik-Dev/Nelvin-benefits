import React, { useState } from "react";
import { Receipt, CheckCircle, XCircle, Eye, Download } from "lucide-react";

export default function ClaimsPanel({ company }) {
  const [claims, setClaims] = useState([
    { id: "cl1", employee_name: "Sarah Connor", category: "Meal Expense", amount: 45.0, merchant: "Uber Eats", date: "2026-05-02", status: "pending" },
    { id: "cl2", employee_name: "Michael Scott", category: "Commute", amount: 20.0, merchant: "Bolt Taxi", date: "2026-05-01", status: "approved" },
    { id: "cl3", employee_name: "Pam Beesly", category: "Health & Wellness", amount: 120.0, merchant: "Fitness First", date: "2026-04-28", status: "approved" },
  ]);

  const updateStatus = (id, newStatus) => {
    setClaims(claims.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Expense Claims & Reimbursements</h1>
        <p className="text-sm text-gray-500 mt-1">Review, approve, or reject employee benefit out-of-pocket claims.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Category & Merchant</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {claims.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{c.employee_name}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{c.category}</p>
                  <p className="text-xs text-gray-400">{c.merchant}</p>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">${c.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{c.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                    c.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                    c.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {c.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(c.id, "approved")} className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => updateStatus(c.id, "rejected")} className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}