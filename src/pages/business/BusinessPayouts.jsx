import React, { useState } from "react";
import { HandCoins, Building2, CheckCircle2, ArrowUpRight, Edit2, X } from "lucide-react";

export default function BusinessPayouts() {
  const [bankModal, setBankModal] = useState(false);
  const [bankName, setBankName] = useState("Chase Commercial Bank");
  const [iban, setIban] = useState("US89 3704 0024 1109 4410");

  const [payouts] = useState([
    { id: "p1", netAmount: "$1,250.00", commission: "$65.00", gross: "$1,315.00", date: "Scheduled: 10 May 2026", status: "pending" },
    { id: "p2", netAmount: "$2,400.00", commission: "$120.00", gross: "$2,520.00", date: "Paid: 03 May 2026", status: "paid" },
  ]);

  const handleBankSave = (e) => {
    e.preventDefault();
    setBankModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#082F24]">Partner Earnings & Bank Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">View revenue settlements, platform fee deductions, and linked bank account details.</p>
        </div>
        <button
          onClick={() => setBankModal(true)}
          className="bg-[#082F24] hover:bg-[#0d4636] text-[#B8FF00] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Building2 className="w-4 h-4 text-[#B8FF00]" /> Edit Bank Details
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-[#00BD00] rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Linked Bank Settlement Account</p>
            <p className="font-extrabold text-[#082F24] text-base">{bankName}</p>
            <p className="font-mono text-xs text-gray-500">{iban}</p>
          </div>
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

      {bankModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-[#082F24]">Update Bank Settlement Account</h3>
              <button onClick={() => setBankModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBankSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-[#00BD00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">IBAN / Account Number</label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full text-xs p-3 font-mono border border-gray-200 rounded-xl focus:border-[#00BD00] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#082F24] hover:bg-[#0d4636] text-[#B8FF00] font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Save Settlement Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}