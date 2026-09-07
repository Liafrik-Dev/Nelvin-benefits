import React, { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-[2rem] border-2 border-[#180126]/10 p-8 sm:p-12 text-center bg-[#F7F3ED]">
          <div className="w-12 h-12 bg-[#7637E3] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#180126] mb-3">
            Never miss a drop.

          </h2>
          <p className="text-[#180126]/60 text-sm mb-8">
            Get the week's best offers, cashback drops,and luxury reveals — straight to your inbox.

          </p>
          {done ? (
            <p className="inline-flex items-center gap-2 bg-[#B8FF00] text-[#082F24] font-bold text-sm rounded-full px-6 py-3">
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
                className="flex-1 bg-white rounded-full px-5 py-3 text-sm text-[#180126] outline-none border border-[#180126]/20 focus:border-[#00BD00] placeholder:text-[#D1CCD4]"
              />
              <button
                type="submit"
                className="group bg-[#082F24] hover:bg-[#0d4636] text-white px-6 py-3 rounded-full font-bold text-sm transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                Subscribe
                <span className="w-4 h-4 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#082F24] text-[10px] font-extrabold">→</span>
              </button>
            </form>
          )}
          <p className="text-xs text-[#180126]/40 mt-4">
            By subscribing you agree to Nelvin's Privacy Policy. Unsubscribe anytime.


          </p>
        </div>
      </div>
    </section>
  );
}
