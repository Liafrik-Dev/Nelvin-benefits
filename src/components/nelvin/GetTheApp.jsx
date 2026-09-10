import React from "react";
import AppleIcon from "@/components/shared/AppleIcon";
import GoogleIcon from "@/components/shared/GoogleIcon";
import { Fingerprint, Wifi, Bell } from "lucide-react";

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GetTheApp() {
  return (
    <section className="bg-[#082F24] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white border-y border-emerald-900">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="space-y-2 text-center lg:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-[#B8FF00] bg-white/10 px-3 py-1 rounded-full">
            Join the Movement
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight">
            Ready to connect your employee experience?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-2xl">
            Join remarkable organizations putting people at the heart of what they do. Book a demo today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link
            to="/corporate"
            className="bg-[#B8FF00] hover:bg-[#a2e600] text-[#082F24] font-black text-xs h-12 px-7 rounded-full transition-all shadow-lg flex items-center gap-2"
          >
            Book Free Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors">
              <AppleIcon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[8px] text-white/70 leading-none">App Store</div>
              </div>
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors">
              <GoogleIcon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[8px] text-white/70 leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
