import React, { useState } from "react";
import { PiggyBank, Plus, DollarSign, ArrowUpRight } from "lucide-react";

export default function BudgetsPanel({ company }) {
  const [budgets, setBudgets] = useState([
    { id: "b1", department: "Engineering", allocated: 12000, spent: 7800, period: "Monthly" },
    { id: "b2", department: "Marketing & Growth", allocated: 8000, spent: 4200, period: "Monthly" },
    { id: "b3", department: "Operations", allocated: 5000, spent: 3100, period: "Monthly" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Budgets & Allowances</h1>
          <p className="text-sm text-gray-500 mt-1">Set monthly benefit spending caps and allowance limits per department.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" /> Add Budget Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          return (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-gray-400">{b.period} Cap</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{pct}% Used</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg font-heading">{b.department}</h3>
                <p className="text-2xl font-black text-gray-900 mt-1">${b.spent.toLocaleString()} / <span className="text-gray-400">${b.allocated.toLocaleString()}</span></p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}