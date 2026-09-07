import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, FileText, Calendar } from "lucide-react";

const resources = [
  {
    type: "Webinar",
    title: "How Red Hat is Modernizing Global Benefits With Data and Technology",
    img: "/images/benifex/8.png",
  },
  {
    type: "Report",
    title: "Is it time to quit the generation game in employee benefits?",
    img: "/images/benifex/9.png",
  },
  {
    type: "Webinar",
    title: "Your workforce is changing. Are your benefits keeping up?",
    img: "/images/benifex/9.png",
  },
  {
    type: "Report",
    title: "Energizing Reward and Benefits",
    img: "/images/benifex/8.png",
  },
];

export default function CountriesSection() {
  return (
    <section id="events" className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <p className="text-[#180126]/50 font-semibold text-xs tracking-[0.2em] uppercase mb-3">Insights</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#180126] tracking-tight">
              Latest resources, events &amp; insights
            </h2>
          </div>
          <Link to="/offers" className="group inline-flex items-center gap-2 text-[#180126] font-bold text-sm">
            <span className="transition-transform group-hover:-translate-x-1">See all resources</span>
            <span className="w-6 h-6 rounded-full border-2 border-[#180126] flex items-center justify-center text-xs transition-colors group-hover:bg-[#180126] group-hover:text-white">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {resources.map((r) => (
            <Link
              key={r.type + r.title}
              to="/offers"
              className="group bg-white rounded-3xl overflow-hidden border-2 border-transparent hover:border-[#00BD00] transition-colors"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-[#180126] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
                  {r.type === "Webinar" ? <Play className="w-3 h-3" /> : r.type === "Report" ? <FileText className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                  {r.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-[#180126] leading-snug group-hover:text-[#082F24]">{r.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-[#00BD00] text-xs font-bold mt-3">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}