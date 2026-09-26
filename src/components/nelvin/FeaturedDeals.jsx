import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, Gift, Wallet, Tag, Award, Smartphone, HeartPulse, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * Explore the platform — every capability in one tabbed section: a rail of
 * tabs over a single shared detail panel. Copy and labels are unchanged from
 * the previous card grid; the visual panel used to show a competitor's own
 * product screenshots (the same handful reused across unrelated tabs), which
 * read as neither professional nor original. Replaced with a custom icon +
 * gradient treatment, one distinct look per capability, in Nelvin's palette.
 */

const panels = [
  {
    label: "Platform overview",
    title: "One home for everything at work",
    desc: "Connect all your benefits, wellbeing, reward and recognition so your people have one home for everything.",
    to: "/offers",
    icon: LayoutGrid,
    from: "from-[#1B4F9C]",
    to2: "to-[#123A78]",
  },
  {
    label: "Benefits",
    title: "Run, manage and administer engaging benefits",
    desc: "Engaging employee benefits made effortless.",
    to: "/benefits",
    icon: Gift,
    from: "from-[#B8860B]",
    to2: "to-[#7A5A05]",
  },
  {
    label: "Wallet",
    title: "Give every member exactly what they want",
    desc: "Card-based allowances with ultimate flexibility.",
    to: "/choose-plan",
    icon: Wallet,
    from: "from-[#123A78]",
    to2: "to-[#0B2650]",
  },
  {
    label: "Discounts",
    title: "Global savings on global brands",
    desc: "Instantly increase post-payroll value.",
    to: "/offers",
    icon: Tag,
    from: "from-[#7A5A05]",
    to2: "to-[#4A3603]",
  },
  {
    label: "Reward & recognition",
    title: "Shine a light on great work",
    desc: "Celebrate the incredible things happening across your organisation.",
    to: "/corporate",
    icon: Award,
    from: "from-[#1B4F9C]",
    to2: "to-[#0B2650]",
  },
  {
    label: "Mobile",
    title: "Anywhere, anytime rewards",
    desc: "In the office, remote, or on the go.",
    to: "/",
    icon: Smartphone,
    from: "from-[#123A78]",
    to2: "to-[#1B4F9C]",
  },
  {
    label: "Wellbeing",
    title: "Enhanced wellbeing for every member",
    desc: "Customised and guided support.",
    to: "/benefits",
    icon: HeartPulse,
    from: "from-[#B8860B]",
    to2: "to-[#123A78]",
  },
  {
    label: "AI-powered benefits",
    title: "Next-generation engagement",
    desc: "Transformative, AI-driven technology for your people.",
    to: "/offers",
    icon: Sparkles,
    from: "from-[#0B2650]",
    to2: "to-[#7A5A05]",
  },
];

const benefits = [
  "Reduce admin and get a better return on employee experiences",
  "Attract and retain top talent",
  "Drive a consistent experience globally",
  "Help your people feel good about coming to work, every day",
];

export default function FeaturedDeals() {
  const [activePanel, setActivePanel] = React.useState(0);
  const panel = panels[activePanel];
  const Icon = panel.icon;

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

        {/* Shared detail panel — icon visual runs full-bleed, copy sits beside it */}
        <div className="card-nv mt-6 grid grid-cols-1 overflow-hidden lg:grid-cols-12">
          <div className={`relative flex min-h-[17rem] items-center justify-center bg-gradient-to-br ${panel.from} ${panel.to2} sm:min-h-[20rem] lg:col-span-6 lg:min-h-[27rem]`}>
            <Icon className="h-24 w-24 text-white/90 sm:h-32 sm:w-32" strokeWidth={1.25} />
            <span className="absolute left-5 top-5 rounded-full bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
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