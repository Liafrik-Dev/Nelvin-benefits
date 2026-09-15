import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Platform overview tiles — the reference's bento of capability cards.
 * Copy and destinations unchanged; cards now share the 16px/soft-shadow
 * card treatment with the rest of the page.
 */

const panels = [
  {
    label: "Platform overview",
    title: "One home for everything at work",
    desc: "Connect all your benefits, wellbeing, reward and recognition so your people have one home for everything.",
    to: "/offers",
    img: "/images/benifex/Recognition2.png",
    span: "lg:col-span-2",
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
  return (
    <section id="explore-platform" className="surface-nv-primary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Explore the platform"
          title="Nelvin brings everything together"
          lead="One platform for benefits, discounts, reward, wellbeing and wallet — one home for everything."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {panels.map((panel) => (
            <Link
              key={panel.title}
              to={panel.to}
              className={`group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl border border-[#F1F1F1] bg-[#FFFFFF] p-6 shadow-nv-card transition-shadow hover:shadow-nv-card-hover ${panel.span || ""}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                style={{ backgroundImage: `url(${panel.img})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-[#0866FF]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                  {panel.label}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug text-white">{panel.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ivory-muted">{panel.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-gold">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
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