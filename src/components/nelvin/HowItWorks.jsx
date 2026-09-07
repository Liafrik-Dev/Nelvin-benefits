import React from "react";
import { Link } from "react-router-dom";
import { Award } from "lucide-react";

const awards = [
  {
    year: "2026 shortlisted",
    org: "Employee Benefits Awards",
    title: "Best Motivation &amp; Recognition Scheme",
    badge: "/images/benifex/8.png",
  },
  {
    year: "2026 shortlisted",
    org: "Employee Benefits Awards",
    title: "Best Healthcare and Wellbeing Benefits",
    badge: "/images/benifex/9.png",
  },
  {
    year: "2026 shortlisted",
    org: "Corporate Adviser Awards",
    title: "Best Employee Benefits Technology Platform",
    badge: "/images/benifex/8.png",
  },
];

export default function HowItWorks() {
  return (
    <section id="awards" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <p className="text-[#180126]/50 font-semibold text-xs tracking-[0.2em] uppercase mb-3">Recognition</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#180126] tracking-tight max-w-2xl leading-tight">
              Leading the charge against bland benefits and outdated platforms
            </h2>
          </div>
          <Link to="/corporate" className="group inline-flex items-center gap-2 text-[#180126] font-bold text-sm whitespace-nowrap">
            <span className="transition-transform group-hover:-translate-x-1">See all awards</span>
            <span className="w-6 h-6 rounded-full border-2 border-[#180126] flex items-center justify-center text-xs transition-colors group-hover:bg-[#180126] group-hover:text-white">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((a) => (
            <div key={a.title} className="group border-2 border-[#180126]/10 hover:border-[#00BD00] rounded-3xl p-8 transition-colors relative overflow-hidden">
              <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-[#F7F3ED] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#7637E3]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#180126]/50 mb-2">{a.year}</p>
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#180126] mb-3">{a.org}</h4>
              <p className="text-lg font-bold text-[#180126] leading-snug">{a.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}