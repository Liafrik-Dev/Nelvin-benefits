import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const panels = [
  {
    label: "Platform overview",
    title: "One home for everything at work",
    desc: "Connect all your benefits, wellbeing, reward,and recognition so your people have one home for everything.",
    to: "/offers",
    img: "/images/benifex/Recognition2.png",
    bg: "bg-[#7637E3]",
    span: "lg:col-span-2",
  },
  {
    label: "Benefits",
    title: "Run, manage,and administer engaging benefits",
    desc: "Engaging employee benefits made effortless.",
    to: "/benefits",
    img: "/images/benifex/benefits-page-your-benefits.png",
    bg: "bg-[#082F24]",
  },
  {
    label: "Wallet",
    title: "Give every member exactly what they want",
    desc: "Card-based allowances with ultimate flexibility.",
    to: "/choose-plan",
    img: "/images/benifex/Discounts.png",
    bg: "bg-[#180126]",
  },
  {
    label: "Discounts",
    title: "Global savings on global brands",
    desc: "Instantly increase post-payroll value.",
    to: "/offers",
    img: "/images/benifex/Discounts.png",
    bg: "bg-[#180126]",
  },
  {
    label: "Reward & Recognition",
    title: "Shine a light on great work",
    desc: "Celebrate the incredible things happening across your organisation.",
    to: "/corporate",
    img: "/images/benifex/recognition-page-prove-the-impact.png",
    bg: "bg-[#7637E3]",
  },
  {
    label: "Mobile",
    title: "Anywhere, anytime rewards",
    desc: "In the office, remote, or on the go.",
    to: "/",
    img: "/images/benifex/Recognition2.png",
    bg: "bg-[#00BD00]",
  },
  {
    label: "Wellbeing",
    title: "Enhanced wellbeing for every member",
    desc: "Customised and guided support.",
    to: "/benefits",
    img: "/images/benifex/benefits-page-your-benefits.png",
    bg: "bg-[#082F24]",
  },
  {
    label: "AI-powered Benefits",
    title: "Next-generation engagement",
    desc: "Transformative, AI-driven technology for your people.",
    to: "/offers",
    img: "/images/benifex/Recognition2.png",
    bg: "bg-[#B8FF00]",
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
    <section id="platform" className="bg-[#F7F3ED] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#180126]/50 font-semibold text-xs tracking-[0.2em] uppercase mb-3">Explore the platform</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#180126] tracking-tight">
            Nelvin brings everything together
          </h2>
          <p className="text-[#180126]/60 mt-4 max-w-xl mx-auto text-base">
            One platform for benefits, discounts, reward, wellbeing,and wallet — in one home for everything.

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {panels.map((panel, i) => (
            <Link
              key={i}
              to={panel.to}
              className={`group relative rounded-[28px] overflow-hidden ${panel.bg} ${panel.span || ""} flex flex-col justify-end min-h-64 p-6`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                style={{ backgroundImage: `url(${panel.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest bg-white/20 text-white rounded-full px-3 py-1 mb-3">
                  {panel.label}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug mb-2">{panel.title}</h3>
                <p className="text-white/70 text-xs leading-relaxed mb-4">{panel.desc}</p>
                <span className="inline-flex items-center gap-2 text-white text-xs font-bold group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-5">
              <span className="w-6 h-6 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#082F24] text-xs font-extrabold flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm font-semibold text-[#180126] leading-relaxed">{b}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/offers"
            className="group inline-flex items-center gap-3 bg-[#180126] hover:bg-[#2b0140] text-white font-bold text-sm h-11 px-6 rounded-[23px] transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">Explore the platform</span>
            <span className="w-4 h-4 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#180126] text-xs">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}