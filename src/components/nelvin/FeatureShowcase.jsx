import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Alternating feature rows. Not part of the current Home composition but
 * kept working and aligned with the shared design tokens.
 */

const FEATURES = [
  {
    id: "ai",
    kicker: "AI Intelligence",
    title: "AI that understands every member's life",
    desc: "Nelvin's recommendation engine learns from behaviour, spend and lifestyle — then serves the right benefit at the right moment, automatically.",
    points: ["Personalised offer feed", "Predictive engagement nudges", "Smart budget suggestions", "AI-powered savings insights"],
    img: "/images/benifex/africa/tanzania.jpg",
    to: "/offers",
  },
  {
    id: "rewards",
    kicker: "Rewards & Loyalty",
    title: "Rewards people actually want to earn",
    desc: "Launch points, tiered loyalty and recognition programmes that celebrate milestones — automatically synced with your budget.",
    points: ["Points & tiered tiers", "Milestone recognition", "Instant reward redemption", "Manager recognition tools"],
    img: "/images/benifex/Recognition2.png",
    to: "/my-offers",
  },
  {
    id: "wallet",
    kicker: "Wallet & Payments",
    title: "A digital wallet that just works",
    desc: "Multi-currency wallets, virtual cards, cashback and instant settlements — in one compliant, secure home.",
    points: ["Multi-currency balances", "Virtual & physical cards", "Instant cashback", "Split payments"],
    img: "/images/benifex/Discounts.png",
    to: "/profile",
  },
  {
    id: "analytics",
    kicker: "Analytics & Reporting",
    title: "See engagement, spend and ROI in real time",
    desc: "Executive dashboards that turn raw redemption data into board-ready stories — automatically, per team, per market.",
    points: ["Executive dashboards", "Budget tracking", "ROI attribution", "Benchmarking"],
    img: "/images/benifex/benefits-page-your-benefits.png",
    to: "/admin/analytics",
  },
  {
    id: "integrations",
    kicker: "Developer / API & Integrations",
    title: "Embed benefits everywhere",
    desc: "REST APIs, webhooks and native integrations for HRIS, payroll and comms tools — build on Nelvin the way you want.",
    points: ["REST & GraphQL APIs", "Webhooks & events", "HRIS & payroll sync", "SSO / SCIM ready"],
    img: "/images/benifex/africa/nigeria.jpg",
    to: "/partner",
  },
  {
    id: "security",
    kicker: "Security & Compliance",
    title: "Enterprise-grade trust, built in",
    desc: "Encryption in transit and at rest, role-based access, audit logs and regional data residency — because trust isn't a feature, it's the foundation.",
    points: ["AES-256 encryption", "SOC 2 / ISO 27001", "RBAC & SSO", "Audit trails & consent"],
    img: "/images/benifex/africa/morocco.jpg",
    to: "/corporate",
  },
];

function VisualCard({ f }) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-nv-card ring-1 ring-white/10">
      <img
        src={f.img}
        alt={f.title}
        loading="lazy"
        className="h-72 w-full object-cover sm:h-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#062B23]/85 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/12 bg-[#062B23]/90 px-4 py-2.5 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-gold" />
        <span className="text-[11px] font-extrabold text-ivory">{f.kicker}</span>
      </div>
    </div>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="surface-nv-primary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Capabilities"
          title="Built for every part of the benefits story"
          lead="From personalised discovery to enterprise-grade security — the platform covers the full journey."
        />

        <div className="mt-16 space-y-16 lg:space-y-24">
          {FEATURES.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={f.id}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={flip ? "lg:order-2" : ""}>
                  <p className="eyebrow-nv mb-3">{f.kicker}</p>
                  <h3 className="text-balance-nv max-w-lg text-2xl font-extrabold font-heading leading-tight tracking-tight text-ivory sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-ivory-muted">{f.desc}</p>

                  <ul className="mt-6 grid max-w-md grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-ivory-muted">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D6B56D]/15">
                          <Check className="h-3 w-3 text-gold" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <Link to={f.to} className="btn-nv btn-nv-md btn-nv-outline group mt-8">
                    Explore {f.kicker}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className={flip ? "lg:order-1" : ""}>
                  <VisualCard f={f} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}