import React, { useState } from "react";
import { TicketCheck, CheckCircle2, QrCode, X } from "lucide-react";

export default function BusinessRedemptions() {
  const [scanModal, setScanModal] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);

  const [redemptions, setRedemptions] = useState([
    { id: "1", customer: "Alex Johnson", company: "Acme Corp", offer: "25% Off Footwear", code: "NV-8841", amount: "$35.00", date: "Today, 2:15 PM" },
    { id: "2", customer: "Sarah Connor", company: "Cyberdyne", offer: "Free Upgrade", code: "NV-3310", amount: "$12.00", date: "Today, 1:05 PM" },
  ]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    setScanSuccess(true);
    setTimeout(() => {
      setRedemptions([
        {
          id: `${Date.now()}`,
          customer: "Verified Walk-In Member",
          company: "Enterprise Partner",
          offer: "Scanned Voucher Perk",
          code: inputCode.toUpperCase(),
          amount: "$25.00",
          date: "Just now",
        },
        ...redemptions,
      ]);
      setScanSuccess(false);
      setInputCode("");
      setScanModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#082F24]">Member Redemptions Log</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time stream of employee benefit redemptions verified in your store.</p>
        </div>
        <button
          onClick={() => setScanModal(true)}
          className="bg-[#082F24] hover:bg-[#0d4636] text-[#B8FF00] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#B8FF00]" /> Scan / Validate Voucher
        </button>
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
                <td className="px-6 py-4 font-extrabold text-[#00BD00]">{r.amount}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center relative shadow-2xl">
            <button onClick={() => setScanModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-[#00BD00]">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#082F24]">Validate Customer Voucher</h3>
            <p className="text-xs text-gray-500">
              Enter customer code or scan QR code at terminal.
            </p>
            <form onSubmit={handleVerify} className="space-y-3">
              <input
                type="text"
                required
                placeholder="NV-8841"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full text-center font-mono font-bold text-sm tracking-widest p-3 border border-gray-200 rounded-xl focus:border-[#00BD00] focus:outline-none uppercase"
              />
              {scanSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Voucher Validated!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#082F24] hover:bg-[#0d4636] text-[#B8FF00] font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  Verify Code
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}