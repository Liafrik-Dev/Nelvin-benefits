import React from "react";
import { Fingerprint, Wifi, Bell } from "lucide-react";

export default function GetTheApp() {
  return (
    <section className="bg-emerald-800 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-700" />
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1">
          <p className="text-amber-400 font-semibold text-xs tracking-[0.15em] uppercase mb-4">Get the App</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
            Africa's savings, right in your pocket.
          </h2>
          <p className="text-white/70 mt-4 max-w-md leading-relaxed">
            Offline QR redemption, push alerts on nearby deals, biometric login, and instant cashback tracking — anywhere on the continent.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button className="bg-black hover:bg-gray-900 text-white rounded-xl px-5 py-3 flex items-center gap-2.5 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-[9px] text-white/70 leading-none">Download on the</div>
                <div className="text-sm font-semibold leading-tight">App Store</div>
              </div>
            </button>
            <button className="bg-black hover:bg-gray-900 text-white rounded-xl px-5 py-3 flex items-center gap-2.5 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              <div className="text-left">
                <div className="text-[9px] text-white/70 leading-none">Get it on</div>
                <div className="text-sm font-semibold leading-tight">Google Play</div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Fingerprint className="w-4 h-4" /> Biometric login
            </span>
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Wifi className="w-4 h-4" /> Offline redemption
            </span>
            <span className="flex items-center gap-2 text-white/70 text-xs">
              <Bell className="w-4 h-4" /> Nearby alerts
            </span>
          </div>
        </div>

        {/* Right — phone mockup */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-[460px]">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-amber-100/10 rounded-3xl" />
            <div className="absolute inset-4 bg-gradient-to-b from-amber-100 to-amber-50 rounded-[2rem] shadow-2xl flex items-center justify-center">
              <div className="w-32 h-56 bg-white/60 rounded-2xl border-2 border-gray-200/50 relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}