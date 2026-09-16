import React, { useState, useEffect } from "react";
import { db } from "@/services/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { Wallet as WalletIcon, CreditCard, ArrowDownRight, ArrowUpRight, Plus, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Wallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(350.0);
  const [cashback, setCashback] = useState(48.5);
  const [allowance, setAllowance] = useState(150.0);
  const [topUpModal, setTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [successMsg, setSuccessMsg] = useState("");
  const [txFilter, setTxFilter] = useState("all");

  const [transactions, setTransactions] = useState([
    { id: "1", type: "cashback_earned", label: "Cashback - Nike Store Purchase", amount: "+$12.50", date: "Today, 2:15 PM", status: "Completed" },
    { id: "2", type: "allowance_refill", label: "Monthly Meal Allowance - Company Refill", amount: "+$150.00", date: "1st May 2026", status: "Completed" },
    { id: "3", type: "redemption", label: "Uber Ride Voucher Redemption", amount: "-$15.00", date: "28th Apr 2026", status: "Completed" },
    { id: "4", type: "top_up", label: "Card Top-Up (Visa ending 4242)", amount: "+$100.00", date: "20th Apr 2026", status: "Completed" },
  ]);

  const handleTopUp = (e) => {
    e.preventDefault();
    const added = Number(topUpAmount);
    setBalance((prev) => prev + added);
    setTransactions([
      {
        id: `${Date.now()}`,
        type: "top_up",
        label: "Direct Wallet Top-Up",
        amount: `+$${added.toFixed(2)}`,
        date: "Just now",
        status: "Completed",
      },
      ...transactions,
    ]);
    setTopUpModal(false);
    setSuccessMsg(`Successfully added $${added.toFixed(2)} to your Nelvin Wallet!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredTx = transactions.filter((tx) => {
    if (txFilter === "credits") return tx.amount.startsWith("+");
    if (txFilter === "debits") return tx.amount.startsWith("-");
    return true;
  });

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#1B4F9C] text-xs font-bold uppercase">
              <WalletIcon className="w-3.5 h-3.5 text-[#1B4F9C]" /> Digital Wallet & Allowance Card
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory font-heading">
              My Wallet & Cashback
            </h1>
            <p className="text-ivory-muted text-sm">Manage personal top-ups, corporate stipends, and earned cashback.</p>
          </div>

          <button
            onClick={() => setTopUpModal(true)}
            className="bg-[#FFFFFF] text-[#1B4F9C] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#FFFFFF] transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Top Up Balance
          </button>
        </div>

        {successMsg && (
          <div className="bg-[#FFFFFF] border border-[#F1F1F1] text-[#1B4F9C] p-4 rounded-lg flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#1B4F9C]" /> {successMsg}
          </div>
        )}

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] rounded-xl p-6 text-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#484848] tracking-wider">Total Balance</span>
              <CreditCard className="w-5 h-5 text-[#1B4F9C]" />
            </div>
            <div>
              <p className="text-3xl font-black font-heading text-[#1B4F9C]">${balance.toFixed(2)}</p>
              <p className="text-xs text-[#484848] mt-1">Ready for redemption</p>
            </div>
          </div>

          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-ivory-dim tracking-wider">Cashback Earned</span>
              <ArrowDownRight className="w-5 h-5 text-[#1B4F9C]" />
            </div>
            <div>
              <p className="text-3xl font-black font-heading text-ivory">${cashback.toFixed(2)}</p>
              <p className="text-xs text-[#1B4F9C] font-semibold mt-1">Available to spend</p>
            </div>
          </div>

          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-ivory-dim tracking-wider">Company Allowance</span>
              <ArrowUpRight className="w-5 h-5 text-[#1B4F9C]" />
            </div>
            <div>
              <p className="text-3xl font-black font-heading text-ivory">${allowance.toFixed(2)}</p>
              <p className="text-xs text-ivory-muted mt-1">Refills on the 1st of every month</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F1F1] pb-4">
            <h2 className="text-lg font-bold text-ivory font-heading">Recent Wallet Transactions</h2>
            <div className="flex items-center gap-2">
              {["all", "credits", "debits"].map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                    txFilter === f ? "bg-[#FFFFFF] text-[#1B4F9C]" : "bg-[#F4F4F4] text-ivory-muted hover:bg-[#F4F4F4]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F1F1F1] text-ivory-dim font-semibold">
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F9F8F7] transition-colors">
                    <td className="py-3.5 px-2 font-bold capitalize text-ivory">{tx.type.replace("_", " ")}</td>
                    <td className="py-3.5 px-2 font-medium text-ivory">{tx.label}</td>
                    <td className="py-3.5 px-2 text-ivory-muted">{tx.date}</td>
                    <td className="py-3.5 px-2">
                      <span className="bg-[#FFFFFF] text-[#1B4F9C] px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3.5 px-2 text-right font-extrabold ${tx.amount.startsWith("+") ? "text-[#1B4F9C]" : "text-ivory"}`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Top Up Modal */}
      {topUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-ivory font-heading">Top Up Wallet Balance</h3>
            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ivory mb-2">Select Amount ($)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 50, 100].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2.5 rounded-xl font-bold text-sm border ${
                        topUpAmount === amt ? "bg-[#FFFFFF] text-[#1B4F9C] border-[#F1F1F1]" : "bg-[#F9F8F7] border-[#F1F1F1] text-ivory"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Custom Amount</label>
                <input
                  type="number"
                  min="5"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2.5 text-sm font-bold text-ivory"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTopUpModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-ivory-muted hover:bg-[#F4F4F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FFFFFF] text-[#1B4F9C] px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#FFFFFF]"
                >
                  Confirm & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}