import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const FEATURES = [
  {
    id: "ai",
    kicker: "AI Intelligence",
    title: "AI that understands every member's life",
    desc: "Nelvin's recommendation engine learns from behaviour, spend and lifestyle — then serves the right benefit at the right moment, automatically.",
    points: ["Personalised offer feed", "Predictive engagement nudges", "Smart budget suggestions", "AI-powered savings insights"],
    img: "/images/benifex/africa/tanzania.jpg",
    color: "#0A3A2F",
    to: "/offers",
  },
  {
    id: "rewards",
    kicker: "Rewards & Loyalty",
    title: "Rewards people actually want to earn",
    desc: "Launch points, tiered loyalty and recognition programmes that celebrate milestones — automatically synced with your budget.",
    points: ["Points & tiered tiers", "Milestone recognition", "Instant reward redemption", "Manager recognition tools"],
    img: "/images/benifex/Recognition2.png",
    color: "#0A3A2F",
    to: "/my-offers",
  },
  {
    id: "wallet",
    kicker: "Wallet & Payments",
    title: "A digital wallet that just works",
    desc: "Multi-currency wallets, virtual cards, cashback and instant settlements — in one compliant, secure home.",
    points: ["Multi-currency balances", "Virtual & physical cards", "Instant cashback", "Split payments"],
    img: "/images/benifex/Discounts.png",
    color: "#D6B56D",
    dark: true,
    to: "/profile",
  },
  {
    id: "analytics",
    kicker: "Analytics & Reporting",
    title: "See engagement, spend and ROI in real time",
    desc: "Executive dashboards that turn raw redemption data into board-ready stories — automatically, per team, per market.",
    points: ["Executive dashboards", "Budget tracking", "ROI attribution", "Benchmarking"],
    img: "/images/benifex/benefits-page-your-benefits.png",
    color: "#103F35",
    to: "/admin/analytics",
  },
  {
    id: "integrations",
    kicker: "Developer / API & Integrations",
    title: "Embed benefits everywhere",
    desc: "REST APIs, webhooks and native integrations for HRIS, payroll and comms tools — build on Nelvin the way you want.",
    points: ["REST & GraphQL APIs", "Webhooks & events", "HRIS & payroll sync", "SSO / SCIM ready"],
    img: "/images/benifex/africa/nigeria.jpg",
    color: "#0A3A2F",
    to: "/partner",
  },
  {
    id: "security",
    kicker: "Security & Compliance",
    title: "Enterprise-grade trust, built in",
    desc: "Encryption in transit and at rest, role-based access, audit logs and regional data residency — because trust isn't a feature, it's the foundation.",
    points: ["AES-256 encryption", "SOC 2 / ISO 27001", "RBAC & SSO", "Audit trails & consent"],
    img: "/images/benifex/africa/morocco.jpg",
    color: "#062B23",
    to: "/corporate",
  },
];

function VisualCard({ f }) {
  const dark = f.dark;
  return (
    <div className="relative rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
      <img src={f.img} alt={f.title} loading="lazy" className="w-full h-72 sm:h-80 object-cover" />
      <div className={`absolute inset-0 ${dark ? "bg-gradient-to-t from-[#103F35]/70 via-transparent to-transparent" : "bg-gradient-to-t from-[#103F35]/50 via-transparent to-transparent"}`} />
      <div className="absolute bottom-4 left-4 bg-emerald-black/90 backdrop-blur rounded-lg px-4 py-2.5 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
        <span className="text-[11px] font-extrabold text-[#F5F1E8]">{f.kicker}</span>
      </div>
    </div>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="bg-forest py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        {FEATURES.map((f, i) => (
          <div key={f.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
            <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <p className="text-[#E5C77A] font-bold text-xs tracking-[0.2em] uppercase mb-3">{f.kicker}</p>
              <h3 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-heading text-[#F5F1E8] tracking-tight leading-tight max-w-lg">{f.title}</h3>
              <p className="mt-4 text-[#F5F1E8]/60 leading-relaxed max-w-md">{f.desc}</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 max-w-md">
                {f.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-[#F5F1E8]/80">
                    <span className="w-5 h-5 rounded-full bg-[#0A3A2F]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#E5C77A]" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to={f.to} className="group mt-8 inline-flex items-center gap-2 text-[#F5F1E8] font-bold text-sm">
                Explore {f.kicker}
                <span className="w-8 h-8 rounded-full bg-[#103F35] group-hover:bg-[#D6B56D] transition-colors flex items-center justify-center text-[#062B23] text-xs font-extrabold">→</span>
              </Link>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <VisualCard f={f} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}