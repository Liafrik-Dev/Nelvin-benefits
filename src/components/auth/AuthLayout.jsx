import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/nelvin/Brand";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#062B23] text-white font-sans flex flex-col justify-between">
      {/* Top Header Navigation matching Brand Palette */}
      <header className="w-full bg-[#062B23]/90 backdrop-blur-md border-b border-white/10 fixed inset-x-0 top-0 z-50">
        <div className="container-nv h-16 flex items-center justify-between gap-4">
          <BrandLogo size="sm" tagline="Perks for Everyone" className="shrink-0" />

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-ivory-muted">
            <RouterLink to="/offers" className="hover:text-gold transition-colors">Discounts</RouterLink>
            <RouterLink to="/corporate" className="hover:text-gold transition-colors">Pricing</RouterLink>
            <RouterLink to="/support" className="hover:text-gold transition-colors">Contact</RouterLink>
            <RouterLink to="/business" className="hover:text-gold transition-colors">Request a Brand</RouterLink>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <RouterLink to="/login" className="btn-nv btn-nv-sm btn-nv-gold">
              <ArrowRight className="h-3.5 w-3.5" /> Login
            </RouterLink>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      <main className="flex-1 w-full container-nv pt-24 pb-10 sm:pt-28 sm:pb-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#062B23] border-t border-white/10 py-4 text-center text-xs text-ivory-dim flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gold" />
        <span>Enterprise ISO-27001 Secured • NelvinBenefit Platform</span>
      </footer>
    </div>
  );
}
