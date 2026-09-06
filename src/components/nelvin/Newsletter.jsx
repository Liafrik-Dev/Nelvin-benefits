import React, { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-rose-50 rounded-3xl p-8 sm:p-12 text-center border border-rose-100">
          <div className="w-12 h-12 bg-rose-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 mb-3">Never miss a drop.</h2>
          <p className="text-gray-500 text-sm mb-8">
            Get the week's best offers, cashback drops, and luxury reveals — straight to your inbox.
          </p>
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your best email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white rounded-full px-5 py-3 text-sm outline-none border border-gray-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            By subscribing you agree to Nelvin's Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}