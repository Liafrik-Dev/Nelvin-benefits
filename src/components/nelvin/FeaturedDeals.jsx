import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Explore the platform — every capability in one tabbed section: a rail of
 * tabs over a single shared detail panel. Copy, labels and destinations are
 * unchanged from the previous card grid.
 */

const panels = [
  {
    label: "Platform overview",
    title: "One home for everything at work",
    desc: "Connect all your benefits, wellbeing, reward and recognition so your people have one home for everything.",
    to: "/offers",
    img: "/images/benifex/Recognition2.png",
  },
  {
    label: "Benefits",
    title: "Run, manage and administer engaging benefits",
    desc: "Engaging employee benefits made effortless.",
    to: "/benefits",
    img: "/images/benifex/benefits-page-your-benefits.png",
  },
  {
    label: "Wallet",
    title: "Give every member exactly what they want",
    desc: "Card-based allowances with ultimate flexibility.",
    to: "/choose-plan",
    img: "/images/benifex/Discounts.png",
  },
  {
    label: "Discounts",
    title: "Global savings on global brands",
    desc: "Instantly increase post-payroll value.",
    to: "/offers",
    img: "/images/benifex/Discounts.png",
  },
  {
    label: "Reward & recognition",
    title: "Shine a light on great work",
    desc: "Celebrate the incredible things happening across your organisation.",
    to: "/corporate",
    img: "/images/benifex/recognition-page-prove-the-impact.png",
  },
  {
    label: "Mobile",
    title: "Anywhere, anytime rewards",
    desc: "In the office, remote, or on the go.",
    to: "/",
    img: "/images/benifex/Recognition2.png",
  },
  {
    label: "Wellbeing",
    title: "Enhanced wellbeing for every member",
    desc: "Customised and guided support.",
    to: "/benefits",
    img: "/images/benifex/benefits-page-your-benefits.png",
  },
  {
    label: "AI-powered benefits",
    title: "Next-generation engagement",
    desc: "Transformative, AI-driven technology for your people.",
    to: "/offers",
    img: "/images/benifex/Recognition2.png",
  },
];

const benefits = [
  "Reduce admin and get a better return on employee experiences",
  "Attract and retain top talent",
  "Drive a consistent experience globally",
  "Help your people feel good about coming to work, every day",
];

export default function FeaturedDeals() {
  const [activePanel, setActivePanel] = useState(0);
  const panel = panels[activePanel];

  return (
    <section id="explore-platform" className="surface-nv-primary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Explore the platform"
          title="Nelvin brings everything together"
          lead="One platform for benefits, discounts, reward, wellbeing and wallet — one home for everything."
        />

        {/* Tab rail — one tab per capability, scrolling horizontally on mobile */}
        <div
          className="scrollbar-hide -mx-1 mt-12 flex gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Platform capabilities"
        >
          {panels.map((p, i) => {
            const on = activePanel === i;
            return (
              <button
                key={p.title}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActivePanel(i)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition-colors ${
                  on
                    ? "bg-gold text-white shadow-nv-card"
                    : "border border-[#F1F1F1] bg-[#F9F8F7] text-ivory-muted hover:border-[#1B4F9C]/35 hover:text-ivory"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Shared detail panel — image runs full-bleed, copy sits beside it */}
        <div className="card-nv mt-6 grid grid-cols-1 overflow-hidden lg:grid-cols-12">
          <div className="relative min-h-[17rem] sm:min-h-[20rem] lg:col-span-6 lg:min-h-[27rem]">
            <img
              src={panel.img}
              alt={panel.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/25"
              aria-hidden="true"
            />
            <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {panel.label}
            </span>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-6">
            <h3 className="text-2xl font-extrabold font-heading leading-snug text-ivory sm:text-3xl">
              {panel.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory-muted">{panel.desc}</p>
            <Link to={panel.to} className="btn-nv btn-nv-md btn-nv-gold group mt-7 w-fit">
              Explore {panel.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-extrabold text-white">
                ✓
              </span>
              <p className="text-sm font-semibold leading-relaxed text-ivory">{b}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link to="/offers" className="btn-nv btn-nv-lg btn-nv-outline group">
            Explore the platform
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}