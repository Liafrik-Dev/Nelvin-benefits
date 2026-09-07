import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const pillars = [
  {
    img: "/images/benifex/benefits-page-your-benefits.png",
    title: "Design and deliver benefits globally",
    desc: "We're the only partner that can help tackle your entire benefits strategy, administration,and communication through a flexible, full-service model.",
    to: "/benefits",
  },
  {
    img: "/images/benifex/Discounts.png",
    title: "Provide consistent member experiences",
    desc: "Put your people at the centre of engaging experiences, wherever they are in the world.",
    to: "/offers",
  },
  {
    img: "/images/benifex/recognition-page-prove-the-impact.png",
    title: "Show the value of everything you do",
    desc: "Connect members to the valuable benefits, content,and apps that enhance wellbeing,bring your culture to life,and show you care.",
    to: "/corporate",
  },
];

export default function CategoriesGrid() {
  return (
    <section id="wellbeing" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#180126]/50 font-semibold text-xs tracking-[0.2em] uppercase mb-3">Why Nelvin</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#180126] tracking-tight max-w-3xl mx-auto leading-tight">
            Improve wellbeing and engagement,and keep your best people
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="group block"
            >
              <div className="rounded-3xl overflow-hidden mb-6 relative">
                <div className="aspect-4/3 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#180126] mb-3">{p.title}</h3>
              <p className="text-[#180126]/60 text-sm leading-relaxed mb-4">{p.desc}</p>
              <span className="inline-flex items-center gap-2 text-[#00BD00] font-bold text-sm group-hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
