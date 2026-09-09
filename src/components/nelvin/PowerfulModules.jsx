import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, Smartphone, ShieldCheck, Zap, Layers } from "lucide-react";

const MODULE_TABS = [
  {
    id: "discounts",
    label: "Discounts & Perks",
    title: "Global Corporate Discounts",
    subtitle: "Deliver instant purchasing power to your workforce with 20,000+ brand deals.",
    points: [
      "Exclusive negotiated rates across retail, dining, travel & entertainment",
      "Instant voucher issuance and in-store QR code redemptions",
      "Geofenced local store discovery and personalized recommendations",
      "Direct integration with employer allowance wallets and payroll"
    ],
    link: "/offers",
    image: "/images/assets/From Klickpin.com- 4603664114519569792-pin-id-4603664114519569792.jpg"
  },
  {
    id: "wallet",
    label: "Digital Wallet",
    title: "Flexible Benefit Wallets",
    subtitle: "Empower members with card-based allowances and instant cashback rewards.",
    points: [
      "Multi-currency digital wallet with automatic stipend allocation",
      "Real-time transaction tracking and receipt upload for tax compliance",
      "Cashback accumulation with auto-redeem capabilities",
      "Integrated virtual employee cards for seamless offline purchases"
    ],
    link: "/wallet",
    image: "/images/assets/9616fb85452ebcfd3225f75064f4c008.jpg"
  },
  {
    id: "benefits",
    label: "Flexible Benefits",
    title: "Custom Benefit Schemes",
    subtitle: "Let employees choose the benefits that matter most to their lifestyle.",
    points: [
      "Health, wellness, transport, food and lifestyle stipend categories",
      "Automated eligibility criteria based on team, level, or location",
      "Flexible points allocation system with year-end rollover options",
      "Self-service reimbursement requests with automated HR approval"
    ],
    link: "/benefits",
    image: "/images/assets/e3077f45ddb74207c4d4fcb10af9d7df.jpg"
  },
  {
    id: "analytics",
    label: "HR Analytics",
    title: "Enterprise Audience Insights",
    subtitle: "Real-time engagement telemetry and return on benefit investment.",
    points: [
      "Live adoption metrics across departments and regional offices",
      "Budget utilization heatmaps and automated cost forecasts",
      "Exportable CSV/PDF reports for executive leadership",
      "Employee satisfaction surveys and sentiment tracking"
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 492229434296406338-pin-id-492229434296406338.jpg"
  },
  {
    id: "rewards",
    label: "Peer Recognition",
    title: "Social Rewards & Kudos",
    subtitle: "Foster a culture of appreciation with instant peer-to-peer rewards.",
    points: [
      "Public applause feed with corporate values tagging",
      "Monthly reward points budgets for managers and team leads",
      "Gift card and experience catalog redemptions",
      "Milestone celebrations for anniversaries and onboarding"
    ],
    link: "/rewards",
    image: "/images/assets/From Klickpin.com- 1024498615375273129-pin-id-1024498615375273129.jpg"
  },
  {
    id: "communications",
    label: "Communications",
    title: "Targeted Employee Pulse",
    subtitle: "Keep your workforce aligned with targeted announcements and campaigns.",
    points: [
      "Targeted announcements by department, city, or employment tier",
      "Interactive pulse surveys with real-time analytics",
      "Push notifications for new perks, events, and company news",
      "Integrated feedback loops for continuous platform tuning"
    ],
    link: "/corporate-dashboard",
    image: "/images/assets/From Klickpin.com- 122160208638482683-pin-id-122160208638482683.jpg"
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
