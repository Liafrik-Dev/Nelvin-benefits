import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AppleIcon from "@/components/shared/AppleIcon";
import GoogleIcon from "@/components/shared/GoogleIcon";
import { BrandLogo } from "@/components/nelvin/Brand";

/**
 * Footer — the reference organises this as a small number of titled link
 * columns with hairline dividers, a brand block, store buttons and a legal
 * rail. NelvinBenefit keeps that structure in corporate blue + gold.
 */

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

const footerColumns = [
  {
    title: "Employee portal",
    links: [
      { label: "Explore perks", to: "/explore" },
      { label: "Categories", to: "/categories" },
      { label: "Marketplace", to: "/marketplace" },
      { label: "My wallet & cashback", to: "/wallet" },
      { label: "Rewards & praise", to: "/rewards" },
      { label: "Wellness benefits", to: "/wellness" },
    ],
  },
  {
    title: "HR & employer",
    links: [
      { label: "HR dashboard", to: "/corporate-dashboard" },
      { label: "Employee management", to: "/corporate-dashboard" },
      { label: "Budgets & allowances", to: "/corporate-dashboard" },
      { label: "Corporate sign up", to: "/corporate-signup" },
      { label: "HRIS & SSO integrations", to: "/corporate-dashboard" },
    ],
  },
  {
    title: "Business partners",
    links: [
      { label: "Business dashboard", to: "/business" },
      { label: "Merchant onboarding", to: "/partner" },
      { label: "Manage offers", to: "/business/offers" },
      { label: "QR code validator", to: "/business/qr-codes" },
      { label: "Earnings & payouts", to: "/business/payouts" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Nelvin", to: "/corporate" },
      { label: "Awards & impact", to: "/corporate" },
      { label: "Partner enquiries", to: "/partner" },
      { label: "Contact support", to: "/support" },
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
    <footer className="bg-[#1B4F9C] text-white">
      {/* Brand + app block */}
      <div className="container-nv py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16">
          <div>
            <BrandLogo size="md" tagline="Employee Benefits Platform" tone="inverse" />
            <p className="mt-5 max-w-xs text-[15px] font-light leading-relaxed text-white">
              Africa's savings super app. Unlock exclusive offers, cashback and
              corporate experiences across all 54 countries.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href="#"
                className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 text-[15px] font-normal text-white transition-colors hover:border-white/50 hover:bg-white/20"
              >
                <AppleIcon className="h-4 w-4" />
                App Store
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 text-[15px] font-normal text-white transition-colors hover:border-white/50 hover:bg-white/20"
              >
                <GoogleIcon className="h-4 w-4" />
                Google Play
              </a>
            </div>

            <a
              href="mailto:Nelvin23@proton.me"
              className="mt-5 inline-flex min-h-8 items-center gap-2 py-1 text-[15px] font-normal text-white transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              Nelvin23@proton.me
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[17px] font-semibold leading-[22px] text-white">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="inline-flex min-h-8 items-center py-1 text-[15px] font-light text-white transition-colors hover:text-white hover:underline"
                      >
                        <span>{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Legal rail */}
      <div className="border-t border-white/20">
        <div className="container-nv flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-center text-[15px] font-light text-white sm:text-left">
            © 2026 <span className="font-bold text-brand-gold">NelvinBenefit</span> Africa Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-[#1B4F9C]"
              >
                <s.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}