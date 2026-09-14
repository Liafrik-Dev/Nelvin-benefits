import React from "react";
import { Link } from "react-router-dom";
const Facebook = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
);
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.92 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.607.23 4.547 1.98 4.695 4.63.058 1.332.072 1.745.072 5.225s-.014 3.893-.072 5.226c-.148 2.648-2.086 4.4-4.695 4.63-1.28.058-1.688.072-4.947.072s-3.667-.014-4.947-.072c-2.609-.23-4.547-1.982-4.695-4.63C.014 15.893 0 15.48 0 12s.014-3.893.072-5.225C.22 4.125 2.158 2.373 4.767 2.122C7.333 2.014 7.741 2 12 2zm0 5.865a6.135 6.135 0 100 12.27 6.135 6.135 0 000-12.27zm0 10.107a3.972 3.972 0 1100-7.944 3.972 3.972 0 000 7.944zm6.398-10.027a1.434 1.434 0 11-2.868 0 1.434 1.434 0 012.868 0z"/></svg>
);
const Youtube = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.501 6.186C0 7.98 0 12 0 12s0 4.02.501 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 16.02 24 12 24 12s0-4.02-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
import AppleIcon from "@/components/shared/AppleIcon";
import GoogleIcon from "@/components/shared/GoogleIcon";

const footerColumns = [
  {
    title: "Employee Portal",
    links: [
      { label: "Explore Perks", to: "/explore" },
      { label: "Categories", to: "/categories" },
      { label: "Marketplace", to: "/marketplace" },
      { label: "My Wallet & Cashback", to: "/wallet" },
      { label: "Rewards & Praise", to: "/rewards" },
      { label: "Wellness Benefits", to: "/wellness" },
    ],
  },
  {
    title: "HR & Employer",
    links: [
      { label: "HR Dashboard", to: "/corporate-dashboard" },
      { label: "Employee Management", to: "/corporate-dashboard" },
      { label: "Budgets & Allowances", to: "/corporate-dashboard" },
      { label: "Corporate Sign Up", to: "/corporate-signup" },
      { label: "HRIS & SSO Integrations", to: "/corporate-dashboard" },
    ],
  },
  {
    title: "Business Partners",
    links: [
      { label: "Business Dashboard", to: "/business" },
      { label: "Merchant Onboarding", to: "/partner" },
      { label: "Manage Offers", to: "/business/offers" },
      { label: "QR Code Validator", to: "/business/qr-codes" },
      { label: "Earnings & Payouts", to: "/business/payouts" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Nelvin", to: "/corporate" },
      { label: "Awards & Impact", to: "/corporate" },
      { label: "Partner Enquiries", to: "/partner" },
      { label: "Contact Support", to: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & conditions", to: "/support" },
      { label: "Cookie policy", to: "/support" },
      { label: "Privacy notice", to: "/support" },
    ],
  },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/nelvinbenefits" },
  { icon: Twitter, label: "X", href: "https://x.com/nelvinbenefits" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/nelvinbenefits" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/nelvinbenefits" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@nelvinbenefits" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-secondary text-[#F5F1E8] border-t border-[#D6B56D]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#D6B56D] rounded-lg flex items-center justify-center shadow-md shadow-[#062B23]/30">
                <span className="text-[#062B23] font-extrabold text-sm">N</span>
              </div>
              <span className="font-bold text-xl font-heading">Nelvin</span>
            </div>
            <p className="text-[#F5F1E8]/60 text-xs leading-relaxed mb-6">
              Africa's savings super app. Unlock exclusive offers, cashback, and corporate experiences across all 54 countries.
            </p>
            <div className="flex flex-col gap-2">
              <button className="bg-emerald-black/90 hover:bg-[#062B23] hover:text-white text-[#F5F1E8] rounded-lg px-3 py-2 flex items-center gap-2 text-xs transition-colors w-fit border border-[#D6B56D]/15">
                <AppleIcon className="w-4 h-4" />
                App Store
              </button>
              <button className="bg-emerald-black/90 hover:bg-[#062B23] hover:text-white text-[#F5F1E8] rounded-lg px-3 py-2 flex items-center gap-2 text-xs transition-colors w-fit border border-[#D6B56D]/15">
                <GoogleIcon className="w-4 h-4" />
                Google Play
              </button>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-xs tracking-wider uppercase mb-4 text-[#F5F1E8]/80">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[#F5F1E8]/60 hover:text-[#E5C77A] text-xs transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#D6B56D]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#F5F1E8]/40 text-xs">
            © 2026 Nelvin Africa Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 bg-emerald-black/90 hover:bg-[#D6B56D] hover:text-[#062B23] rounded-lg flex items-center justify-center transition-colors border border-[#D6B56D]/15 text-ivory-muted"
              >
                <s.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}