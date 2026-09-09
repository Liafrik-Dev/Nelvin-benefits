import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Eye, ArrowRight, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#082F24] text-white font-sans flex flex-col justify-between">
      {/* Top Header Navigation matching Brand Palette */}
      <header className="w-full bg-[#082F24]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <RouterLink to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#B8FF00] rounded-xl flex items-center justify-center shadow-md text-[#082F24] font-extrabold text-lg">
              N
            </div>
            <span className="font-extrabold text-xl font-heading tracking-tight text-white">
              Nelvin<span className="text-[#B8FF00]">Benefits</span>
            </span>
          </RouterLink>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/80">
            <RouterLink to="/offers" className="hover:text-[#B8FF00] transition-colors">Discounts</RouterLink>
            <RouterLink to="/corporate" className="hover:text-[#B8FF00] transition-colors">Pricing</RouterLink>
            <RouterLink to="/subscriber/support" className="hover:text-[#B8FF00] transition-colors">Contact</RouterLink>
            <RouterLink to="/business" className="hover:text-[#B8FF00] transition-colors">Request a Brand</RouterLink>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <RouterLink
              to="/login"
              className="px-4 py-1.5 rounded-full bg-[#B8FF00] text-[#082F24] font-extrabold text-xs hover:bg-[#8DF01F] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ArrowRight className="w-3.5 h-3.5" /> Login
            </RouterLink>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#082F24] border-t border-white/10 py-4 text-center text-xs text-white/60 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#B8FF00]" />
        <span>Enterprise ISO-27001 Secured • Nelvin Benefits Platform</span>
      </footer>
    </div>
  );
}
