import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layers, Zap } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Module explorer — the reference groups platform capability into a
 * horizontal tab rail over one shared detail panel. Copy is unchanged; the
 * structure, spacing and surfaces follow the reference.
 */

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
      "Localized merchant matching across Africa and MENA regions",
    ],
    link: "/explore",
    image: "/images/assets/From Klickpin.com- 4603664114519569792-pin-id-4603664114519569792.jpg",
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
      "Managerial recognition budgets with real-time telemetry",
    ],
    link: "/rewards",
    image: "/images/assets/From Klickpin.com- 1024498615375273129-pin-id-1024498615375273129.jpg",
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
      "Multi-currency support across NGN, KES, EGP, AED, and USD",
    ],
    link: "/wallet",
    image: "/images/benifex/africa/nigeria.jpg",
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
      "Employee satisfaction survey integration and eNPS tracking",
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 492229434296406338-pin-id-492229434296406338.jpg",
  },
  {
    id: "developer",
    label: "Developer & API",
    title: "Seamless HRIS & Payroll Sync",
    subtitle: "Connect Nelvin directly with your existing HR technology stack in minutes.",
    points: [
      "Bi-directional sync with BambooHR, Workday, Deel, and Personio",
      "REST & GraphQL APIs with webhook triggers for custom workflows",
      "Single Sign-On (SSO) via Okta, Azure AD, Google Workspace, and SAML",
      "Automated employee onboarding and offboarding roster sync",
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 122160208638482683-pin-id-122160208638482683.jpg",
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
      "Comprehensive audit logs and role-based access controls (RBAC)",
    ],
    link: "/settings",
    image: "/images/benifex/africa/morocco.jpg",
  },
];

export default function PowerfulModules() {
  const [activeTabId, setActiveTabId] = useState("ai");
  const activeTab = MODULE_TABS.find((t) => t.id === activeTabId) || MODULE_TABS[0];

  return (
    <section id="modules" className="surface-nv-secondary section-nv border-y border-[#F1F1F1]">
      <div className="container-nv">
        <SectionHeading
          eyebrow="All-in-one engine"
          title={<>Everything a modern benefits platform needs, built in.</>}
          lead="Consolidate your entire benefits ecosystem into a single, coherent experience."
        />

        {/* Tab rail */}
        <div className="mt-12 overflow-x-auto">
          <div
            className="flex min-w-max items-center gap-1 border-b border-[#F1F1F1]"
            role="tablist"
            aria-label="Platform modules"
          >
            {MODULE_TABS.map((tab) => {
              const on = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    on
                      ? "bg-gold/10 text-gold ring-1 ring-gold/30"
                      : "text-ivory-dim hover:bg-[#F9F8F7] hover:text-ivory"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="card-nv mt-8 grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-6">
            <div className="group relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-[#F1F1F1] bg-[#FFFFFF]">
              <img
                src={activeTab.image}
                alt={activeTab.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-4 backdrop-blur">
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    Live platform view
                  </span>
                  <p className="mt-1 truncate text-xs font-bold text-ivory sm:text-sm">{activeTab.title}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-white">
                  <Zap className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <h3 className="text-2xl font-extrabold font-heading text-ivory sm:text-3xl">
              {activeTab.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ivory-muted">{activeTab.subtitle}</p>

            <ul className="mt-6 space-y-3">
              {activeTab.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm font-medium text-ivory-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <Link to={activeTab.link} className="btn-nv btn-nv-md btn-nv-outline group mt-8">
              Explore {activeTab.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}