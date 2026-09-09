import React, { useState } from "react";
import { LifeBuoy, Send, CheckCircle2 } from "lucide-react";

export default function BusinessSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Partner Help & Support</h1>
        <p className="text-sm text-gray-500 mt-1">Get dedicated merchant assistance, billing help, or technical support.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Payout bank account change"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain your inquiry..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#082F24] text-[#B8FF00] font-bold py-3 rounded-full text-xs hover:bg-emerald-950 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" /> Submit Merchant Ticket
        </button>
        {submitted && (
          <p className="text-xs font-bold text-emerald-700 text-center flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Ticket submitted to Nelvin Partner Desk!
          </p>
        )}
      </form>
    </div>
  );
}