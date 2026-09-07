import React from "react";
import AppleIcon from "@/components/shared/AppleIcon";
import GoogleIcon from "@/components/shared/GoogleIcon";
import { Fingerprint, Wifi, Bell } from "lucide-react";

export default function GetTheApp() {
  return (
    <section className="bg-[#082F24] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1">
          <p className="text-[#B8FF00] font-semibold text-xs tracking-[0.2em] uppercase mb-4">Get the App</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
            Nelvin,in your pocket.
          </h2>
          <p className="text-white/70 mt-4 max-w-md leading-relaxed">
            Offline QR redemption, push alerts on nearby deals, biometric login,and instant cashback tracking — anywhere on the continent.

          </p>
          <div className="flex items-center gap-3 mt-8">
            <button className="bg-white hover:bg-[#F7F3ED] text-[#180126] rounded-xl px-5 py-3 flex items-center gap-2.5 transition-colors">
              <AppleIcon className="w-5 h-5" />
              <div className="text-left">
                <div className="text-[9px] text-[#180126]/70 leading-none">Download on the</div>
                <div className="text-sm font-bold leading-tight">App Store</div>
              </div>
            </button>
            <button className="bg-white hover:bg-[#F7F3ED] text-[#180126] rounded-xl px-5 py-3 flex items-center gap-2.5 transition-colors">
              <GoogleIcon className="w-5 h-5" />
              <div className="text-left">
                <div className="text-[9px] text-[#180126]/70 leading-none">Get it on</div>
                <div className="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Fingerprint className="w-4 h-4 text-[#B8FF00]" /> Biometric login
            </span>
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Wifi className="w-4 h-4 text-[#B8FF00]" /> Offline redemption
            </span>
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Bell className="w-4 h-4 text-[#B8FF00]" /> Nearby alerts
            </span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-[460px]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7637E3]/40 to-[#B8FF00]/20 rounded-3xl" />
            <div className="absolute inset-4 bg-gradient-to-b from-white/15 to-white/5 rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/10">
              <div className="w-36 h-60 rounded-2xl bg-[#180126] border border-[#B8FF00]/40 relative overflow-hidden">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white/20 rounded-full" />
                <div className="absolute inset-x-4 top-8 bottom-4 rounded-2xl bg-gradient-to-b from-[#082F24] to-[#180126] p-4">
                  <div className="w-10 h-10 bg-[#B8FF00] rounded-xl flex items-center justify-center mb-3">
                    <span className="text-[#082F24] font-extrabold">N</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                    <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
