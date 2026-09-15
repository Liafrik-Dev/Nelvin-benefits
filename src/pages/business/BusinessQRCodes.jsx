import React, { useState } from "react";
import { QrCode, CheckCircle2, AlertCircle } from "lucide-react";

export default function BusinessQRCodes() {
  const [qrInput, setQrInput] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!qrInput) return;
    setResult({
      valid: true,
      customer: "Alex Johnson (Acme Corp)",
      tier: "Enterprise Subscriber",
      offer: "25% Off Storewide Nike Footwear",
      discountAmount: "$25.00",
      code: qrInput.toUpperCase(),
    });
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">QR Code Validator</h1>
        <p className="text-sm text-ivory-muted mt-1">Cashier point-of-sale scanner tool to verify member QR barcodes instantly.</p>
      </div>

      <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-lg bg-[#FFFFFF] text-[#0866FF] flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8" />
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ivory mb-1">Enter QR Code Hash or Scan Code</label>
            <input
              type="text"
              required
              placeholder="e.g. NV-QR-889412"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-4 py-3 text-sm font-bold font-mono text-center tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFFFFF] text-[#0866FF] font-bold py-3 rounded-full text-xs hover:bg-[#FFFFFF] transition-colors shadow-sm"
          >
            Verify & Redeem Offer
          </button>
        </form>

        {result && (
          <div className="p-4 bg-[#FFFFFF] border border-[#F1F1F1] rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#0866FF] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#0866FF]" /> Valid Voucher Code!
            </div>
            <div className="space-y-1 text-ivory pt-1">
              <p><span className="font-bold">Customer:</span> {result.customer}</p>
              <p><span className="font-bold">Member Status:</span> {result.tier}</p>
              <p><span className="font-bold">Offer:</span> {result.offer}</p>
              <p className="text-sm font-extrabold text-[#0866FF]"><span className="font-bold">Discount:</span> {result.discountAmount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}