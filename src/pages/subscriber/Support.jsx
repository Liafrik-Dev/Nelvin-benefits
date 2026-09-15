import React, { useState } from "react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import EmployeeNav from "@/components/shared/EmployeeNav";
import { HelpCircle, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSubmitted(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const faqs = [
    { q: "How do I redeem my vouchers at partner stores?", a: "Show the voucher promo code or QR code on your phone screen to the store cashier at checkout." },
    { q: "When does my company allowance refill?", a: "Corporate allowances refill automatically on the 1st day of every month." },
    { q: "Can I transfer my cashback balance to my bank account?", a: "Yes, you can transfer your wallet cashback to any linked bank account via the Wallet section." },
  ];

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>
      <EmployeeNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#0866FF] text-xs font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-[#0866FF]" /> Help & Support Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-2 font-heading">
            How can we help you?
          </h1>
          <p className="text-ivory-muted text-sm">Get answers to common questions or reach out directly to Nelvin Member Support.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQs */}
          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-ivory font-heading">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 bg-[#F9F8F7] rounded-lg space-y-1">
                  <h4 className="font-bold text-ivory text-xs">{faq.q}</h4>
                  <p className="text-xs text-ivory-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-ivory font-heading text-lg">
              <MessageSquare className="w-5 h-5 text-[#0866FF]" /> Submit a Ticket
            </div>
            <p className="text-xs text-ivory-muted">Our support team responds within 2 hours during business operations.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Issue Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Redemption code error at store"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ivory mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  placeholder="Explain your problem or inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F9F8F7] border border-[#F1F1F1] rounded-xl p-3 text-xs font-medium focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFFFFF] text-[#0866FF] font-bold py-3 rounded-full text-xs hover:bg-[#FFFFFF] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Send Ticket
              </button>
              {submitted && (
                <div className="p-3 bg-[#FFFFFF] text-[#0866FF] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0866FF]" /> Support ticket created!
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}