import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function PricingSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden">
          <img src="/images/benifex/footer-banner-v2.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#082F24]/85" />
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

            <div className="bg-white rounded-3xl p-8 shadow-xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-[#B8FF00] flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#082F24]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#180126] mb-2">Thank you!</h3>
                  <p className="text-sm text-[#180126]/60">We'll be in touch shortly to arrange your demo.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-[#180126]">Book a free demo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="First Name"
                      className="border border-[#180126]/30 rounded-lg px-4 py-2.5 text-sm text-[#180126] outline-none focus:border-[#180126] placeholder:text-[#D1CCD4]"
                    />
                    <input
                      required
                      placeholder="Surname"
                      className="border border-[#180126]/30 rounded-lg px-4 py-2.5 text-sm text-[#180126] outline-none focus:border-[#180126] placeholder:text-[#D1CCD4]"
                    />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full border border-[#180126]/30 rounded-lg px-4 py-2.5 text-sm text-[#180126] outline-none focus:border-[#180126] placeholder:text-[#D1CCD4]"
                  />
                  <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-[#180126] hover:bg-[#2b0140] text-white font-bold text-sm h-11 rounded-[23px] transition-colors"
                  >
                    <span className="transition-transform group-hover:-translate-x-1">Submit</span>
                    <span className="w-4 h-4 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#180126] text-xs">→</span>
                  </button>
                  <p className="text-[10px] text-[#180126]/50 leading-relaxed">
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