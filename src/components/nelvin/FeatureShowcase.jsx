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
    img: "https://images.unsplash.com/photo-1677442136019-3f6b6b6b6b?w=900&q=80",
    color: "#7637E3",
    to: "/offers",
  },
  {
    id: "rewards",
    kicker: "Rewards & Loyalty",
    title: "Rewards people actually want to earn",
    desc: "Launch points, tiered loyalty and recognition programmes that celebrate milestones — automatically synced with your budget.",
    points: ["Points & tiered tiers", "Milestone recognition", "Instant reward redemption", "Manager recognition tools"],
    img: "/images/benifex/Recognition2.png",
    color: "#00BD00",
    to: "/my-offers",
  },
  {
    id: "wallet",
    kicker: "Wallet & Payments",
    title: "A digital wallet that just works",
    desc: "Multi-currency wallets, virtual cards, cashback and instant settlements — in one compliant, secure home.",
    points: ["Multi-currency balances", "Virtual & physical cards", "Instant cashback", "Split payments"],
    img: "/images/benifex/Discounts.png",
    color: "#B8FF00",
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
    color: "#180126",
    to: "/admin/analytics",
  },
  {
    id: "integrations",
    kicker: "Developer / API & Integrations",
    title: "Embed benefits everywhere",
    desc: "REST APIs, webhooks and native integrations for HRIS, payroll and comms tools — build on Nelvin the way you want.",
    points: ["REST & GraphQL APIs", "Webhooks & events", "HRIS & payroll sync", "SSO / SCIM ready"],
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80",
    color: "#7637E3",
    to: "/partner",
  },
  {
    id: "security",
    kicker: "Security & Compliance",
    title: "Enterprise-grade trust, built in",
    desc: "Encryption in transit and at rest, role-based access, audit logs and regional data residency — because trust isn't a feature, it's the foundation.",
    points: ["AES-256 encryption", "SOC 2 / ISO 27001", "RBAC & SSO", "Audit trails & consent"],
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d?w=900&q=80",
    color: "#082F24",
    to: "/corporate",
  },
];

function VisualCard({ f }) {
  const dark = f.dark;
  return (
    <div className="relative rounded-[2rem] shadow-2xl ring-1 ring-black/5 overflow-hidden">
      <img src={f.img} alt={f.title} loading="lazy" className="w-full h-72 sm:h-80 object-cover" />
      <div className={`absolute inset-0 ${dark ? "bg-gradient-to-t from-[#180126]/70 via-transparent to-transparent" : "bg-gradient-to-t from-[#180126]/50 via-transparent to-transparent"}`} />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
        <span className="text-[11px] font-extrabold text-[#180126]">{f.kicker}</span>
      </div>
    </div>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        {FEATURES.map((f, i) => (
          <div key={f.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
            <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">{f.kicker}</p>
              <h3 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight max-w-lg">{f.title}</h3>
              <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-md">{f.desc}</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 max-w-md">
                {f.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-[#180126]/80">
                    <span className="w-5 h-5 rounded-full bg-[#00BD00]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#00BD00]" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to={f.to} className="group mt-8 inline-flex items-center gap-2 text-[#180126] font-bold text-sm">
                Explore {f.kicker}
                <span className="w-8 h-8 rounded-full bg-[#180126] group-hover:bg-[#00BD00] transition-colors flex items-center justify-center text-white text-xs font-extrabold">→</span>
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