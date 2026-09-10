import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Smartphone, ShieldCheck, Zap, Layers } from "lucide-react";

const MODULE_TABS = [
  {
    id: "ai",
    label: "AI Intelligence",
    title: "Automated Benefit Personalization",
    subtitle: "AI-driven recommendation engines that surface the exact perks employees value most.",
    points: [
      "Predictive perk discovery based on employee spending and lifestyle habits",
      "Smart budget allocation optimization for HR teams",
      "Automated fraud detection on claim receipts",
      "Localized merchant matching across Africa and MENA regions"
    ],
    link: "/explore",
    image: "/images/assets/From Klickpin.com- 4603664114519569792-pin-id-4603664114519569792.jpg"
  },
  {
    id: "rewards",
    label: "Rewards & Loyalty",
    title: "Peer Praise & Milestone Recognition",
    subtitle: "Foster a culture of high performance and appreciation with instant point allocations.",
    points: [
      "Peer-to-peer kudos feed with company core values tagging",
      "Automated work anniversary and birthday reward drops",
      "Redeemable point store for gift cards, tech gadgets, and flights",
      "Managerial recognition budgets with real-time telemetry"
    ],
    link: "/rewards",
    image: "/images/assets/From Klickpin.com- 1024498615375273129-pin-id-1024498615375273129.jpg"
  },
  {
    id: "wallet",
    label: "Wallet & Payments",
    title: "Digital Stipends & Virtual Cards",
    subtitle: "Multi-currency digital wallet for stipends, out-of-pocket reimbursements, and instant cashback.",
    points: [
      "Instant corporate allowance refills (Meal, Transport, Wellness)",
      "Virtual Visa/Mastercard generation for employee online checkout",
      "Instant cashback auto-credited into spendable balance",
      "Multi-currency support across NGN, KES, EGP, AED, and USD"
    ],
    link: "/wallet",
    image: "/images/assets/9616fb85452ebcfd3225f75064f4c008.jpg"
  },
  {
    id: "analytics",
    label: "Analytics & Reporting",
    title: "Executive Engagement Telemetry",
    subtitle: "Real-time visibility into benefit adoption, budget utilization, and program ROI.",
    points: [
      "Departmental spending heatmaps and cost forecast models",
      "Live redemption tracking and perk popularity indexes",
      "One-click CSV/PDF export for C-suite and finance reviews",
      "Employee satisfaction survey integration and eNPS tracking"
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 492229434296406338-pin-id-492229434296406338.jpg"
  },
  {
    id: "developer",
    label: "Developer / API & Integrations",
    title: "Seamless HRIS & Payroll Sync",
    subtitle: "Connect Nelvin directly with your existing HR technology stack in minutes.",
    points: [
      "Bi-directional sync with BambooHR, Workday, Deel, and Personio",
      "REST & GraphQL APIs with webhook triggers for custom workflows",
      "Single Sign-On (SSO) via Okta, Azure AD, Google Workspace, and SAML",
      "Automated employee onboarding and offboarding roster sync"
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 122160208638482683-pin-id-122160208638482683.jpg"
  },
  {
    id: "security",
    label: "Security & Compliance",
    title: "Enterprise Bank-Grade Security",
    subtitle: "Top-tier data privacy and regulatory compliance built into every transaction.",
    points: [
      "ISO 27001 & SOC 2 Type II certified infrastructure",
      "Full GDPR & NDPR data compliance with local data residency",
      "End-to-end 256-bit AES encryption for wallet and personal data",
      "Comprehensive audit logs and role-based access controls (RBAC)"
    ],
    link: "/settings",
    image: "/images/assets/e3077f45ddb74207c4d4fcb10af9d7df.jpg"
  }
];

export default function PowerfulModules() {
  const [activeTabId, setActiveTabId] = useState("discounts");
  const activeTab = MODULE_TABS.find((t) => t.id === activeTabId) || MODULE_TABS[0];

  return (
    <section id="modules" className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#7637E3]/10 text-[#7637E3] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" /> All-In-One Unified Engine
          </div>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black font-heading text-slate-900 tracking-tight">
            Everything a modern benefits platform needs — <span className="text-[#7637E3]">built in</span>.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Consolidate your entire benefits ecosystem into a single compressed, multi-layered experience.
          </p>
        </div>

        {/* Tab Navigation Bar - Styled like attached POS screenshot */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-max border-b border-slate-200 gap-2 px-2">
            {MODULE_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`py-4 px-5 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "text-slate-900 border-2 border-slate-900 rounded-t-2xl bg-white shadow-sm -mb-[2px] z-10"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compressed Multi-Layer Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative overflow-hidden">
          {/* Subtle Layered Glow Background */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#7637E3]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#B8FF00]/20 blur-3xl pointer-events-none" />

          {/* Left Side: Multi-device Showcase Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 group">
              <img
                src={activeTab.image}
                alt={activeTab.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7637E3] tracking-wider block">Live Platform View</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 font-heading">{activeTab.title}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#7637E3] text-white flex items-center justify-center font-bold text-xs shadow-md">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Feature Details & Bullet Points */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight mb-2">
                {activeTab.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {activeTab.subtitle}
              </p>
            </div>

            <ul className="space-y-3">
              {activeTab.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to={activeTab.link}
                className="inline-flex items-center gap-2 text-[#7637E3] font-extrabold text-sm hover:text-[#5a25bb] transition-colors group"
              >
                Explore {activeTab.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
