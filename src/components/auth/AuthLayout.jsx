import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Sparkles, Building2, UserCheck, Store } from "lucide-react";

const LUXE_BG = "https://images.unsplash.com/photo-1618221197710-5a7d3b8f3d1?w=1920&q=80";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#082F24] px-4 py-12 overflow-hidden text-white font-sans">
      {/* Background imagery and gradient glows */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LUXE_BG})`, opacity: 0.25 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#082F24]/90 via-[#082F24]/80 to-[#180126]/95" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B8FF00]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#7637E3]/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#B8FF00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#B8FF00]/20">
              <span className="text-[#082F24] font-black text-base">N</span>
            </div>
            <span className="font-extrabold text-2xl font-heading tracking-tight text-white">Nelvin</span>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">{title}</h1>
            {subtitle && <p className="text-white/70 mt-1.5 text-xs sm:text-sm font-medium">{subtitle}</p>}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-white/30 p-6 sm:p-8 text-gray-900">
          {children}
        </div>

        {/* Security badge & footer link */}
        <div className="text-center space-y-3">
          <p className="text-xs text-white/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B8FF00]" /> Protected by ISO-27001 enterprise grade security
          </p>
          {footer && <div className="text-xs text-white/80 font-medium">{footer}</div>}
        </div>
      </div>
    </div>
  );
}