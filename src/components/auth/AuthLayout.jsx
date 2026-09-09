import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Eye, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between">
      {/* Top Header Navigation matching Screenshot */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <RouterLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-[#7637E3] rounded-2xl flex items-center justify-center shadow-md text-white font-extrabold text-lg">
              N
            </div>
            <span className="font-extrabold text-xl sm:text-2xl font-heading tracking-tight text-slate-900">
              Nelvin<span className="text-[#7637E3]">Benefits</span>
            </span>
          </RouterLink>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <RouterLink to="/offers" className="hover:text-[#7637E3] transition-colors">Discounts</RouterLink>
            <RouterLink to="/corporate" className="hover:text-[#7637E3] transition-colors">Pricing</RouterLink>
            <RouterLink to="/subscriber/support" className="hover:text-[#7637E3] transition-colors">Contact</RouterLink>
            <RouterLink to="/business" className="hover:text-[#7637E3] transition-colors">Request a Brand</RouterLink>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
              title="Preview Mode"
            >
              <Eye className="w-5 h-5" />
            </button>
            <RouterLink
              to="/login"
              className="px-5 py-2 rounded-full border-2 border-[#7637E3] text-[#7637E3] font-bold text-sm hover:bg-[#7637E3] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ArrowRight className="w-4 h-4" /> Login
            </RouterLink>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Enterprise ISO-27001 Secured • Nelvin Benefits Platform</span>
      </footer>
    </div>
  );
}
