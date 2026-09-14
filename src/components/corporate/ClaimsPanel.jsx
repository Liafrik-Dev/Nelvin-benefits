import React, { useState } from "react";
import { Receipt, CheckCircle, XCircle, Eye, Download, Search, Filter, X } from "lucide-react";

export default function ClaimsPanel({ company }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [claims, setClaims] = useState([
    { id: "cl1", employee_name: "Sarah Connor", category: "Meal Expense", amount: 45.0, merchant: "Uber Eats", date: "2026-05-02", status: "pending", receiptUrl: "#" },
    { id: "cl2", employee_name: "Michael Scott", category: "Commute", amount: 20.0, merchant: "Bolt Taxi", date: "2026-05-01", status: "approved", receiptUrl: "#" },
    { id: "cl3", employee_name: "Pam Beesly", category: "Health & Wellness", amount: 120.0, merchant: "Fitness First", date: "2026-04-28", status: "approved", receiptUrl: "#" },
    { id: "cl4", employee_name: "Jim Halpert", category: "Remote Work Setup", amount: 85.5, merchant: "Logitech Store", date: "2026-04-25", status: "pending", receiptUrl: "#" },
  ]);

  const updateStatus = (id, newStatus, reason = "") => {
    setClaims(claims.map((c) => (c.id === id ? { ...c, status: newStatus, note: reason } : c)));
    setSelectedClaim(null);
    setRejectReason("");
  };

  const filtered = claims.filter((c) => {
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch = c.employee_name.toLowerCase().includes(search.toLowerCase()) ||
                          c.merchant.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Employee,Category,Merchant,Amount,Date,Status", ...filtered.map(c => `${c.employee_name},${c.category},${c.merchant},${c.amount},${c.date},${c.status}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `claims_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F5F1E8]">Expense Claims & Reimbursements</h1>
          <p className="text-sm text-ivory-muted mt-1">Review, approve, or reject employee benefit out-of-pocket claims.</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#062B23] hover:bg-[#0A3A2F] text-white font-bold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#D6B56D]" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-white/10 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ivory-dim" />
          <input
            type="text"
            placeholder="Search employee, merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-forest-secondary/60 rounded-xl text-xs text-ivory focus:outline-none border border-transparent focus:border-[#0A3A2F]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "pending", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterStatus === st ? "bg-[#062B23] text-[#D6B56D]" : "bg-forest-secondary/60 text-ivory-muted hover:bg-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-forest-secondary/60 text-ivory-muted text-xs uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Category & Merchant</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-forest-secondary/60 transition-colors">
                <td className="px-6 py-4 font-bold text-ivory">{c.employee_name}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-ivory">{c.category}</p>
                  <p className="text-xs text-ivory-dim">{c.merchant}</p>
                </td>
                <td className="px-6 py-4 font-bold text-ivory">${c.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-ivory-muted text-xs">{c.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                    c.status === "approved" ? "bg-[#0A3A2F] text-ivory" :
                    c.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setSelectedClaim(c)} className="text-xs font-bold text-[#F5F1E8] hover:underline inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-[#F5F1E8]">Review Claim #{selectedClaim.id}</h3>
              <button onClick={() => setSelectedClaim(null)} className="text-ivory-dim hover:text-ivory-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-bold text-ivory-muted">Employee:</span> {selectedClaim.employee_name}</p>
              <p><span className="font-bold text-ivory-muted">Category:</span> {selectedClaim.category}</p>
              <p><span className="font-bold text-ivory-muted">Merchant:</span> {selectedClaim.merchant}</p>
              <p><span className="font-bold text-ivory-muted">Amount:</span> <span className="font-extrabold text-[#F5F1E8]">${selectedClaim.amount.toFixed(2)}</span></p>
              <p><span className="font-bold text-ivory-muted">Date:</span> {selectedClaim.date}</p>
            </div>
            {selectedClaim.status === "pending" ? (
              <div className="pt-2 space-y-3">
                <textarea
                  placeholder="Optional rejection or approval notes..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs p-3 border border-white/12 rounded-xl focus:border-[#0A3A2F] focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedClaim.id, "approved", rejectReason)}
                    className="flex-1 bg-[#0A3A2F] hover:bg-[#D6B56D] text-[#062B23] font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Approve Claim
                  </button>
                  <button
                    onClick={() => updateStatus(selectedClaim.id, "rejected", rejectReason)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-forest-secondary/60 rounded-xl text-xs text-ivory-muted">
                Status: <strong className="capitalize">{selectedClaim.status}</strong> {selectedClaim.note && `(${selectedClaim.note})`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}