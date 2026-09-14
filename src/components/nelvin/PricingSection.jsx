import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function PricingSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-forest-secondary py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-xl overflow-hidden">
          <img src="/images/benifex/footer-banner-v2.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#062B23]/85" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 sm:p-14 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight leading-tight">
                Ready to connect your employee experience?
              </h2>
              <p className="text-white/70 mt-4 max-w-md text-base leading-relaxed">
                Join the remarkable organisations putting people at the heart of what they do.
                A global community of changemakers.
 Book a free demo today.

              </p>
            </div>

            <div className="bg-emerald-black/90 rounded-xl ring-1 ring-white/10 p-8 shadow-xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-[#D6B56D] flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#F5F1E8]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F1E8] mb-2">Thank you!</h3>
                  <p className="text-sm text-[#F5F1E8]/60">We'll be in touch shortly to arrange your demo.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-[#F5F1E8]">Book a free demo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="First Name"
                      className="border border-[#D6B56D]/25/30 rounded-lg px-4 py-2.5 text-sm text-[#F5F1E8] outline-none focus:border-[#D6B56D]/25 placeholder:text-[#9AA39C]"
                    />
                    <input
                      required
                      placeholder="Surname"
                      className="border border-[#D6B56D]/25/30 rounded-lg px-4 py-2.5 text-sm text-[#F5F1E8] outline-none focus:border-[#D6B56D]/25 placeholder:text-[#9AA39C]"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full border border-[#D6B56D]/25/30 rounded-lg px-4 py-2.5 text-sm text-[#F5F1E8] outline-none focus:border-[#D6B56D]/25 placeholder:text-[#9AA39C]"
                  />
                  <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-[#103F35] hover:bg-[#2b0140] text-white font-bold text-sm h-11 rounded-[23px] transition-colors"
                  >
                    <span className="transition-transform group-hover:-translate-x-1">Submit</span>
                    <span className="w-4 h-4 rounded-full bg-[#D6B56D] flex items-center justify-center text-[#062B23] text-xs">→</span>
                  </button>
                  <p className="text-[10px] text-[#F5F1E8]/50 leading-relaxed">
                    Nelvin will use your personal information to contact you from time to time about other products, services and events that we feel may be of interest to you.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}