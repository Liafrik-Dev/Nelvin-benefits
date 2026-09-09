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
        <h1 className="text-2xl font-bold font-heading text-gray-900">QR Code Validator</h1>
        <p className="text-sm text-gray-500 mt-1">Cashier point-of-sale scanner tool to verify member QR barcodes instantly.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8" />
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Enter QR Code Hash or Scan Code</label>
            <input
              type="text"
              required
              placeholder="e.g. NV-QR-889412"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold font-mono text-center tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#082F24] text-[#B8FF00] font-bold py-3 rounded-full text-xs hover:bg-emerald-950 transition-colors shadow-sm"
          >
            Verify & Redeem Offer
          </button>
        </form>

        {result && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Valid Voucher Code!
            </div>
            <div className="space-y-1 text-gray-700 pt-1">
              <p><span className="font-bold">Customer:</span> {result.customer}</p>
              <p><span className="font-bold">Member Status:</span> {result.tier}</p>
              <p><span className="font-bold">Offer:</span> {result.offer}</p>
              <p className="text-sm font-extrabold text-emerald-800"><span className="font-bold">Discount:</span> {result.discountAmount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}