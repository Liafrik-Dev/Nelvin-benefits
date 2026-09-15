import React, { useState } from "react";
import { PiggyBank, Plus, DollarSign, ArrowUpRight, X, Check } from "lucide-react";

export default function BudgetsPanel({ company }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dept, setDept] = useState("");
  const [amount, setAmount] = useState("");

  const [budgets, setBudgets] = useState([
    { id: "b1", department: "Engineering", allocated: 12000, spent: 7800, period: "Monthly" },
    { id: "b2", department: "Marketing & Growth", allocated: 8000, spent: 4200, period: "Monthly" },
    { id: "b3", department: "Operations", allocated: 5000, spent: 3100, period: "Monthly" },
  ]);

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!dept || !amount) return;
    setBudgets([
      ...budgets,
      {
        id: `b${Date.now()}`,
        department: dept,
        allocated: parseFloat(amount),
        spent: 0,
        period: "Monthly",
      },
    ]);
    setDept("");
    setAmount("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#282828]">Budgets & Allowances</h1>
          <p className="text-sm text-ivory-muted mt-1">Set monthly benefit spending caps and allowance limits per department.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#0866FF] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-[#0866FF]" /> Add Budget Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          return (
            <div key={b.id} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-ivory-dim">{b.period} Cap</span>
                <span className="text-xs font-bold text-[#0866FF] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full">{pct}% Used</span>
              </div>
              <div>
                <h3 className="font-bold text-ivory text-lg font-heading">{b.department}</h3>
                <p className="text-2xl font-black text-ivory mt-1">${b.spent.toLocaleString()} / <span className="text-ivory-dim">${b.allocated.toLocaleString()}</span></p>
              </div>
              <div className="w-full bg-[#F4F4F4] rounded-full h-2">
                <div className="bg-[#FFFFFF] h-2 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F1F1] pb-3">
              <h3 className="font-bold text-lg text-[#282828]">Create Department Budget</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ivory-dim hover:text-ivory-muted"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ivory-muted uppercase mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales & Support"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full text-xs p-3 border border-[#F1F1F1] rounded-xl focus:border-[#F1F1F1] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ivory-muted uppercase mb-1">Monthly Budget Cap ($)</label>
                <input
                  type="number"
                  required
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-xs p-3 border border-[#F1F1F1] rounded-xl focus:border-[#F1F1F1] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#0866FF] font-bold text-xs py-3 rounded-xl shadow-sm transition-colors"
              >
                Save Budget Rule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}