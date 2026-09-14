import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-forest py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border-2 border-[#D6B56D]/15 p-8 sm:p-12 text-center bg-forest-secondary">
          <div className="w-12 h-12 bg-[#062B23] rounded-lg flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-[#D6B56D]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F1E8] mb-3">
            Never miss a drop.

          </h2>
          <p className="text-[#F5F1E8]/60 text-sm mb-8">
            Get the week's best offers, cashback drops,and luxury reveals — straight to your inbox.

          </p>
          {done ? (
            <p className="inline-flex items-center gap-2 bg-[#D6B56D] text-[#062B23] font-bold text-sm rounded-full px-6 py-3">
              <Check className="w-4 h-4" /> Thank you! You are subscribed.

            </p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-emerald-black/90 rounded-lg px-5 py-3 text-sm text-[#F5F1E8] outline-none border border-[#D6B56D]/25 focus:border-[#D6B56D] placeholder:text-[#9AA39C]"
              />
              <button
                type="submit"
                className="group bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] px-6 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 shadow-md shadow-[#062B23]/30"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="text-xs text-[#F5F1E8]/40 mt-4">
            By subscribing you agree to Nelvin's Privacy Policy. Unsubscribe anytime.


          </p>
        </div>
      </div>
    </section>
  );
}
