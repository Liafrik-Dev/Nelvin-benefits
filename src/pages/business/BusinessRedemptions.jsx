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
          <h1 className="text-2xl font-bold font-heading text-[#F5F1E8]">Member Redemptions Log</h1>
          <p className="text-sm text-ivory-muted mt-1">Real-time stream of employee benefit redemptions verified in your store.</p>
        </div>
        <button
          onClick={() => setScanModal(true)}
          className="bg-[#062B23] hover:bg-[#0A3A2F] text-[#D6B56D] text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#D6B56D]" /> Scan / Validate Voucher
        </button>
      </div>

      <div className="bg-white rounded-lg border border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-forest-secondary/60 text-ivory-muted text-xs uppercase font-semibold border-b border-white/10">
            <tr>
              <th className="px-6 py-3.5">Customer & Corporate Company</th>
              <th className="px-6 py-3.5">Offer Title</th>
              <th className="px-6 py-3.5">Code</th>
              <th className="px-6 py-3.5">Gross Amount</th>
              <th className="px-6 py-3.5">Redemption Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {redemptions.map((r) => (
              <tr key={r.id} className="hover:bg-forest-secondary/60 transition-colors">
                <td className="px-6 py-4 font-bold text-ivory">
                  <p>{r.customer}</p>
                  <p className="text-xs text-ivory-dim font-normal">{r.company}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-ivory">{r.offer}</td>
                <td className="px-6 py-4 font-mono font-bold text-ivory">{r.code}</td>
                <td className="px-6 py-4 font-extrabold text-[#E5C77A]">{r.amount}</td>
                <td className="px-6 py-4 text-xs text-ivory-muted">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-emerald-black rounded-xl p-6 max-w-sm w-full space-y-4 text-center relative shadow-2xl">
            <button onClick={() => setScanModal(false)} className="absolute top-4 right-4 text-ivory-dim hover:text-ivory-muted">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-[#0A3A2F] rounded-lg flex items-center justify-center mx-auto text-[#E5C77A]">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#F5F1E8]">Validate Customer Voucher</h3>
            <p className="text-xs text-ivory-muted">
              Enter customer code or scan QR code at terminal.
            </p>
            <form onSubmit={handleVerify} className="space-y-3">
              <input
                type="text"
                required
                placeholder="NV-8841"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full text-center font-mono font-bold text-sm tracking-widest p-3 border border-white/12 rounded-xl focus:border-[#0A3A2F] focus:outline-none uppercase"
              />
              {scanSuccess ? (
                <div className="p-3 bg-[#0A3A2F] text-[#E5C77A] rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D6B56D]" /> Voucher Validated!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#062B23] hover:bg-[#0A3A2F] text-[#D6B56D] font-bold text-xs py-3 rounded-xl transition-colors"
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